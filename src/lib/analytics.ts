declare global {
  interface Window {
    // Firma amplia: cubre 'event'/'config'/'js' y también 'consent' (Consent Mode v2).
    gtag?: (...args: unknown[]) => void
  }
}

function fireEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') return
  window.gtag('event', eventName, params)
}

/** Valoración form submitted */
export function trackGenerateLead(method: string = 'valoracion_form'): void {
  fireEvent('generate_lead', { method })
}

/** Newsletter/guide form submitted */
export function trackSignUp(method: string): void {
  fireEvent('sign_up', { method })
}

export type ThyroidFunnelEvent =
  | 'thyroid_landing_view'
  | 'thyroid_test_start'
  | 'thyroid_test_question'
  | 'thyroid_test_complete'
  | 'thyroid_lead_capture'
  | 'thyroid_result_view'
  | 'thyroid_valuation_click'
  | 'thyroid_valuation_submit'
  | 'thyroid_sale'
  | 'thyroid_continuity'

const THYROID_ANONYMOUS_KEY = 'wr_thyroid_anonymous_id'
const THYROID_SESSION_KEY = 'wr_thyroid_session_id'
const THYROID_LEAD_KEY = 'wr_thyroid_lead_id'

function getTrackingId(key: string, storage: Storage): string {
  const existing = storage.getItem(key)
  if (existing) return existing
  const value = crypto.randomUUID()
  storage.setItem(key, value)
  return value
}

export function identifyThyroidLead(leadId: string): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(THYROID_LEAD_KEY, leadId)
}

export function getThyroidTrackingContext(): { anonymousId: string; sessionId: string } | null {
  if (typeof window === 'undefined') return null
  return {
    anonymousId: getTrackingId(THYROID_ANONYMOUS_KEY, window.localStorage),
    sessionId: getTrackingId(THYROID_SESSION_KEY, window.sessionStorage),
  }
}

export function trackThyroidFunnel(
  event: ThyroidFunnelEvent,
  params?: Record<string, string | number | boolean>,
  persist = true,
): void {
  fireEvent(event, params)
  if (typeof window === 'undefined' || !persist) return

  const attribution = new URLSearchParams(window.location.search)
  const payload = {
    eventName: event,
    leadId: window.localStorage.getItem(THYROID_LEAD_KEY),
    anonymousId: getThyroidTrackingContext()?.anonymousId,
    sessionId: getThyroidTrackingContext()?.sessionId,
    profile: typeof params?.profile === 'string' ? params.profile : null,
    intent: typeof params?.intent === 'string' ? params.intent : null,
    questionId: typeof params?.question_id === 'string' ? params.question_id : null,
    source: attribution.get('utm_source'),
    medium: attribution.get('utm_medium'),
    campaign: attribution.get('utm_campaign'),
    metadata: params ?? {},
  }
  void fetch('/api/funnel/tiroides/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => undefined)
}

/** Contact form submitted */
export function trackContact(): void {
  fireEvent('contact')
}

/** WhatsApp bubble clicked */
export function trackClickWhatsApp(): void {
  fireEvent('click_whatsapp')
}

/** Tarifas page viewed */
export function trackViewPricing(): void {
  fireEvent('view_pricing')
}

/** Plan CTA clicked */
export function trackClickPlan(planName: string): void {
  fireEvent('click_plan', { plan_name: planName })
}
