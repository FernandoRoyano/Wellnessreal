import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import Proposal from '@/lib/db/models/Proposal'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    await connectDB()

    const proposal = await Proposal.findOne({ token })

    if (!proposal) {
      return NextResponse.json({ error: 'Propuesta no encontrada' }, { status: 404 })
    }

    // Mark as viewed on first access
    if (proposal.status === 'pending') {
      proposal.status = 'viewed'
      proposal.viewedAt = new Date()
      await proposal.save()
    }

    // Return client-safe data (exclude admin notes)
    return NextResponse.json({
      proposal: {
        clientName: proposal.clientName,
        serviceType: proposal.serviceType,
        serviceLabel: proposal.serviceLabel,
        price: proposal.price,
        duration: proposal.duration,
        description: proposal.description,
        contractText: proposal.contractText,
        status: proposal.status,
        signedAt: proposal.signedAt,
        signatureFullName: proposal.signatureFullName,
        paymentMethod: proposal.paymentMethod,
        transferMarkedAt: proposal.transferMarkedAt,
        paidAt: proposal.paidAt,
        confirmedAt: proposal.confirmedAt,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
