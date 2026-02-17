import { NextRequest, NextResponse } from 'next/server'
import { getProposalByToken, updateProposalByToken } from '@/lib/db/proposals'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const proposal = await getProposalByToken(token)

    if (!proposal) {
      return NextResponse.json({ error: 'Propuesta no encontrada' }, { status: 404 })
    }

    // Mark as viewed on first access
    if (proposal.status === 'pending') {
      await updateProposalByToken(token, {
        status: 'viewed',
        viewed_at: new Date().toISOString(),
      })
      proposal.status = 'viewed'
    }

    // Return client-safe data (exclude admin notes)
    return NextResponse.json({
      proposal: {
        clientName: proposal.client_name,
        serviceType: proposal.service_type,
        serviceLabel: proposal.service_label,
        price: proposal.price,
        duration: proposal.duration,
        description: proposal.description,
        contractText: proposal.contract_text,
        status: proposal.status,
        signedAt: proposal.signed_at,
        signatureFullName: proposal.signature_full_name,
        paymentMethod: proposal.payment_method,
        transferMarkedAt: proposal.transfer_marked_at,
        paidAt: proposal.paid_at,
        confirmedAt: proposal.confirmed_at,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
