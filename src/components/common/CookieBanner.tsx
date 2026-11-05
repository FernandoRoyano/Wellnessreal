'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie } from 'lucide-react'
import { CONSENT_KEY, saveCookieConsent } from '@/lib/cookie-consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(true)
  const [reopened, setReopened] = useState(false)

  useEffect(() => {
    const consent = document.documentElement.dataset.cookieConsent
    // Se lee tras hidratar porque localStorage no existe durante el render del servidor.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (consent === 'accepted' || consent === 'rejected') setVisible(false)
    const open = () => { setReopened(true); setVisible(true) }
    window.addEventListener('wr-open-cookie-settings', open)
    return () => window.removeEventListener('wr-open-cookie-settings', open)
  }, [])

  const accept = () => {
    saveCookieConsent('accepted')
    setVisible(false)
  }

  const reject = () => {
    saveCookieConsent('rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      data-initial={!reopened ? CONSENT_KEY : undefined}
      className="cookie-banner relative z-[220] px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:fixed md:bottom-0 md:left-0 md:right-0 md:p-5"
    >
      <div style={{ backgroundColor: 'var(--color-brand-deep)' }} className="max-w-5xl mx-auto surface-card-accent rounded-xl p-3 shadow-xl md:rounded-2xl md:p-6 md:backdrop-blur-xl">
        <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:gap-5">
          <div className="flex min-w-0 flex-1 items-start gap-3 md:items-center">
            <span
              aria-hidden="true"
              className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-strong bg-accent-muted md:flex"
            >
              <Cookie className="w-5 h-5 text-accent" />
            </span>
            <p className="text-[11px] leading-4 text-muted md:text-fluid-sm md:leading-relaxed">
              <span className="md:hidden">Cookies de analítica y publicidad (Meta). </span>
              <span className="hidden md:inline">
                Utilizo cookies propias y de terceros para mejorar tu experiencia, analizar el tráfico
                y medir publicidad con Meta en páginas generales. Puedes aceptar todas, rechazar las no esenciales o consultar
                la{' '}
              </span>
              <Link
                href="/privacidad"
                className="text-accent underline underline-offset-2 hover:opacity-80 transition"
              >
                política de privacidad
              </Link>
              <span className="hidden md:inline">.</span>
            </p>
          </div>

          <div className="flex w-full shrink-0 gap-2 md:w-auto md:gap-3">
            <button
              type="button"
              onClick={reject}
              className="min-h-10 flex-1 rounded-lg border border-border-subtle px-3 py-2 text-xs font-semibold text-muted transition-[border-color,color,background-color] hover:border-border-strong hover:text-white md:min-h-11 md:flex-none md:rounded-xl md:px-5 md:py-2.5 md:text-fluid-sm"
            >
              Solo esenciales
            </button>
            <button
              type="button"
              onClick={accept}
              className="btn-brand min-h-10 flex-1 rounded-lg px-3 py-2 text-xs md:min-h-11 md:flex-none md:rounded-xl md:px-5 md:py-2.5 md:text-fluid-sm"
            >
              Aceptar todas
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CookieSettingsButton() {
  return <button type="button" className="text-accent underline underline-offset-2" onClick={() => window.dispatchEvent(new Event('wr-open-cookie-settings'))}>Cambiar preferencias de cookies</button>
}
