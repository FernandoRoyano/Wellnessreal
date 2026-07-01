// ============================================================
//  Método BASE · Motor de ajuste quirúrgico (compartido)
//  Toma lo que el cliente reporta y progresa el plan vigente SIN
//  empezar de cero. Lo usan el admin (Fernando ajusta a mano) y
//  el check-in de progreso del cliente (cada 4 semanas).
// ============================================================

import { anthropic, MODELO_IA } from '@/lib/anthropic'
import { supabase } from '@/lib/supabase'
import { METODO_BASE_KB } from '@/lib/metodo-base-kb'
import { AJUSTE_JSON_SCHEMA, type Ajuste } from '@/lib/programa-schema'
import { construirContextoCliente } from '@/lib/cliente-memoria'

export interface ResultadoAjuste {
  programa_id: string
  version: number
  resumen_cambios: string[]
}

export class SinPlanVigenteError extends Error {}

// Genera una versión nueva del plan a partir de lo reportado.
// entregarYa=true la marca como revisada (entrega instantánea, tier 'auto').
export async function generarAjuste({
  cliente_id,
  cambio,
  semana,
  entregarYa = false,
}: {
  cliente_id: string
  cambio: string
  semana?: number
  entregarYa?: boolean
}): Promise<ResultadoAjuste> {
  // --- 1) Registrar lo reportado ---
  await supabase.from('eventos_cliente').insert({
    cliente_id,
    semana: semana ?? null,
    tipo: 'cambio_reportado',
    contenido: { texto: cambio.trim() },
  })

  // --- 2) Reconstruir la memoria del cliente ---
  const ctx = await construirContextoCliente(cliente_id)
  if (!ctx.programaVigente) {
    throw new SinPlanVigenteError('Este cliente no tiene un plan vigente que ajustar.')
  }

  // --- 3) Pedir el ajuste quirúrgico ---
  const mensaje = `
Vas a AJUSTAR el plan vigente de este cliente. NO empieces de cero: parte del plan actual y
cámbialo SOLO en lo necesario para responder a lo que ha reportado. Mantén todo lo que funciona,
conserva la continuidad de la progresión y respeta sus lesiones, material, días y preferencias.

${ctx.texto}

LO QUE EL CLIENTE HA REPORTADO AHORA${semana ? ` (semana ${semana})` : ''}:
"${cambio.trim()}"

PLAN VIGENTE ACTUAL (versión ${ctx.programaVigente.version}), en JSON:
${JSON.stringify(ctx.programaVigente.programa)}

Devuelve el plan COMPLETO ya actualizado (no un diff) llamando a la herramienta 'entregar_ajuste',
junto con 'resumen_cambios': una lista breve de qué has cambiado y por qué, en tú, con el tono WellnessReal.
`.trim()

  const respuesta = await anthropic.messages.create({
    model: MODELO_IA,
    max_tokens: 8000,
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

  // --- 4) Archivar la anterior y guardar la nueva ---
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
      revisado: entregarYa,
      revisado_en: entregarYa ? new Date().toISOString() : null,
    })
    .select('id')
    .single()

  if (errPrograma) throw new Error('Supabase (programa): ' + errPrograma.message)

  // --- 5) Registrar el evento de ajuste + actualizar la semana ---
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

  return { programa_id: guardado.id, version: nuevaVersion, resumen_cambios }
}
