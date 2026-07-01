import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { updateProposalByToken } from '@/lib/db/proposals'
import { supabase } from '@/lib/supabase'
import { getPlanOpcion, PERMANENCIA_MESES } from '@/lib/precios-plan'
import type Stripe from 'stripe'

export const runtime = 'nodejs'

// Fin del periodo mensual ya pagado. En algunas versiones de la API el campo
// vive en la suscripción y en otras en el item; probamos ambos.
function periodoFin(sub: Stripe.Subscription): Date | null {
  const top = (sub as unknown as { current_period_end?: number }).current_period_end
  const item = sub.items?.data?.[0] as unknown as { current_period_end?: number } | undefined
  const unix = top ?? item?.current_period_end
  return unix ? new Date(unix * 1000) : null
}

// Vuelca el estado de una suscripción de Stripe a cliente_perfil.
// Devuelve { clienteId, tier } para pasos posteriores.
async function sincronizarSuscripcion(sub: Stripe.Subscription) {
  const clienteId = sub.metadata?.cliente_id
  const tier = sub.metadata?.tier
  if (!clienteId) return { clienteId: null as string | null, tier }

  const fin = periodoFin(sub)
  const updates: Record<string, unknown> = {
    stripe_subscription_id: sub.id,
    stripe_customer_id: typeof sub.customer === 'string' ? sub.customer : sub.customer.id,
    estado_suscripcion: sub.status, // active | trialing | past_due | canceled | unpaid | incomplete
    cancela_en: sub.cancel_at ? new Date(sub.cancel_at * 1000).toISOString() : null,
  }
  if (fin) updates.acceso_hasta = fin.toISOString()

  await supabase.from('cliente_perfil').update(updates).eq('id', clienteId)
  return { clienteId, tier }
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const stripe = getStripe()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  try {
    switch (event.type) {
      // --- Alta: se completa el checkout de la suscripción ---
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Flujo antiguo: propuestas + contrato (pago único).
        const proposalToken = session.metadata?.proposalToken
        if (proposalToken) {
          await updateProposalByToken(proposalToken, {
            status: 'paid',
            paid_at: new Date().toISOString(),
            confirmed_by: 'stripe_webhook',
            stripe_payment_intent_id: session.payment_intent as string,
          })
        }

        // Flujo Método BASE: alta de suscripción.
        if (session.metadata?.kind === 'plan_base' && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string)
          const { clienteId, tier } = await sincronizarSuscripcion(sub)
          if (clienteId) {
            const opcion = getPlanOpcion(tier || '')
            const ahora = new Date()
            const permanencia = new Date(ahora)
            permanencia.setMonth(permanencia.getMonth() + PERMANENCIA_MESES)

            await supabase
              .from('cliente_perfil')
              .update({
                pagado_en: ahora.toISOString(),
                permanencia_hasta: permanencia.toISOString(),
                plan_tier: opcion?.tier ?? tier,
              })
              .eq('id', clienteId)

            await supabase.from('eventos_cliente').insert({
              cliente_id: clienteId,
              tipo: 'nota',
              contenido: {
                mensaje: `Alta de suscripción · ${opcion?.nombre ?? tier} (${opcion?.precio ?? '?'}€/mes)`,
                tier: opcion?.tier ?? tier,
              },
            })

            // Tier 'auto': se entrega al instante → marcamos el plan vigente como revisado.
            if (opcion?.tier === 'auto') {
              await supabase
                .from('programas_generados')
                .update({ revisado: true, revisado_en: ahora.toISOString() })
                .eq('cliente_id', clienteId)
                .eq('vigente', true)
            }
          }
        }
        break
      }

      // --- Renovación mensual (y primer cobro): extiende el acceso ---
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        const subId = (invoice as unknown as { subscription?: string }).subscription
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId)
          await sincronizarSuscripcion(sub)
        }
        break
      }

      // --- Cobro fallido: entra en gracia (past_due). Stripe reintenta. ---
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subId = (invoice as unknown as { subscription?: string }).subscription
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId)
          const { clienteId } = await sincronizarSuscripcion(sub)
          if (clienteId) {
            await supabase.from('eventos_cliente').insert({
              cliente_id: clienteId,
              tipo: 'nota',
              contenido: { mensaje: 'Cobro mensual fallido — Stripe reintentará (periodo de gracia).' },
            })
          }
        }
        break
      }

      // --- Cambios de estado (cancelación programada, past_due→active, etc.) ---
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const { clienteId } = await sincronizarSuscripcion(sub)
        if (clienteId && event.type === 'customer.subscription.deleted') {
          await supabase.from('eventos_cliente').insert({
            cliente_id: clienteId,
            tipo: 'nota',
            contenido: { mensaje: 'Suscripción finalizada (cancelada o impagada).' },
          })
        }
        break
      }
    }
  } catch (e) {
    console.error('[stripe-webhook]', event.type, e)
    // Devolvemos 200 igualmente para que Stripe no reintente en bucle por un
    // fallo nuestro no recuperable; los errores quedan logueados.
  }

  return NextResponse.json({ received: true })
}
