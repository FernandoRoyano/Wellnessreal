'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2, LockKeyhole } from 'lucide-react'
import { getAttributionForSubmit } from '@/lib/tracking'
import { identifyThyroidLead, trackSignUp, trackThyroidFunnel } from '@/lib/analytics'

export default function ThyroidClassForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    trackThyroidFunnel('thyroid_vsl_landing_view', { page: 'thyroid_class_registration' })
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')
    setError('')

    try {
      const response = await fetch('/api/tiroides-clase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, _attribution: getAttributionForSubmit() }),
      })
      const result = (await response.json()) as { error?: string; leadId?: string | null }
      if (!response.ok) throw new Error(result.error || 'No hemos podido completar el registro.')

      if (result.leadId) identifyThyroidLead(result.leadId)
      trackSignUp('thyroid_vsl')
      router.push('/tiroides/clase/video')
    } catch (submitError) {
      setStatus('error')
      setError(submitError instanceof Error ? submitError.message : 'Inténtalo de nuevo.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl backdrop-blur-md sm:p-7" aria-busy={status === 'loading'}>
      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-fluid-xs font-semibold text-white/75">Tu nombre</span>
          <input required minLength={2} maxLength={100} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className="min-h-12 w-full rounded-xl border border-white/15 bg-brand-night px-4 text-white outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" placeholder="¿Cómo te llamas?" />
        </label>
        <label className="block">
          <span className="mb-2 block text-fluid-xs font-semibold text-white/75">Tu mejor email</span>
          <input required type="email" inputMode="email" autoComplete="email" spellCheck={false} value={email} onChange={(event) => setEmail(event.target.value)} className="min-h-12 w-full rounded-xl border border-white/15 bg-brand-night px-4 text-white outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" placeholder="tu@email.com" />
        </label>
      </div>

      {error && <p className="mt-4 rounded-xl border border-danger/30 bg-danger/10 p-3 text-fluid-sm text-danger" role="alert">{error}</p>}

      <button type="submit" disabled={status === 'loading'} className="btn-brand mt-5 min-h-14 w-full text-fluid-base disabled:cursor-wait disabled:opacity-60">
        {status === 'loading' ? <><Loader2 className="h-5 w-5 animate-spin" /> Preparando tu acceso…</> : <>Ver la clase gratuita <ArrowRight className="h-4 w-4" /></>}
      </button>
      <p className="mt-4 flex items-start justify-center gap-2 text-center text-[0.7rem] leading-relaxed text-white/45">
        <LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Te enviaré el acceso y contenido relacionado. Puedes darte de baja cuando quieras.
      </p>
    </form>
  )
}
