import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { listLeads, getLeadStats, type LeadSource, type LeadStatus } from '@/lib/db/leads'
import { LEAD_KINDS, type LeadKind } from '@/lib/lead-measurement'

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
    const kind = searchParams.get('kind')
    const page = Number(searchParams.get('page') ?? '0')
    if (!Number.isInteger(page) || page < 0 || page > 10000 || (kind && !LEAD_KINDS.some(option => option.value === kind))) {
      return NextResponse.json({ error: 'Filtro no válido' }, { status: 400 })
    }

    const [leads, stats] = await Promise.all([
      listLeads({
        status: status || undefined,
        source: source || undefined,
        search,
        kind: kind as LeadKind | undefined,
        offset: page * 200,
        limit: 201,
      }),
      withStats ? getLeadStats() : Promise.resolve(null),
    ])

    return NextResponse.json({ leads: leads.slice(0, 200), hasMore: leads.length > 200, stats })
  } catch (err) {
    console.error('[GET /api/admin/leads]', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
