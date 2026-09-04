import Image from 'next/image'
import Container from '@/components/common/Container'
import Link from 'next/link'
import {
  Smartphone,
  Target,
  BarChart3,
  Check,
  ArrowRight,
  Sparkles,
  GraduationCap,
  MessageCircle,
  UserRound,
} from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import JsonLd, {
  localBusinessSchema,
  webSiteSchema,
  reviewSchema,
  personSchema,
} from '@/components/seo/JsonLd'
import HeroAnimation from '@/components/animations/HeroAnimation'
import ParallaxImage from '@/components/animations/ParallaxImage'
import AnimatedSection from '@/components/animations/AnimatedSection'
import StaggerChildren from '@/components/animations/StaggerChildren'
import MagneticButton from '@/components/animations/MagneticButton'

export const metadata = buildMetadata({
  // El layout raíz añade " | WellnessReal" vía template — no repetir la marca aquí
  title: 'Entrenamiento Online Personalizado en Madrid',
  description:
    'Entrenamiento online personalizado, nutrición y osteopatía. Planes adaptados a tu vida real con app profesional y seguimiento semanal. Primera valoración gratis.',
  path: '/',
  keywords: [
    'entrenamiento online personalizado',
    'entrenador personal Madrid',
    'entrenamiento a distancia',
    'fitness online personalizado',
    'plan entrenamiento app',
    'nutrición personalizada',
  ],
})

const BENEFITS = [
  {
    icon: Smartphone,
    title: 'App profesional exclusiva',
    desc: 'Tu plan en una app móvil intuitiva. Vídeos, tracking automático y soporte directo desde el móvil.',
  },
  {
    icon: Target,
    title: '100% personalizado',
    desc: 'Adaptado a TU espacio, TU material, TU nivel y TUS objetivos. Nada de rutinas genéricas.',
  },
  {
    icon: BarChart3,
    title: 'Seguimiento cada semana',
    desc: 'Análisis de tu progreso, ajustes constantes y feedback profesional. No estás solo.',
  },
] as const

const SUPPORTING_BENEFITS = [
  'Entrena cuando y donde puedas',
  'Método basado en evidencia',
  'Mejor precio que el formato presencial',
] as const

const STEPS = [
  {
    step: '01',
    title: 'Solicita tu valoración gratis',
    desc: 'Valoración profesional 100% online. Analizamos tu situación, objetivos y diseñamos tu plan personalizado.',
  },
  {
    step: '02',
    title: 'Recibes acceso a tu app',
    desc: 'Te envío invitación a la app móvil (iOS/Android). Descargas, entras y ya tienes tu plan esperándote.',
  },
  {
    step: '03',
    title: 'Empiezas tu transformación',
    desc: 'Sigues tu plan desde el móvil. Vídeos explicativos, ejercicios personalizados, tracking automático.',
  },
  {
    step: '04',
    title: 'Seguimiento constante',
    desc: 'Cada semana revisamos tu evolución. Ajusto el plan según tus resultados y te doy feedback profesional.',
  },
] as const

const APP_FEATURES = [
  'App móvil nativa (iOS y Android) súper intuitiva',
  'Vídeos explicativos de cada ejercicio',
  'Tracking automático de peso, sensaciones y progreso',
  'Notificaciones y recordatorios personalizados',
  'Conexión directa conmigo desde la app',
] as const

const TESTIMONIALS = [
  {
    text: 'Llegué con varios intentos fallidos y sin creer que esto funcionara. En 14 meses bajé 21 kg, pero lo mejor fue sentir que, por primera vez en años, no estaba a dieta: estaba viviendo.',
    initials: 'PF',
    name: 'Padre de familia, 41 años',
    result: '-21kg en 14 meses',
  },
  {
    text: 'No quería perder peso, quería verme diferente. La báscula apenas cambió, pero la ropa me queda completamente distinta y ahora tengo músculo donde antes no había.',
    initials: 'M34',
    name: 'Mujer, 34 años',
    result: 'Recomposición corporal',
  },
  {
    text: 'Mi médico me recomendó cambiar hábitos. En 12 meses perdí 19 kg y mejoré mis marcadores de salud con seguimiento profesional. Volví a sentir que tenía el control.',
    initials: 'H45',
    name: 'Hombre, 45 años',
    result: '-19 kg en 12 meses',
  },
  {
    text: 'No cambió solo mi cuerpo. Volví a ponerme ropa que tenía guardada y a sentirme cómoda conmigo misma. Ese cambio no aparece en ninguna báscula.',
    initials: 'M29',
    name: 'Mujer, 29 años',
    result: 'Cambio de vida',
  },
] as const

const PLANS = [
  {
    name: 'Pack 3 meses',
    price: '450',
    period: '3 meses · 150 €/mes',
    desc: 'Para empezar con una base clara',
    features: [
      'Plan 100% personalizado',
      'Acceso completo a la app',
      'Revisión y ajustes semanales',
    ],
    popular: false,
  },
  {
    name: 'Pack 6 meses',
    price: '750',
    period: '6 meses · 125 €/mes',
    desc: 'Tiempo real para consolidar el cambio',
    features: ['Todo lo incluido en 3 meses', 'Ahorro de 150 €', 'Seguimiento a medio plazo'],
    popular: true,
  },
  {
    name: 'Premium',
    price: '990',
    period: '3 meses · 330 €/mes',
    desc: 'Máxima cercanía y disponibilidad',
    features: ['Acompañamiento 1 a 1', 'Contacto prioritario', 'Ajustes con mayor frecuencia'],
    popular: false,
  },
] as const

const REVIEW_SCHEMA_DATA = TESTIMONIALS.map((t) => ({
  text: t.text.split('.')[0] + '.',
  author: t.name,
  result: t.result,
}))

export default function HomePage() {
  return (
    <>
      <JsonLd data={localBusinessSchema()} />
      <JsonLd data={webSiteSchema()} />
      <JsonLd data={personSchema()} />
      <JsonLd data={reviewSchema(REVIEW_SCHEMA_DATA)} />

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
                Entrenamiento online · Madrid
              </span>
            </div>

            <h1 className="headline text-fluid-6xl text-white animate-fade-up">
              Ponte en forma sin
              <br className="hidden sm:block" />
              <span className="text-gradient-brand"> vivir en el gimnasio.</span>
            </h1>

            <p className="text-fluid-xl text-white/85 max-w-3xl mx-auto font-medium leading-relaxed animate-fade-up [animation-delay:100ms]">
              Entrenamiento online para gente con trabajo, familia y poco tiempo.
              <span className="text-accent font-semibold">
                {' '}
                Plan personalizado, app profesional y seguimiento semanal.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2 animate-fade-up [animation-delay:300ms]">
              <MagneticButton strength={0.25}>
                <Link href="/valoracion" className="btn-brand text-fluid-base">
                  Quiero mi plan personalizado
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </MagneticButton>
              <Link
                href="/recurso-gratis"
                className="inline-flex items-center gap-2 px-3 py-3 text-fluid-sm font-semibold text-white/75 hover:text-accent transition-colors"
              >
                Prefiero empezar con la guía <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Micro-prueba social */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-5 text-fluid-xs text-white/70 animate-fade-up [animation-delay:400ms]">
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/15 px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Valoración gratuita
              </span>
              <span className="rounded-full border border-white/10 bg-black/15 px-3 py-1.5">
                +100 clientes transformados
              </span>
              <span className="rounded-full border border-white/10 bg-black/15 px-3 py-1.5">
                14 años de experiencia
              </span>
            </div>
          </div>
        </HeroAnimation>
      </section>

      {/* ═══════════════ BENEFICIOS ═══════════════ */}
      <section className="relative py-[clamp(4rem,7vw,6.5rem)] bg-brand-dusk">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <Container>
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center mb-fluid-lg space-y-4">
              <span className="eyebrow">Por qué funciona</span>
              <h2 className="headline text-fluid-4xl text-white">
                Entrenamiento online que{' '}
                <span className="text-gradient-brand">sí da resultados</span>
              </h2>
              <p className="text-fluid-lg text-muted">
                Porque está diseñado para tu vida real, no para la vida que te venden en Instagram.
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

      {/* ═══════════════ CÓMO FUNCIONA ═══════════════ */}
      <section className="relative py-[clamp(4rem,7vw,6.5rem)] bg-brand-deep">
        <Container>
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center mb-fluid-lg space-y-4">
              <span className="eyebrow">Paso a paso</span>
              <h2 className="headline text-fluid-4xl text-white">
                Cómo funciona <span className="text-gradient-brand">(es muy fácil)</span>
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

      {/* ═══════════════ TECNOLOGÍA ═══════════════ */}
      <section className="relative py-[clamp(4rem,7vw,6.5rem)] bg-brand-dusk overflow-x-clip">
        <div className="absolute inset-0 bg-radial-violet opacity-60" />
        <Container>
          <AnimatedSection>
            <div className="relative grid lg:grid-cols-2 gap-fluid-md items-center">
              <div className="relative order-2 lg:order-1">
                <div className="absolute -inset-8 bg-accent/10 rounded-full blur-3xl" />
                <div className="relative rounded-2xl overflow-hidden border border-border-strong shadow-xl">
                  <Image
                    src="/images/wr_app_interface.png"
                    alt="App profesional de entrenamiento"
                    width={500}
                    height={640}
                    className="w-full h-auto"
                  />
                </div>
                {/* Badge flotante */}
                <div className="absolute -top-4 -right-4 md:-right-8 surface-card-accent rounded-xl px-4 py-3 animate-float">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-fluid-xs font-semibold text-white">Tracking en vivo</span>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2 space-y-6">
                <span className="eyebrow">Tecnología</span>
                <h2 className="headline text-fluid-4xl text-white">
                  La plataforma líder en entrenamiento online,
                  <span className="text-gradient-brand"> en tu bolsillo.</span>
                </h2>
                <p className="text-fluid-lg text-muted">
                  Trabajo con software profesional — no con PDFs ni hojas de Excel. Así te doy la
                  mejor experiencia.
                </p>
                <ul className="space-y-3 pt-2">
                  {APP_FEATURES.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-fluid-base text-white/85">
                      <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center">
                        <Check className="w-3 h-3 text-accent" strokeWidth={3} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AnimatedSection>
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
                    Yo diseño tu plan, leo cómo respondes y lo ajusto contigo cada semana. No hablas
                    con un bot ni recibes una rutina genérica.
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 pt-2">
                  {[
                    { icon: GraduationCap, figure: '14 años', label: 'de experiencia' },
                    { icon: UserRound, figure: '+100', label: 'clientes' },
                    { icon: MessageCircle, figure: 'Semanal', label: 'seguimiento real' },
                  ].map(({ icon: Icon, figure, label }) => (
                    <div key={figure} className="surface-card rounded-xl p-4">
                      <Icon className="w-4 h-4 text-accent mb-3" />
                      <div className="font-display font-bold text-white">{figure}</div>
                      <p className="text-fluid-xs text-muted mt-1">{label}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/valoracion"
                  className="inline-flex items-center gap-2 text-fluid-sm font-bold text-accent hover:gap-3 transition-all"
                >
                  Cuéntame tu caso <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* ═══════════════ TESTIMONIOS ═══════════════ */}
      <section className="relative py-[clamp(4rem,7vw,6.5rem)] bg-brand-dusk">
        <Container>
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center mb-fluid-lg space-y-4">
              <span className="eyebrow">Historias reales</span>
              <h2 className="headline text-fluid-4xl text-white">
                Lo que <span className="text-gradient-brand">cambió</span> para ellos
              </h2>
              <p className="text-fluid-lg text-muted">
                Personas normales con vidas ocupadas. Resultados que duran porque el proceso
                funciona.
              </p>
            </div>
          </AnimatedSection>

          <StaggerChildren className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {TESTIMONIALS.map(({ text, name, result, initials }, i) => (
              <figure key={i} className="surface-card rounded-2xl p-8 relative hover-lift">
                {/* Comilla decorativa */}
                <span
                  aria-hidden
                  className="absolute top-4 right-6 font-display text-fluid-6xl text-accent/20 leading-none select-none"
                >
                  &ldquo;
                </span>
                <blockquote className="text-fluid-base text-white/90 leading-relaxed italic relative">
                  {text}
                </blockquote>
                <figcaption className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-5 border-t border-border-subtle">
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border-strong bg-accent-muted text-[0.65rem] font-bold text-accent">
                      {initials}
                    </span>
                    <span className="text-fluid-sm font-semibold text-white">{name}</span>
                  </span>
                  <span className="shrink-0 px-3 py-1 rounded-full text-fluid-xs font-bold bg-accent text-accent-fg">
                    {result}
                  </span>
                </figcaption>
              </figure>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* ═══════════════ PRICING ═══════════════ */}
      <section className="relative py-[clamp(4rem,7vw,6.5rem)] bg-brand-deep">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <Container>
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center mb-fluid-lg space-y-4">
              <span className="eyebrow">Planes</span>
              <h2 className="headline text-fluid-4xl text-white">
                Elige <span className="text-gradient-brand">tu plan</span>
              </h2>
              <p className="text-fluid-lg text-muted">
                Sin permanencias ocultas. Cancela cuando quieras.
              </p>
            </div>
          </AnimatedSection>

          <StaggerChildren className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {PLANS.map(({ name, price, period, desc, features, popular }, i) => (
              <article
                key={i}
                className={
                  'relative rounded-2xl p-8 flex flex-col transition-all duration-300 ' +
                  (popular
                    ? 'surface-card-accent md:-translate-y-3 md:scale-[1.03] shadow-xl'
                    : 'surface-card hover:-translate-y-1')
                }
              >
                {popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-fg text-fluid-xs font-bold px-4 py-1.5 rounded-full tracking-wide uppercase shadow-lg">
                    Más elegido
                  </span>
                )}
                <div className="space-y-1 mb-6">
                  <h3 className="text-fluid-xl text-white tracking-tight">{name}</h3>
                  <p className="text-fluid-sm text-muted">{desc}</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="stat-figure text-fluid-6xl text-accent">{price}</span>
                    <span className="text-fluid-xl text-accent font-bold">€</span>
                  </div>
                  <p className="text-fluid-xs text-subtle mt-1">{period}</p>
                </div>
                <ul className="space-y-3 mb-7">
                  {features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-fluid-sm text-white/80"
                    >
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/tarifas"
                  className={
                    'mt-auto inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-fluid-sm transition-all ' +
                    (popular
                      ? 'btn-brand'
                      : 'border border-border text-white hover:bg-accent-muted hover:border-border-strong')
                  }
                >
                  {popular ? 'Elegir este plan' : 'Ver este plan'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </article>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* ═══════════════ CTA FINAL ═══════════════ */}
      <section className="relative py-[clamp(4.5rem,8vw,7rem)] overflow-hidden">
        <ParallaxImage src="/images/lifestyle.jpg" alt="Transforma tu vida" speed={0.15} />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-deep/95 via-brand-deep/90 to-brand-violet-soft/70 z-[1]" />
        <div className="absolute inset-0 bg-grid-soft z-[2] opacity-40" />

        <AnimatedSection className="relative z-10">
          <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
            <span className="eyebrow justify-center">Último paso</span>
            <h2 className="headline text-fluid-5xl text-white">
              No necesitas más información.
              <br />
              <span className="text-gradient-brand">Necesitas empezar.</span>
            </h2>
            <p className="text-fluid-xl text-white/80 font-medium">
              Valoración profesional <span className="text-accent font-bold">gratis</span>.
              Analizamos tu caso y te digo si puedo ayudarte.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-2">
              <MagneticButton strength={0.25}>
                <Link href="/valoracion" className="btn-brand text-fluid-lg px-12 py-5">
                  Quiero empezar
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </MagneticButton>
              <Link
                href="/recurso-gratis"
                className="inline-flex items-center gap-2 px-3 py-3 text-fluid-sm font-semibold text-white/75 hover:text-accent transition-colors"
              >
                Primero quiero la guía <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-fluid-xs text-white/65 pt-4">
              Sin compromiso. Sin letra pequeña. Respondo personalmente en 24h.
            </p>
          </div>
        </AnimatedSection>
      </section>
    </>
  )
}
