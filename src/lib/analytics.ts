declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'js',
      targetId: string,
      params?: Record<string, unknown>
    ) => void
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
