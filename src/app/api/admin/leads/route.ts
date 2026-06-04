import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { listLeads, getLeadStats, type LeadSource, type LeadStatus } from '@/lib/db/leads'

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as LeadStatus | null
    const source = searchParams.get('source') as LeadSource | null
    const search = searchParams.get('search') || undefined
    const withStats = searchParams.get('stats') === '1'

    const [leads, stats] = await Promise.all([
      listLeads({
        status: status || undefined,
        source: source || undefined,
        search,
      }),
      withStats ? getLeadStats() : Promise.resolve(null),
    ])

    return NextResponse.json({ leads, stats })
  } catch (err) {
    console.error('[GET /api/admin/leads]', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
