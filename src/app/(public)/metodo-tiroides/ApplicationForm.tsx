'use client'

import { useActionState, useEffect, useRef } from 'react'
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react'
import { applyToThyroidProgram, type ThyroidApplicationState } from './actions'
import { trackThyroidFunnel } from '@/lib/analytics'

const INITIAL_STATE: ThyroidApplicationState = { success: false }
const FIELD_CLASS = 'w-full rounded-xl border border-border-subtle bg-brand-night px-4 py-3.5 text-white placeholder:text-dim focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25'

export default function ApplicationForm() {
  const [state, action, pending] = useActionState(applyToThyroidProgram, INITIAL_STATE)
  const trackedSuccess = useRef(false)

  useEffect(() => {
    if (state.success && !trackedSuccess.current) {
      trackedSuccess.current = true
      trackThyroidFunnel('thyroid_valuation_submit', { product: 'metodo_tiroides', value: 249 })
    }
  }, [state.success])

  if (state.success) {
    return (
      <div className="rounded-2xl border border-success/30 bg-success/10 p-8 text-center" role="status">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
        <h3 className="headline mt-4 text-fluid-2xl text-white">Solicitud recibida</h3>
        <p className="mx-auto mt-3 max-w-md text-fluid-sm leading-relaxed text-muted">
          La revisaré personalmente y te escribiré para entender tu caso. Solicitar plaza no implica pagar ni reservar nada todavía.
        </p>
      </div>
    )
  }

  const fieldError = (name: keyof NonNullable<ThyroidApplicationState['fieldErrors']>) => state.fieldErrors?.[name]?.[0]

  return (
    <form action={action} className="space-y-4 rounded-[1.75rem] border border-accent/25 bg-brand-dusk p-6 shadow-2xl md:p-8">
      <div>
        <p className="text-fluid-xs font-semibold uppercase tracking-[0.18em] text-accent">Solicitud de plaza</p>
        <h2 className="headline mt-2 text-fluid-2xl text-white">Cuéntame desde dónde empiezas</h2>
        <p className="mt-2 text-fluid-sm text-muted">Tardarás unos dos minutos. Yo leo cada solicitud.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre" error={fieldError('name')} errorId="application-name-error"><input name="name" autoComplete="name" required aria-invalid={Boolean(fieldError('name'))} aria-describedby={fieldError('name') ? 'application-name-error' : undefined} className={FIELD_CLASS} placeholder="Tu nombre" /></Field>
        <Field label="Email" error={fieldError('email')} errorId="application-email-error"><input name="email" type="email" inputMode="email" autoComplete="email" required aria-invalid={Boolean(fieldError('email'))} aria-describedby={fieldError('email') ? 'application-email-error' : undefined} className={FIELD_CLASS} placeholder="tu@email.com" /></Field>
      </div>
      <Field label="Teléfono" error={fieldError('phone')} errorId="application-phone-error"><input name="phone" type="tel" inputMode="tel" autoComplete="tel" required aria-invalid={Boolean(fieldError('phone'))} aria-describedby={fieldError('phone') ? 'application-phone-error' : undefined} className={FIELD_CLASS} placeholder="+34 600 000 000" /></Field>
      <Field label="¿Qué quieres conseguir en estas 12 semanas?" error={fieldError('goal')} errorId="application-goal-error">
        <textarea name="goal" rows={4} required aria-invalid={Boolean(fieldError('goal'))} aria-describedby={fieldError('goal') ? 'application-goal-error' : undefined} className={`${FIELD_CLASS} resize-y`} placeholder="Cuéntamelo con tus palabras…" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Días que puedes entrenar" error={fieldError('days')} errorId="application-days-error">
          <select name="days" defaultValue="" required aria-invalid={Boolean(fieldError('days'))} aria-describedby={fieldError('days') ? 'application-days-error' : undefined} className={FIELD_CLASS}>
            <option value="" disabled>Elige una opción</option><option value="1">1 día</option><option value="2">2 días</option><option value="3">3 días</option><option value="4+">4 o más días</option>
          </select>
        </Field>
        <Field label="Directo semanal" error={fieldError('liveAvailability')} errorId="application-live-error">
          <select name="liveAvailability" defaultValue="" required aria-invalid={Boolean(fieldError('liveAvailability'))} aria-describedby={fieldError('liveAvailability') ? 'application-live-error' : undefined} className={FIELD_CLASS}>
            <option value="" disabled>Elige una opción</option><option value="si">Puedo asistir</option><option value="algunas">Algunas semanas</option><option value="diferido">Lo vería en diferido</option>
          </select>
        </Field>
      </div>
      <Field label="Lesiones o limitaciones que deba conocer (opcional)" error={fieldError('limitations')} errorId="application-limitations-error">
        <textarea name="limitations" rows={3} aria-invalid={Boolean(fieldError('limitations'))} aria-describedby={fieldError('limitations') ? 'application-limitations-error' : undefined} className={`${FIELD_CLASS} resize-y`} placeholder="No hace falta compartir analíticas ni medicación." />
      </Field>

      {state.error && <p role="alert" className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-fluid-sm text-danger">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-brand w-full py-4 text-fluid-base disabled:opacity-60">
        {pending ? <><Loader2 className="h-5 w-5 animate-spin" /> Enviando…</> : <>Solicitar mi plaza <ArrowRight className="h-4 w-4" /></>}
      </button>
      <p className="flex items-center justify-center gap-1.5 text-center text-fluid-xs text-subtle">
        <ShieldCheck className="h-3.5 w-3.5" /> Solicitar no es pagar. Hablamos antes y decides después.
      </p>
    </form>
  )
}

function Field({ label, error, errorId, children }: { label: string; error?: string; errorId: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-fluid-xs font-semibold text-white/80">{label}</span>{children}{error && <span id={errorId} className="mt-1 block text-fluid-xs text-danger">{error}</span>}</label>
}
