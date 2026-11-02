export const CONSENT_KEY = 'wr_cookie_consent_v2'
export type CookieConsent = 'accepted' | 'rejected'

export function hasTrackingConsent(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(CONSENT_KEY) === 'accepted'
  } catch {
    return false
  }
}

export function clearTrackingData(): void {
  if (typeof window === 'undefined') return
  const names = new Set(['wr_attr', '_fbp', '_fbc', '_ttp', ...document.cookie.split(';').map(value => value.trim().split('=')[0]).filter(name => /^_ga(?:_|$)|^_gid$|^_gat|^_gcl_/.test(name))])
  for (const name of names) {
    for (const domain of ['', `; domain=${window.location.hostname}`, '; domain=.wellnessreal.es']) {
      document.cookie = `${name}=; max-age=0; path=/${domain}; SameSite=Lax; Secure`
    }
  }
  try {
    for (const key of ['wr_thyroid_anonymous_id', 'wr_thyroid_lead_id']) window.localStorage.removeItem(key)
    window.sessionStorage.removeItem('wr_thyroid_session_id')
  } catch {
    // El bloqueo del almacenamiento no debe impedir rechazar las cookies.
  }
}

export function saveCookieConsent(choice: CookieConsent): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, choice)
  } catch {
    // Sin almacenamiento persistente volveremos a solicitar la elección.
  }
  document.documentElement.dataset.cookieConsent = choice
  if (choice === 'rejected') clearTrackingData()
  const permission = choice === 'accepted' ? 'granted' : 'denied'
  window.gtag?.('consent', 'update', {
    ad_storage: permission, analytics_storage: permission,
    ad_user_data: permission, ad_personalization: permission,
  })
  window.dispatchEvent(new Event('wr-consent-changed'))
}
