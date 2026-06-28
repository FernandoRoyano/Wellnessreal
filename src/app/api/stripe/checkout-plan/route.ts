// ============================================================
//  Método BASE · Checkout del plan (Stripe)
//  Crea una sesión de pago para el plan IA (tier 'auto') o el
//  plan revisado por Fernando (tier 'revisado'). El desbloqueo
//  real lo hace el webhook al confirmarse el pago.
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { getPlanOpcion } from '@/lib/precios-plan'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { cliente_id, tier } = await req.json()
    const opcion = getPlanOpcion(tier)

    if (!cliente_id || !opcion) {
      return NextResponse.json({ error: 'Faltan datos (cliente y tipo de plan).' }, { status: 400 })
    }

    const { data: cliente, error } = await supabase
      .from('cliente_perfil')
      .select('id, nombre, email, token, pagado_en')
      .eq('id', cliente_id)
      .single()

    if (error || !cliente) {
      return NextResponse.json({ error: 'Cliente no encontrado.' }, { status: 404 })
    }
    if (cliente.pagado_en) {
      return NextResponse.json({ error: 'Este plan ya está pagado.' }, { status: 409 })
    }

    const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://wellnessreal.es'

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${opcion.nombre} · WellnessReal`,
              description: opcion.gancho,
            },
            unit_amount: Math.round(opcion.precio * 100),
          },
          quantity: 1,
        },
      ],
      customer_email: cliente.email,
      metadata: { kind: 'plan_base', cliente_id: cliente.id, tier: opcion.tier },
      success_url: `${base}/programa/${cliente.token}?pago=ok`,
      cancel_url: `${base}/programa/${cliente.token}?pago=cancelado`,
    })

    // Guardamos la intención (tier elegido) aunque el pago aún no esté confirmado.
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
