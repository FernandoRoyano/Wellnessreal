// ============================================================
//  Método BASE · API de generación de programas
//  Flujo:
//   1) Recibe las respuestas del cuestionario (POST).
//   2) Guarda onboarding_respuestas.
//   3) Crea/actualiza el perfil canónico (cliente_perfil).
//   4) Llama a Claude con el Método BASE (cacheado) + tool use forzado.
//   5) Guarda el programa como version 1, vigente, SIN revisar.
//   6) Registra un evento 'nota' (programa inicial generado).
//   El programa NO se envía al cliente automáticamente: Fernando lo revisa antes.
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { anthropic, MODELO_IA } from '@/lib/anthropic'
import { supabase } from '@/lib/supabase'
import { METODO_BASE_KB } from '@/lib/metodo-base-kb'
import { PROGRAMA_JSON_SCHEMA, type Programa } from '@/lib/programa-schema'
import { getDefaultThyroidRoadmap, getThyroidBaseProgram, THYROID_ADAPTATION_RULES, THYROID_TEMPLATE_VERSION } from '@/lib/metodo-tiroides-template'
import { recordThyroidFunnelEvent } from '@/lib/db/thyroid-funnel'
import { stopCommunityPurchaseInvitations } from '@/lib/mailerlite'
import { z } from 'zod'
import { authorizeProgramGeneration, claimProgramGeneration } from '@/lib/program-generation-access'
import { getClientIp, rateLimit } from '@/lib/rateLimit'
import { queueProgramReview } from '@/lib/thyroid-lifecycle'

export const runtime = 'nodejs'
export const maxDuration = 60 // tope duro en Vercel free; la generación debe caber aquí

const optionalText = z.string().max(5000).nullable().optional()
const generationSchema = z.object({
  origen: z.enum(['general', 'metodo-tiroides', 'admin-tiroides']).default('general'),
  nombre: z.string().trim().min(2).max(100),
  email: z.email().transform(value => value.toLowerCase().trim()),
  privacy_consent: z.boolean().optional(),
  objetivo_principal: z.string().min(1).max(1000),
  objetivos_secundarios: z.array(z.string().max(200)).max(20).optional(),
  edad: z.number().int().min(18).max(110).nullable().optional(),
  altura_cm: z.number().int().min(100).max(250).nullable().optional(),
  peso_kg: z.number().min(30).max(400).nullable().optional(),
  dias_semana: z.number().int().min(1).max(7).nullable().optional(),
  minutos_sesion: z.number().int().min(10).max(240).nullable().optional(),
  sexo: optionalText, donde_entrena: optionalText, horario_entreno: optionalText,
  material: optionalText, experiencia: optionalText, preferencias_entreno: optionalText,
  lesiones: optionalText, medicacion: optionalText, consideraciones: optionalText,
  dormir_calidad: optionalText, dormir_horas: optionalText, comidas_dia: optionalText,
  alergias: optionalText, preferencias_comida: optionalText, no_le_gusta: optionalText,
  hambre: optionalText, digestion: optionalText, estilo_vida: optionalText,
})

export async function POST(req: NextRequest) {
  let release: (() => Promise<void>) | null = null
  try {
    const limit = rateLimit(`generation:${getClientIp(req)}`, 5, 10 * 60 * 1000)
    if (!limit.success) return NextResponse.json({ error: 'Demasiados intentos. Espera unos minutos.' }, { status: 429 })
    const parsed = generationSchema.safeParse(await req.json())
    if (!parsed.success) return NextResponse.json({ error: 'Revisa los datos de la evaluación.' }, { status: 400 })
    const datos = parsed.data
    const email = datos.email
    const access = await authorizeProgramGeneration(email, datos.origen)
    if (!access.allowed) return NextResponse.json({ error: access.error }, { status: access.status })
    if (!access.admin && datos.privacy_consent !== true) return NextResponse.json({ error: 'Autoriza el tratamiento de tu evaluación antes de continuar.' }, { status: 400 })
    const isAdminFlow = access.admin && datos.origen === 'admin-tiroides'
    if (access.applicationId) {
      release = await claimProgramGeneration(access.applicationId)
      if (!release) return NextResponse.json({ error: 'Tu evaluación se está procesando. Espera un momento antes de repetir.' }, { status: 409 })
      const { data: existing, error: profileError } = await supabase.from('cliente_perfil').select('id,token').eq('email', email).maybeSingle()
      if (profileError) throw new Error('[ProgramGeneration:existing] No se pudo consultar tu perfil')
      if (existing) {
        const { data: program, error: programError } = await supabase.from('programas_generados').select('id').eq('cliente_id', existing.id).eq('vigente', true).limit(1).maybeSingle()
        if (programError) throw new Error('[ProgramGeneration:existing] No se pudo consultar tu plan')
        if (program) {
          try { await queueProgramReview(program.id) } catch { console.error('[ProgramGeneration:review] Aviso pendiente de reintento') }
          return NextResponse.json({ ok: true, token: existing.token })
        }
      }
    }

    // --- 1) Guardar respuestas del onboarding ---
    const { data: onboarding, error: errOnboarding } = await supabase
      .from('onboarding_respuestas')
      .insert({
        nombre: datos.nombre,
        email,
        edad: datos.edad ?? null,
        sexo: datos.sexo ?? null,
        altura_cm: datos.altura_cm ?? null,
        peso_kg: datos.peso_kg ?? null,
        objetivo_principal: datos.objetivo_principal,
        objetivos_secundarios: datos.objetivos_secundarios ?? [],
        dias_semana: datos.dias_semana ?? null,
        minutos_sesion: datos.minutos_sesion ?? null,
        donde_entrena: datos.donde_entrena ?? null,
        horario_entreno: datos.horario_entreno ?? null,
        material: datos.material ?? null,
        experiencia: datos.experiencia ?? null,
        preferencias_entreno: datos.preferencias_entreno ?? null,
        lesiones: datos.lesiones ?? null,
        medicacion: datos.medicacion ?? null,
        consideraciones: datos.consideraciones ?? null,
        dormir_calidad: datos.dormir_calidad ?? null,
        dormir_horas: datos.dormir_horas ?? null,
        comidas_dia: datos.comidas_dia ?? null,
        alergias: datos.alergias ?? null,
        preferencias_comida: datos.preferencias_comida ?? null,
        no_le_gusta: datos.no_le_gusta ?? null,
        hambre: datos.hambre ?? null,
        digestion: datos.digestion ?? null,
        estilo_vida: datos.estilo_vida ?? null,
      })
      .select()
      .single()

    if (errOnboarding) throw new Error('Supabase (onboarding): ' + errOnboarding.message)

    // --- 2) Crear/actualizar el perfil canónico (memoria duradera) ---
    const { data: perfil, error: errPerfil } = await supabase
      .from('cliente_perfil')
      .upsert(
        {
          onboarding_id: onboarding.id,
          nombre: datos.nombre,
          email,
          objetivo_principal: datos.objetivo_principal,
          objetivos_secundarios: datos.objetivos_secundarios ?? [],
          donde_entrena: datos.donde_entrena ?? null,
          horario_entreno: datos.horario_entreno ?? null,
          material: datos.material ?? null,
          dias_semana: datos.dias_semana ?? null,
          minutos_sesion: datos.minutos_sesion ?? null,
          experiencia: datos.experiencia ?? null,
          preferencias_entreno: datos.preferencias_entreno ?? null,
          lesiones: datos.lesiones ?? null,
          medicacion: datos.medicacion ?? null,
          dormir_calidad: datos.dormir_calidad ?? null,
          dormir_horas: datos.dormir_horas ?? null,
          comidas_dia: datos.comidas_dia ?? null,
          alergias: datos.alergias ?? null,
          preferencias_comida: datos.preferencias_comida ?? null,
          no_le_gusta: datos.no_le_gusta ?? null,
          hambre: datos.hambre ?? null,
          digestion: datos.digestion ?? null,
          estilo_vida: datos.estilo_vida ?? null,
          actualizado_en: new Date().toISOString(),
        },
        { onConflict: 'email' },
      )
      .select()
      .single()

    if (errPerfil) throw new Error('Supabase (perfil): ' + errPerfil.message)

    // Vincula la identidad de comunidad con el perfil canónico aunque la persona
    // se registrase antes de completar el onboarding.
    const { error: memberLinkError } = await supabase
      .from('member_profiles')
      .update({ cliente_id: perfil.id })
      .ilike('email', email.replace(/[\\%_]/g, '\\$&'))
    if (memberLinkError) {
      throw new Error(`[generar-programa:linkMember] ${memberLinkError.message}`)
    }

    if (datos.origen === 'metodo-tiroides') {
      await supabase
        .from('cliente_perfil')
        .update({ acceso_manual: true, pagado_en: new Date().toISOString() })
        .eq('id', perfil.id)
      await stopCommunityPurchaseInvitations(email).catch(() => console.error('[generar-programa:emailSequence] Acceso concedido; exclusión comercial pendiente de revisión'))
    }

    if (!access.admin) {
      const { error: consentError } = await supabase.from('eventos_cliente').insert({
        cliente_id: perfil.id, tipo: 'nota',
        contenido: { mensaje: 'Autorización de evaluación recibida', privacy_consent: { accepted: true, version: '2026-11-02', recorded_at: new Date().toISOString() } },
      })
      if (consentError) throw new Error('[ProgramGeneration:consent] No se pudo registrar la autorización')
    }

    // --- 3) Construir el mensaje con los datos del cliente ---
    const isThyroidProgram = datos.origen === 'metodo-tiroides' || isAdminFlow
    const baseProgram = isThyroidProgram ? getThyroidBaseProgram(Number(datos.dias_semana) || 3) : null
    const mensajeCliente = `
Genera el programa completo del Método BASE para esta persona:

- Identidad: persona adulta (no necesaria para diseñar el programa)
- Edad: ${datos.edad ?? 'no indicada'}
- Sexo: ${datos.sexo ?? 'no indicado'}
- Altura: ${datos.altura_cm ?? '?'} cm · Peso: ${datos.peso_kg ?? '?'} kg
- Objetivo principal: ${datos.objetivo_principal}
- Objetivos secundarios: ${(datos.objetivos_secundarios ?? []).join(', ') || 'ninguno'}
- Días que puede entrenar/semana: ${datos.dias_semana ?? 'no indicado'}
- Minutos por sesión: ${datos.minutos_sesion ?? 'no indicado'}
- Dónde entrena: ${datos.donde_entrena ?? 'no indicado'}
- Franja horaria de entrenamiento: ${datos.horario_entreno ?? 'no indicada'}
- Material disponible: ${datos.material ?? 'no indicado'}
- Experiencia: ${datos.experiencia ?? 'no indicada'}
- Cómo le gusta entrenar: ${datos.preferencias_entreno ?? 'sin preferencia (decide tú el enfoque)'}
- Lesiones: ${datos.lesiones ?? 'ninguna indicada'}
- Medicación: ${datos.medicacion ?? 'ninguna indicada'}
- Otras consideraciones de salud: ${datos.consideraciones ?? 'ninguna'}
- Sueño: ${datos.dormir_calidad ?? 'no indicado'}${datos.dormir_horas ? `, ${datos.dormir_horas} h` : ''}
- Comidas al día preferidas: ${datos.comidas_dia ?? 'no indicado'}
- Alergias / intolerancias: ${datos.alergias ?? 'ninguna'}
- Le gusta comer: ${datos.preferencias_comida ?? 'no indicado'}
- NO comerá: ${datos.no_le_gusta ?? 'nada en concreto'}
- Momentos de más hambre / ansiedad: ${datos.hambre ?? 'no indicado'}
- Digestiones: ${datos.digestion ?? 'no indicado'}
- Estilo de vida (trabajo, turnos, estrés): ${datos.estilo_vida ?? 'no indicado'}

Genera tantos días de entrenamiento como días disponibles tenga. Adapta cada ejercicio a su
entorno y material. Respeta cómo le gusta entrenar siempre que sea compatible con su objetivo;
si no ha indicado preferencia, elige tú el enfoque más eficaz. En la nutrición: respeta alergias, lo que NO comerá y sus gustos; estructura
las comidas según las que prefiera al día y refuerza la saciedad en sus momentos de más hambre o
ansiedad; ten en cuenta el sueño, la medicación y las digestiones para la recuperación y los
ajustes. Encaja el plan en su franja horaria de entrenamiento.
${baseProgram ? `\nREGLAS DE ADAPTACIÓN:\n${THYROID_ADAPTATION_RULES}\n\nPLANTILLA MAESTRA A ADAPTAR:\n${JSON.stringify(baseProgram)}` : ''}
Devuelve el resultado llamando a
la herramienta 'entregar_programa'.
`.trim()

    // --- 4) Llamar a Claude con tool use forzado (JSON garantizado) ---
    const respuesta = await anthropic.messages.create({
      model: MODELO_IA,
      max_tokens: 8000, // un programa completo cabe de sobra; menos tokens = menos latencia
      // El Método BASE es estable → lo cacheamos para abaratar las siguientes llamadas
      system: [{ type: 'text', text: METODO_BASE_KB, cache_control: { type: 'ephemeral' } }],
      tools: [
        {
          name: 'entregar_programa',
          description: 'Entrega el programa completo del Método BASE con la estructura exacta requerida.',
          input_schema: PROGRAMA_JSON_SCHEMA as never,
        },
      ],
      tool_choice: { type: 'tool', name: 'entregar_programa' },
      messages: [{ role: 'user', content: mensajeCliente }],
    })

    const bloque = respuesta.content.find((c) => c.type === 'tool_use')
    if (!bloque || bloque.type !== 'tool_use') {
      throw new Error('La IA no devolvió el programa en el formato esperado.')
    }
    const programa = bloque.input as Programa
    if (isThyroidProgram) programa.vision_12_semanas = getDefaultThyroidRoadmap()

    // --- 5) Guardar una nueva versiÃ³n vigente y conservar el historial ---
    const { data: latestProgram, error: latestProgramError } = await supabase
      .from('programas_generados')
      .select('version')
      .eq('cliente_id', perfil.id)
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (latestProgramError) throw new Error('Supabase (versiÃ³n): ' + latestProgramError.message)
    const nextVersion = (latestProgram?.version ?? 0) + 1

    const { data: guardado, error: errPrograma } = await supabase
      .from('programas_generados')
      .insert({
        cliente_id: perfil.id,
        onboarding_id: onboarding.id,
        version: nextVersion,
        vigente: true,
        programa,
        origen: isAdminFlow ? 'plantilla-tiroides-manual' : isThyroidProgram ? 'plantilla-tiroides' : 'generacion',
        modelo: MODELO_IA,
        meta: {
          notify_review: datos.origen === 'metodo-tiroides' || datos.origen === 'admin-tiroides',
          input_tokens: respuesta.usage?.input_tokens,
          output_tokens: respuesta.usage?.output_tokens,
          cache_read: respuesta.usage?.cache_read_input_tokens,
          plantilla: isThyroidProgram ? THYROID_TEMPLATE_VERSION : undefined,
        },
        revisado: false,
      })
      .select()
      .single()

    if (errPrograma) throw new Error('Supabase (programa): ' + errPrograma.message)

    const { error: archiveError } = await supabase
      .from('programas_generados')
      .update({ vigente: false })
      .eq('cliente_id', perfil.id)
      .eq('vigente', true)
      .neq('id', guardado.id)
    if (archiveError) throw new Error('Supabase (archivar versiones): ' + archiveError.message)

    // --- 6) Registrar evento + marcar onboarding como generado ---
    await supabase.from('eventos_cliente').insert({
      cliente_id: perfil.id,
      semana: 1,
      tipo: 'nota',
      contenido: { mensaje: 'Programa inicial generado', programa_id: guardado.id },
    })

    await supabase
      .from('onboarding_respuestas')
      .update({ estado: 'generado' })
      .eq('id', onboarding.id)

    if (isThyroidProgram) {
      try { await queueProgramReview(guardado.id) } catch {
        console.error('[ProgramGeneration:review] Aviso pendiente de reintento', { programId: guardado.id })
      }
    }

    if (datos.origen === 'metodo-tiroides') {
      try {
        await recordThyroidFunnelEvent({
          eventName: 'thyroid_onboarding_complete',
          email,
          externalId: `onboarding:${onboarding.id}`,
          metadata: { product: 'metodo_tiroides' },
        })
      } catch (trackingError) {
        console.error('[generar-programa:trackOnboarding]', trackingError)
      }
    }

    return NextResponse.json({
      ok: true,
      cliente_id: perfil.id,
      token: perfil.token,
      programa_id: guardado.id,
      ...(access.admin ? { programa } : {}),
    })
  } catch (e) {
    console.error('[generar-programa]', e)
    return NextResponse.json({ error: 'No se pudo preparar tu evaluación. Inténtalo de nuevo.' }, { status: 500 })
  } finally {
    try { await release?.() } catch { console.error('[ProgramGeneration:release] No se pudo liberar la reserva') }
  }
}
