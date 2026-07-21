import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { setMemberStatus, deleteMember } from '@/lib/db/comunidad'

const VALID = ['pending', 'approved', 'blocked'] as const

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const { id } = await params
    const { status } = await request.json()
    if (!VALID.includes(status)) {
      return NextResponse.json({ error: 'Estado no válido' }, { status: 400 })
    }
    await setMemberStatus(id, status)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[PATCH /api/admin/comunidad/members/[id]]', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const { id } = await params
    await deleteMember(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/admin/comunidad/members/[id]]', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
