import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { getSubscriberCount } from '@/lib/mailerlite'

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const counts = await getSubscriberCount()

    return NextResponse.json(counts)
  } catch (err) {
    console.error('[GET /api/admin/email/subscribers/count]', err)
    return NextResponse.json({ error: 'Error al obtener conteos' }, { status: 500 })
  }
}
