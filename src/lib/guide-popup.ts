export type GuideResource = 'guia' | 'tiroides'
export const POPUP_COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000
export const GUIDE_REQUEST_KEY = 'wr_guides_requested'
export const POPUP_LAST_SHOWN_KEY = 'wr_popup_last_shown_at'
export const POPUP_SESSION_KEY = 'wr_popup_shown'

const HIDDEN = ['/admin', '/studio', '/cliente', '/programa', '/comunidad', '/valoracion', '/recurso-gratis', '/metodo-tiroides', '/libro-tiroides', '/webinar', '/contacto', '/privacidad', '/terminos', '/politica-editorial', '/tiroides/clase', '/tiroides/video']

export function getPopupResource(pathname: string, declaredResource?: string | null): GuideResource | undefined {
  if (pathname === '/tiroides' || pathname.startsWith('/gracias') || HIDDEN.some(path => pathname === path || pathname.startsWith(`${path}/`))) return undefined
  if (declaredResource === 'guia' || declaredResource === 'tiroides') return declaredResource
  return /tiroid|hashimoto|levotiroxina/.test(pathname) ? 'tiroides' : 'guia'
}

export function popupAllowed(resource: GuideResource, requested: GuideResource[], sessionShown: boolean, lastShown: number, now: number): boolean {
  return !sessionShown && !requested.includes(resource) && (!Number.isFinite(lastShown) || lastShown <= 0 || now - lastShown >= POPUP_COOLDOWN_MS)
}

export function requestedGuides(): GuideResource[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(GUIDE_REQUEST_KEY) || '[]')
    const guides: GuideResource[] = Array.isArray(raw) ? raw.filter((value): value is GuideResource => value === 'guia' || value === 'tiroides') : []
    if (localStorage.getItem('wr_lead_submitted') && !guides.includes('guia')) guides.push('guia')
    return guides
  } catch { return [] }
}

export function rememberGuideRequest(resource: GuideResource): void {
  try { localStorage.setItem(GUIDE_REQUEST_KEY, JSON.stringify([...new Set([...requestedGuides(), resource])])) } catch { /* La descarga no depende del almacenamiento local. */ }
}

export const POPUP_GUIDES = {
  guia: {
    title: 'Un plan tiene que caber en tu vida.',
    description: 'Entiende las bases de la fuerza y la alimentación para la salud, con ejercicios ilustrados, variantes y ejemplos prácticos.',
    guide: 'Fitness real para gente con vida real',
    button: 'Quiero la guía fitness',
    file: '/guia-wellness-real.pdf',
  },
  tiroides: {
    title: '¿Te cuesta saber por dónde empezar?',
    description: 'Recibe la guía gratuita para entender cómo organizar el entrenamiento y los hábitos cuando tienes hipotiroidismo.',
    guide: 'Entrenar y adelgazar con hipotiroidismo',
    button: 'Quiero la guía de tiroides',
    file: '/tiroides.pdf',
  },
} as const
