import { NextRequest, NextResponse } from 'next/server'
import { updateProposalById, toClientProposal } from '@/lib/db/proposals'
import { isAdminAuthenticated } from '@/lib/auth'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params

    const proposal = await updateProposalById(id, {
      status: 'confirmed',
      confirmed_at: new Date().toISOString(),
      confirmed_by: 'admin_manual',
      paid_at: new Date().toISOString(),
    })

    if (!proposal) {
      return NextResponse.json({ error: 'Propuesta no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ success: true, proposal: toClientProposal(proposal) })
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
