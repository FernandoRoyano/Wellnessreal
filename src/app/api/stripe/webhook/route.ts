import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { connectDB } from '@/lib/db/connection'
import Proposal from '@/lib/db/models/Proposal'
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
      await connectDB()
      await Proposal.findOneAndUpdate(
        { token: proposalToken },
        {
          status: 'paid',
          paidAt: new Date(),
          confirmedBy: 'stripe_webhook',
          stripePaymentIntentId: session.payment_intent as string,
        }
      )
    }
  }

  return NextResponse.json({ received: true })
}
