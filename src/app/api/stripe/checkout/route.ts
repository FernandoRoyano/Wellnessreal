import { NextRequest, NextResponse } from 'next/server'
import { getProposalByToken, updateProposalByToken } from '@/lib/db/proposals'
import { getStripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 400 })
    }

    const proposal = await getProposalByToken(token)

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
              name: `${proposal.service_label} - ${proposal.duration}`,
              description: `Propuesta para ${proposal.client_name}`,
            },
            unit_amount: Math.round(proposal.price * 100),
          },
          quantity: 1,
        },
      ],
      customer_email: proposal.client_email,
      metadata: { proposalToken: proposal.token },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cliente/${proposal.token}/exito`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cliente/${proposal.token}/cancelado`,
    })

    await updateProposalByToken(token, {
      stripe_session_id: session.id,
      payment_method: 'stripe',
    })

    return NextResponse.json({ sessionUrl: session.url })
  } catch {
    return NextResponse.json({ error: 'Error al crear sesión de pago' }, { status: 500 })
  }
}
