'use client'

import Container from '@/components/common/Container'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, X, ArrowRight, Sparkles } from 'lucide-react'
import { trackSignUp } from '@/lib/analytics'

const newsletterSchema = z.object({
  email: z.email({ message: 'Email inválido' }),
  name:  z.string().min(2, 'Nombre requerido'),
})

type NewsletterFormData = z.infer<typeof newsletterSchema>

const WHATS_INSIDE = [
  'Por qué tu metabolismo está más lento, no roto (y cuánto de verdad).',
  'El semáforo de mitos: gluten, yodo, keto, "curación natural"… qué es falso y qué no.',
  'Los 4 pilares que sí mueven la aguja, explicados simple.',
  'Una semana de ejemplo con solo 3 entrenos de 40 minutos.',
  'Por qué la báscula te miente y qué mirar en su lugar.',
] as const

const IS_FOR = [
  'Tienes hipotiroidismo o Hashimoto y sientes que tu cuerpo no colabora.',
  'Llevas tiempo oyendo "haz más y come menos" y no funciona.',
  'Estás harta de milagros, detox y suplementos que no sirven.',
  'Quieres entender qué pasa de verdad con tu metabolismo.',
] as const

const IS_NOT_FOR = [
  'Buscas una pastilla mágica o una dieta exprés.',
  'No estás dispuesta a entrenar fuerza ni a cuidar tu descanso.',
  'Quieres resultados en una semana sin cambiar nada.',
] as const

const FIELD_CLASS =
  'w-full px-4 py-4 rounded-xl bg-brand-night text-white border text-fluid-base ' +
  'placeholder:text-dim ' +
  'focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all'

export default function TiroidesPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  })

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      setError('')
      const { getAttributionForSubmit } = await import('@/lib/tracking')
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          resource: 'tiroides',
          _source: 'tiroides',
          _attribution: getAttributionForSubmit(),
        }),
      })
      if (!response.ok) throw new Error('Error al suscribir')

      trackSignUp('tiroides')
      router.push('/gracias-tiroides')
    } catch {
      setError('Hubo un problema. Inténtalo de nuevo.')
    }
  }

  const borderClass = (hasError: boolean) =>
    hasError ? 'border-danger focus:border-danger' : 'border-border-subtle focus:border-accent'

  return (
    <>
      {/* ═══════════════ HERO + FORM ═══════════════ */}
      <section className="relative py-fluid-xl overflow-hidden bg-brand-deep">
        <div className="absolute inset-0 bg-radial-accent opacity-60" />
        <div className="absolute inset-0 bg-grid-soft opacity-40" />
        <Container>
          <div className="relative grid md:grid-cols-2 gap-fluid-md items-center">
            {/* Copy */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-subtle bg-accent-muted backdrop-blur-sm animate-fade-in">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span className="text-fluid-xs font-semibold tracking-wider uppercase text-accent">
                  Recurso gratuito
                </span>
              </div>

              <h1 className="headline text-fluid-5xl text-white animate-fade-up">
                Tu tiroides va lenta.
                <br />
                <span className="text-gradient-brand">Adelgazar no es imposible.</span>
              </h1>

              <p className="text-fluid-lg text-muted leading-relaxed">
                La guía sin milagros para entender por qué con hipotiroidismo cuesta más… y{' '}
                <span className="text-white font-semibold">qué sí funciona de verdad</span>. Sin dietas detox, sin
                suplementos milagro, sin pasar hambre.
              </p>

              <p className="text-fluid-base text-white font-semibold pt-2">Lo que vas a encontrar dentro:</p>

              <ul className="space-y-3">
                {WHATS_INSIDE.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-fluid-base text-white/85">
                    <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center">
                      <CheckCircle className="w-3.5 h-3.5 text-accent" strokeWidth={2.2} />
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Formulario */}
            <div id="formulario" className="surface-card-accent rounded-2xl p-fluid-md">
              <div className="text-center mb-6 space-y-2">
                <h2 className="headline text-fluid-2xl text-white">Llévate la guía gratis</h2>
                <p className="text-fluid-sm text-muted">
                  Entiende tu tiroides y tu peso sin milagros. En tu email en menos de 1 minuto.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <div className="rounded-xl p-3 text-fluid-sm text-danger bg-danger/10 border border-danger/30">
                    ⚠ {error}
                  </div>
                )}

                <div>
                  <input
                    {...register('name')}
                    type="text"
                    placeholder="Tu nombre"
                    className={`${FIELD_CLASS} ${borderClass(!!errors.name)}`}
                  />
                  {errors.name && <p className="text-fluid-xs text-danger mt-1.5">⚠ {errors.name.message}</p>}
                </div>

                <div>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="tu@email.com"
                    className={`${FIELD_CLASS} ${borderClass(!!errors.email)}`}
                  />
                  {errors.email && <p className="text-fluid-xs text-danger mt-1.5">⚠ {errors.email.message}</p>}
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-brand w-full text-fluid-base py-4 disabled:opacity-60">
                  {isSubmitting ? 'Enviando…' : (<>Descargar la guía gratis <ArrowRight className="w-4 h-4" /></>)}
                </button>

                <p className="text-fluid-xs text-subtle text-center">
                  Sin spam. Solo contenido útil. Puedes darte de baja cuando quieras.
                </p>
              </form>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ PARA QUIÉN / NO ES ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-dusk">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <Container>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <article className="surface-card rounded-2xl p-8 border-l-4 border-l-success">
              <h3 className="text-fluid-xl font-semibold text-white mb-6 flex items-center gap-2 tracking-tight">
                <CheckCircle className="w-5 h-5 text-success" />
                Esta guía es para ti si...
              </h3>
              <ul className="space-y-3">
                {IS_FOR.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-fluid-sm text-white/85 leading-relaxed">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="surface-card rounded-2xl p-8 border-l-4 border-l-danger">
              <h3 className="text-fluid-xl font-semibold text-white mb-6 flex items-center gap-2 tracking-tight">
                <X className="w-5 h-5 text-danger" />
                NO es para ti si...
              </h3>
              <ul className="space-y-3">
                {IS_NOT_FOR.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-fluid-sm text-white/85 leading-relaxed">
                    <X className="w-4 h-4 text-danger mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </Container>
      </section>

      {/* ═══════════════ CTA FINAL ═══════════════ */}
      <section className="relative py-fluid-lg bg-brand-deep">
        <Container>
          <div className="max-w-2xl mx-auto surface-card-accent rounded-2xl p-fluid-md text-center space-y-5">
            <h2 className="headline text-fluid-3xl text-white">
              Empieza hoy. <span className="text-gradient-brand">Sin milagros.</span>
            </h2>
            <p className="text-fluid-base text-muted">
              Descarga la guía y entiende por fin qué le pasa a tu metabolismo.
            </p>
            <button
              type="button"
              onClick={() => document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-brand text-fluid-base px-8 py-4"
            >
              Descargar la guía gratis
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Aviso legal */}
          <p className="max-w-2xl mx-auto mt-8 text-fluid-xs text-subtle text-center leading-relaxed">
            Esta guía es información general y no sustituye el consejo de tu médico. Tu tiroides la lleva tu
            endocrino; lo de entrenar y comer para verte bien con ella regulada, lo vemos juntos.
          </p>
        </Container>
      </section>
    </>
  )
}
