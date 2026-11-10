import Image from 'next/image'
import Container from '@/components/common/Container'
import Link from 'next/link'
import {
  Target,
  BarChart3,
  Check,
  ArrowRight,
  Sparkles,
  GraduationCap,
  MessageCircle,
  UserRound,
  BookOpen,
  Download,
} from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import JsonLd, {
  localBusinessSchema,
  webSiteSchema,
  personSchema,
} from '@/components/seo/JsonLd'
import HeroAnimation from '@/components/animations/HeroAnimation'
import ParallaxImage from '@/components/animations/ParallaxImage'
import AnimatedSection from '@/components/animations/AnimatedSection'
import StaggerChildren from '@/components/animations/StaggerChildren'
import MagneticButton from '@/components/animations/MagneticButton'
import { CommunityLink } from '@/components/comunidad/CommunityLink'
import { THYROID_PROGRAM } from '@/lib/metodo-tiroides'
import TrainingDecisions from '@/components/sections/TrainingDecisions'

export const metadata = buildMetadata({
  title: 'Comunidad gratuita de entrenamiento y hábitos | Tiroides',
  description:
    'Aprende con Fernando Royano en la comunidad gratuita para mujeres con hipotiroidismo o Hashimoto: lecciones, recursos y dudas sobre fuerza y hábitos.',
  path: '/',
  keywords: [
    'comunidad gratuita hipotiroidismo',
    'entrenamiento con hipotiroidismo',
    'fuerza y hábitos',
    'Hashimoto entrenamiento',
  ],
})

const BENEFITS = [
  {
    icon: GraduationCap,
    title: 'Criterio basado en evidencia',
    desc: 'La ciencia se traduce en decisiones útiles, sin promesas mágicas ni reglas imposibles de mantener.',
  },
  {
    icon: Target,
    title: 'Adaptado a tu contexto',
    desc: 'Aprendes a tener en cuenta tu nivel, tu tiempo, tu energía y el material disponible.',
  },
  {
    icon: BarChart3,
    title: 'Progreso que se puede ajustar',
    desc: 'Aprendes qué registrar y qué observar antes de cambiar la carga, el volumen o los hábitos.',
  },
] as const

const SUPPORTING_BENEFITS = [
  'Entrenamiento de fuerza',
  'Hábitos sostenibles',
  'Límites sanitarios claros',
] as const

const COMMUNITY_BENEFITS = [
  {
    icon: BookOpen,
    title: 'Lecciones para comprender',
    description: 'Tiroides, fuerza y hábitos, explicados paso a paso y con fuentes.',
  },
  {
    icon: Download,
    title: 'Recursos para aplicar',
    description: 'Herramientas descargables para organizarte y poner lo aprendido en práctica.',
  },
  {
    icon: MessageCircle,
    title: 'Un espacio para compartir',
    description: 'Plantea dudas generales y comparte tu experiencia con otras personas de la comunidad.',
  },
] as const

const STEPS = [
  {
    step: '01',
    title: 'Entra gratis a la comunidad',
    desc: 'Confirma tu acceso por email y empieza por la bienvenida. No necesitas contratar un programa.',
  },
  {
    step: '02',
    title: 'Comprende una idea cada vez',
    desc: 'Lee las lecciones sobre fuerza y hábitos, consulta las fuentes y plantea tus dudas generales.',
  },
  {
    step: '03',
    title: 'Llévalo a una semana posible',
    desc: 'Usa los recursos y el planificador para organizarte a tu ritmo, sin intentar cambiarlo todo a la vez.',
  },
  {
    step: '04',
    title: 'Da otro paso si lo necesitas',
    desc: 'Si después buscas estructura y seguimiento, puedes conocer Método BASE Tiroides. Es opcional y de pago; puedes seguir en la comunidad gratuita.',
  },
] as const

export default function HomePage() {
  return (
    <>
      <JsonLd data={localBusinessSchema()} />
      <JsonLd data={webSiteSchema()} />
      <JsonLd data={personSchema()} />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[calc(100svh-4.5rem)] md:min-h-[calc(100svh-5rem)] flex items-center justify-center overflow-hidden py-12">
        <ParallaxImage
          src="/images/portada-WR.jpg"
          alt="Entrenamiento Online WellnessReal"
          speed={0.2}
          priority
        />
        {/* Capas de fondo: imagen → gradient de marca → viñeta */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-deep/80 via-brand-deep/70 to-brand-deep z-[1]" />
        <div className="absolute inset-0 bg-radial-accent z-[2]" />
        <div className="absolute inset-0 bg-grid-soft z-[3] opacity-40" />

        <HeroAnimation>
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-subtle bg-accent-muted backdrop-blur-sm animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-fluid-xs font-semibold tracking-wider uppercase text-accent">
                Comunidad gratuita · Hipotiroidismo y Hashimoto
              </span>
            </div>

            <h1 className="headline break-words text-[clamp(2rem,8vw,3.4rem)] sm:text-fluid-6xl text-white animate-fade-up">
              Aprende a entrenar.<br />Empieza en comunidad.
            </h1>

            <p className="text-fluid-base sm:text-fluid-xl text-white/85 max-w-3xl mx-auto font-medium leading-relaxed animate-fade-up [animation-delay:100ms]">
              Soy Fernando Royano. He creado un espacio gratuito para mujeres con hipotiroidismo o Hashimoto que quieren entender la fuerza, la alimentación y los hábitos. Lecciones, recursos y dudas generales para llevar lo aprendido a tu vida real.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2 animate-fade-up [animation-delay:300ms]">
              <MagneticButton strength={0.25}>
                <CommunityLink href="/comunidad/entrar" source="home_hero" className="btn-brand text-fluid-base">
                  Entrar gratis a la comunidad
                  <ArrowRight className="w-4 h-4" />
                </CommunityLink>
              </MagneticButton>
              <Link
                href="#aprender"
                className="inline-flex items-center gap-2 px-3 py-3 text-fluid-sm font-semibold text-white/75 hover:text-accent transition-colors"
              >
                Ver qué encontrarás dentro <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="text-fluid-sm text-white/80">Acceso gratuito con tu email. Aprende a tu ritmo, sin obligación de contratar.</p>
            {/* Experiencia y alcance */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-5 text-fluid-xs text-white/70 animate-fade-up [animation-delay:400ms]">
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/15 px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Lecciones y herramientas prácticas
              </span>
              <span className="rounded-full border border-white/10 bg-black/15 px-3 py-1.5">
                Entrenamiento para la vida real
              </span>
              <span className="rounded-full border border-white/10 bg-black/15 px-3 py-1.5">
                14 años de experiencia
              </span>
            </div>
          </div>
        </HeroAnimation>
      </section>

      <section id="comunidad" aria-labelledby="community-heading" className="border-y border-border-subtle bg-brand-deep py-[clamp(3rem,6vw,5rem)]">
        <Container>
          <div id="aprender" className="grid scroll-mt-28 items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="min-w-0">
              <span className="eyebrow">Aprender gratis</span>
              <h2 id="community-heading" className="headline mt-4 text-fluid-3xl text-white">
                Aprende a entrenar <span className="text-accent">con más criterio.</span>
              </h2>
              <p className="mt-5 max-w-xl text-fluid-base leading-relaxed text-muted">
                Un espacio para mujeres con hipotiroidismo o Hashimoto que quieren entender mejor el entrenamiento y llevarlo a su día a día.
              </p>
              <CommunityLink href="/comunidad/entrar" source="home_benefits" className="btn-brand mt-6 text-fluid-sm">
                Organizar mi primera semana <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </CommunityLink>
              <p className="mt-4 max-w-xl text-fluid-sm leading-relaxed text-muted">
                Las lecciones y conversaciones están reservadas a los miembros. El acceso gratuito se confirma por email; Método BASE tiene su propio acceso de pago.
              </p>
              <div className="mt-6 border-t border-border-subtle pt-5">
                <h3 className="text-fluid-lg text-white">Así empieza «Por qué empezar con fuerza»</h3>
                <blockquote className="my-3 text-fluid-sm leading-relaxed text-muted">«Entrenar fuerza no significa empezar con barras enormes ni terminar agotada. Significa enseñar a tu cuerpo a producir fuerza con movimientos que puedas controlar.»</blockquote>
                <CommunityLink href="/comunidad/entrar?next=/comunidad/entrena-organizate/por-que-empezar-con-fuerza" source="home_lesson_preview" className="inline-flex min-h-11 items-center gap-2 text-fluid-sm font-semibold text-accent">Leer la lección en la comunidad <ArrowRight className="h-4 w-4" /></CommunityLink>
              </div>
              <div className="mt-5 border-t border-border-subtle pt-5">
                <h3 className="text-fluid-lg text-white">Una herramienta que encontrarás dentro</h3>
                <p className="mt-2 text-fluid-sm leading-relaxed text-muted">El planificador semanal te ayuda a reservar dos momentos posibles para entrenar y prever una alternativa si cambia tu semana.</p>
                <CommunityLink href="/comunidad/entrar?next=%2Fcomunidad%23recursos" source="home_resource" className="mt-3 inline-flex min-h-11 items-center gap-2 text-fluid-sm font-semibold text-accent">Acceder al planificador <ArrowRight className="h-4 w-4" /></CommunityLink>
              </div>
              <div className="mt-5 space-y-3 border-t border-border-subtle pt-5 text-fluid-sm text-muted">
                <p><Link href="/recurso-gratis" className="font-semibold text-accent underline underline-offset-4">Guía Fuerza para la vida real</Link>: fundamentos, ejercicios y alimentación para la salud, sin entrar en la comunidad.</p>
                <p><Link href="/tiroides" className="font-semibold text-accent underline underline-offset-4">Test de hábitos con hipotiroidismo</Link>: una herramienta orientativa si ese es tu contexto, no un diagnóstico ni un paso obligatorio.</p>
              </div>
            </div>
            <ul className="divide-y divide-border-subtle">
              {COMMUNITY_BENEFITS.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                  <Icon className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  <div className="min-w-0">
                    <h3 className="text-fluid-lg font-semibold text-white">{title}</h3>
                    <p className="mt-2 text-fluid-sm leading-relaxed text-muted">{description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ═══════════════ BENEFICIOS ═══════════════ */}
      <section className="relative py-[clamp(4rem,7vw,6.5rem)] bg-brand-dusk">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <Container>
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center mb-fluid-lg space-y-4">
              <span className="eyebrow">Qué vas a aprender</span>
              <h2 className="headline text-fluid-4xl text-white">
                Entender, aplicar y{' '}
                <span className="text-gradient-brand">ajustar</span>
              </h2>
              <p className="text-fluid-lg text-muted">
                Una forma práctica de entrenar y cuidarte con criterio, sin convertir el fitness en otra obligación imposible.
              </p>
            </div>
          </AnimatedSection>

          <StaggerChildren className="grid md:grid-cols-3 gap-5">
            {BENEFITS.map(({ icon: Icon, title, desc }, i) => (
              <article
                key={i}
                className="group surface-card hover-lift rounded-lg p-7 relative overflow-hidden"
              >
                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-accent/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-accent-muted border border-border-strong mb-5 group-hover:scale-110 group-hover:rotate-[-3deg] transition-transform duration-300">
                    <Icon className="w-5 h-5 text-accent" strokeWidth={2.2} />
                  </div>
                  <h3 className="text-fluid-xl text-white mb-2 tracking-tight">{title}</h3>
                  <p className="text-fluid-sm text-muted leading-relaxed">{desc}</p>
                </div>
              </article>
            ))}
          </StaggerChildren>
          <div className="mt-5 grid sm:grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border-subtle bg-border-subtle">
            {SUPPORTING_BENEFITS.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center justify-center gap-2 bg-brand-deep px-5 py-4 text-center text-fluid-sm text-white/75"
              >
                <Check className="w-4 h-4 shrink-0 text-accent" /> {benefit}
              </div>
            ))}
          </div>

        </Container>
      </section>

      <TrainingDecisions />

      {/* ═══════════════ CÓMO FUNCIONA ═══════════════ */}
      <section className="relative py-[clamp(4rem,7vw,6.5rem)] bg-brand-deep">
        <Container>
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center mb-fluid-lg space-y-4">
              <span className="eyebrow">Paso a paso</span>
              <h2 className="headline text-fluid-4xl text-white">
                De comprender a <span className="text-gradient-brand">ponerlo en práctica</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto relative">
            {/* Línea vertical conectora — solo desktop */}
            <div className="absolute left-[2.25rem] top-12 bottom-12 w-px bg-gradient-to-b from-accent/60 via-border to-transparent hidden md:block" />

            <StaggerChildren className="space-y-fluid-sm" childSelector=":scope > article">
              {STEPS.map(({ step, title, desc }, i) => (
                <article key={i} className="flex gap-6 md:gap-8 items-start group">
                  <div className="relative shrink-0">
                    <div
                      className="w-[4.5rem] h-[4.5rem] rounded-2xl flex items-center justify-center font-display font-extrabold text-fluid-2xl bg-accent text-accent-fg shadow-lg relative z-10 group-hover:scale-105 transition-transform duration-300"
                      style={{ boxShadow: '0 12px 32px -6px rgba(252, 238, 33, 0.45)' }}
                    >
                      {step}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-6 bg-border md:hidden" />
                    )}
                  </div>
                  <div className="pt-3 flex-1 min-w-0">
                    <h3 className="text-fluid-2xl text-white mb-2 tracking-tight">{title}</h3>
                    <p className="text-fluid-base text-muted leading-relaxed">{desc}</p>
                  </div>
                </article>
              ))}
            </StaggerChildren>
          </div>
        </Container>
      </section>

      {/* ═══════════════ QUIÉN ESTÁ DETRÁS ═══════════════ */}
      <section className="relative py-[clamp(4rem,7vw,6.5rem)] bg-brand-deep overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <Container>
          <AnimatedSection>
            <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-fluid-md items-center max-w-6xl mx-auto">
              <div className="relative min-h-[28rem] rounded-[2rem] overflow-hidden surface-card-accent flex items-end p-7">
                <Image
                  src="/images/fernando-royano-about.jpg"
                  alt="Fernando Royano, entrenador y fundador de WellnessReal"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-[center_18%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/95 via-transparent to-transparent" />
                <div className="relative w-full rounded-2xl border border-white/10 bg-brand-ink/75 p-5 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-fg">
                      <UserRound className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-display font-bold text-white">Fernando Royano</p>
                      <p className="text-fluid-xs text-muted">
                        Entrenador y graduado en Ciencias del Deporte
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <span className="eyebrow">Quién está detrás</span>
                <h2 className="headline text-fluid-4xl text-white">
                  No es una app. <span className="text-gradient-brand">Soy yo.</span>
                </h2>
                <div className="space-y-4 text-fluid-base text-white/80 leading-relaxed">
                  <p>
                    Llevo <strong className="text-white">14 años</strong> entrenando a personas con
                    trabajo, familia, lesiones antiguas y poco tiempo. No creo en extremos ni en la
                    culpa: creo en planes que siguen funcionando cuando la semana se complica.
                  </p>
                  <p className="text-white font-semibold">
                    En la comunidad comparto explicaciones y herramientas para que aprendas con
                    criterio. El plan adaptado y el seguimiento pertenecen a los programas de pago.
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 pt-2">
                  {[
                    { icon: GraduationCap, figure: '14 años', label: 'de experiencia' },
                    { icon: UserRound, figure: '+100', label: 'clientes' },
                    { icon: BookOpen, figure: 'Lecciones', label: 'para aprender a tu ritmo' },
                  ].map(({ icon: Icon, figure, label }) => (
                    <div key={figure} className="surface-card rounded-xl p-4">
                      <Icon className="w-4 h-4 text-accent mb-3" />
                      <div className="font-display font-bold text-white">{figure}</div>
                      <p className="text-fluid-xs text-muted mt-1">{label}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/sobre-mi"
                  className="inline-flex items-center gap-2 text-fluid-sm font-bold text-accent hover:gap-3 transition-all"
                >
                  Conoce mi forma de trabajar <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      <section id="comparar-programas" aria-labelledby="base-next-step" className="scroll-mt-24 bg-brand-deep py-fluid-lg">
        <Container>
          <div className="mx-auto max-w-3xl border-t border-border-subtle pt-10">
            <span className="eyebrow">El siguiente paso es opcional</span>
            <h2 id="base-next-step" className="headline mt-4 text-fluid-3xl text-white">Cuando aprender te lleva a querer un plan.</h2>
            <p className="mt-5 text-fluid-base leading-relaxed text-muted">La comunidad gratuita te ayuda a comprender y empezar a organizarte. Si necesitas una estructura adaptada y seguimiento, Método BASE Tiroides es el programa de pago de 12 semanas para personas con hipotiroidismo o Hashimoto diagnosticado y seguimiento sanitario.</p>
            <p className="mt-4 text-fluid-base leading-relaxed text-muted">Incluye plan de fuerza adaptado, contenidos, grupo privado, check-in semanal y dos revisiones individuales. Puedes seguir en la comunidad gratuita aunque no contrates.</p>
            <p className="mt-5 font-semibold text-accent">{THYROID_PROGRAM.price} € · pago único</p>
            <p className="mt-2 text-fluid-sm text-muted">2 pagos de {THYROID_PROGRAM.installmentPrice} € · total {THYROID_PROGRAM.installmentPrice * THYROID_PROGRAM.installmentCount} €. El segundo pago se solicita a los 30 días.</p>
            <Link href="/metodo-tiroides" className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-accent underline underline-offset-4">Ver qué incluye Método BASE <ArrowRight className="h-4 w-4" /></Link>
            <p className="mt-4 text-fluid-sm text-subtle">La solicitud no implica contratar. No incluye diagnóstico ni cambios de medicación.</p>
          </div>
        </Container>
      </section>

      {/* ═══════════════ CTA FINAL ═══════════════ */}
      <section className="relative py-[clamp(4.5rem,8vw,7rem)] overflow-hidden">
        <ParallaxImage src="/images/lifestyle.jpg" alt="Transforma tu vida" speed={0.15} />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-deep/95 via-brand-deep/90 to-brand-violet-soft/70 z-[1]" />
        <div className="absolute inset-0 bg-grid-soft z-[2] opacity-40" />

        <AnimatedSection className="relative z-10">
          <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
            <span className="eyebrow justify-center">Tu primer paso</span>
            <h2 className="headline text-fluid-5xl text-white">
              Empieza aprendiendo.
              <br />
              <span className="text-gradient-brand">Hazlo en comunidad.</span>
            </h2>
            <p className="text-fluid-xl text-white/80 font-medium">
              Entra en la comunidad gratuita, lee tu primera lección y utiliza los recursos para
              organizar tu semana. Si después necesitas más apoyo, podrás conocer Método BASE.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-2">
              <MagneticButton strength={0.25}>
                <CommunityLink href="/comunidad/entrar" source="home_final" className="btn-brand text-fluid-base px-8 py-5">
                  Entrar gratis a la comunidad
                  <ArrowRight className="w-5 h-5" />
                </CommunityLink>
              </MagneticButton>
              <Link
                href="/metodo-tiroides"
                className="inline-flex items-center gap-2 px-3 py-3 text-fluid-sm font-semibold text-white/75 hover:text-accent transition-colors"
              >
                Conocer el siguiente paso de pago <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-fluid-xs text-white/65 pt-4">
              Información clara, límites sanitarios explícitos y sin promesas rápidas.
            </p>
          </div>
        </AnimatedSection>
      </section>
    </>
  )
}
