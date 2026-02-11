import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { getSubscribers } from '@/lib/mailerlite'

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor') || undefined
    const limit = Number(searchParams.get('limit')) || 50
    const status = searchParams.get('status') || undefined

    const result = await getSubscribers({
      cursor,
      limit,
      filter: status ? { status } : undefined,
    })

    return NextResponse.json(result)
  } catch (err) {
    console.error('[GET /api/admin/email/subscribers]', err)
    return NextResponse.json({ error: 'Error al obtener suscriptores' }, { status: 500 })
  }
}
