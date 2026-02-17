import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { updateProposalByToken } from '@/lib/db/proposals'
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
    const proposalToken = session.metadata?.proposalToken

    if (proposalToken) {
      await updateProposalByToken(proposalToken, {
        status: 'paid',
        paid_at: new Date().toISOString(),
        confirmed_by: 'stripe_webhook',
        stripe_payment_intent_id: session.payment_intent as string,
      })
    }
  }

  return NextResponse.json({ received: true })
}
