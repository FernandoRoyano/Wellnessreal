// ============================================================
//  Método BASE · Check-in de progreso del cliente (cada 4 semanas)
//  El cliente reporta cómo le fue el mes; el motor progresa su plan.
//  auto (19€) → se entrega al instante · revisado (49€) → a la cola
//  de Fernando para aprobarlo.
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generarAjuste, SinPlanVigenteError } from '@/lib/ajustar-programa'

export const runtime = 'nodejs'
export const maxDuration = 60

const SEMANAS_CICLO = 4
const DIAS_CICLO = SEMANAS_CICLO * 7

interface Respuestas {
  cumplimiento?: string // todos | mayoria | medias | casi_ninguno
  cargas?: string // cortas | justas | demasiado
  energia?: string // bien | regular | mal
  molestia?: string // vacío = ninguna
  cambios_contexto?: string
  objetivo_cambio?: string
  nota?: string
}

const CUMPLIMIENTO: Record<string, string> = {
  todos: 'Ha cumplido todos los entrenamientos',
  mayoria: 'Ha cumplido la mayoría de los entrenamientos',
  medias: 'Ha cumplido los entrenamientos a medias',
  casi_ninguno: 'Apenas ha podido entrenar este ciclo',
}
const CARGAS: Record<string, string> = {
  cortas: 'las cargas se le quedaron cortas: podía con más (toca progresar)',
  justas: 'las cargas estuvieron justas/adecuadas',
  demasiado: 'las cargas fueron demasiado exigentes: no llegaba a lo pautado',
}
const ENERGIA: Record<string, string> = {
  bien: 'energía y descanso bien',
  regular: 'energía y descanso regulares',
  mal: 'energía y descanso mal (cuidado con el volumen)',
}

function componerParte(r: Respuestas): string {
  const partes: string[] = []
  if (r.cumplimiento && CUMPLIMIENTO[r.cumplimiento]) partes.push(CUMPLIMIENTO[r.cumplimiento] + '.')
  if (r.cargas && CARGAS[r.cargas]) partes.push('Sobre el esfuerzo: ' + CARGAS[r.cargas] + '.')
  if (r.energia && ENERGIA[r.energia]) partes.push('Este mes, ' + ENERGIA[r.energia] + '.')
  if (r.molestia?.trim()) partes.push('Molestia o dolor nuevo a tener en cuenta: ' + r.molestia.trim() + '.')
  if (r.cambios_contexto?.trim()) partes.push('Ha cambiado su contexto (días/material/horario): ' + r.cambios_contexto.trim() + '.')
  if (r.objetivo_cambio?.trim()) partes.push('Quiere reorientar su objetivo hacia: ' + r.objetivo_cambio.trim() + '.')
  if (r.nota?.trim()) partes.push('Comentario del cliente: ' + r.nota.trim())
  return partes.join(' ')
}

export async function POST(req: NextRequest) {
  try {
    const { token, respuestas } = (await req.json()) as { token?: string; respuestas?: Respuestas }
    if (!token || !respuestas) {
      return NextResponse.json({ error: 'Faltan datos.' }, { status: 400 })
    }

    const { data: cliente } = await supabase
      .from('cliente_perfil')
      .select('id, plan_tier, estado_suscripcion, acceso_hasta, acceso_manual, semana_actual, pagado_en')
      .eq('token', token)
      .maybeSingle()

    if (!cliente) return NextResponse.json({ error: 'Cliente no encontrado.' }, { status: 404 })

    // --- Acceso: suscripción activa/gracia o acceso manual ---
    const estadoOk = ['active', 'trialing', 'past_due'].includes(cliente.estado_suscripcion ?? '')
    const enVentana = cliente.acceso_hasta ? new Date(cliente.acceso_hasta) > new Date() : false
    const tieneAcceso = (estadoOk && enVentana) || cliente.acceso_manual === true
    if (!tieneAcceso) {
      return NextResponse.json({ error: 'Necesitas una suscripción activa para actualizar tu plan.' }, { status: 403 })
    }

    // --- Elegibilidad: plan vigente con ≥4 semanas y sin ajuste pendiente ---
    const { data: vigente } = await supabase
      .from('programas_generados')
      .select('creado_en, revisado')
      .eq('cliente_id', cliente.id)
      .eq('vigente', true)
      .maybeSingle()

    if (!vigente) {
      return NextResponse.json({ error: 'Aún no tienes un plan que progresar.' }, { status: 400 })
    }
    if (vigente.revisado === false) {
      return NextResponse.json({ error: 'Ya tienes una actualización en revisión. Te avisamos en cuanto esté lista.' }, { status: 409 })
    }
    const anclaMs = Math.max(
      vigente.creado_en ? new Date(vigente.creado_en).getTime() : 0,
      cliente.pagado_en ? new Date(cliente.pagado_en).getTime() : 0,
    )
    const diasDesde = anclaMs ? (Date.now() - anclaMs) / (1000 * 60 * 60 * 24) : 0
    if (diasDesde < DIAS_CICLO) {
      const faltan = Math.ceil(DIAS_CICLO - diasDesde)
      return NextResponse.json(
        { error: `Tu plan actual aún está en marcha. Podrás actualizarlo en ${faltan} día${faltan === 1 ? '' : 's'}.` },
        { status: 425 },
      )
    }

    const parte = componerParte(respuestas)
    if (!parte.trim()) {
      return NextResponse.json({ error: 'Cuéntanos algo sobre cómo te ha ido.' }, { status: 400 })
    }

    const entregarYa = cliente.plan_tier === 'auto'
    const nuevaSemana = (cliente.semana_actual ?? 0) + SEMANAS_CICLO

    const res = await generarAjuste({
      cliente_id: cliente.id,
      cambio: parte,
      semana: nuevaSemana,
      entregarYa,
    })

    return NextResponse.json({
      ok: true,
      entregado: entregarYa, // true = ya visible; false = pendiente de revisión de Fernando
      version: res.version,
    })
  } catch (e) {
    if (e instanceof SinPlanVigenteError) {
      return NextResponse.json({ error: e.message }, { status: 400 })
    }
    console.error('[checkin]', e)
    return NextResponse.json({ error: 'No se pudo actualizar tu plan. Inténtalo de nuevo.' }, { status: 500 })
  }
}
