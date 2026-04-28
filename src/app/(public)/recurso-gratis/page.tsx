'use client'

import Container from '@/components/common/Container'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, X, Briefcase, Baby, Utensils, ArrowRight, Sparkles } from 'lucide-react'
import { trackSignUp } from '@/lib/analytics'

const newsletterSchema = z.object({
  email: z.email({ message: 'Email inválido' }),
  name:  z.string().min(2, 'Nombre requerido'),
})

type NewsletterFormData = z.infer<typeof newsletterSchema>

const BENEFITS = [
  'Por qué el "todo o nada" te sabotea',
  'Cómo adaptar el fitness a TU contexto',
  'Las 3 prioridades que realmente importan',
  'Plan de acción para empezar esta semana',
] as const

const IS_FOR = [
  'Tienes trabajo, familia y poco tiempo libre',
  'Has probado dietas y siempre acabas rebotando',
  'Quieres resultados pero sin obsesionarte',
  'Buscas algo sostenible, no una solución mágica',
  'Estás cansado de consejos extremos que no aplican a tu vida',
] as const

const IS_NOT_FOR = [
  'Buscas pastillas mágicas o atajos',
  'Quieres resultados sin hacer nada',
  'Crees que existe la dieta perfecta',
  'No estás dispuesto a ser flexible',
  'Prefieres excusas antes que soluciones',
] as const

const CONTEXT_ITEMS = [
  { icon: Briefcase, text: 'Trabajo estresante con poco tiempo' },
  { icon: Baby,      text: 'Hijos y responsabilidades familiares' },
  { icon: Utensils,  text: 'Sin tiempo para cocinar elaborado' },
] as const

const FIELD_CLASS =
  'w-full px-4 py-4 rounded-xl bg-brand-night text-white border text-fluid-base ' +
  'placeholder:text-dim ' +
  'focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all'

export default function RecursoGratisPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  })

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      setError('')
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Error al suscribir')

      trackSignUp('recurso_gratis')
      router.push('/gracias-recurso')
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
                Fitness real para
                <br />
                <span className="text-gradient-brand">gente con vida real.</span>
              </h1>

              <p className="text-fluid-lg text-muted leading-relaxed">
                Descarga la guía que te enseña a ponerte en forma{' '}
                <span className="text-white font-semibold">sin dietas extremas, sin vivir en el gimnasio</span> y sin
                necesitar una vida perfecta.
              </p>

              <p className="text-fluid-base text-muted leading-relaxed">
                Es la guía base que doy a todos mis clientes antes de personalizar el plan. Escrita por alguien que ha acompañado a perder <span className="text-white font-semibold">35 kg en 9 meses</span> o a ganar <span className="text-white font-semibold">8 kg de músculo a los 50</span>.{' '}
                <span className="text-accent font-semibold">Solo lo que funciona de verdad.</span>
              </p>

              <ul className="space-y-3 pt-2">
                {BENEFITS.map((item, i) => (
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
                <p className="text-fluid-sm text-muted">Los principios que aplico con todos mis clientes antes de personalizar. En tu email en menos de 1 minuto.</p>
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
                  {isSubmitting ? 'Enviando…' : (<>Quiero la guía gratis <ArrowRight className="w-4 h-4" /></>)}
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

      {/* ═══════════════ EL PROBLEMA ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-deep">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <span className="eyebrow justify-center">El problema</span>
              <h2 className="headline text-fluid-4xl text-white">
                El fitness <span className="text-gradient-brand">&ldquo;blanco o negro&rdquo;</span>
              </h2>
            </div>

            <p className="text-fluid-lg text-muted leading-relaxed">
              Unos te dicen que puedes comer basura y adelgazar. Otros que todo tiene que ser perfecto.
            </p>
            <p className="text-fluid-lg text-muted leading-relaxed">
              <span className="text-white font-semibold">La realidad:</span> ninguno de los dos extremos funciona para
              alguien con una vida real.
            </p>

            <div className="grid md:grid-cols-3 gap-6 pt-4">
              {CONTEXT_ITEMS.map((item, i) => {
                const Icon = item.icon
                return (
                  <article key={i} className="surface-card rounded-2xl p-6 hover-lift">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-accent-muted border border-border-strong mx-auto mb-4">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <p className="text-fluid-sm text-muted leading-relaxed">{item.text}</p>
                  </article>
                )
              })}
            </div>

            <p className="text-fluid-xl text-white pt-4">
              <span className="text-accent font-bold">El contexto es lo más importante.</span>
              <br />
              <span className="text-muted">Esta guía te enseña a trabajar con el tuyo, no contra él.</span>
            </p>
          </div>
        </Container>
      </section>

      {/* ═══════════════ CTA FINAL ═══════════════ */}
      <section className="relative py-fluid-lg bg-brand-dusk">
        <Container>
          <div className="max-w-2xl mx-auto surface-card-accent rounded-2xl p-fluid-md text-center space-y-5">
            <h2 className="headline text-fluid-3xl text-white">
              Empieza hoy. <span className="text-gradient-brand">Sin excusas.</span>
            </h2>
            <p className="text-fluid-base text-muted">
              Descarga la guía y empieza a entrenar con sentido.
            </p>
            <button
              type="button"
              onClick={() => document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-brand text-fluid-base px-8 py-4"
            >
              Quiero la guía gratis
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Container>
      </section>
    </>
  )
}
