// ============================================================
//  Método BASE · API de ajuste quirúrgico
//  El corazón del sistema: NUNCA regenera desde cero.
//  Flujo:
//   1) Registra lo que el cliente ha reportado (evento).
//   2) Reconstruye la memoria del cliente (ficha + plan vigente + historial).
//   3) Pide a la IA un AJUSTE quirúrgico sobre el plan vigente.
//   4) Guarda una versión nueva (vigente), deja la anterior archivada.
//   5) Registra el evento 'ajuste' con el resumen de cambios.
//   La nueva versión queda SIN revisar: Fernando la aprueba antes de enviar.
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { anthropic, MODELO_IA } from '@/lib/anthropic'
import { supabase } from '@/lib/supabase'
import { METODO_BASE_KB } from '@/lib/metodo-base-kb'
import { AJUSTE_JSON_SCHEMA, type Ajuste } from '@/lib/programa-schema'
import { construirContextoCliente } from '@/lib/cliente-memoria'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { cliente_id, cambio, semana } = await req.json()
    if (!cliente_id || !cambio || !String(cambio).trim()) {
      return NextResponse.json(
        { error: 'Faltan datos (cliente_id y el cambio reportado).' },
        { status: 400 },
      )
    }

    // --- 1) Registrar lo reportado ---
    await supabase.from('eventos_cliente').insert({
      cliente_id,
      semana: semana ?? null,
      tipo: 'cambio_reportado',
      contenido: { texto: String(cambio).trim() },
    })

    // --- 2) Reconstruir la memoria ---
    const ctx = await construirContextoCliente(cliente_id)
    if (!ctx.programaVigente) {
      return NextResponse.json(
        { error: 'Este cliente no tiene un plan vigente que ajustar.' },
        { status: 400 },
      )
    }

    // --- 3) Pedir el ajuste quirúrgico ---
    const mensaje = `
Vas a AJUSTAR el plan vigente de este cliente. NO empieces de cero: parte del plan actual y
cámbialo SOLO en lo necesario para responder a lo que ha reportado. Mantén todo lo que funciona,
conserva la continuidad de la progresión y respeta sus lesiones, material, días y preferencias.

${ctx.texto}

LO QUE EL CLIENTE HA REPORTADO AHORA${semana ? ` (semana ${semana})` : ''}:
"${String(cambio).trim()}"

PLAN VIGENTE ACTUAL (versión ${ctx.programaVigente.version}), en JSON:
${JSON.stringify(ctx.programaVigente.programa)}

Devuelve el plan COMPLETO ya actualizado (no un diff) llamando a la herramienta 'entregar_ajuste',
junto con 'resumen_cambios': una lista breve de qué has cambiado y por qué, en tú, con el tono WellnessReal.
`.trim()

    const respuesta = await anthropic.messages.create({
      model: MODELO_IA,
      max_tokens: 8000, // cabe el plan completo; menos latencia para no pasar de 60s
      system: [{ type: 'text', text: METODO_BASE_KB, cache_control: { type: 'ephemeral' } }],
      tools: [
        {
          name: 'entregar_ajuste',
          description: 'Entrega el plan completo ya ajustado + el resumen de cambios.',
          input_schema: AJUSTE_JSON_SCHEMA as never,
        },
      ],
      tool_choice: { type: 'tool', name: 'entregar_ajuste' },
      messages: [{ role: 'user', content: mensaje }],
    })

    const bloque = respuesta.content.find((c) => c.type === 'tool_use')
    if (!bloque || bloque.type !== 'tool_use') {
      throw new Error('La IA no devolvió el ajuste en el formato esperado.')
    }
    const { programa, resumen_cambios } = bloque.input as Ajuste

    const nuevaVersion = ctx.programaVigente.version + 1

    // --- 4) Archivar la versión anterior y guardar la nueva (vigente, sin revisar) ---
    await supabase
      .from('programas_generados')
      .update({ vigente: false })
      .eq('cliente_id', cliente_id)
      .eq('vigente', true)

    const { data: guardado, error: errPrograma } = await supabase
      .from('programas_generados')
      .insert({
        cliente_id,
        version: nuevaVersion,
        vigente: true,
        programa,
        origen: 'ajuste',
        modelo: MODELO_IA,
        meta: {
          input_tokens: respuesta.usage?.input_tokens,
          output_tokens: respuesta.usage?.output_tokens,
          cache_read: respuesta.usage?.cache_read_input_tokens,
          resumen_cambios,
        },
        revisado: false,
      })
      .select('id')
      .single()

    if (errPrograma) throw new Error('Supabase (programa): ' + errPrograma.message)

    // --- 5) Registrar el evento de ajuste + actualizar la semana del perfil ---
    await supabase.from('eventos_cliente').insert({
      cliente_id,
      semana: semana ?? null,
      tipo: 'ajuste',
      contenido: { resumen_cambios, programa_id: guardado.id, version: nuevaVersion },
    })

    if (semana) {
      await supabase
        .from('cliente_perfil')
        .update({ semana_actual: semana, actualizado_en: new Date().toISOString() })
        .eq('id', cliente_id)
    }

    return NextResponse.json({
      ok: true,
      programa_id: guardado.id,
      version: nuevaVersion,
      resumen_cambios,
    })
  } catch (e) {
    console.error('[ajustar-programa]', e)
    const message = e instanceof Error ? e.message : 'Error ajustando el programa.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
