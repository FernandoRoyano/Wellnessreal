// ============================================================
//  Método BASE · Checkout del plan (Stripe · SUSCRIPCIÓN)
//  Suscripción mensual recurrente: 'auto' (19€/mes, plan IA al
//  instante) o 'revisado' (49€/mes, Fernando lo ajusta a mano).
//  Permanencia mínima de 3 meses. El alta real la confirma el
//  webhook (checkout.session.completed / invoice.paid).
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { getPlanOpcion, getPriceId } from '@/lib/precios-plan'

export const runtime = 'nodejs'

// ¿Tiene ya una suscripción que le da acceso ahora mismo?
function tieneAccesoVigente(c: { estado_suscripcion: string | null; acceso_hasta: string | null }) {
  const activa = c.estado_suscripcion === 'active' || c.estado_suscripcion === 'trialing' || c.estado_suscripcion === 'past_due'
  const enVentana = c.acceso_hasta ? new Date(c.acceso_hasta) > new Date() : false
  return activa && enVentana
}

export async function POST(req: NextRequest) {
  try {
    const { cliente_id, tier } = await req.json()
    const opcion = getPlanOpcion(tier)

    if (!cliente_id || !opcion) {
      return NextResponse.json({ error: 'Faltan datos (cliente y tipo de plan).' }, { status: 400 })
    }

    const priceId = getPriceId(opcion.tier)
    if (!priceId) {
      console.error('[checkout-plan] Falta STRIPE_PRICE_* para el tier', opcion.tier)
      return NextResponse.json({ error: 'Configuración de precios incompleta.' }, { status: 500 })
    }

    const { data: cliente, error } = await supabase
      .from('cliente_perfil')
      .select('id, nombre, email, token, stripe_customer_id, estado_suscripcion, acceso_hasta')
      .eq('id', cliente_id)
      .single()

    if (error || !cliente) {
      return NextResponse.json({ error: 'Cliente no encontrado.' }, { status: 404 })
    }
    if (tieneAccesoVigente(cliente)) {
      return NextResponse.json({ error: 'Ya tienes una suscripción activa.' }, { status: 409 })
    }

    const stripe = getStripe()

    // Reutilizamos el customer si ya existe (para portal e historial); si no, lo creamos.
    let customerId = cliente.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: cliente.email ?? undefined,
        name: cliente.nombre ?? undefined,
        metadata: { cliente_id: cliente.id },
      })
      customerId = customer.id
      await supabase.from('cliente_perfil').update({ stripe_customer_id: customerId }).eq('id', cliente.id)
    }

    const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://wellnessreal.es'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      // La metadata también va en la suscripción para poder identificar al
      // cliente en eventos posteriores (invoice.paid, subscription.updated…).
      subscription_data: {
        metadata: { kind: 'plan_base', cliente_id: cliente.id, tier: opcion.tier },
      },
      metadata: { kind: 'plan_base', cliente_id: cliente.id, tier: opcion.tier },
      success_url: `${base}/programa/${cliente.token}?pago=ok`,
      cancel_url: `${base}/programa/${cliente.token}?pago=cancelado`,
    })

    // Guardamos la intención (tier elegido) aunque el alta aún no esté confirmada.
    await supabase
      .from('cliente_perfil')
      .update({ plan_tier: opcion.tier, stripe_session_id: session.id })
      .eq('id', cliente.id)

    return NextResponse.json({ sessionUrl: session.url })
  } catch (e) {
    console.error('[checkout-plan]', e)
    return NextResponse.json({ error: 'No se pudo iniciar el pago.' }, { status: 500 })
  }
}
