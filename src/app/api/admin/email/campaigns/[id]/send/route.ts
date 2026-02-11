import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { sendCampaign } from '@/lib/mailerlite'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params
    const result = await sendCampaign(id)

    return NextResponse.json(result)
  } catch (err) {
    console.error('[POST /api/admin/email/campaigns/[id]/send]', err)
    return NextResponse.json({ error: 'Error al enviar campaña' }, { status: 500 })
  }
}
