import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import Proposal from '@/lib/db/models/Proposal'
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
    await connectDB()

    const proposal = await Proposal.findByIdAndUpdate(
      id,
      {
        status: 'confirmed',
        confirmedAt: new Date(),
        confirmedBy: 'admin_manual',
        paidAt: new Date(),
      },
      { new: true }
    ).lean()

    if (!proposal) {
      return NextResponse.json({ error: 'Propuesta no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ success: true, proposal })
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
