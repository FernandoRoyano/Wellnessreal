import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { updateProposalByToken } from '@/lib/db/proposals'
import { supabase } from '@/lib/supabase'
import type Stripe from 'stripe'
import { markThyroidLeadAsCustomer, recordThyroidFunnelEvent } from '@/lib/db/thyroid-funnel'

export const runtime = 'nodejs'

async function recordThyroidRevenue(input: {
  email: string | null
  eventName: 'thyroid_sale' | 'thyroid_continuity'
  value: number | null
  externalId: string
  metadata?: Record<string, unknown>
}) {
  if (!input.email) return
  const leadId = await markThyroidLeadAsCustomer(input.email)
  await recordThyroidFunnelEvent({
    eventName: input.eventName,
    leadId,
    email: input.email,
    value: input.value,
    externalId: input.externalId,
    metadata: input.metadata,
  })
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
      // --- Pago completado ---
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

        if (session.metadata?.kind === 'metodo_tiroides') {
          if (session.payment_status !== 'paid') break
          const applicationId = session.metadata.asesoria_id
          if (applicationId) {
            const { data: currentApplication } = await supabase
              .from('asesoria_solicitudes')
              .select('email,notas')
              .eq('id', applicationId)
              .maybeSingle()

            const paymentPlan = session.metadata.payment_plan ?? 'one_time'
            const installmentIndex = session.metadata.installment_index ?? '0'
            const paymentMarker = paymentPlan === 'installments'
              ? `[payment:installments:${installmentIndex}]`
              : '[payment:one_time]'
            const existingNotes = currentApplication?.notas?.trim() ?? ''
            const firstPaidAtMarker = paymentPlan === 'installments' && installmentIndex === '1'
              ? `[payment:first_paid_at:${new Date().toISOString()}]`
              : null
            const notes = existingNotes.includes(paymentMarker)
              ? existingNotes
              : [existingNotes, paymentMarker, firstPaidAtMarker].filter(Boolean).join('\n')

            const { data: application } = await supabase
              .from('asesoria_solicitudes')
              .update({ estado: 'pagada', notas: notes })
              .eq('id', applicationId)
              .select('email')
              .maybeSingle()

            if (application?.email) {
              await supabase
                .from('cliente_perfil')
                .update({ acceso_manual: true, pagado_en: new Date().toISOString() })
                .ilike('email', application.email)
            }
          }
          await recordThyroidRevenue({
            email: session.customer_details?.email ?? session.customer_email,
            eventName: 'thyroid_sale',
            value: (session.amount_total ?? 0) / 100,
            externalId: `stripe:${event.id}`,
            metadata: {
              product: 'metodo_tiroides',
              payment_type: session.metadata.payment_plan ?? 'one_time',
              installment_index: session.metadata.installment_index ?? '0',
            },
          })
        }
        break
      }

    }
  } catch (e) {
    console.error('[stripe-webhook]', event.type, e)
    // Stripe debe reintentar si falla una actualización crítica de acceso o pago.
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
