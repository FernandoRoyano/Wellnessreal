'use client'

import { useState } from 'react'
import { AlertCircle, Check, Send } from 'lucide-react'
import { trackSignUp } from '@/lib/analytics'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function FooterNewsletterForm({ source = 'footer', initialEmail = '' }: { source?: 'footer' | 'community'; initialEmail?: string }) {
  const [email, setEmail] = useState(initialEmail)
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
        body: JSON.stringify({ email, _source: source, ...(source === 'community' ? { marketingConsent: true } : {}), _attribution: getAttributionForSubmit() }),
      })
      if (!response.ok) throw new Error('No se pudo completar la suscripción')
      setStatus('success')
      if (source === 'footer') trackSignUp('footer')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-md flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap"
      >
        <label htmlFor={`${source}-newsletter-email`} className="sr-only">
          Email para la newsletter
        </label>
        <input
          id={`${source}-newsletter-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="tu@email.com"
          required
          disabled={status === 'loading'}
          aria-describedby={`${source}-newsletter-status`}
          className="min-h-11 min-w-0 flex-1 rounded-xl border border-border-subtle bg-brand-night px-4 py-3 text-white placeholder:text-dim transition-[border-color,box-shadow,opacity] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="btn-brand min-h-11 shrink-0 px-6 py-3 disabled:opacity-70"
        >
          {status === 'loading' && 'Enviando…'}
          {status === 'success' && (
            <>
              <Check className="h-4 w-4" aria-hidden="true" /> Suscrito
            </>
          )}
          {(status === 'idle' || status === 'error') && (
            <>
              Suscribirme <Send className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
        {source === 'community' && <label className="flex basis-full items-start gap-3 text-left text-fluid-sm text-muted"><input type="checkbox" required className="mt-1 h-4 w-4 shrink-0 accent-accent" />Quiero recibir ideas prácticas y comunicaciones sobre los servicios de Fernando. Es opcional para usar la comunidad.</label>}
      </form>
      <p className="mx-auto mt-2 max-w-md text-fluid-xs text-muted">Al suscribirte solicitas recibir la newsletter. Puedes darte de baja cuando quieras. <a href="/privacidad" className="text-accent underline underline-offset-2">Política de privacidad</a>.</p>

      <div id={`${source}-newsletter-status`} className="min-h-[1.5rem] pt-1" aria-live="polite">
        {status === 'success' && (
          <p className="inline-flex items-center gap-1.5 text-fluid-sm text-success">
            <Check className="h-4 w-4" aria-hidden="true" /> {source === 'community' ? 'Preferencia guardada. Tu acceso a la comunidad sigue igual.' : '¡Listo! Revisa tu email.'}
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
