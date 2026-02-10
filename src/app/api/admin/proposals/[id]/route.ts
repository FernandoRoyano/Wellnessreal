import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import Proposal from '@/lib/db/models/Proposal'
import { isAdminAuthenticated } from '@/lib/auth'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params
    await connectDB()
    const proposal = await Proposal.findById(id).lean()

    if (!proposal) {
      return NextResponse.json({ error: 'Propuesta no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ proposal })
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params
    const updates = await request.json()

    const allowedFields = ['notes', 'status']
    const filtered: Record<string, unknown> = {}
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        filtered[key] = updates[key]
      }
    }

    await connectDB()
    const proposal = await Proposal.findByIdAndUpdate(id, filtered, { new: true }).lean()

    if (!proposal) {
      return NextResponse.json({ error: 'Propuesta no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ proposal })
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params
    await connectDB()
    const proposal = await Proposal.findByIdAndDelete(id)

    if (!proposal) {
      return NextResponse.json({ error: 'Propuesta no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
