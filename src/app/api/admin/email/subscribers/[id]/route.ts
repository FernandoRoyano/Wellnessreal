import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { getSubscriber, deleteSubscriber } from '@/lib/mailerlite'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params
    const result = await getSubscriber(id)

    return NextResponse.json(result)
  } catch (err) {
    console.error('[GET /api/admin/email/subscribers/[id]]', err)
    return NextResponse.json({ error: 'Error al obtener suscriptor' }, { status: 500 })
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
    await deleteSubscriber(id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/admin/email/subscribers/[id]]', err)
    return NextResponse.json({ error: 'Error al eliminar suscriptor' }, { status: 500 })
  }
}
