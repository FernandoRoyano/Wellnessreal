import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { THYROID_FUNNEL_EVENTS } from '@/lib/db/thyroid-funnel'

interface EventRow {
  id: string
  event_name: string
  lead_id: string | null
  anonymous_id: string | null
  session_id: string | null
  external_id: string | null
  profile: string | null
  intent: string | null
  question_id: string | null
  source: string | null
  value: number | null
  created_at: string
  metadata: Record<string, unknown> | null
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
      .select('id,event_name,lead_id,anonymous_id,session_id,external_id,profile,intent,question_id,source,value,created_at,metadata')
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

    const identitiesByEvent = new Map<string, Set<string>>(
      THYROID_FUNNEL_EVENTS.map((name) => [name, new Set<string>()]),
    )
    const byProfile: Record<string, number> = {}
    const salesByProfile: Record<string, number> = {}
    const byIntent: Record<string, number> = {}
    const salesByIntent: Record<string, number> = {}
    const bySource: Record<string, number> = {}
    const byQuestion: Record<string, number> = {}
    let revenue = 0
    let recurringRevenue = 0
    const engagedIdentities = new Set<string>()
    const landingCtaIdentities = new Set<string>()

    for (const event of events) {
      const identity = event.lead_id
        ? `lead:${event.lead_id}`
        : event.anonymous_id
          ? `anonymous:${event.anonymous_id}`
          : event.session_id
            ? `session:${event.session_id}`
            : event.external_id
              ? `external:${event.external_id}`
              : `event:${event.id}`
      const viewType = event.event_name === 'thyroid_landing_view'
        ? String(event.metadata?.view_type ?? 'initial')
        : null
      if (viewType === 'engaged') engagedIdentities.add(identity)
      if (viewType === 'cta_click' || event.event_name === 'thyroid_landing_cta_click') {
        landingCtaIdentities.add(identity)
      }
      if (!viewType || viewType === 'initial') identitiesByEvent.get(event.event_name)?.add(identity)
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

    const counts = Object.fromEntries(
      THYROID_FUNNEL_EVENTS.map((name) => [name, identitiesByEvent.get(name)?.size ?? 0]),
    ) as Record<string, number>
    const engagedViews = engagedIdentities.size
    const landingCtaClicks = landingCtaIdentities.size

    const rate = (from: string, to: string) => counts[from] > 0
      ? Math.round((counts[to] / counts[from]) * 1000) / 10
      : 0

    return NextResponse.json({
      days,
      counts,
      rates: {
        landingToEngaged: counts.thyroid_landing_view > 0
          ? Math.round((engagedViews / counts.thyroid_landing_view) * 1000) / 10
          : 0,
        landingToStart: rate('thyroid_landing_view', 'thyroid_test_start'),
        startToComplete: rate('thyroid_test_start', 'thyroid_test_complete'),
        completeToLead: rate('thyroid_test_complete', 'thyroid_lead_capture'),
        leadToValuation: rate('thyroid_lead_capture', 'thyroid_valuation_submit'),
        valuationToSale: rate('thyroid_valuation_submit', 'thyroid_sale'),
        leadToSale: rate('thyroid_lead_capture', 'thyroid_sale'),
        vslLandingToRegistration: rate('thyroid_vsl_landing_view', 'thyroid_vsl_registration'),
        vslRegistrationToCta: rate('thyroid_vsl_registration', 'thyroid_vsl_cta_click'),
        offerToApplication: rate('thyroid_offer_view', 'thyroid_valuation_submit'),
        applicationToSale: rate('thyroid_valuation_submit', 'thyroid_sale'),
        saleToOnboarding: rate('thyroid_sale', 'thyroid_onboarding_complete'),
      },
      landingSignals: { engagedViews, landingCtaClicks },
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
