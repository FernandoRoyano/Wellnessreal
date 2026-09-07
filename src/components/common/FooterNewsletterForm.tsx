'use client'

import { useState } from 'react'
import { AlertCircle, Check, Send } from 'lucide-react'
import { trackSignUp } from '@/lib/analytics'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function FooterNewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      const { getAttributionForSubmit } = await import('@/lib/tracking')
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, _source: 'footer', _attribution: getAttributionForSubmit() }),
      })
      if (!response.ok) throw new Error('No se pudo completar la suscripción')
      setStatus('success')
      trackSignUp('footer')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 pt-2 sm:flex-row">
        <label htmlFor="footer-newsletter-email" className="sr-only">Email para la newsletter</label>
        <input
          id="footer-newsletter-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="tu@email.com"
          required
          disabled={status === 'loading'}
          aria-describedby="footer-newsletter-status"
          className="min-h-11 min-w-0 flex-1 rounded-xl border border-border-subtle bg-brand-night px-4 py-3 text-white placeholder:text-dim transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="btn-brand min-h-11 shrink-0 px-6 py-3 disabled:opacity-70"
        >
          {status === 'loading' && 'Enviando…'}
          {status === 'success' && <><Check className="h-4 w-4" aria-hidden="true" /> Suscrito</>}
          {(status === 'idle' || status === 'error') && <>Suscribirme <Send className="h-4 w-4" aria-hidden="true" /></>}
        </button>
      </form>

      <div id="footer-newsletter-status" className="min-h-[1.5rem] pt-1" aria-live="polite">
        {status === 'success' && (
          <p className="inline-flex items-center gap-1.5 text-fluid-sm text-success">
            <Check className="h-4 w-4" aria-hidden="true" /> ¡Listo! Revisa tu email.
          </p>
        )}
        {status === 'error' && (
          <p className="inline-flex items-center gap-1.5 text-fluid-sm text-danger">
            <AlertCircle className="h-4 w-4" aria-hidden="true" /> Algo falló. Inténtalo de nuevo.
          </p>
        )}
      </div>
    </>
  )
}
