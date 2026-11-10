'use client'

import Container from '@/components/common/Container'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, X, Briefcase, Baby, Utensils, ArrowRight, Sparkles } from 'lucide-react'
import { trackLeadFormStart, trackSignUp } from '@/lib/analytics'
import { rememberGuideRequest } from '@/lib/guide-popup'

const newsletterSchema = z.object({
  email: z.email({ message: 'Email inválido' }),
  name:  z.string().min(2, 'Nombre requerido'),
})

type NewsletterFormData = z.infer<typeof newsletterSchema>

const BENEFITS = [
  'Fundamentos de fuerza, actividad aeróbica y esfuerzo explicados con claridad',
  'Sentadillas, zancadas, flexiones, peso muerto, dominadas y remos ilustrados, con variantes',
  'Nutrición para la salud con fuentes científicas, platos y compra práctica',
  'Un plan semanal rellenable para elegir tus próximos pasos',
] as const

const IS_FOR = [
  'Tienes trabajo, familia y poco tiempo libre',
  'Quieres aprender las bases antes de complicar tu plan',
  'Quieres resultados pero sin obsesionarte',
  'Buscas algo sostenible, no una solución mágica',
  'Estás cansado de consejos extremos que no aplican a tu vida',
] as const

const IS_NOT_FOR = [
  'Necesitas rehabilitación o una pauta médica individual',
  'Buscas una dieta clínica o un menú prescrito',
  'Quieres una rutina diseñada para una competición concreta',
  'Necesitas una valoración individual antes de entrenar',
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
  const formStarted = useRef(false)
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
        body: JSON.stringify({ ...data, _attribution: getAttributionForSubmit() }),
      })
      if (!response.ok) throw new Error('Error al suscribir')
      rememberGuideRequest('guia')
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
                Fuerza para
                <br />
                <span className="text-gradient-brand">la vida real.</span>
              </h1>

              <p className="text-fluid-lg text-muted leading-relaxed">
                Aprende los fundamentos del entrenamiento y la alimentación para cuidar tu salud,
                con ejercicios ilustrados y ejemplos que puedes adaptar a tu semana.
              </p>

              <div className="flex items-center gap-5 sm:gap-7">
                <Image
                  src="/recursos/guia-fuerza/portada.webp"
                  alt="Portada de Fuerza para la vida real, de Fernando Royano"
                  width={953}
                  height={1348}
                  sizes="(max-width: 640px) 128px, 160px"
                  preload
                  className="w-32 sm:w-40 h-auto shrink-0 rounded-sm shadow-2xl border border-white/10"
                />
                <div className="space-y-3">
                  <p className="text-fluid-sm font-semibold text-accent">20 páginas · PDF gratuito</p>
                  <p className="text-fluid-base text-white">Ejercicios, variantes y nutrición con fuentes científicas.</p>
                  <p className="text-fluid-sm text-muted">Por Fernando Royano</p>
                  <a href="#muestra" className="inline-flex min-h-11 items-center text-fluid-sm text-accent underline underline-offset-4">Ver dos páginas de muestra</a>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <div id="formulario" className="surface-card rounded-2xl p-fluid-md scroll-mt-28">
              <div className="text-center mb-6 space-y-2">
                <h2 className="headline text-fluid-2xl text-white">Llévate la guía gratis</h2>
                <p className="text-fluid-sm text-muted">Al completar la solicitud podrás descargarla. También te enviaremos el enlace por correo.</p>
              </div>

              <form
                onFocusCapture={() => {
                  if (formStarted.current) return
                  formStarted.current = true
                  trackLeadFormStart('recurso_gratis')
                }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {error && (
                  <div className="rounded-xl p-3 text-fluid-sm text-danger bg-danger/10 border border-danger/30">
                    ⚠ {error}
                  </div>
                )}

                <div>
                  <label htmlFor="guide-name" className="sr-only">Tu nombre</label>
                  <input
                    {...register('name')}
                    id="guide-name"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Tu nombre"
                    className={`${FIELD_CLASS} ${borderClass(!!errors.name)}`}
                  />
                  {errors.name && <p className="text-fluid-xs text-danger mt-1.5">⚠ {errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="guide-email" className="sr-only">Tu email</label>
                  <input
                    {...register('email')}
                    id="guide-email"
                    type="email"
                    autoComplete="email"
                    placeholder="tu@email.com"
                    className={`${FIELD_CLASS} ${borderClass(!!errors.email)}`}
                  />
                  {errors.email && <p className="text-fluid-xs text-danger mt-1.5">⚠ {errors.email.message}</p>}
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-brand w-full text-fluid-base py-4 disabled:opacity-60">
                  {isSubmitting ? 'Enviando…' : (<>Quiero la guía gratis <ArrowRight className="w-4 h-4" /></>)}
                </button>

                <p className="text-fluid-xs text-subtle text-center">
                  Recibirás la guía y contenidos de entrenamiento. Puedes darte de baja cuando quieras.{' '}
                  <a href="/privacidad" className="underline underline-offset-2">Privacidad</a>.
                </p>
              </form>
            </div>
          </div>
        </Container>
      </section>

      <section id="muestra" className="py-fluid-xl bg-brand-deep scroll-mt-24" aria-labelledby="guide-preview-title">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="max-w-2xl mb-8 space-y-4">
              <span className="eyebrow">Por dentro</span>
              <h2 id="guide-preview-title" className="headline text-fluid-3xl text-white">Mira qué vas a encontrar.</h2>
              <p className="text-fluid-base text-muted">Dos páginas reales de la guía. Puedes ampliarlas antes de decidir si te resulta útil.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 md:gap-10">
              {[
                { file: 'sentadilla-barra', title: 'Aprender un movimiento', description: 'Sentadilla con barra: ejecución, músculos principales y variantes.', page: 6 },
                { file: 'alimentacion', title: 'Llevar la ciencia a la compra', description: 'Recomendaciones de alimentación y cómo empezar a aplicarlas.', page: 14 },
              ].map(sample => (
                <figure key={sample.file} className="space-y-4">
                  <a href={`/recursos/guia-fuerza/${sample.file}.webp`} target="_blank" rel="noopener noreferrer" className="block rounded-lg focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4" aria-label={`Ampliar página ${sample.page}: ${sample.title} (abre en otra pestaña)`}>
                    <Image src={`/recursos/guia-fuerza/${sample.file}.webp`} alt={sample.description} width={953} height={1348} sizes="(max-width: 640px) calc(100vw - 48px), 480px" className="w-full h-auto rounded-lg border border-white/10" />
                  </a>
                  <figcaption className="space-y-1">
                    <p className="text-fluid-xs font-semibold text-accent">PÁGINA {sample.page} · AMPLIAR IMAGEN ↗</p>
                    <h3 className="text-fluid-lg font-semibold text-white">{sample.title}</h3>
                    <p className="text-fluid-sm text-muted">{sample.description}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
            <ul className="mt-10 grid sm:grid-cols-2 gap-4">
              {BENEFITS.map(item => <li key={item} className="flex gap-3 text-fluid-base text-muted"><CheckCircle className="w-5 h-5 text-accent shrink-0 mt-1" aria-hidden="true" /><span>{item}</span></li>)}
            </ul>
            <a href="#formulario" className="btn-brand mt-8 inline-flex min-h-11 px-6 py-3">Quiero la guía completa <ArrowRight className="w-4 h-4" aria-hidden="true" /></a>
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
                Necesitas otro tipo de apoyo si...
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
              Entre promesas rápidas y rutinas que piden demasiado tiempo, cuesta decidir por dónde empezar.
            </p>
            <p className="text-fluid-lg text-muted leading-relaxed">
              <span className="text-white font-semibold">Un criterio útil:</span> elegir acciones que puedas repetir
              y saber cómo ajustarlas cuando cambie tu semana.
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
              <span className="text-accent font-bold">Tu contexto cuenta.</span>
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
              Empieza por <span className="text-gradient-brand">entender las bases.</span>
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
