/** Eventos genéricos con consentimiento. Requiere Configuración básica activa en Meta. */
export const META_PIXEL_ID = '1856252045560196'
export const CONSENT_KEY = 'wr_cookie_consent_v2'
const PUBLIC_PATHS = new Set(['/', '/contacto', '/sobre-mi', '/filosofia', '/servicios', '/tarifas'])
export const THYROID_LANDING_PATHS = new Set([
  '/tiroides', '/metodo-tiroides', '/hipotiroidismo',
  '/hipotiroidismo/ejercicio', '/hipotiroidismo/perder-peso',
  '/tiroides/clase', '/tiroides/clase/video',
])
const ATTRIBUTION_KEYS = new Set(['fbclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id'])
let excludedJourney = false
let healthJourney = false

export function canTrackMeta(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const safeUrl = (url: URL) => {
      if (THYROID_LANDING_PATHS.has(url.pathname)) healthJourney = true
      return (PUBLIC_PATHS.has(url.pathname) || THYROID_LANDING_PATHS.has(url.pathname))
        && [...url.searchParams.keys()].every(key => ATTRIBUTION_KEYS.has(key))
        && !url.hash
    }
    if (!safeUrl(new URL(window.location.href))) excludedJourney = true
    if (document.referrer) {
      const referrer = new URL(document.referrer)
      if (!safeUrl(referrer)) excludedJourney = true
    }
    return !excludedJourney && localStorage.getItem(CONSENT_KEY) === 'accepted'
  } catch {
    return false
  }
}

export function syncMetaConsent(): boolean {
  if (typeof window === 'undefined') return false
  const allowed = canTrackMeta()
  window.fbq?.('consent', allowed ? 'grant' : 'revoke')
  return allowed
}

export function trackMetaEvent(event: 'PageView' | 'Lead'): void {
  if (!syncMetaConsent()) return
  // No se atribuyen solicitudes ni otros resultados de salud a Meta.
  if (event === 'Lead' && healthJourney) return
  window.fbq?.('trackSingle', META_PIXEL_ID, event)
}
