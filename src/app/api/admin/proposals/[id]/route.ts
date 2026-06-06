import { NextRequest, NextResponse } from 'next/server'
import { getProposalById, updateProposalById, deleteProposalById, toClientProposal } from '@/lib/db/proposals'
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
    const proposal = await getProposalById(id)

    if (!proposal) {
      return NextResponse.json({ error: 'Propuesta no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ proposal: toClientProposal(proposal) })
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

    const allowedFields = ['notes', 'status', 'payment_method', 'price']
    const filtered: Record<string, unknown> = {}
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        filtered[key] = updates[key]
      }
    }

    // Cuando se cambia el estado manualmente desde el admin, auto-derivar
    // los timestamps correspondientes si no existen, para que el historial
    // refleje el cambio sin obligar a editarlos a mano.
    if (typeof updates.status === 'string') {
      const current = await getProposalById(id)
      if (!current) {
        return NextResponse.json({ error: 'Propuesta no encontrada' }, { status: 404 })
      }
      const now = new Date().toISOString()

      if (['viewed', 'signed', 'payment_pending', 'paid', 'confirmed'].includes(updates.status) && !current.viewed_at) {
        filtered.viewed_at = current.viewed_at || now
      }
      if (['signed', 'payment_pending', 'paid', 'confirmed'].includes(updates.status) && !current.signed_at) {
        filtered.signed_at = now
        if (!current.signature_full_name) {
          filtered.signature_full_name = 'Marcado manualmente'
        }
      }
      if (['paid', 'confirmed'].includes(updates.status) && !current.paid_at) {
        filtered.paid_at = now
      }
      if (updates.status === 'confirmed') {
        if (!current.confirmed_at) filtered.confirmed_at = now
        if (!current.confirmed_by) filtered.confirmed_by = 'admin_manual'
      }
    }

    const proposal = await updateProposalById(id, filtered)

    if (!proposal) {
      return NextResponse.json({ error: 'Propuesta no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ proposal: toClientProposal(proposal) })
  } catch (err) {
    console.error('[PATCH /api/admin/proposals/[id]]', err)
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
    await deleteProposalById(id)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
