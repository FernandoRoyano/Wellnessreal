'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { X, Gift, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import { trackSignUp } from '@/lib/analytics'

const HIDDEN_PATHS = [
  '/admin',
  '/studio',
  '/cliente',
  '/valoracion',
  '/recurso-gratis',
  '/gracias',
  '/metodo-tiroides',
]
const SESSION_KEY = 'wr_popup_shown'
const LOCAL_KEY = 'wr_lead_submitted'

type Status = 'idle' | 'loading' | 'success' | 'error'

const FIELD_CLASS =
  'w-full px-4 py-3 rounded-xl bg-brand-night text-white border border-border-subtle ' +
  'placeholder:text-dim ' +
  'focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all'

export default function LeadMagnetPopup() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return
    if (localStorage.getItem(LOCAL_KEY)) return
    if (sessionStorage.getItem(SESSION_KEY)) return

    const handleExitIntent = (event: MouseEvent) => {
      if (event.clientY <= 8 && window.matchMedia('(pointer: fine)').matches) {
        setVisible(true)
        sessionStorage.setItem(SESSION_KEY, '1')
        document.removeEventListener('mouseout', handleExitIntent)
      }
    }

    document.addEventListener('mouseout', handleExitIntent)
    return () => document.removeEventListener('mouseout', handleExitIntent)
  }, [pathname])

  useEffect(() => {
    if (!visible) return
    const dialog = dialogRef.current
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const focusable = dialog?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable?.[0]
    const last = focusable?.[focusable.length - 1]
    first?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setVisible(false)
        return
      }
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
      previousFocus?.focus()
    }
  }, [visible])

  const close = () => setVisible(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const { getAttributionForSubmit } = await import('@/lib/tracking')
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, _source: 'popup', _attribution: getAttributionForSubmit() }),
      })
      if (!res.ok) throw new Error()
      localStorage.setItem(LOCAL_KEY, '1')
      trackSignUp('popup')
      setStatus('success')
      setTimeout(() => setVisible(false), 3000)
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
      className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center p-4 bg-black/70 sm:backdrop-blur-sm animate-fade-in"
      onClick={close}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-md surface-card-accent rounded-2xl p-7 md:p-8 animate-scale-in"
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
          <div className="text-center py-4 space-y-3">
            <CheckCircle className="w-10 h-10 text-success mx-auto" />
            <p className="text-fluid-xl font-bold text-white">¡Perfecto!</p>
            <p id="leadmagnet-description" className="text-fluid-sm text-muted">Revisa tu email — la guía está en camino.</p>
          </div>
        ) : (
          <>
            <h2 id="leadmagnet-title" className="headline text-fluid-xl text-white mb-1">
              Antes de irte, llévate esto.
            </h2>
            <p id="leadmagnet-description" className="text-fluid-sm text-muted mb-1">
              La guía base que doy a todos mis clientes antes de empezar:
            </p>
            <p className="text-fluid-base font-bold text-accent mb-5">
              &ldquo;Fitness real para gente con vida real&rdquo;
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <label htmlFor="leadmagnet-email" className="sr-only">
                Tu email
              </label>
              <input
                id="leadmagnet-email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={FIELD_CLASS}
              />
              {status === 'error' && (
                <p className="text-fluid-sm text-danger flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Algo falló. Inténtalo de nuevo.
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
                    Quiero la guía gratis <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-fluid-xs text-subtle text-center mt-4">
              Sin spam. Puedes darte de baja cuando quieras.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
