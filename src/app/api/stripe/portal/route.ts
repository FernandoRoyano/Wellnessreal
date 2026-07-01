// ============================================================
//  Método BASE · Portal de cliente de Stripe
//  Página alojada por Stripe para gestionar tarjeta y ver
//  facturas. La CANCELACIÓN se deshabilita aquí a propósito:
//  se hace por /api/stripe/cancelar para respetar la permanencia.
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import type Stripe from 'stripe'

export const runtime = 'nodejs'

// Reutiliza (o crea una vez) la configuración del portal con cancelación off.
async function getPortalConfig(stripe: Stripe): Promise<string> {
  const list = await stripe.billingPortal.configurations.list({ limit: 100 })
  const mia = list.data.find((c) => c.metadata?.wr === 'v1')
  if (mia) return mia.id
  const cfg = await stripe.billingPortal.configurations.create({
    business_profile: { headline: 'WellnessReal · Gestiona tu suscripción' },
    features: {
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      customer_update: { enabled: true, allowed_updates: ['email'] },
      subscription_cancel: { enabled: false },
    },
    metadata: { wr: 'v1' },
  })
  return cfg.id
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()
    if (!token) return NextResponse.json({ error: 'Falta el identificador.' }, { status: 400 })

    const { data: cliente } = await supabase
      .from('cliente_perfil')
      .select('id, token, stripe_customer_id')
      .eq('token', token)
      .maybeSingle()

    if (!cliente?.stripe_customer_id) {
      return NextResponse.json({ error: 'No hay suscripción que gestionar.' }, { status: 404 })
    }

    const stripe = getStripe()
    const base = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin

    const portal = await stripe.billingPortal.sessions.create({
      customer: cliente.stripe_customer_id,
      configuration: await getPortalConfig(stripe),
      return_url: `${base}/programa/${cliente.token}`,
    })

    return NextResponse.json({ url: portal.url })
  } catch (e) {
    console.error('[stripe-portal]', e)
    return NextResponse.json({ error: 'No se pudo abrir el portal.' }, { status: 500 })
  }
}
