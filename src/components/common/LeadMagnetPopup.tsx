'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { X, Gift, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import { trackSignUp } from '@/lib/analytics'
import { getPopupResource, popupAllowed, requestedGuides, rememberGuideRequest, POPUP_GUIDES, POPUP_LAST_SHOWN_KEY, POPUP_SESSION_KEY, type GuideResource } from '@/lib/guide-popup'

type Status = 'idle' | 'loading' | 'success' | 'error'

const FIELD_CLASS =
  'w-full px-4 py-3 rounded-xl bg-brand-night text-white border border-border-subtle ' +
  'placeholder:text-dim ' +
  'focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-[border-color,box-shadow]'

export default function LeadMagnetPopup() {
  const pathname = usePathname()
  const [popup, setPopup] = useState<{ pathname: string; resource: GuideResource } | null>(null)
  const visible = popup?.pathname === pathname && Boolean(getPopupResource(pathname))
  const guide = POPUP_GUIDES[popup?.resource ?? 'guia']
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const dialogRef = useRef<HTMLDivElement>(null)
  const shownInMemory = useRef(false)

  useEffect(() => {
    if (!getPopupResource(pathname)) return
    const started = Date.now()
    let opened = false
    const open = () => {
      if (opened || shownInMemory.current || document.visibilityState !== 'visible') return
      if (document.activeElement?.matches('input, textarea, select') || document.querySelector('[aria-modal="true"]')) return
      const resource = getPopupResource(pathname, document.querySelector('[data-lead-resource]')?.getAttribute('data-lead-resource'))
      if (!resource) return
      let sessionShown = false
      let lastShown = 0
      try { sessionShown = Boolean(sessionStorage.getItem(POPUP_SESSION_KEY)); lastShown = Number(localStorage.getItem(POPUP_LAST_SHOWN_KEY)) } catch { /* Mantener la protección en memoria. */ }
      if (!popupAllowed(resource, requestedGuides(), sessionShown, lastShown, Date.now())) return
      opened = true
      shownInMemory.current = true
      try { sessionStorage.setItem(POPUP_SESSION_KEY, '1'); localStorage.setItem(POPUP_LAST_SHOWN_KEY, String(Date.now())) } catch { /* No impedir el cierre ni la lectura. */ }
      setPopup({ pathname, resource })
    }
    const handleExitIntent = (event: MouseEvent) => {
      if (event.clientY <= 8 && event.relatedTarget === null && Date.now() - started >= 15000 && window.matchMedia('(pointer: fine)').matches) open()
    }
    const handleReading = () => {
      if (window.matchMedia('(pointer: fine)').matches || Date.now() - started < 45000) return
      if ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight >= 0.5) open()
    }
    const timer = window.setTimeout(handleReading, 45000)
    document.addEventListener('mouseout', handleExitIntent)
    window.addEventListener('scroll', handleReading, { passive: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', handleReading)
      document.removeEventListener('mouseout', handleExitIntent)
    }
  }, [pathname])

  useEffect(() => {
    if (!visible) return
    const dialog = dialogRef.current
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog?.querySelector<HTMLElement>('button')?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPopup(null)
        return
      }
      const focusable = dialog?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')
      const first = focusable?.[0]
      const last = focusable?.[focusable.length - 1]
      if (event.key !== 'Tab' || !first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      if (previousFocus?.isConnected) previousFocus.focus()
    }
  }, [visible])

  const close = () => setPopup(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!popup) return
    setStatus('loading')
    try {
      const { getAttributionForSubmit } = await import('@/lib/tracking')
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resource: popup.resource, _source: `popup_${popup.resource}`, _attribution: getAttributionForSubmit() }),
      })
      if (!res.ok) throw new Error()
      rememberGuideRequest(popup.resource)
      trackSignUp(`popup_${popup.resource}`)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="leadmagnet-title"
      aria-describedby="leadmagnet-description"
      className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-black/70 sm:p-4 sm:backdrop-blur-sm animate-fade-in overscroll-contain"
      onClick={close}
    >
      <div
        ref={dialogRef}
        style={{ backgroundColor: 'var(--color-brand-night)' }}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto surface-card-accent rounded-2xl p-6 md:p-8 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Cerrar"
          className="absolute top-3 right-3 flex min-h-11 min-w-11 items-center justify-center rounded-lg text-muted hover:text-accent hover:bg-accent-muted transition-colors"
        >
          <X size={18} />
        </button>

        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-accent-muted border border-border-strong">
          <Gift className="w-5 h-5 text-accent" />
        </div>

        {status === 'success' ? (
          <div className="text-center py-4 space-y-3" role="status" aria-live="polite">
            <CheckCircle className="w-10 h-10 text-success mx-auto" aria-hidden="true" />
            <p id="leadmagnet-title" className="text-fluid-xl font-bold text-white">
              ¡Perfecto!
            </p>
            <p id="leadmagnet-description" className="text-fluid-sm text-muted">
              Tu guía ya está disponible. Puedes descargarla aquí y revisar también tu correo.
            </p>
            <a href={guide.file} download className="btn-brand mt-3 inline-flex min-h-11 px-5">Descargar mi guía</a>
          </div>
        ) : (
          <>
            <h2 id="leadmagnet-title" className="headline text-fluid-xl text-white mb-1">
              {guide.title}
            </h2>
            <p id="leadmagnet-description" className="text-fluid-sm text-muted mb-1">
              {guide.description}
            </p>
            <p className="text-fluid-base font-bold text-accent mb-5">
              &ldquo;{guide.guide}&rdquo;
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <label htmlFor="leadmagnet-email" className="sr-only">
                Tu email
              </label>
              <input
                id="leadmagnet-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                spellCheck={false}
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-invalid={status === 'error'}
                aria-describedby={status === 'error' ? 'leadmagnet-error' : undefined}
                className={FIELD_CLASS}
              />
              {status === 'error' && (
                <p
                  id="leadmagnet-error"
                  role="alert"
                  className="text-fluid-sm text-danger flex items-center gap-1.5"
                >
                  <AlertCircle className="w-4 h-4" aria-hidden="true" /> Algo falló. Inténtalo de
                  nuevo.
                </p>
              )}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-brand w-full text-fluid-base py-3 disabled:opacity-60"
              >
                {status === 'loading' ? (
                  'Enviando…'
                ) : (
                  <>
                    {guide.button} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>

            <p className="text-fluid-xs text-subtle text-center mt-4">
              Recibirás la guía y contenidos de entrenamiento. Puedes darte de baja cuando quieras. <a href="/privacidad" className="underline underline-offset-2">Privacidad</a>.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
