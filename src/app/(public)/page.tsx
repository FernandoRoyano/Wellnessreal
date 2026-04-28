import Image from 'next/image'
import Container from '@/components/common/Container'
import Link from 'next/link'
import { Smartphone, Target, BarChart3, Flame, Clock, TrendingUp, Check, ArrowRight, Sparkles } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import JsonLd, { localBusinessSchema, webSiteSchema, reviewSchema, personSchema } from '@/components/seo/JsonLd'
import HeroAnimation from '@/components/animations/HeroAnimation'
import ParallaxImage from '@/components/animations/ParallaxImage'
import AnimatedSection from '@/components/animations/AnimatedSection'
import StaggerChildren from '@/components/animations/StaggerChildren'
import MagneticButton from '@/components/animations/MagneticButton'

export const metadata = buildMetadata({
  title: 'WellnessReal | Entrenamiento Online Personalizado en Madrid',
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
  { icon: Smartphone, title: 'App profesional exclusiva', desc: 'Tu plan en una app móvil intuitiva. Vídeos, tracking automático y soporte directo desde el móvil.' },
  { icon: Target,     title: '100% personalizado',        desc: 'Adaptado a TU espacio, TU material, TU nivel y TUS objetivos. Nada de rutinas genéricas.' },
  { icon: BarChart3,  title: 'Seguimiento cada semana',   desc: 'Análisis de tu progreso, ajustes constantes y feedback profesional. No estás solo.' },
  { icon: Flame,      title: 'Resultados comprobados',    desc: 'Método basado en ciencia, +100 clientes reales y transformaciones documentadas.' },
  { icon: Clock,      title: 'Entrena a tu ritmo',        desc: 'Sin horarios fijos ni citas obligatorias. Tú decides cuándo y dónde. Yo te guío siempre.' },
  { icon: TrendingUp, title: 'Mejor precio que presencial', desc: 'Servicio profesional por una fracción del coste del entrenamiento presencial tradicional.' },
] as const

const STEPS = [
  { step: '01', title: 'Solicita tu valoración gratis', desc: 'Valoración profesional 100% online. Analizamos tu situación, objetivos y diseñamos tu plan personalizado.' },
  { step: '02', title: 'Recibes acceso a tu app',       desc: 'Te envío invitación a la app móvil (iOS/Android). Descargas, entras y ya tienes tu plan esperándote.' },
  { step: '03', title: 'Empiezas tu transformación',    desc: 'Sigues tu plan desde el móvil. Vídeos explicativos, ejercicios personalizados, tracking automático.' },
  { step: '04', title: 'Seguimiento constante',         desc: 'Cada semana revisamos tu evolución. Ajusto el plan según tus resultados y te doy feedback profesional.' },
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
    text: 'Llegué con 92kg, varios intentos fallidos a mis espaldas y sin creerme que esto fuera a funcionar. En 14 meses bajé 21kg. Pero lo que más me sorprendió no fue la báscula — fue darme cuenta de que por primera vez en años no estaba a dieta. Estaba viviendo.',
    name: 'Padre de familia, 41 años',
    result: '-21kg en 14 meses',
  },
  {
    text: 'No quería perder peso, quería verme diferente. Empecé en 88kg y terminé en 86kg — casi igual en la báscula. Pero la ropa me queda completamente distinta. Tengo músculo donde antes no había nada. Nadie se cree que no haya adelgazado más.',
    name: 'Mujer, 34 años',
    result: 'Recomposición corporal',
  },
  {
    text: 'A los 45 años me dijeron que tenía el colesterol alto y tensión límite. Mi médico me recomendó cambiar hábitos. En 12 meses perdí 19kg, normalicé los valores y dejé la medicación preventiva que me habían recetado. Mi médico no se lo creía.',
    name: 'Hombre, 45 años',
    result: '-19kg y sin medicación',
  },
  {
    text: 'Lo que cambió no fue solo mi cuerpo. Cambié yo. Empecé a ir a sitios que antes evitaba, a ponerme ropa que tenía guardada, a sentirme cómoda en mi propio cuerpo por primera vez desde que era adolescente. Eso no te lo da ninguna báscula.',
    name: 'Mujer, 29 años',
    result: 'Cambio de vida',
  },
] as const

const PLANS = [
  { name: 'Pack 3 meses',  price: '450', period: '3 meses · 150 €/mes',  desc: 'Entrada estándar',          popular: false },
  { name: 'Pack 6 meses',  price: '750', period: '6 meses · 125 €/mes',  desc: 'El más elegido',            popular: true  },
  { name: 'Premium',       price: '990', period: '3 meses · 330 €/mes',  desc: 'Acompañamiento 1-a-1',      popular: false },
] as const

const REVIEW_SCHEMA_DATA = TESTIMONIALS.map(t => ({
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
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-8">
        <ParallaxImage src="/images/portada-WR.jpg" alt="Entrenamiento Online WellnessReal" speed={0.2} priority />
        {/* Capas de fondo: imagen → gradient de marca → viñeta */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-deep/80 via-brand-deep/70 to-brand-deep z-[1]" />
        <div className="absolute inset-0 bg-radial-accent z-[2]" />
        <div className="absolute inset-0 bg-grid-soft z-[3] opacity-40" />

        <HeroAnimation>
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8">
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

            <p className="text-fluid-xl text-white/80 max-w-3xl mx-auto font-medium animate-fade-up [animation-delay:100ms]">
              Entrenamiento online para gente con trabajo, familia y poco tiempo.
              <span className="text-accent font-semibold"> Sin dietas extremas. Sin perfección. Solo resultados.</span>
            </p>

            <p className="text-fluid-base text-white/55 max-w-xl mx-auto animate-fade-up [animation-delay:200ms]">
              Plan personalizado + app profesional + seguimiento semanal. Adaptado a tu vida real.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2 animate-fade-up [animation-delay:300ms]">
              <MagneticButton strength={0.25}>
                <Link href="/valoracion" className="btn-brand text-fluid-base">
                  Quiero mi plan personalizado
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </MagneticButton>
              <Link href="/recurso-gratis" className="btn-ghost text-fluid-sm">
                Descargar guía gratis
              </Link>
            </div>

            {/* Micro-prueba social */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-8 text-fluid-xs text-white/40 animate-fade-up [animation-delay:400ms]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Valoración gratuita
              </span>
              <span>·</span>
              <span>+100 clientes transformados</span>
              <span>·</span>
              <span>14 años de experiencia</span>
            </div>
          </div>
        </HeroAnimation>
      </section>

      {/* ═══════════════ BENEFICIOS ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-dusk">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <Container>
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center mb-fluid-lg space-y-4">
              <span className="eyebrow">Por qué funciona</span>
              <h2 className="headline text-fluid-4xl text-white">
                Entrenamiento online que <span className="text-gradient-brand">sí da resultados</span>
              </h2>
              <p className="text-fluid-lg text-muted">
                Porque está diseñado para tu vida real, no para la vida que te venden en Instagram.
              </p>
            </div>
          </AnimatedSection>

          <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </Container>
      </section>

      {/* ═══════════════ CÓMO FUNCIONA ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-deep">
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
      <section className="relative py-fluid-xl bg-brand-dusk overflow-x-clip">
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
                  Trabajo con software profesional — no con PDFs ni hojas de Excel. Así te doy la mejor experiencia.
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

      {/* ═══════════════ TESTIMONIOS ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-deep">
        <Container>
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center mb-fluid-lg space-y-4">
              <span className="eyebrow">Historias reales</span>
              <h2 className="headline text-fluid-4xl text-white">
                Lo que <span className="text-gradient-brand">cambió</span> para ellos
              </h2>
              <p className="text-fluid-lg text-muted">
                Personas normales con vidas ocupadas. Resultados que duran porque el proceso funciona.
              </p>
            </div>
          </AnimatedSection>

          <StaggerChildren className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {TESTIMONIALS.map(({ text, name, result }, i) => (
              <figure
                key={i}
                className="surface-card rounded-2xl p-8 relative hover-lift"
              >
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
                <figcaption className="flex items-center justify-between gap-4 mt-6 pt-5 border-t border-border-subtle">
                  <span className="text-fluid-sm font-semibold text-white">{name}</span>
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
      <section className="relative py-fluid-xl bg-brand-dusk">
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
            {PLANS.map(({ name, price, period, desc, popular }, i) => (
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
                <Link
                  href="/tarifas"
                  className={
                    'mt-auto inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-fluid-sm transition-all ' +
                    (popular
                      ? 'btn-brand'
                      : 'border border-border text-white hover:bg-accent-muted hover:border-border-strong')
                  }
                >
                  Ver detalles
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </article>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* ═══════════════ CTA FINAL ═══════════════ */}
      <section className="relative py-fluid-xl overflow-hidden">
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
              Valoración profesional <span className="text-accent font-bold">gratis</span>. Analizamos tu caso y te digo si puedo ayudarte.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-2">
              <MagneticButton strength={0.25}>
                <Link href="/valoracion" className="btn-brand text-fluid-lg px-12 py-5">
                  Quiero empezar
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </MagneticButton>
              <Link href="/recurso-gratis" className="btn-ghost text-fluid-sm">
                Primero quiero la guía gratis
              </Link>
            </div>
            <p className="text-fluid-xs text-white/35 pt-4">
              Sin compromiso. Sin letra pequeña. Respondo personalmente en 24h.
            </p>
          </div>
        </AnimatedSection>
      </section>
    </>
  )
}
