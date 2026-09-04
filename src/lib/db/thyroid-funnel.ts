import { supabase } from '@/lib/supabase'

export const THYROID_FUNNEL_EVENTS = [
  'thyroid_landing_view',
  'thyroid_test_start',
  'thyroid_test_question',
  'thyroid_test_complete',
  'thyroid_lead_capture',
  'thyroid_result_view',
  'thyroid_valuation_click',
  'thyroid_valuation_submit',
  'thyroid_sale',
  'thyroid_continuity',
] as const

export type ThyroidFunnelEventName = (typeof THYROID_FUNNEL_EVENTS)[number]

interface FunnelEventInput {
  eventName: ThyroidFunnelEventName
  leadId?: string | null
  email?: string | null
  anonymousId?: string | null
  sessionId?: string | null
  profile?: string | null
  intent?: string | null
  questionId?: string | null
  source?: string | null
  medium?: string | null
  campaign?: string | null
  value?: number | null
  currency?: string
  externalId?: string | null
  metadata?: Record<string, unknown>
}

async function findLeadId(email?: string | null): Promise<string | null> {
  if (!email) return null
  const { data } = await supabase
    .from('leads')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle()
  return (data?.id as string | undefined) ?? null
}

export async function recordThyroidFunnelEvent(input: FunnelEventInput): Promise<void> {
  const leadId = input.leadId ?? await findLeadId(input.email)
  const { error } = await supabase.from('thyroid_funnel_events').insert({
    event_name: input.eventName,
    lead_id: leadId,
    anonymous_id: input.anonymousId ?? null,
    session_id: input.sessionId ?? null,
    profile: input.profile ?? null,
    intent: input.intent ?? null,
    question_id: input.questionId ?? null,
    source: input.source ?? null,
    medium: input.medium ?? null,
    campaign: input.campaign ?? null,
    value: input.value ?? null,
    currency: input.currency ?? 'EUR',
    external_id: input.externalId ?? null,
    metadata: input.metadata ?? {},
  })

  // Eventos de Stripe son idempotentes mediante external_id.
  if (error && error.code !== '23505') {
    throw new Error(`[ThyroidFunnel:recordEvent] ${error.message}`)
  }
}

export async function markThyroidLeadAsCustomer(email: string): Promise<string | null> {
  const normalizedEmail = email.toLowerCase().trim()
  const { data: lead, error: findError } = await supabase
    .from('leads')
    .select('id,tags')
    .eq('email', normalizedEmail)
    .maybeSingle()
  if (findError) throw new Error(`[ThyroidFunnel:findCustomer] ${findError.message}`)
  if (!lead) return null
  const tags = lead.tags as string[] | null
  const isThyroidLead = tags?.some((tag) => tag === 'via:tiroides' || tag === 'form:test-tiroides')
  if (!isThyroidLead) return null

  const { error } = await supabase
    .from('leads')
    .update({ status: 'cliente', converted_at: new Date().toISOString() })
    .eq('id', lead.id)
  if (error) throw new Error(`[ThyroidFunnel:markCustomer] ${error.message}`)
  return lead.id as string
}

export async function attachAnonymousEventsToLead(anonymousId: string, leadId: string): Promise<void> {
  const { error } = await supabase
    .from('thyroid_funnel_events')
    .update({ lead_id: leadId })
    .eq('anonymous_id', anonymousId)
    .is('lead_id', null)
  if (error) throw new Error(`[ThyroidFunnel:attachAnonymous] ${error.message}`)
}
