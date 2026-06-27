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

export const runtime = 'nodejs'
export const maxDuration = 60 // tope duro en Vercel free; la generación debe caber aquí

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const datos = await req.json()

    if (!datos?.nombre || !datos?.email || !datos?.objetivo_principal) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios (nombre, email, objetivo).' },
        { status: 400 },
      )
    }
    if (!EMAIL_REGEX.test(datos.email)) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 })
    }

    const email = String(datos.email).toLowerCase().trim()

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

    // --- 3) Construir el mensaje con los datos del cliente ---
    const mensajeCliente = `
Genera el programa completo del Método BASE para este cliente:

- Nombre: ${datos.nombre}
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
entorno y material. En la nutrición: respeta alergias, lo que NO comerá y sus gustos; estructura
las comidas según las que prefiera al día y refuerza la saciedad en sus momentos de más hambre o
ansiedad; ten en cuenta el sueño, la medicación y las digestiones para la recuperación y los
ajustes. Encaja el plan en su franja horaria de entrenamiento. Devuelve el resultado llamando a
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

    // --- 5) Guardar el programa como version 1, vigente, SIN revisar ---
    const { data: guardado, error: errPrograma } = await supabase
      .from('programas_generados')
      .insert({
        cliente_id: perfil.id,
        onboarding_id: onboarding.id,
        version: 1,
        vigente: true,
        programa,
        origen: 'generacion',
        modelo: MODELO_IA,
        meta: {
          input_tokens: respuesta.usage?.input_tokens,
          output_tokens: respuesta.usage?.output_tokens,
          cache_read: respuesta.usage?.cache_read_input_tokens,
        },
        revisado: false,
      })
      .select()
      .single()

    if (errPrograma) throw new Error('Supabase (programa): ' + errPrograma.message)

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

    return NextResponse.json({
      ok: true,
      cliente_id: perfil.id,
      programa_id: guardado.id,
      programa,
    })
  } catch (e) {
    console.error('[generar-programa]', e)
    const message = e instanceof Error ? e.message : 'Error generando el programa.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
