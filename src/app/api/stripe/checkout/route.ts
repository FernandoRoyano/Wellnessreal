import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import Proposal from '@/lib/db/models/Proposal'
import { getStripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 400 })
    }

    await connectDB()
    const proposal = await Proposal.findOne({ token })

    if (!proposal) {
      return NextResponse.json({ error: 'Propuesta no encontrada' }, { status: 404 })
    }

    if (proposal.status !== 'signed') {
      return NextResponse.json({ error: 'El contrato debe estar firmado primero' }, { status: 400 })
    }

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${proposal.serviceLabel} - ${proposal.duration}`,
              description: `Propuesta para ${proposal.clientName}`,
            },
            unit_amount: Math.round(proposal.price * 100),
          },
          quantity: 1,
        },
      ],
      customer_email: proposal.clientEmail,
      metadata: { proposalToken: proposal.token },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cliente/${proposal.token}/exito`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cliente/${proposal.token}/cancelado`,
    })

    proposal.stripeSessionId = session.id
    proposal.paymentMethod = 'stripe'
    await proposal.save()

    return NextResponse.json({ sessionUrl: session.url })
  } catch {
    return NextResponse.json({ error: 'Error al crear sesión de pago' }, { status: 500 })
  }
}
