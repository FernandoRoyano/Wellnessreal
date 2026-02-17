import { NextRequest, NextResponse } from 'next/server'
import { getProposalByToken, updateProposalByToken } from '@/lib/db/proposals'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const proposal = await getProposalByToken(token)

    if (!proposal) {
      return NextResponse.json({ error: 'Propuesta no encontrada' }, { status: 404 })
    }

    if (proposal.status !== 'signed') {
      return NextResponse.json({ error: 'El contrato debe estar firmado primero' }, { status: 400 })
    }

    await updateProposalByToken(token, {
      status: 'payment_pending',
      payment_method: 'transfer',
      transfer_marked_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
