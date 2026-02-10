import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import Proposal from '@/lib/db/models/Proposal'

export async function POST(
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

    if (proposal.status !== 'signed') {
      return NextResponse.json({ error: 'El contrato debe estar firmado primero' }, { status: 400 })
    }

    proposal.status = 'payment_pending'
    proposal.paymentMethod = 'transfer'
    proposal.transferMarkedAt = new Date()
    await proposal.save()

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
