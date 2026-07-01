// ============================================================
//  Método BASE · Cancelar suscripción (con permanencia mínima)
//  Programa la cancelación respetando los 3 meses de permanencia:
//  - Dentro de la permanencia → cancela al terminar el mes 3
//    (Stripe sigue cobrando los meses que falten).
//  - Cumplida la permanencia → cancela al final del mes en curso.
//  El acceso se mantiene hasta la fecha efectiva de cancelación.
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()
    if (!token) return NextResponse.json({ error: 'Falta el identificador.' }, { status: 400 })

    const { data: cliente } = await supabase
      .from('cliente_perfil')
      .select('id, stripe_subscription_id, permanencia_hasta, estado_suscripcion')
      .eq('token', token)
      .maybeSingle()

    if (!cliente?.stripe_subscription_id) {
      return NextResponse.json({ error: 'No hay suscripción activa.' }, { status: 404 })
    }
    if (cliente.estado_suscripcion === 'canceled') {
      return NextResponse.json({ error: 'La suscripción ya está cancelada.' }, { status: 409 })
    }

    const stripe = getStripe()
    const permUnix = cliente.permanencia_hasta ? Math.floor(new Date(cliente.permanencia_hasta).getTime() / 1000) : 0
    const ahoraUnix = Math.floor(Date.now() / 1000)

    // Dentro de la permanencia → cancelar en su fecha (sigue cobrando hasta ahí).
    // Fuera → cancelar al final del periodo mensual en curso.
    const sub =
      permUnix > ahoraUnix
        ? await stripe.subscriptions.update(cliente.stripe_subscription_id, { cancel_at: permUnix })
        : await stripe.subscriptions.update(cliente.stripe_subscription_id, { cancel_at_period_end: true })

    const efectiva = sub.cancel_at
      ? new Date(sub.cancel_at * 1000)
      : cliente.permanencia_hasta
        ? new Date(cliente.permanencia_hasta)
        : null

    await supabase
      .from('cliente_perfil')
      .update({ cancela_en: efectiva ? efectiva.toISOString() : null })
      .eq('id', cliente.id)

    await supabase.from('eventos_cliente').insert({
      cliente_id: cliente.id,
      tipo: 'nota',
      contenido: {
        mensaje: `Cancelación solicitada · efectiva el ${efectiva ? efectiva.toLocaleDateString('es-ES') : '¿?'}`,
      },
    })

    return NextResponse.json({
      ok: true,
      cancela_en: efectiva ? efectiva.toISOString() : null,
      dentro_permanencia: permUnix > ahoraUnix,
    })
  } catch (e) {
    console.error('[stripe-cancelar]', e)
    return NextResponse.json({ error: 'No se pudo cancelar la suscripción.' }, { status: 500 })
  }
}
