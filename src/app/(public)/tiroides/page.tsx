'use client'

import Container from '@/components/common/Container'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, X, ArrowRight, Sparkles } from 'lucide-react'
import { trackSignUp } from '@/lib/analytics'
import TestTiroides from '@/components/tiroides/TestTiroides'

const newsletterSchema = z.object({
  email: z.email({ message: 'Email inválido' }),
  name:  z.string().min(2, 'Nombre requerido'),
})

type NewsletterFormData = z.infer<typeof newsletterSchema>

const WHATS_INSIDE = [
  'Qué estás haciendo ya bien y dónde tienes margen de mejora.',
  'Qué conviene priorizar entre fuerza, alimentación, descanso y seguimiento.',
  'Qué mitos sobre hipotiroidismo y Hashimoto puedes dejar de perseguir.',
  'Un siguiente paso realista según tus respuestas y tu objetivo.',
] as const

const IS_FOR = [
  'Tienes hipotiroidismo o Hashimoto y quieres volver a entrenar con confianza.',
  'Te cuesta organizar la fuerza, la alimentación y el descanso de forma sostenible.',
  'Estás cansada de milagros, detox y mensajes contradictorios.',
  'Quieres saber qué merece la pena priorizar en tu situación.',
] as const

const IS_NOT_FOR = [
  'Buscas un diagnóstico, interpretar analíticas o modificar tu medicación.',
  'Buscas una cura, una dieta exprés o una promesa hormonal.',
  'No quieres hacer cambios progresivos en entrenamiento y hábitos.',
] as const

const PRIORIDADES = [
  { t: 'Fuerza', d: 'Una progresión adaptada a tu punto de partida, no más ejercicio por castigo.' },
  { t: 'Hábitos', d: 'Alimentación y descanso que puedas sostener sin perseguir la perfección.' },
  { t: 'Seguimiento', d: 'Revisar qué funciona y ajustar el plan según tu evolución real.' },
  { t: 'Contexto médico', d: 'Tu diagnóstico, medicación y analíticas siempre con tu profesional sanitario.' },
] as const

// "Enemigo sin enemigos": el consejo de siempre vs lo que de verdad mueve la aguja.
const CONSEJO_VS = [
  { mal: 'Hacer cada vez más para compensar.', bien: 'Elegir una dosis de entrenamiento que puedas recuperar y sostener.' },
  { mal: 'Usar el cardio como único plan.', bien: 'Entrenar fuerza con una progresión adaptada a ti.' },
  { mal: 'Perseguir detox y suplementos milagro.', bien: 'Construir hábitos y consultar la parte médica con tu profesional sanitario.' },
  { mal: 'Juzgarlo todo por el peso diario.', bien: 'Observar también fuerza, adherencia, medidas y cómo te sientes.' },
] as const

const FIELD_CLASS =
  'w-full px-4 py-4 rounded-xl bg-brand-night text-white border text-fluid-base ' +
  'placeholder:text-dim ' +
  'focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all'

export default function TiroidesPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  // Fallback: el formulario clásico del PDF solo aparece si pide "solo la guía".
  const [showGuideForm, setShowGuideForm] = useState(false)
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
      {/* ═══════════════ HERO + TEST ═══════════════ */}
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
                  Test gratis · 1 minuto
                </span>
              </div>

              <h1 className="headline text-fluid-5xl text-white animate-fade-up">
                No necesitas hacer más.
                <br />
                <span className="text-gradient-brand">Necesitas saber qué priorizar.</span>
              </h1>

              <p className="text-fluid-lg text-muted leading-relaxed">
                Si tienes hipotiroidismo o Hashimoto, el entrenamiento no debería sumar más confusión.{' '}
                <span className="text-white font-semibold">Haz el test</span> y descubre qué merece la pena priorizar
                ahora en tu fuerza, hábitos y seguimiento.
              </p>

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

            {/* Test (o formulario de la guía como fallback) */}
            <div id="test">
              {showGuideForm ? (
                <div className="surface-card-accent rounded-2xl p-fluid-md">
                  <button
                    onClick={() => setShowGuideForm(false)}
                    className="inline-flex items-center gap-1.5 text-fluid-xs text-subtle hover:text-white mb-4"
                  >
                    ← Volver al test
                  </button>
                  <div className="text-center mb-6 space-y-2">
                    <h2 className="headline text-fluid-2xl text-white">Llévate la guía gratis</h2>
                    <p className="text-fluid-sm text-muted">
                      Entrena y mejora tus hábitos con criterios claros, sin milagros ni promesas médicas.
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
              ) : (
                <TestTiroides onWantGuide={() => setShowGuideForm(true)} />
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ PRIORIDADES ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-dusk">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 space-y-3">
              <h2 className="headline text-fluid-3xl text-white">
                Trabajamos sobre lo que <span className="text-gradient-brand">sí puedes cambiar.</span>
              </h2>
              <p className="text-fluid-base text-muted max-w-2xl mx-auto">
                Sin diagnosticar ni prometer resultados hormonales: ordenamos entrenamiento, hábitos y seguimiento
                para construir un proceso realista.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PRIORIDADES.map((p, i) => (
                <div key={i} className="surface-card rounded-2xl p-6 border-t-2 border-t-accent/40">
                  <p className="headline text-fluid-xl text-accent">{p.t}</p>
                  <p className="text-fluid-sm text-white/85 leading-relaxed mt-2">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ EL CONSEJO DE SIEMPRE vs LO QUE FUNCIONA ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-deep">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 space-y-3">
              <h2 className="headline text-fluid-3xl text-white">
                Puede que no te falte esfuerzo. <span className="text-gradient-brand">Puede faltarte estructura.</span>
              </h2>
              <p className="text-fluid-base text-muted max-w-2xl mx-auto">
                El test no diagnostica ni mide tu tiroides. Te ayuda a ordenar las decisiones que sí están dentro
                de nuestro ámbito profesional.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <article className="surface-card rounded-2xl p-8 border-l-4 border-l-danger">
                <h3 className="text-fluid-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <X className="w-5 h-5 text-danger" />
                  Lo que te han dicho
                </h3>
                <ul className="space-y-4">
                  {CONSEJO_VS.map((c, i) => (
                    <li key={i} className="flex items-start gap-3 text-fluid-sm text-white/75 leading-relaxed">
                      <X className="w-4 h-4 text-danger mt-0.5 shrink-0" />
                      {c.mal}
                    </li>
                  ))}
                </ul>
              </article>
              <article className="surface-card rounded-2xl p-8 border-l-4 border-l-success">
                <h3 className="text-fluid-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  Un enfoque más útil
                </h3>
                <ul className="space-y-4">
                  {CONSEJO_VS.map((c, i) => (
                    <li key={i} className="flex items-start gap-3 text-fluid-sm text-white/90 leading-relaxed">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      {c.bien}
                    </li>
                  ))}
                </ul>
              </article>
            </div>

            {/* Mantra */}
            <blockquote className="max-w-2xl mx-auto mt-12 text-center">
              <p className="headline text-fluid-2xl text-white leading-snug">
                “No entrenamos para mover un número en la analítica.
                <br />
                <span className="text-gradient-brand">Entrenamos para recuperar fuerza, capacidad y confianza.”</span>
              </p>
            </blockquote>
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
                Esto es para ti si...
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
              Empieza por saber <span className="text-gradient-brand">dónde estás.</span>
            </h2>
            <p className="text-fluid-base text-muted">
              Haz el test en 1 minuto e identifica qué merece la pena priorizar en tu situación.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowGuideForm(false)
                document.getElementById('test')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="btn-brand text-fluid-base px-8 py-4"
            >
              Hacer el test gratis
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Aviso legal */}
          <p className="max-w-2xl mx-auto mt-8 text-fluid-xs text-subtle text-center leading-relaxed">
            Este test y esta guía son información general y no sustituyen el consejo de tu médico ni son un
            diagnóstico. El seguimiento de tu tiroides, medicación y analíticas corresponde a tu equipo sanitario;
            WellnessReal trabaja entrenamiento, hábitos y composición corporal dentro de su ámbito profesional.
          </p>
        </Container>
      </section>
    </>
  )
}
