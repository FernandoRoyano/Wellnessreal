import Container from '@/components/common/Container'
import Link from 'next/link'
import { Heart, Activity, Moon, Check, ArrowRight, Sparkles } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import HeroAnimation from '@/components/animations/HeroAnimation'
import AnimatedSection from '@/components/animations/AnimatedSection'
import StaggerChildren from '@/components/animations/StaggerChildren'
import MagneticButton from '@/components/animations/MagneticButton'

export const metadata = buildMetadata({
  title: 'Nuestra Filosofía | Fitness Real Sin Extremos',
  description:
    'La filosofía WellnessReal: salud real basada en actividad física, nutrición y recuperación. Sin postureo, sin excusas. Solo lo que funciona de verdad.',
  path: '/filosofia',
  keywords: [
    'filosofía fitness',
    'salud real',
    'bienestar integral',
    'entrenamiento sin extremos',
    'vida saludable',
  ],
})

const HEALTH_PILLARS = [
  'Moverte con regularidad',
  'Comer bien (sin obsesionarte)',
  'Dormir lo que tu cuerpo pide',
  'Gestionar el estrés del día a día',
  'Cuidar la cabeza y las emociones',
  'Rodearte de gente que suma',
  'Un entorno que te lo ponga fácil',
] as const

const CIRCLE = [
  {
    icon: Activity,
    title: 'Moverte',
    description:
      'Con regularidad y del modo que encaje en tu vida. Más fuerza, más energía y menos achaques. No hace falta vivir en el gimnasio.',
    accent: true,
  },
  {
    icon: Heart,
    title: 'Comer bien',
    description:
      'Pautas flexibles, sin prohibiciones absurdas ni dietas de revista. Un modo de comer que puedas sostener años, no semanas.',
    accent: false,
  },
  {
    icon: Moon,
    title: 'Descansar',
    description:
      'Dormir y recuperarte no es un lujo — es lo que hace que todo lo demás funcione. Sin descanso real, el cuerpo no responde.',
    accent: false,
  },
] as const

export default function FilosofiaPage() {
  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative py-fluid-xl overflow-hidden bg-brand-deep">
        <div className="absolute inset-0 bg-radial-accent opacity-80" />
        <div className="absolute inset-0 bg-grid-soft opacity-40" />
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full bg-brand-violet/20 blur-3xl -translate-y-1/2 translate-x-1/4" />

        <Container>
          <HeroAnimation>
            <div className="relative max-w-4xl space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-subtle bg-accent-muted backdrop-blur-sm animate-fade-in">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span className="text-fluid-xs font-semibold tracking-wider uppercase text-accent">
                  Filosofía WellnessReal
                </span>
              </div>

              <h1 className="headline text-fluid-7xl text-white animate-fade-up">
                Salud real,
                <br />
                <span className="text-gradient-brand">sin postureo.</span>
              </h1>

              <p className="text-fluid-xl text-white/85 leading-relaxed max-w-2xl font-medium animate-fade-up [animation-delay:100ms]">
                <span className="text-accent font-semibold">¿Cansado de planes que no encajan con tu vida?</span>{' '}
                Aquí te cuento cómo lo hago: sin fórmulas mágicas, sin promesas a lo grande, sin jerga de coach.
              </p>

              <p className="text-fluid-base text-muted max-w-2xl leading-relaxed animate-fade-up [animation-delay:200ms]">
                Estar bien no va de dietas perfectas ni entrenar seis días a la semana. El 80% de tu salud son los
                hábitos que repites cada día. Ni más, ni menos.
              </p>
            </div>
          </HeroAnimation>
        </Container>
      </section>

      {/* ═══════════════ QUÉ ES LA SALUD ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-dusk">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <Container>
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="space-y-4 mb-fluid-md">
                <span className="eyebrow">La base</span>
                <h2 className="headline text-fluid-4xl text-white">¿Qué es estar sano?</h2>
                <p className="text-fluid-lg text-muted leading-relaxed max-w-3xl">
                  Hay demasiada información y muy pocas respuestas claras. Te lo resumo: lo que más pesa en tu salud no
                  son los superalimentos ni la última rutina viral. Son las cosas pequeñas que haces todos los días.
                </p>
              </div>

              {/* Pull quote destacado */}
              <figure className="surface-card-accent rounded-2xl p-fluid-md mb-fluid-md relative">
                <span
                  aria-hidden
                  className="absolute top-2 left-6 font-display text-fluid-7xl text-accent/20 leading-none select-none"
                >
                  &ldquo;
                </span>
                <blockquote className="text-fluid-2xl md:text-fluid-3xl text-white font-semibold text-center leading-[1.3] relative">
                  Si quieres estar bien:{' '}
                  <span className="text-gradient-brand">muévete, come bien y descansa.</span>{' '}
                  Tu entorno, tu cabeza y tus hábitos suman o restan. Lo que haces cada día pesa más que cualquier plan perfecto.
                </blockquote>
              </figure>
            </AnimatedSection>

            <StaggerChildren>
              <ul className="grid md:grid-cols-2 gap-x-8 gap-y-3 mb-fluid-md">
                {HEALTH_PILLARS.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-fluid-base text-white/85 py-2.5 border-b border-border-subtle last:border-b-0 md:[&:nth-last-child(2)]:border-b-0"
                  >
                    <span className="shrink-0 w-6 h-6 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center">
                      <Check className="w-3 h-3 text-accent" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-fluid-xl text-muted leading-relaxed text-center">
                No hace falta acertar en todo. Empezar por{' '}
                <span className="text-accent font-semibold">dos o tres de estas</span> ya cambia las cosas.
              </p>
            </StaggerChildren>
          </div>
        </Container>
      </section>

      {/* ═══════════════ NO ES UN PRODUCTO ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-deep overflow-hidden">
        <div className="absolute inset-0 bg-radial-violet" />
        <Container>
          <AnimatedSection>
            <div className="relative max-w-3xl mx-auto text-center space-y-6">
              <span className="eyebrow justify-center">La propuesta</span>
              <h2 className="headline text-fluid-5xl text-white">WellnessReal no es un producto</h2>
              <p className="text-fluid-3xl text-white font-semibold">
                Es una <span className="text-gradient-brand">forma de hacer las cosas.</span>
              </p>
              <p className="text-fluid-lg text-muted leading-relaxed max-w-2xl mx-auto">
                No vendo sueños ni promesas de &ldquo;-20kg en 2 meses&rdquo;. Lo que hago es sentarme contigo, entender
                tu vida real y montar algo que puedas sostener. Vida sana y vida feliz a la vez. Sin esclavitud fitness.
              </p>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* ═══════════════ CÍRCULO DE LA SALUD ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-dusk">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <Container>
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-fluid-lg">
              <span className="eyebrow">Los tres pilares</span>
              <h2 className="headline text-fluid-4xl text-white">Las tres piezas que tienen que encajar</h2>
              <p className="text-fluid-lg text-muted leading-relaxed">
                Si solo trabajas una, las otras tiran para abajo. Cuando las tres empujan en la misma dirección, el
                cambio deja de depender de fuerza de voluntad. Se vuelve sostenible.
              </p>
            </div>
          </AnimatedSection>

          <StaggerChildren className="grid md:grid-cols-3 gap-6 mb-fluid-md">
            {CIRCLE.map(({ icon: Icon, title, description, accent }, i) => (
              <article
                key={i}
                className={
                  'group rounded-2xl p-8 relative overflow-hidden hover-lift ' +
                  (accent ? 'surface-card-accent' : 'surface-card')
                }
              >
                {/* número de paso decorativo, sutil */}
                <span
                  aria-hidden
                  className="absolute top-4 right-5 font-display text-fluid-5xl font-extrabold text-accent/15 leading-none select-none"
                >
                  0{i + 1}
                </span>

                <div className="relative">
                  <div
                    className={
                      'inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6 border transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-3deg] ' +
                      (accent
                        ? 'bg-accent text-accent-fg border-accent'
                        : 'bg-accent-muted text-accent border-border-strong')
                    }
                  >
                    <Icon className="w-6 h-6" strokeWidth={2.2} />
                  </div>
                  <h3 className="text-fluid-2xl text-white mb-3 tracking-tight">{title}</h3>
                  <p className="text-fluid-base text-muted leading-relaxed">{description}</p>
                </div>
              </article>
            ))}
          </StaggerChildren>

          <AnimatedSection>
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <p className="text-fluid-2xl text-white font-semibold">
                Las tres están <span className="text-gradient-brand">interconectadas.</span>
              </p>
              <p className="text-fluid-base text-muted leading-relaxed">
                Si entrenas bien pero duermes mal, no avanzas. Si comes bien pero no te mueves, tampoco. El truco no
                está en ser perfecto en ninguna — está en no abandonar ninguna.
              </p>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-deep overflow-hidden">
        <div className="absolute inset-0 bg-grid-soft opacity-30" />
        <div className="absolute inset-0 bg-radial-accent opacity-50" />
        <Container>
          <AnimatedSection>
            <div className="relative max-w-3xl mx-auto text-center space-y-8">
              <span className="eyebrow justify-center">Si te suena</span>
              <h2 className="headline text-fluid-5xl text-white">
                ¿Empezamos, <span className="text-gradient-brand">o lo dejamos para otro día?</span>
              </h2>
              <p className="text-fluid-xl text-muted leading-relaxed max-w-2xl mx-auto">
                La valoración inicial es gratuita. Me cuentas tu situación, analizo qué necesitas y te digo honestamente
                si puedo ayudarte. Sin venderte nada.
              </p>
              <div className="pt-2">
                <MagneticButton strength={0.25}>
                  <Link href="/valoracion" className="btn-brand text-fluid-lg px-10 py-5">
                    Quiero hablar contigo
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </MagneticButton>
              </div>
              <p className="text-fluid-xs text-white/35 pt-2">
                Sin compromiso. Sin letra pequeña. Respondo personalmente en 24h.
              </p>
            </div>
          </AnimatedSection>
        </Container>
      </section>
    </>
  )
}
