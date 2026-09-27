import Container from '@/components/common/Container'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, X, ArrowRight, Sparkles, ShieldCheck, Clock3, BadgeCheck } from 'lucide-react'
import TiroidesConversionPanel from '@/components/tiroides/TiroidesConversionPanel'
import MobileTestShortcut from '@/components/tiroides/MobileTestShortcut'
import JsonLd, { breadcrumbSchema } from '@/components/seo/JsonLd'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Hipotiroidismo y entrenamiento | Guías y test gratuito',
  description:
    'Información práctica sobre fuerza, energía y hábitos cuando tienes hipotiroidismo o Hashimoto. Haz el test gratuito para ordenar tus prioridades.',
  path: '/tiroides',
  keywords: [
    'entrenamiento hipotiroidismo',
    'ejercicio Hashimoto',
    'fuerza hipotiroidismo',
    'cansancio hipotiroidismo ejercicio',
  ],
})

const WHATS_INSIDE = [
  'Tu prioridad real entre fuerza, alimentación, descanso y seguimiento.',
  'Los frenos que pueden estar dispersando tu esfuerzo.',
  'Un siguiente paso concreto según tu situación y objetivo.',
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
  {
    t: 'Fuerza',
    d: 'Una progresión adaptada a tu punto de partida, no más ejercicio por castigo.',
  },
  { t: 'Hábitos', d: 'Alimentación y descanso que puedas sostener sin perseguir la perfección.' },
  { t: 'Seguimiento', d: 'Revisar qué funciona y ajustar el plan según tu evolución real.' },
  {
    t: 'Contexto médico',
    d: 'Tu diagnóstico, medicación y analíticas siempre con tu profesional sanitario.',
  },
] as const

// "Enemigo sin enemigos": el consejo de siempre vs lo que de verdad mueve la aguja.
const CONSEJO_VS = [
  {
    mal: 'Hacer cada vez más para compensar.',
    bien: 'Elegir una dosis de entrenamiento que puedas recuperar y sostener.',
  },
  {
    mal: 'Usar el cardio como único plan.',
    bien: 'Entrenar fuerza con una progresión adaptada a ti.',
  },
  {
    mal: 'Perseguir detox y suplementos milagro.',
    bien: 'Construir hábitos y consultar la parte médica con tu profesional sanitario.',
  },
  {
    mal: 'Juzgarlo todo por el peso diario.',
    bien: 'Observar también fuerza, adherencia, medidas y cómo te sientes.',
  },
] as const

const THYROID_GUIDES = [
  {
    href: '/blog/mejor-ejercicio-hipotiroidismo',
    title: 'Ejercicio e hipotiroidismo',
    description: 'Qué aportan la fuerza y el cardio y cómo ajustar la dosis a tu energía.',
  },
  {
    href: '/blog/por-que-no-adelgazo-con-hipotiroidismo',
    title: 'Por qué no adelgazo con hipotiroidismo',
    description: 'Siete piezas para distinguir un estancamiento real del ruido de la báscula.',
  },
  {
    href: '/blog/gluten-e-hipotiroidismo',
    title: 'Gluten e hipotiroidismo',
    description: 'Cuándo conviene estudiarlo, cuándo no retirarlo y qué sabemos de verdad.',
  },
  {
    href: '/blog/cansancio-e-hipotiroidismo',
    title: 'Cansancio e hipotiroidismo',
    description: 'Qué revisar con tu médico y cómo adaptar sueño, comida y movimiento.',
  },
  {
    href: '/blog/suplementos-tiroides',
    title: 'Suplementos para la tiroides',
    description: 'Yodo, selenio, vitamina D y hierro: evidencia frente a promesas.',
  },
  {
    href: '/blog/adelgazar-con-hipotiroidismo',
    title: 'Adelgazar con hipotiroidismo',
    description: 'Una guía para organizar comida, fuerza, movimiento y descanso sin extremos.',
  },
] as const

export default function TiroidesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Inicio', url: 'https://wellnessreal.es' },
          { name: 'Hipotiroidismo', url: 'https://wellnessreal.es/tiroides' },
        ])}
      />
      {/* ═══════════════ HERO + TEST ═══════════════ */}
      <section className="relative overflow-hidden bg-brand-deep py-8 lg:py-[clamp(3.5rem,7vw,6.5rem)]">
        <div className="absolute inset-0 bg-radial-accent opacity-60" />
        <div className="absolute inset-0 bg-grid-soft opacity-40" />
        <div className="absolute -right-24 top-16 h-96 w-96 rounded-full bg-accent/10 blur-[100px]" />
        <Container>
          <div className="relative grid items-center gap-fluid-lg lg:grid-cols-[1.06fr_0.94fr]">
            {/* Copy */}
            <div className="space-y-4 lg:space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-subtle bg-accent-muted backdrop-blur-sm animate-fade-in">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span className="text-fluid-xs font-semibold tracking-wider uppercase text-accent">
                  Centro gratuito · Test de 1 minuto
                </span>
              </div>

              <h1 className="headline text-[clamp(2.7rem,13vw,3.5rem)] leading-[0.98] text-white animate-fade-up lg:text-fluid-5xl lg:leading-[1.1]">
                No necesitas hacer más.
                <br />
                <span className="text-gradient-brand">Necesitas saber qué priorizar.</span>
              </h1>

              <p className="max-w-2xl text-sm text-muted leading-relaxed lg:text-fluid-lg">
                Si tienes hipotiroidismo o Hashimoto, el entrenamiento no debería sumar más
                confusión. Aquí puedes entender mejor el contexto y descubrir qué merece la pena
                priorizar ahora, sin comprar ningún programa.
              </p>

              <ul className="hidden space-y-3 lg:block">
                {WHATS_INSIDE.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-fluid-base text-white/85">
                    <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center">
                      <CheckCircle className="w-3.5 h-3.5 text-accent" strokeWidth={2.2} />
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="hidden items-center gap-3 border-t border-white/10 pt-5 lg:flex">
                <Image
                  src="/images/fernando-royano-avatar.webp"
                  alt="Fernando Royano, entrenador de WellnessReal"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full border-2 border-accent/50 object-cover object-top"
                />
                <div>
                  <p className="text-fluid-sm font-semibold text-white">
                    Diseñado por Fernando Royano
                  </p>
                  <p className="text-fluid-xs text-subtle">
                    Graduado en CAFYD · 14 años de experiencia · +100 clientes
                  </p>
                </div>
              </div>
            </div>

            {/* Test (o formulario de la guía como fallback) */}
            <div id="test" className="relative scroll-mt-28">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-accent/20 via-transparent to-brand-purple/20 blur-xl" />
              <div className="relative">
                <TiroidesConversionPanel />
              </div>
            </div>
          </div>

          <div className="relative mt-fluid-md grid grid-cols-1 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 backdrop-blur-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              { icon: Clock3, label: '1 minuto', detail: 'Recorrido breve y adaptativo' },
              {
                icon: BadgeCheck,
                label: 'Resultado personal',
                detail: 'Prioridades según tus respuestas',
              },
              {
                icon: ShieldCheck,
                label: 'Criterio profesional',
                detail: 'Sin milagros ni promesas médicas',
              },
            ].map(({ icon: Icon, label, detail }) => (
              <div
                key={label}
                className="flex items-center gap-3 px-3 py-3 sm:py-0 sm:not-first:pl-6"
              >
                <Icon className="h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="text-fluid-sm font-semibold text-white">{label}</p>
                  <p className="text-fluid-xs text-subtle">{detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative mt-5 flex items-center gap-3 border-t border-white/10 pt-5 lg:hidden">
            <Image
              src="/images/fernando-royano-avatar.webp"
              alt="Fernando Royano, entrenador de WellnessReal"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full border-2 border-accent/50 object-cover object-top"
            />
            <div>
              <p className="text-fluid-sm font-semibold text-white">Diseñado por Fernando Royano</p>
              <p className="text-fluid-xs text-subtle">Graduado en CAFYD · 14 años de experiencia</p>
            </div>
          </div>
        </Container>
      </section>

      <MobileTestShortcut />

      {/* Centro temático: refuerza el contexto SEO sin competir con el test. */}
      <section className="relative bg-brand-deep py-fluid-xl" aria-labelledby="guias-tiroides">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 max-w-3xl space-y-3">
              <span className="eyebrow">Guías basadas en evidencia</span>
              <h2 id="guias-tiroides" className="headline text-fluid-3xl text-white">
                Entiende mejor el hipotiroidismo antes de{' '}
                <span className="text-gradient-brand">decidir qué hacer.</span>
              </h2>
              <p className="text-fluid-base leading-relaxed text-muted">
                Entrenamiento, composición corporal, cansancio y alimentación explicados sin
                soluciones milagro. Empieza por la duda que más se parece a tu situación.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {THYROID_GUIDES.map((guide) => (
                <article key={guide.href} className="surface-card flex h-full flex-col rounded-2xl p-6">
                  <h3 className="headline text-fluid-xl text-white">{guide.title}</h3>
                  <p className="mt-3 flex-1 text-fluid-sm leading-relaxed text-muted">
                    {guide.description}
                  </p>
                  <Link
                    href={guide.href}
                    className="mt-5 inline-flex min-h-11 items-center gap-2 text-fluid-sm font-semibold text-accent transition-[gap] hover:gap-3"
                  >
                    Leer la guía
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-accent/20 bg-accent/5 p-6 sm:flex-row sm:items-center">
              <div>
                <p className="font-semibold text-white">Si ya quieres convertirlo en un plan</p>
                <p className="mt-1 text-fluid-sm text-muted">
                  Conoce el acompañamiento de 12 semanas de Método BASE Tiroides.
                </p>
              </div>
              <Link href="/metodo-tiroides" className="btn-ghost shrink-0 text-fluid-sm">
                Ver Método BASE
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
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
                Trabajamos sobre lo que{' '}
                <span className="text-gradient-brand">sí puedes cambiar.</span>
              </h2>
              <p className="text-fluid-base text-muted max-w-2xl mx-auto">
                Sin diagnosticar ni prometer resultados hormonales: ordenamos entrenamiento, hábitos
                y seguimiento para construir un proceso realista.
              </p>
            </div>
            <div className="grid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] sm:grid-cols-2 lg:grid-cols-4">
              {PRIORIDADES.map((p, i) => (
                <div
                  key={i}
                  className="relative min-h-52 border-b border-white/10 p-6 last:border-b-0 sm:odd:border-r lg:border-b-0 lg:not-last:border-r"
                >
                  <span aria-hidden="true" className="absolute right-5 top-3 headline text-5xl text-white/35">
                    0{i + 1}
                  </span>
                  <p className="mb-8 text-fluid-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    Prioridad 0{i + 1}
                  </p>
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
                Puede que no te falte esfuerzo.{' '}
                <span className="text-gradient-brand">Puede faltarte estructura.</span>
              </h2>
              <p className="text-fluid-base text-muted max-w-2xl mx-auto">
                El test no diagnostica ni mide tu tiroides. Te ayuda a ordenar las decisiones que sí
                están dentro de nuestro ámbito profesional.
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
              <div className="hidden grid-cols-2 border-b border-white/10 bg-white/[0.025] px-6 py-4 md:grid">
                <p className="text-fluid-xs font-semibold uppercase tracking-widest text-danger">
                  Ruido que te frena
                </p>
                <p className="text-fluid-xs font-semibold uppercase tracking-widest text-success">
                  Una dirección más útil
                </p>
              </div>
              {CONSEJO_VS.map((c, i) => (
                <div
                  key={i}
                  className="grid gap-4 border-b border-white/10 p-6 last:border-b-0 md:grid-cols-2 md:gap-8"
                >
                  <div className="flex items-start gap-3 text-fluid-sm leading-relaxed text-white/65">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                    {c.mal}
                  </div>
                  <div className="flex items-start gap-3 text-fluid-sm leading-relaxed text-white/90">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {c.bien}
                  </div>
                </div>
              ))}
            </div>

            {/* Mantra */}
            <blockquote className="max-w-2xl mx-auto mt-12 text-center">
              <p className="headline text-fluid-2xl text-white leading-snug">
                “No entrenamos para mover un número en la analítica.
                <br />
                <span className="text-gradient-brand">
                  Entrenamos para recuperar fuerza, capacidad y confianza.”
                </span>
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
                  <li
                    key={i}
                    className="flex items-start gap-3 text-fluid-sm text-white/85 leading-relaxed"
                  >
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
                  <li
                    key={i}
                    className="flex items-start gap-3 text-fluid-sm text-white/85 leading-relaxed"
                  >
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
            <a href="#test" className="btn-brand text-fluid-base px-8 py-4">
              Hacer el test gratis
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>

          {/* Aviso legal */}
          <p className="max-w-2xl mx-auto mt-8 text-fluid-xs text-subtle text-center leading-relaxed">
            Este test y esta guía son información general y no sustituyen el consejo de tu médico ni
            son un diagnóstico. El seguimiento de tu tiroides, medicación y analíticas corresponde a
            tu equipo sanitario; WellnessReal trabaja entrenamiento, hábitos y composición corporal
            dentro de su ámbito profesional.
          </p>
        </Container>
      </section>
    </>
  )
}
