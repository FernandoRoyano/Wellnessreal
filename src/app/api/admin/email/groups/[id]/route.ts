import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { deleteGroup } from '@/lib/mailerlite'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params
    await deleteGroup(id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/admin/email/groups/[id]]', err)
    return NextResponse.json({ error: 'Error al eliminar grupo' }, { status: 500 })
  }
}
