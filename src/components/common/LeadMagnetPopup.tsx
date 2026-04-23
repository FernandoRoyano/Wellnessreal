'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { X, Gift, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import { trackSignUp } from '@/lib/analytics'

const HIDDEN_PATHS = ['/admin', '/studio', '/cliente']
const SESSION_KEY = 'wr_popup_shown'
const LOCAL_KEY = 'wr_lead_submitted'
const SCROLL_THRESHOLD = 0.55

type Status = 'idle' | 'loading' | 'success' | 'error'

const FIELD_CLASS =
  'w-full px-4 py-3 rounded-xl bg-brand-night text-white border border-border-subtle ' +
  'placeholder:text-dim ' +
  'focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all'

export default function LeadMagnetPopup() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [status, setStatus]   = useState<Status>('idle')

  useEffect(() => {
    if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return
    if (localStorage.getItem(LOCAL_KEY))   return
    if (sessionStorage.getItem(SESSION_KEY)) return

    const handleScroll = () => {
      const scrolled = window.scrollY + window.innerHeight
      const total    = document.documentElement.scrollHeight
      if (scrolled / total >= SCROLL_THRESHOLD) {
        setVisible(true)
        sessionStorage.setItem(SESSION_KEY, '1')
        window.removeEventListener('scroll', handleScroll)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setVisible(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [visible])

  const close = () => setVisible(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
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
      className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={close}
    >
      <div
        className="relative w-full max-w-md surface-card-accent rounded-2xl p-7 md:p-8 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Cerrar"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted hover:text-accent hover:bg-accent-muted transition-colors"
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
            <p className="text-fluid-sm text-muted">
              Revisa tu email — la guía está en camino.
            </p>
          </div>
        ) : (
          <>
            <h2 id="leadmagnet-title" className="headline text-fluid-xl text-white mb-1">
              ¡No te lo pierdas!
            </h2>
            <p className="text-fluid-sm text-muted mb-1">
              Descarga gratis la guía:
            </p>
            <p className="text-fluid-base font-bold text-accent mb-5">
              &ldquo;Fitness real para gente con vida real&rdquo;
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={FIELD_CLASS}
              />
              <input
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
                {status === 'loading' ? 'Enviando…' : (<>Quiero la guía gratis <ArrowRight className="w-4 h-4" /></>)}
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
