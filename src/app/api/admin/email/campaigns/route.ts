import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { getCampaigns, createCampaign } from '@/lib/mailerlite'
import { createCampaignSchema } from '@/lib/validations/campaign'

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined
    const cursor = searchParams.get('cursor') || undefined
    const limit = Number(searchParams.get('limit')) || 25

    const result = await getCampaigns({
      filter: status ? { status, type: 'regular' } : { type: 'regular' },
      cursor,
      limit,
    })

    return NextResponse.json(result)
  } catch (err) {
    console.error('[GET /api/admin/email/campaigns]', err)
    return NextResponse.json({ error: 'Error al obtener campañas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = createCampaignSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const data = parsed.data
    const result = await createCampaign({
      name: data.name,
      subject: data.subject,
      from: data.fromEmail,
      from_name: data.fromName,
      content: data.content,
      groups: [data.groupId],
    })

    return NextResponse.json(result)
  } catch (err) {
    console.error('[POST /api/admin/email/campaigns]', err)
    return NextResponse.json({ error: 'Error al crear campaña' }, { status: 500 })
  }
}
