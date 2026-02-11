import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { getCampaign, deleteCampaign } from '@/lib/mailerlite'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params
    const result = await getCampaign(id)

    return NextResponse.json(result)
  } catch (err) {
    console.error('[GET /api/admin/email/campaigns/[id]]', err)
    return NextResponse.json({ error: 'Error al obtener campaña' }, { status: 500 })
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
    await deleteCampaign(id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/admin/email/campaigns/[id]]', err)
    return NextResponse.json({ error: 'Error al eliminar campaña' }, { status: 500 })
  }
}
