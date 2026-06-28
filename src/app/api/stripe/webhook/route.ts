import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { updateProposalByToken } from '@/lib/db/proposals'
import { supabase } from '@/lib/supabase'
import { getPlanOpcion } from '@/lib/precios-plan'
import type Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // --- Flujo antiguo: propuestas + contrato ---
    const proposalToken = session.metadata?.proposalToken
    if (proposalToken) {
      await updateProposalByToken(proposalToken, {
        status: 'paid',
        paid_at: new Date().toISOString(),
        confirmed_by: 'stripe_webhook',
        stripe_payment_intent_id: session.payment_intent as string,
      })
    }

    // --- Flujo Método BASE: pago del plan (auto / revisado) ---
    if (session.metadata?.kind === 'plan_base') {
      const clienteId = session.metadata.cliente_id
      const tier = session.metadata.tier
      const opcion = getPlanOpcion(tier || '')
      const ahora = new Date().toISOString()

      if (clienteId && opcion) {
        await supabase
          .from('cliente_perfil')
          .update({ pagado_en: ahora, plan_tier: opcion.tier, stripe_session_id: session.id })
          .eq('id', clienteId)

        await supabase.from('eventos_cliente').insert({
          cliente_id: clienteId,
          tipo: 'nota',
          contenido: {
            mensaje: `Pago recibido · ${opcion.nombre} (${opcion.precio}€)`,
            tier: opcion.tier,
          },
        })

        // Tier 'auto': se entrega al instante → marcamos el plan vigente como revisado.
        // Tier 'revisado': se queda pendiente para que Fernando lo revise a mano.
        if (opcion.tier === 'auto') {
          await supabase
            .from('programas_generados')
            .update({ revisado: true, revisado_en: ahora })
            .eq('cliente_id', clienteId)
            .eq('vigente', true)
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
