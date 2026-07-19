import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { getMembersAdmin, getOnlineMembers } from '@/lib/db/comunidad'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const [members, online] = await Promise.all([getMembersAdmin(), getOnlineMembers()])
    const onlineIds = online.map((m) => m.id)
    return NextResponse.json({ members, onlineIds })
  } catch (err) {
    console.error('[GET /api/admin/comunidad/members]', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
