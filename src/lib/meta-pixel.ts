/** Meta solo recibe eventos genéricos en páginas públicas expresamente permitidas. */
export const META_PIXEL_ID = '1856252045560196'
import { hasTrackingConsent } from '@/lib/cookie-consent'
const PUBLIC_PATHS = new Set(['/', '/contacto', '/sobre-mi', '/filosofia', '/servicios', '/tarifas'])
let excludedJourney = false

export function canTrackMeta(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const safeUrl = (url: URL) => PUBLIC_PATHS.has(url.pathname) && !url.search && !url.hash
    if (!safeUrl(new URL(window.location.href))) excludedJourney = true
    if (document.referrer) {
      const referrer = new URL(document.referrer)
      if (!safeUrl(referrer)) excludedJourney = true
    }
    return !excludedJourney && hasTrackingConsent()
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
  if (syncMetaConsent()) window.fbq?.('trackSingle', META_PIXEL_ID, event)
}
