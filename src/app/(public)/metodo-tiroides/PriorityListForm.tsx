'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle2, Loader2, LockKeyhole } from 'lucide-react'
import { getThyroidTrackingContext, identifyThyroidLead, trackSignUp } from '@/lib/analytics'
import { getAttributionForSubmit } from '@/lib/tracking'

const FIELD_CLASS =
  'w-full rounded-xl border border-border-subtle bg-brand-night px-4 py-3.5 text-white placeholder:text-dim focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25'

export default function PriorityListForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')
    setError('')
    const formData = new FormData(event.currentTarget)

    try {
      const response = await fetch('/api/tiroides-priority', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(formData.get('name') || '').trim(),
          email: String(formData.get('email') || '').trim().toLowerCase(),
          _attribution: getAttributionForSubmit(),
          _funnel: getThyroidTrackingContext(),
        }),
      })
      const result = (await response.json()) as { error?: string; leadId?: string | null }
      if (!response.ok) throw new Error(result.error || 'No hemos podido completar el registro.')
      if (result.leadId) identifyThyroidLead(result.leadId)
      trackSignUp('thyroid_priority_list')
      setStatus('success')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Inténtalo de nuevo.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-success/30 bg-success/10 p-8 text-center" role="status">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden="true" />
        <h3 className="headline mt-4 text-fluid-2xl text-white">Estás en la lista prioritaria</h3>
        <p className="mt-3 text-fluid-sm leading-relaxed text-muted">
          Revisa tu email: te he enviado la clase gratuita. También recibirás el aviso antes de que
          se abran las solicitudes el 5 de octubre.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={status === 'loading'} className="space-y-4 rounded-[1.75rem] border border-accent/25 bg-brand-dusk p-6 shadow-2xl md:p-8">
      <div>
        <p className="text-fluid-xs font-semibold uppercase tracking-[0.18em] text-accent">Lista prioritaria</p>
        <h2 className="headline mt-2 text-fluid-2xl text-white">Recibe primero la apertura</h2>
        <p className="mt-2 text-fluid-sm text-muted">Te enviaré la clase gratuita ahora y el aviso de apertura antes que al resto.</p>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-fluid-xs font-semibold text-white/80">Nombre</span>
        <input name="name" autoComplete="name" required minLength={2} maxLength={100} className={FIELD_CLASS} placeholder="Tu nombre" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-fluid-xs font-semibold text-white/80">Email</span>
        <input name="email" type="email" inputMode="email" autoComplete="email" spellCheck={false} required className={FIELD_CLASS} placeholder="tu@email.com" />
      </label>
      {error && <p role="alert" className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-fluid-sm text-danger">{error}</p>}
      <button type="submit" disabled={status === 'loading'} className="btn-brand w-full py-4 text-fluid-base disabled:opacity-60">
        {status === 'loading' ? <><Loader2 className="h-5 w-5 animate-spin" /> Registrándote…</> : <>Entrar en la lista prioritaria <ArrowRight className="h-4 w-4" /></>}
      </button>
      <p className="flex items-start justify-center gap-2 text-center text-fluid-xs text-subtle">
        <LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Puedes darte de baja cuando quieras. No compartas analíticas ni medicación.
      </p>
    </form>
  )
}
