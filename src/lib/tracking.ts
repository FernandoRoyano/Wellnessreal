/**
 * Tracking de atribución: captura UTMs y fbc/fbp en el primer landing
 * y los persiste 30 días en cookie para enviarlos con cada formulario.
 *
 * Se guarda solo el PRIMERO (first-touch attribution), no se sobrescribe.
 */

const COOKIE_NAME = 'wr_attr'
const COOKIE_DAYS = 30

export interface AttributionData {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  referrer?: string
  landing_page?: string
  fbc?: string
  fbp?: string
  first_seen_at?: string
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/[.$?*|{}()[\]\\/+^]/g, '\\$&') + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + days * 86400000).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

export function getStoredAttribution(): AttributionData {
  const raw = getCookie(COOKIE_NAME)
  if (!raw) return {}
  try {
    return JSON.parse(raw) as AttributionData
  } catch {
    return {}
  }
}

/**
 * Captura UTMs de la URL actual y los persiste si no había nada antes.
 * Se llama en cada page load desde el componente cliente UtmCapture.
 */
export function captureAttribution(): AttributionData {
  if (typeof window === 'undefined') return {}

  const existing = getStoredAttribution()
  // Si ya tenemos atribución persistida, no la sobrescribimos
  // (first-touch attribution)
  if (existing.first_seen_at) {
    return existing
  }

  const params = new URLSearchParams(window.location.search)
  const data: AttributionData = {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_term: params.get('utm_term') || undefined,
    utm_content: params.get('utm_content') || undefined,
    referrer: document.referrer || undefined,
    landing_page: window.location.pathname + window.location.search,
    first_seen_at: new Date().toISOString(),
  }

  // Meta click ID (fbclid en URL → cookie _fbc según spec Meta)
  const fbclid = params.get('fbclid')
  if (fbclid) {
    const subdomainIndex = 1 // .wellnessreal.es vs wellnessreal.es
    const ts = Math.floor(Date.now() / 1000)
    data.fbc = `fb.${subdomainIndex}.${ts}.${fbclid}`
  } else {
    const fbcCookie = getCookie('_fbc')
    if (fbcCookie) data.fbc = fbcCookie
  }

  // Meta browser ID (lo setea el pixel automáticamente como _fbp)
  const fbpCookie = getCookie('_fbp')
  if (fbpCookie) data.fbp = fbpCookie

  // Solo persistimos si hay algo que valga la pena
  const hasUtm = data.utm_source || data.utm_medium || data.utm_campaign
  const hasFb = data.fbc
  const hasReferrer = data.referrer && !data.referrer.includes(window.location.hostname)

  if (hasUtm || hasFb || hasReferrer) {
    setCookie(COOKIE_NAME, JSON.stringify(data), COOKIE_DAYS)
  }

  return data
}

/**
 * Dispara una conversión a Google (GA4), Meta y TikTok con el nombre que cada
 * plataforma espera. No-op si el pixel no está cargado (sin consentimiento).
 */
export type ConversionEvent = 'lead' | 'complete_registration' | 'begin_checkout' | 'purchase'

const META_EVENT: Record<ConversionEvent, string> = {
  lead: 'Lead',
  complete_registration: 'CompleteRegistration',
  begin_checkout: 'InitiateCheckout',
  purchase: 'Purchase',
}
const TIKTOK_EVENT: Record<ConversionEvent, string> = {
  lead: 'SubmitForm',
  complete_registration: 'CompleteRegistration',
  begin_checkout: 'InitiateCheckout',
  purchase: 'CompletePayment',
}

export function trackConversion(
  event: ConversionEvent,
  params: { value?: number; currency?: string; [key: string]: unknown } = {},
) {
  if (typeof window === 'undefined') return
  const w = window as typeof window & {
    gtag?: (...a: unknown[]) => void
    fbq?: (...a: unknown[]) => void
    ttq?: { track?: (e: string, p?: Record<string, unknown>) => void }
  }
  try {
    w.gtag?.('event', event, params)
    w.fbq?.('track', META_EVENT[event], params)
    w.ttq?.track?.(TIKTOK_EVENT[event], params)
  } catch {
    // Nunca romper la UX por un fallo de tracking.
  }
}

/**
 * Devuelve la atribución almacenada + actualiza fbc/fbp por si han cambiado.
 * Llamar antes de cualquier submit de formulario.
 */
export function getAttributionForSubmit(): AttributionData {
  const stored = getStoredAttribution()
  const fbcCookie = getCookie('_fbc')
  const fbpCookie = getCookie('_fbp')
  return {
    ...stored,
    fbc: stored.fbc || fbcCookie || undefined,
    fbp: fbpCookie || stored.fbp || undefined,
  }
}
