'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, ArrowRight, Loader2, ShieldCheck, Sparkles } from 'lucide-react'
import Container from '@/components/common/Container'
import { trackGenerateLead } from '@/lib/analytics'

const FIELD_CLASS =
  'w-full rounded-xl border border-border-subtle bg-brand-night px-4 py-3.5 text-white ' +
  'placeholder:text-dim focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30'

const OBJECTIVES = [
  { value: 'perder-grasa', label: 'Perder grasa' },
  { value: 'ganar-musculo', label: 'Ganar músculo' },
  { value: 'mejorar-salud', label: 'Mejorar fuerza y salud general' },
  { value: 'rendimiento', label: 'Mejorar mi rendimiento' },
  { value: 'recuperacion', label: 'Volver a entrenar tras una lesión' },
  { value: 'habito', label: 'Crear un hábito de ejercicio' },
] as const

const LEVELS = [
  { value: 'nunca', label: 'No he entrenado' },
  { value: 'principiante', label: 'Menos de un año' },
  { value: 'intermedio', label: 'Entre uno y tres años' },
  { value: 'avanzado', label: 'Más de tres años' },
] as const

export default function ValoracionPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    const payload = Object.fromEntries(new FormData(event.currentTarget).entries())

    try {
      const { getAttributionForSubmit } = await import('@/lib/tracking')
      const response = await fetch('/api/valoracion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          interestedPlan: 'personal_12_semanas',
          _attribution: getAttributionForSubmit(),
        }),
      })
      const result = (await response.json()) as { error?: string }
      if (!response.ok) throw new Error(result.error || 'No se pudo enviar la solicitud.')

      trackGenerateLead('valoracion_entrenamiento_personalizado')
      router.push('/gracias-valoracion')
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'No se pudo enviar la solicitud. Inténtalo de nuevo.'
      )
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative overflow-hidden bg-brand-deep py-fluid-xl">
      <div className="absolute inset-0 bg-radial-accent opacity-50" />
      <div className="absolute inset-0 bg-grid-soft opacity-30" />
      <Container>
        <div className="relative mx-auto max-w-3xl">
          <header className="mx-auto mb-fluid-md max-w-2xl space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-accent-muted px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-fluid-xs font-semibold uppercase tracking-wider text-accent">
                Entrenamiento individual · 12 semanas
              </span>
            </div>
            <h1 className="headline text-fluid-5xl text-white">
              Cuéntame tu <span className="text-gradient-brand">punto de partida.</span>
            </h1>
            <p className="text-fluid-lg leading-relaxed text-muted">
              Necesito estos datos para valorar si el acompañamiento individual de 750 € encaja con
              tu objetivo. Enviar el formulario no implica pagar ni reservar una plaza.
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            aria-busy={isSubmitting}
            className="surface-card space-y-6 rounded-2xl p-6 md:p-10"
          >
            <fieldset className="space-y-4">
              <legend className="mb-4 text-fluid-xl font-semibold text-white">Contacto</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nombre" htmlFor="valuation-name">
                  <input id="valuation-name" name="name" required minLength={2} maxLength={100} autoComplete="name" className={FIELD_CLASS} placeholder="Tu nombre" />
                </Field>
                <Field label="Email" htmlFor="valuation-email">
                  <input id="valuation-email" name="email" type="email" required autoComplete="email" inputMode="email" spellCheck={false} className={FIELD_CLASS} placeholder="tu@email.com" />
                </Field>
              </div>
              <Field label="Teléfono" htmlFor="valuation-phone">
                <input id="valuation-phone" name="phone" type="tel" required minLength={9} maxLength={30} autoComplete="tel" inputMode="tel" className={FIELD_CLASS} placeholder="+34 600 000 000" />
              </Field>
            </fieldset>

            <fieldset className="space-y-4 border-t border-border-subtle pt-6">
              <legend className="mb-4 text-fluid-xl font-semibold text-white">Objetivo y experiencia</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Objetivo principal" htmlFor="valuation-objective">
                  <select id="valuation-objective" name="objective" required defaultValue="" className={FIELD_CLASS}>
                    <option value="" disabled>Elige una opción</option>
                    {OBJECTIVES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </Field>
                <Field label="Experiencia entrenando" htmlFor="valuation-level">
                  <select id="valuation-level" name="level" required defaultValue="" className={FIELD_CLASS}>
                    <option value="" disabled>Elige una opción</option>
                    {LEVELS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="¿Qué quieres conseguir?" htmlFor="valuation-detail">
                <textarea id="valuation-detail" name="objectiveDetail" required minLength={20} maxLength={1000} rows={4} className={`${FIELD_CLASS} resize-y`} placeholder="Cuéntamelo con tus palabras y explica qué has intentado hasta ahora." />
              </Field>
            </fieldset>

            <fieldset className="space-y-4 border-t border-border-subtle pt-6">
              <legend className="mb-4 text-fluid-xl font-semibold text-white">Disponibilidad real</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Días por semana" htmlFor="valuation-days">
                  <select id="valuation-days" name="daysPerWeek" required defaultValue="" className={FIELD_CLASS}>
                    <option value="" disabled>Elige una opción</option>
                    {['1 día', '2 días', '3 días', '4 días', '5+ días'].map((value) => <option key={value}>{value}</option>)}
                  </select>
                </Field>
                <Field label="Tiempo por sesión" htmlFor="valuation-duration">
                  <select id="valuation-duration" name="sessionDuration" required defaultValue="" className={FIELD_CLASS}>
                    <option value="" disabled>Elige una opción</option>
                    {['30 min', '45 min', '60 min', '90 min'].map((value) => <option key={value}>{value}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Limitaciones para entrenar (opcional)" htmlFor="valuation-limitations">
                <textarea id="valuation-limitations" name="limitations" maxLength={1000} rows={3} className={`${FIELD_CLASS} resize-y`} placeholder="Indica solo lo necesario para valorar el entrenamiento. No envíes analíticas, diagnósticos ni medicación." />
              </Field>
            </fieldset>

            {error && (
              <p role="alert" className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 p-4 text-fluid-sm text-danger">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
              </p>
            )}

            <button type="submit" disabled={isSubmitting} className="btn-brand w-full py-4 text-fluid-base disabled:opacity-60">
              {isSubmitting ? <><Loader2 className="h-5 w-5 animate-spin" /> Enviando…</> : <>Enviar solicitud de valoración <ArrowRight className="h-4 w-4" /></>}
            </button>
            <p className="text-center text-fluid-xs leading-relaxed text-subtle">
              <ShieldCheck className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
              Usaré estos datos únicamente para responder a tu solicitud. Consulta la{' '}
              <Link href="/privacidad" className="underline underline-offset-2 hover:text-white">política de privacidad</Link>.
            </p>
          </form>
        </div>
      </Container>
    </section>
  )
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-fluid-xs font-semibold text-white/80">{label}</label>
      {children}
    </div>
  )
}
