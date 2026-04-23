import Container from '@/components/common/Container'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import JsonLd, { breadcrumbSchema } from '@/components/seo/JsonLd'
import HeroAnimation from '@/components/animations/HeroAnimation'
import AnimatedSection from '@/components/animations/AnimatedSection'
import StaggerChildren from '@/components/animations/StaggerChildren'
import AnimatedCounter from '@/components/animations/AnimatedCounter'
import MagneticButton from '@/components/animations/MagneticButton'

export const metadata = buildMetadata({
  title: 'De 92kg a 71kg en 14 meses | Caso Real — WellnessReal',
  description:
    'Cómo un padre de familia de 41 años perdió 21kg sin dietas extremas ni entrenamientos imposibles. Historia real de un cliente de WellnessReal.',
  path: '/caso-real',
  keywords: [
    'transformación física real',
    'perder peso sin dieta',
    'caso real entrenamiento online',
    'antes después entrenamiento',
  ],
})

const METHOD = [
  {
    num: '01',
    title: 'Entender su vida real',
    text: 'No empezamos con una rutina ni una dieta. Empezamos entendiendo su horario, su estrés, sus compromisos familiares y qué había fallado antes. El plan se construyó alrededor de su vida — no al revés.',
  },
  {
    num: '02',
    title: 'Cambios pequeños y sostenibles',
    text: 'Nada de eliminar grupos de alimentos ni entrenar cinco días desde el primer momento. Empezó con tres sesiones de 40 minutos y ajustes nutricionales mínimos. Cada mes, un paso más.',
  },
  {
    num: '03',
    title: 'Seguimiento real, no automático',
    text: 'Cada semana revisábamos juntos cómo iba. Si un ejercicio no funcionaba, lo cambiábamos. Si una semana fue mala, ajustábamos. El plan nunca fue estático — evolucionó con él.',
  },
] as const

const TIMELINE = [
  {
    period: 'Mes 1-2',
    title: 'Adaptación',
    text: 'Empezó a entrenar 3 días/semana. Sin cambios drásticos en la dieta, solo ajustes. Perdió 3kg pero lo más importante: empezó a dormir mejor y tener más energía.',
  },
  {
    period: 'Mes 3-6',
    title: 'El cambio se nota',
    text: 'Ya entrenaba con más intensidad. La ropa empezó a quedarle diferente. -8kg acumulados. Su entorno empezó a notar el cambio.',
  },
  {
    period: 'Mes 7-10',
    title: 'Consistencia',
    text: 'El momento donde la mayoría abandona. Él no lo hizo porque el plan se adaptaba a sus semanas malas. -15kg acumulados. Dejó de pensar en "estar a dieta".',
  },
  {
    period: 'Mes 11-14',
    title: 'Resultado final',
    text: '-21kg. Pero no solo eso: valores de colesterol normalizados, energía para jugar con sus hijos, ropa nueva y una relación completamente diferente con la comida y el ejercicio.',
  },
] as const

export default function CasoRealPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Inicio',    url: 'https://wellnessreal.es' },
          { name: 'Caso Real', url: 'https://wellnessreal.es/caso-real' },
        ])}
      />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative py-fluid-xl overflow-hidden bg-brand-deep">
        <div className="absolute inset-0 bg-radial-accent opacity-70" />
        <div className="absolute inset-0 bg-grid-soft opacity-40" />
        <Container>
          <HeroAnimation>
            <div className="relative max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full border border-border-subtle bg-accent-muted backdrop-blur-sm animate-fade-in">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span className="text-fluid-xs font-semibold tracking-wider uppercase text-accent">
                  Historia real · 14 meses de proceso
                </span>
              </div>

              <h1 className="headline text-fluid-7xl text-white animate-fade-up">
                De 92kg a 71kg
                <br />
                <span className="text-gradient-brand">en 14 meses.</span>
              </h1>

              <p className="text-fluid-xl text-white/85 leading-relaxed font-medium animate-fade-up [animation-delay:100ms]">
                Sin dietas extremas. Sin entrenar 6 días a la semana.{' '}
                <span className="text-accent font-semibold">Sin dejar de vivir.</span>
              </p>

              <p className="text-fluid-base text-muted max-w-2xl mx-auto leading-relaxed animate-fade-up [animation-delay:200ms]">
                La historia real de un padre de familia de 41 años que lo había intentado todo.
              </p>

              <div className="pt-4 animate-fade-up [animation-delay:300ms]">
                <Link href="/valoracion" className="btn-brand text-fluid-base">
                  Quiero mi valoración gratuita
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </HeroAnimation>
        </Container>
      </section>

      {/* ═══════════════ PUNTO DE PARTIDA ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-dusk">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <Container>
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <div className="space-y-4 mb-fluid-md">
                <span className="eyebrow">Cómo empezó</span>
                <h2 className="headline text-fluid-4xl text-white">El punto de partida</h2>
              </div>

              <blockquote className="text-fluid-2xl text-white italic leading-[1.4] mb-fluid-sm pl-6 border-l-4 border-accent">
                &ldquo;Llegué con 92kg, varios intentos fallidos a mis espaldas y sin creerme que esto fuera a
                funcionar.&rdquo;
              </blockquote>

              <div className="space-y-5 text-fluid-base text-muted leading-relaxed">
                <p>
                  41 años. Padre de dos hijos. Trabajo de oficina, 9 horas sentado. Llegaba a casa agotado. Había probado
                  gimnasios, dietas de revista, apps de fitness, incluso un nutricionista durante tres meses.
                </p>
                <p>
                  Resultado: siempre el mismo. Perdía algo de peso las primeras semanas, se estancaba, se frustraba y
                  volvía a los hábitos de siempre. Cada intento fallido sumaba un poco más de desconfianza.
                </p>
                <p>
                  Cuando contactó con WellnessReal, sus propias palabras fueron:{' '}
                  <span className="text-accent font-semibold">
                    &ldquo;No sé si esto va a funcionar, pero ya no sé qué más probar.&rdquo;
                  </span>
                </p>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* ═══════════════ MÉTODO ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-deep">
        <Container>
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-fluid-lg">
              <span className="eyebrow justify-center">El método</span>
              <h2 className="headline text-fluid-4xl text-white">
                Qué hicimos <span className="text-gradient-brand">diferente</span>
              </h2>
            </div>
          </AnimatedSection>

          <StaggerChildren className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {METHOD.map((item) => (
              <article key={item.num} className="surface-card hover-lift rounded-2xl p-8 relative overflow-hidden">
                <span
                  aria-hidden
                  className="absolute top-3 right-5 font-display text-fluid-6xl font-extrabold text-accent/15 leading-none select-none"
                >
                  {item.num}
                </span>
                <div className="relative">
                  <span className="stat-figure text-fluid-3xl text-accent block mb-4">{item.num}</span>
                  <h3 className="text-fluid-xl text-white mb-3 tracking-tight">{item.title}</h3>
                  <p className="text-fluid-sm text-muted leading-relaxed">{item.text}</p>
                </div>
              </article>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* ═══════════════ TIMELINE ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-dusk">
        <Container>
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-fluid-lg">
              <span className="eyebrow justify-center">Mes a mes</span>
              <h2 className="headline text-fluid-4xl text-white">La evolución</h2>
            </div>
          </AnimatedSection>

          <StaggerChildren className="max-w-3xl mx-auto" childSelector=":scope > div" stagger={0.2}>
            {TIMELINE.map((milestone, i) => (
              <div key={i} className="flex gap-5 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-accent shadow-glow flex-shrink-0 mt-2" />
                  {i < TIMELINE.length - 1 && <div className="w-0.5 flex-1 bg-gradient-to-b from-accent/60 via-border to-transparent" />}
                </div>
                <div className="pb-fluid-sm flex-1 min-w-0">
                  <span className="eyebrow text-fluid-xs">{milestone.period}</span>
                  <h3 className="text-fluid-2xl text-white mt-2 mb-3 tracking-tight">{milestone.title}</h3>
                  <p className="text-fluid-base text-muted leading-relaxed">{milestone.text}</p>
                </div>
              </div>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* ═══════════════ PULL QUOTE ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-deep">
        <Container>
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <div className="surface-card-accent rounded-2xl p-fluid-md relative">
                <span
                  aria-hidden
                  className="absolute top-2 left-6 font-display text-fluid-7xl text-accent/25 leading-none select-none"
                >
                  &ldquo;
                </span>
                <blockquote className="text-fluid-2xl text-white italic leading-[1.45] relative pl-6">
                  Lo que más me sorprendió no fue la báscula — fue darme cuenta de que por primera vez en años no estaba
                  a dieta. Estaba viviendo. Comía bien, entrenaba porque me gustaba, y los resultados venían solos.
                </blockquote>
                <p className="text-fluid-sm text-muted mt-6 pl-6">
                  — Padre de familia, 41 años · Cliente de WellnessReal
                </p>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-dusk">
        <Container>
          <StaggerChildren
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center"
            stagger={0.15}
          >
            <div className="surface-card rounded-2xl p-6">
              <AnimatedCounter end={21} prefix="-" suffix="kg" className="stat-figure text-fluid-4xl text-accent block mb-2" />
              <span className="text-fluid-xs text-muted uppercase tracking-wider">Peso perdido</span>
            </div>
            <div className="surface-card rounded-2xl p-6">
              <AnimatedCounter end={14} suffix=" meses" className="stat-figure text-fluid-4xl text-accent block mb-2" />
              <span className="text-fluid-xs text-muted uppercase tracking-wider">De proceso</span>
            </div>
            <div className="surface-card rounded-2xl p-6">
              <AnimatedCounter end={3}  suffix=" días/sem" className="stat-figure text-fluid-4xl text-accent block mb-2" />
              <span className="text-fluid-xs text-muted uppercase tracking-wider">De entrenamiento</span>
            </div>
            <div className="surface-card rounded-2xl p-6">
              <AnimatedCounter end={0}  suffix=" dietas" className="stat-figure text-fluid-4xl text-accent block mb-2" />
              <span className="text-fluid-xs text-muted uppercase tracking-wider">Restrictivas</span>
            </div>
          </StaggerChildren>
        </Container>
      </section>

      {/* ═══════════════ CTA FINAL ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-deep overflow-hidden">
        <div className="absolute inset-0 bg-radial-accent opacity-40" />
        <Container>
          <AnimatedSection>
            <div className="relative max-w-3xl mx-auto text-center space-y-8">
              <span className="eyebrow justify-center">Tu turno</span>
              <h2 className="headline text-fluid-5xl text-white">
                ¿Te identificas con <span className="text-gradient-brand">esta historia?</span>
              </h2>
              <p className="text-fluid-lg text-muted leading-relaxed">
                No necesitas ser un caso extremo. Solo necesitas un plan que funcione en tu vida real y a alguien que te
                acompañe en el proceso.
              </p>
              <p className="text-fluid-base text-muted leading-relaxed">
                La valoración es gratuita, sin compromiso y sin presión. Analizamos tu caso y te digo exactamente qué
                haríamos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <MagneticButton strength={0.25}>
                  <Link href="/valoracion" className="btn-brand text-fluid-base px-8">
                    Solicitar valoración gratuita
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </MagneticButton>
                <Link href="/tarifas" className="btn-ghost text-fluid-base px-8">
                  Ver tarifas
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>
    </>
  )
}
