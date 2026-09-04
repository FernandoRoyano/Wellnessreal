import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { THYROID_FUNNEL_EVENTS } from '@/lib/db/thyroid-funnel'

interface EventRow {
  event_name: string
  lead_id: string | null
  profile: string | null
  intent: string | null
  question_id: string | null
  source: string | null
  value: number | null
  created_at: string
}

interface LeadContext {
  id: string
  source: string | null
  utm_source: string | null
  form_data: Record<string, unknown> | null
}

function increment(target: Record<string, number>, key: string) {
  target[key] = (target[key] ?? 0) + 1
}

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const requestedDays = Number(request.nextUrl.searchParams.get('days') || 30)
    const days = [7, 30, 90].includes(requestedDays) ? requestedDays : 30
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
    const { data, error } = await supabase
      .from('thyroid_funnel_events')
      .select('event_name,lead_id,profile,intent,question_id,source,value,created_at')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(10000)
    if (error) throw new Error(`[ThyroidFunnelDashboard:events] ${error.message}`)

    const events = (data ?? []) as EventRow[]
    const leadIds = Array.from(new Set(events.flatMap((event) => event.lead_id ? [event.lead_id] : [])))
    let leads: LeadContext[] = []
    if (leadIds.length > 0) {
      const { data: leadRows, error: leadError } = await supabase
        .from('leads')
        .select('id,source,utm_source,form_data')
        .in('id', leadIds)
      if (leadError) throw new Error(`[ThyroidFunnelDashboard:leads] ${leadError.message}`)
      leads = (leadRows ?? []) as LeadContext[]
    }
    const leadsById = new Map(leads.map((lead) => [lead.id, lead]))

    const counts = Object.fromEntries(THYROID_FUNNEL_EVENTS.map((name) => [name, 0])) as Record<string, number>
    const byProfile: Record<string, number> = {}
    const salesByProfile: Record<string, number> = {}
    const byIntent: Record<string, number> = {}
    const salesByIntent: Record<string, number> = {}
    const bySource: Record<string, number> = {}
    const byQuestion: Record<string, number> = {}
    let revenue = 0
    let recurringRevenue = 0

    for (const event of events) {
      increment(counts, event.event_name)
      const lead = event.lead_id ? leadsById.get(event.lead_id) : undefined
      const formData = lead?.form_data ?? {}
      const profile = event.profile || String(formData.profile || formData.thyroidProfile || 'desconocido')
      const intent = event.intent || String(formData.intent || formData.thyroidIntent || 'desconocido')
      const source = event.source || lead?.utm_source || lead?.source || 'directo'

      if (event.event_name === 'thyroid_lead_capture') {
        increment(byProfile, profile)
        increment(byIntent, intent)
        increment(bySource, source)
      }
      if (event.event_name === 'thyroid_test_question' && event.question_id) {
        increment(byQuestion, event.question_id)
      }
      if (event.event_name === 'thyroid_sale') {
        increment(salesByProfile, profile)
        increment(salesByIntent, intent)
        revenue += Number(event.value || 0)
      }
      if (event.event_name === 'thyroid_continuity') recurringRevenue += Number(event.value || 0)
    }

    const rate = (from: string, to: string) => counts[from] > 0
      ? Math.round((counts[to] / counts[from]) * 1000) / 10
      : 0

    return NextResponse.json({
      days,
      counts,
      rates: {
        landingToStart: rate('thyroid_landing_view', 'thyroid_test_start'),
        startToComplete: rate('thyroid_test_start', 'thyroid_test_complete'),
        completeToLead: rate('thyroid_test_complete', 'thyroid_lead_capture'),
        leadToValuation: rate('thyroid_lead_capture', 'thyroid_valuation_submit'),
        valuationToSale: rate('thyroid_valuation_submit', 'thyroid_sale'),
        leadToSale: rate('thyroid_lead_capture', 'thyroid_sale'),
      },
      revenue,
      recurringRevenue,
      revenuePer100Leads: counts.thyroid_lead_capture > 0
        ? Math.round(((revenue + recurringRevenue) / counts.thyroid_lead_capture) * 100)
        : 0,
      byProfile,
      salesByProfile,
      byIntent,
      salesByIntent,
      bySource,
      byQuestion,
    })
  } catch (error) {
    console.error('[ThyroidFunnelDashboard:GET] No se pudo cargar:', error)
    return NextResponse.json({ error: 'No se pudieron cargar las métricas del funnel' }, { status: 500 })
  }
}
