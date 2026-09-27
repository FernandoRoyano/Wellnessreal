import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  Dumbbell,
  GraduationCap,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import AnimatedSection from '@/components/animations/AnimatedSection'
import Container from '@/components/common/Container'
import JsonLd, { breadcrumbSchema, personSchema } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Sobre mí | Fernando Royano, entrenador de WellnessReal',
  description:
    'Conoce a Fernando Royano, graduado en Ciencias del Deporte y fundador de WellnessReal. Entrenamiento explicado con criterio y adaptado a una vida real.',
  alternates: { canonical: '/sobre-mi' },
  openGraph: {
    title: 'Fernando Royano | Quién está detrás de WellnessReal',
    description:
      'Mi forma de entender el entrenamiento: criterio, adaptación y acompañamiento sin extremos.',
    url: 'https://wellnessreal.es/sobre-mi',
    type: 'profile',
    images: [
      {
        url: '/images/fernando-royano-about.jpg',
        width: 1200,
        height: 1200,
        alt: 'Fernando Royano, entrenador y fundador de WellnessReal',
      },
    ],
  },
}

const principles = [
  {
    icon: BookOpenCheck,
    title: 'Entender antes de hacer',
    description:
      'Quiero que sepas para qué sirve cada decisión. Cuando entiendes el plan, puedes aplicarlo con más autonomía y menos miedo a equivocarte.',
  },
  {
    icon: HeartHandshake,
    title: 'Adaptar sin juzgar',
    description:
      'El trabajo, la familia, el descanso y las semanas difíciles forman parte del proceso. El plan debe convivir con todo eso.',
  },
  {
    icon: ShieldCheck,
    title: 'Ser claro con los límites',
    description:
      'Entrenamiento y educación no sustituyen una valoración sanitaria. Si algo sale de mi ámbito, lo responsable es decirlo.',
  },
] as const

const workingSteps = [
  'Conocer tu punto de partida, horarios, experiencia y limitaciones.',
  'Elegir el mínimo plan que pueda producir progreso y mantenerse.',
  'Explicar el porqué de las decisiones para que no dependas de seguir órdenes a ciegas.',
  'Revisar tu respuesta y ajustar cuando la realidad cambie.',
] as const

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={{
          ...personSchema(),
          url: 'https://wellnessreal.es/sobre-mi',
          image: 'https://wellnessreal.es/images/fernando-royano-about.jpg',
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Inicio', url: 'https://wellnessreal.es' },
          { name: 'Sobre mí', url: 'https://wellnessreal.es/sobre-mi' },
        ])}
      />

      <section className="relative overflow-hidden bg-brand-deep py-[clamp(4.5rem,9vw,8rem)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(159,232,112,0.09),transparent_32%)]" />
        <Container className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <AnimatedSection className="space-y-7">
              <span className="eyebrow">Quién está detrás de WellnessReal</span>
              <div className="space-y-5">
                <h1 className="headline max-w-3xl text-fluid-6xl text-white">
                  Soy Fernando. Entreno personas,{' '}
                  <span className="text-gradient-brand">no semanas perfectas.</span>
                </h1>
                <p className="max-w-2xl text-fluid-lg leading-relaxed text-white/75">
                  Soy graduado en Ciencias de la Actividad Física y del Deporte y llevo 14 años
                  ayudando a personas a entrenar con más criterio. WellnessReal nace de una idea
                  sencilla: un buen plan tiene que funcionar también cuando tu vida se complica.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/metodo-tiroides" className="btn-brand group">
                  Conocer Método BASE Tiroides
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/blog" className="btn-outline-light">
                  Leer mis artículos
                </Link>
              </div>

              <div className="grid max-w-2xl grid-cols-3 gap-3 border-t border-white/10 pt-6">
                {[
                  { value: '14 años', label: 'de experiencia' },
                  { value: '+100', label: 'personas acompañadas' },
                  { value: '1 a 1', label: 'criterio humano' },
                ].map((item) => (
                  <div key={item.value}>
                    <p className="font-display text-fluid-xl font-bold text-white">{item.value}</p>
                    <p className="mt-1 text-fluid-xs leading-snug text-muted">{item.label}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.12} className="relative">
              <div className="relative mx-auto aspect-[4/5] max-w-[31rem] overflow-hidden rounded-[2rem] border border-white/10 bg-brand-dusk shadow-2xl">
                <Image
                  src="/images/fernando-royano-about.jpg"
                  alt="Fernando Royano, entrenador y fundador de WellnessReal"
                  fill
                  priority
                  sizes="(max-width: 1024px) 92vw, 42vw"
                  className="object-cover object-[center_18%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/90 via-transparent to-transparent" />
                <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/10 bg-brand-ink/80 p-5 backdrop-blur-md sm:inset-x-7 sm:bottom-7">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-fg">
                      <GraduationCap className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="font-display font-bold text-white">Fernando Royano</p>
                      <p className="text-fluid-sm text-muted">
                        Graduado en Ciencias del Deporte · Fundador de WellnessReal
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      <section className="bg-brand-dusk py-[clamp(4rem,8vw,7rem)]">
        <Container>
          <AnimatedSection className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <span className="eyebrow">Mi forma de verlo</span>
              <h2 className="headline mt-5 text-fluid-4xl text-white">
                El problema rara vez es no saber que tienes que moverte.
              </h2>
            </div>
            <div className="space-y-5 text-fluid-lg leading-relaxed text-white/75">
              <p>
                Normalmente ya sabes muchas cosas: que te conviene entrenar fuerza, comer con cierto
                orden y descansar mejor. Lo difícil es convertir todo eso en decisiones que encajen
                en tu horario, tu experiencia y tu energía de esa semana.
              </p>
              <p>
                Por eso no trabajo desde la culpa ni desde el “todo o nada”. Prefiero construir una
                base que puedas repetir, medir y ajustar. A veces progresar será hacer más. Otras
                veces será saber mantener o reducir sin sentir que has abandonado.
              </p>
              <p className="font-semibold text-white">
                Mi trabajo no es darte una rutina impresionante sobre el papel. Es ayudarte a tomar
                mejores decisiones cuando el papel se encuentra con tu vida real.
              </p>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      <section className="bg-brand-deep py-[clamp(4rem,8vw,7rem)]">
        <Container>
          <AnimatedSection className="mx-auto max-w-3xl text-center">
            <span className="eyebrow justify-center">Tres principios</span>
            <h2 className="headline mt-5 text-fluid-4xl text-white">
              Criterio técnico, explicado como hablaríamos tú y yo.
            </h2>
          </AnimatedSection>

          <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-3">
            {principles.map(({ icon: Icon, title, description }, index) => (
              <AnimatedSection key={title} delay={index * 0.08} className="h-full">
                <article className="surface-card group h-full rounded-2xl p-7 transition-colors hover:border-border-strong">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-6 font-display text-fluid-xl font-bold text-white">{title}</h3>
                  <p className="mt-3 text-fluid-base leading-relaxed text-muted">{description}</p>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-brand-dusk py-[clamp(4rem,8vw,7rem)]">
        <Container>
          <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2 lg:gap-20">
            <AnimatedSection className="space-y-6 lg:sticky lg:top-28">
              <span className="eyebrow">Cómo trabajo</span>
              <h2 className="headline text-fluid-4xl text-white">
                Una metodología que se adapta sin perder el rumbo.
              </h2>
              <p className="text-fluid-lg leading-relaxed text-muted">
                La personalización no consiste en cambiar ejercicios al azar. Consiste en conservar
                los principios importantes y ajustar la forma de aplicarlos a tu contexto.
              </p>
            </AnimatedSection>

            <div className="space-y-4">
              {workingSteps.map((step, index) => (
                <AnimatedSection key={step} delay={index * 0.06}>
                  <div className="flex gap-5 rounded-2xl border border-border-subtle bg-brand-deep/60 p-6">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent font-display font-bold text-accent-fg">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-fluid-base leading-relaxed text-white/85">{step}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-brand-deep py-[clamp(4rem,8vw,7rem)]">
        <Container>
          <AnimatedSection className="mx-auto max-w-6xl rounded-[2rem] border border-border-subtle bg-brand-dusk p-7 sm:p-10 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <div className="space-y-5">
                <span className="eyebrow">Qué puedes esperar de mí</span>
                <h2 className="headline text-fluid-4xl text-white">Cercanía, pero también honestidad.</h2>
                <p className="text-fluid-base leading-relaxed text-muted">
                  No voy a prometer resultados universales ni a presentarme como el profesional que
                  resuelve todo. Sí puedo ofrecerte criterio de entrenamiento, seguimiento y una
                  explicación clara de cada decisión.
                </p>
              </div>
              <ul className="space-y-4">
                {[
                  { icon: MessageCircle, text: 'Contacto y seguimiento dentro de los límites acordados.' },
                  { icon: Dumbbell, text: 'Entrenamiento adaptado a tu punto de partida y disponibilidad.' },
                  { icon: UserRound, text: 'Revisión humana antes de entregar o modificar tu planificación.' },
                  { icon: Check, text: 'Derivación cuando una necesidad corresponde a un profesional sanitario.' },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-4 text-fluid-base text-white/85">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="pt-1">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-brand-ink py-[clamp(4.5rem,9vw,7.5rem)] text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(159,232,112,0.1),transparent_42%)]" />
        <Container className="relative">
          <AnimatedSection className="mx-auto max-w-3xl space-y-7">
            <span className="eyebrow justify-center">Siguiente paso</span>
            <h2 className="headline text-fluid-5xl text-white">
              Si esta forma de trabajar encaja contigo, conoce el programa con calma.
            </h2>
            <p className="mx-auto max-w-2xl text-fluid-lg leading-relaxed text-muted">
              Revisa qué incluye, qué no incluye y para quién está pensado antes de solicitar una
              plaza. Sin presión y sin promesas que nadie puede garantizar.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/metodo-tiroides" className="btn-brand group">
                Conocer Método BASE Tiroides
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/servicios/entrenamiento-online" className="btn-outline-light">
                Ver entrenamiento individual
              </Link>
            </div>
          </AnimatedSection>
        </Container>
      </section>
    </>
  )
}
