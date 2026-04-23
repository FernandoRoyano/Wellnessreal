import Container from '@/components/common/Container'
import Link from 'next/link'
import Image from 'next/image'
import {
  Smartphone, Utensils, Bone, Dumbbell, Video, BarChart3,
  RefreshCw, MessageCircle, MapPin, Quote, ArrowRight, Sparkles,
} from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import JsonLd, { breadcrumbSchema } from '@/components/seo/JsonLd'
import HeroAnimation from '@/components/animations/HeroAnimation'
import AnimatedSection from '@/components/animations/AnimatedSection'
import StaggerChildren from '@/components/animations/StaggerChildren'
import MagneticButton from '@/components/animations/MagneticButton'

export const metadata = buildMetadata({
  title: 'Servicios | Entrenamiento, Nutrición y Osteopatía',
  description:
    'Servicios de entrenamiento online personalizado, nutrición adaptada y osteopatía. Planes flexibles para gente con vida real. Sin extremos, solo resultados.',
  path: '/servicios',
  keywords: [
    'servicios entrenamiento online',
    'nutrición personalizada online',
    'osteopatía Madrid',
    'entrenador personal online',
    'entrenamiento presencial Madrid',
  ],
})

const MAIN_SERVICE_FEATURES = [
  { icon: Smartphone,    text: 'Plan 100% personalizado en app móvil profesional' },
  { icon: Video,         text: 'Vídeos explicativos de cada ejercicio' },
  { icon: BarChart3,     text: 'Tracking automático de tu progreso' },
  { icon: RefreshCw,     text: 'Revisión y ajuste semanal' },
  { icon: MessageCircle, text: 'Soporte directo cuando lo necesites' },
  { icon: MapPin,        text: 'Adaptado a casa, gimnasio o donde entrenes' },
] as const

const OTHER_SERVICES = [
  {
    icon: Dumbbell,
    title: 'Entrenamiento presencial',
    href: '/servicios/entrenamiento-personalizado',
    desc: 'Sesiones individuales en Madrid donde te guío en cada ejercicio. Técnica perfecta, corrección en tiempo real, motivación constante. Ideal si prefieres el contacto directo o estás en una fase inicial donde la supervisión marca la diferencia.',
  },
  {
    icon: Utensils,
    title: 'Nutrición personalizada',
    href: '/servicios/nutricion',
    desc: 'Pautas adaptadas a tu vida real — tus horarios, tus gustos, tu contexto. Sin dietas imposibles, sin prohibiciones absurdas, sin contar calorías de por vida. Un sistema nutricional que puedas sostener y que trabaje en la misma dirección que tu entrenamiento.',
  },
  {
    icon: Bone,
    title: 'Osteopatía',
    href: '/servicios/osteopatia',
    desc: 'Recuperación de lesiones, alivio de tensiones crónicas y optimización del rendimiento físico. La pieza que muchos entrenamientos ignoran. Sesiones presenciales en Madrid.',
  },
] as const

const TESTIMONIALS = [
  {
    text: 'Llevaba años probando cosas por mi cuenta. Lo que cambió con WellnessReal fue tener a alguien que entiende realmente mi situación y ajusta el plan cuando la vida se complica. Eso no lo da ninguna app.',
    author: 'Cliente online, 38 años',
  },
  {
    text: 'Pensaba que no tenía tiempo para esto. Con 45 minutos tres veces a la semana he conseguido más que en años de ir al gimnasio sin rumbo.',
    author: 'Cliente online, 43 años',
  },
] as const

export default function ServiciosPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Inicio',    url: 'https://wellnessreal.es' },
          { name: 'Servicios', url: 'https://wellnessreal.es/servicios' },
        ])}
      />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative py-fluid-xl overflow-hidden bg-brand-deep">
        <div className="absolute inset-0 bg-radial-accent opacity-80" />
        <div className="absolute inset-0 bg-grid-soft opacity-40" />
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full bg-brand-violet/20 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <Container>
          <HeroAnimation>
            <div className="relative max-w-4xl space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-subtle bg-accent-muted backdrop-blur-sm animate-fade-in">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span className="text-fluid-xs font-semibold tracking-wider uppercase text-accent">
                  Qué ofrezco
                </span>
              </div>

              <h1 className="headline text-fluid-7xl text-white animate-fade-up">
                Entrenamiento y nutrición
                <br className="hidden sm:block" />
                <span className="text-gradient-brand">para tu vida real.</span>
              </h1>

              <p className="text-fluid-xl text-white/85 leading-relaxed max-w-2xl font-medium animate-fade-up [animation-delay:100ms]">
                Sin excusas de tiempo. Sin planes imposibles.{' '}
                <span className="text-accent font-semibold">Solo lo que funciona para ti.</span>
              </p>
            </div>
          </HeroAnimation>
        </Container>
      </section>

      {/* ═══════════════ SERVICIO PRINCIPAL ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-dusk">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <Container>
          <AnimatedSection y={80} duration={1}>
            <div className="surface-card-accent rounded-2xl overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0 items-stretch">
                <div className="relative h-72 md:h-full min-h-[24rem]">
                  <Image
                    src="/images/portada-WR.jpg"
                    alt="Entrenamiento online"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-deep/30 via-transparent to-transparent md:bg-gradient-to-l md:from-brand-deep md:via-brand-deep/30 md:to-transparent" />
                </div>

                <div className="p-fluid-md flex flex-col justify-center space-y-5">
                  <span className="eyebrow">Servicio principal</span>
                  <h2 className="headline text-fluid-4xl text-white">
                    Entrenamiento <span className="text-gradient-brand">online</span>
                  </h2>
                  <p className="text-fluid-base text-muted leading-relaxed">
                    Tu plan personalizado en una app profesional. Entrena cuando puedas, donde quieras, con seguimiento
                    real cada semana. No es una rutina de YouTube ni un PDF genérico — es un plan diseñado para ti
                    (tu horario, tu material, tu nivel, tu objetivo) con ajustes semanales según cómo vas evolucionando.
                  </p>

                  <ul className="space-y-3 pt-2">
                    {MAIN_SERVICE_FEATURES.map(({ icon: Icon, text }, i) => (
                      <li key={i} className="flex items-start gap-3 text-fluid-sm text-white/85">
                        <span className="shrink-0 mt-0.5 w-8 h-8 rounded-lg bg-accent-muted border border-border-subtle flex items-center justify-center">
                          <Icon className="w-4 h-4 text-accent" strokeWidth={2.2} />
                        </span>
                        <span className="leading-relaxed">{text}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-3">
                    <Link href="/tarifas" className="btn-brand text-fluid-base">
                      Ver tarifas
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* ═══════════════ OTROS SERVICIOS ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-deep">
        <Container>
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-fluid-lg">
              <span className="eyebrow justify-center">Más opciones</span>
              <h2 className="headline text-fluid-4xl text-white">
                Otros <span className="text-gradient-brand">servicios</span>
              </h2>
              <p className="text-fluid-lg text-muted leading-relaxed">
                Complementos que funcionan solos o combinados con el plan online.
              </p>
            </div>
          </AnimatedSection>

          <StaggerChildren className="grid md:grid-cols-3 gap-6">
            {OTHER_SERVICES.map(({ icon: Icon, title, desc, href }, i) => (
              <article key={i} className="group surface-card hover-lift rounded-2xl p-7 flex flex-col relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-accent/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex flex-col flex-1">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-accent-muted border border-border-strong mb-5 group-hover:scale-110 group-hover:rotate-[-3deg] transition-transform duration-300">
                    <Icon className="w-5 h-5 text-accent" strokeWidth={2.2} />
                  </div>
                  <h3 className="text-fluid-2xl text-white mb-3 tracking-tight">{title}</h3>
                  <p className="text-fluid-sm text-muted leading-relaxed mb-6 flex-1">{desc}</p>
                  <Link
                    href={href}
                    className="inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-fluid-sm border border-border-strong text-accent hover:bg-accent hover:text-accent-fg transition-all"
                  >
                    Más información
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* ═══════════════ DIFERENCIAL ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-dusk overflow-hidden">
        <div className="absolute inset-0 bg-radial-violet opacity-70" />
        <Container>
          <AnimatedSection>
            <div className="relative max-w-3xl mx-auto text-center space-y-6">
              <span className="eyebrow justify-center">Por qué es diferente</span>
              <h2 className="headline text-fluid-4xl text-white mb-4">
                La diferencia <span className="text-gradient-brand">está en el criterio.</span>
              </h2>
              <p className="text-fluid-lg text-muted leading-relaxed">
                Hay cientos de entrenadores online. La diferencia no está en la app ni en los vídeos — está en el criterio.
              </p>
              <p className="text-fluid-lg text-muted leading-relaxed">
                Llevo más de 10 años en esto. He visto qué funciona y qué no. No sigo modas — sigo principios. No te voy a
                poner el ejercicio viral de Instagram si no tiene sentido para tu caso. No te voy a dar una dieta de moda
                si no encaja con tu vida.
              </p>
              <p className="text-fluid-lg text-muted leading-relaxed">
                Lo que sí voy a hacer es analizar tu contexto en profundidad, diseñar algo específico para ti y estar ahí
                cada semana para asegurarme de que avanzas. Más de 100 personas han pasado por este proceso.{' '}
                <span className="text-white font-semibold">Todas han cambiado algo más que el cuerpo.</span>
              </p>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* ═══════════════ TESTIMONIOS ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-deep">
        <Container>
          <StaggerChildren className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {TESTIMONIALS.map((t, i) => (
              <figure key={i} className="surface-card rounded-2xl p-8 hover-lift">
                <Quote className="w-6 h-6 text-accent mb-4" />
                <blockquote className="text-fluid-base text-white/90 italic leading-relaxed mb-5">
                  {t.text}
                </blockquote>
                <figcaption className="text-fluid-sm font-semibold text-white pt-4 border-t border-border-subtle">
                  — {t.author}
                </figcaption>
              </figure>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* ═══════════════ LEAD MAGNET ═══════════════ */}
      <section className="relative py-fluid-lg bg-brand-dusk">
        <Container>
          <AnimatedSection>
            <div className="max-w-3xl mx-auto surface-card-accent rounded-2xl p-fluid-md text-center space-y-5">
              <h2 className="headline text-fluid-3xl text-white">
                ¿No sabes por <span className="text-gradient-brand">dónde empezar?</span>
              </h2>
              <p className="text-fluid-lg text-muted max-w-xl mx-auto leading-relaxed">
                Descarga la guía gratuita{' '}
                <span className="text-accent font-semibold">&ldquo;Fitness real para gente con vida real&rdquo;</span>.
                Te ayudará a entender qué necesitas.
              </p>
              <div className="pt-2">
                <Link href="/recurso-gratis" className="btn-brand text-fluid-base">
                  Descargar guía gratis
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* ═══════════════ CTA FINAL ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-deep overflow-hidden">
        <div className="absolute inset-0 bg-grid-soft opacity-30" />
        <div className="absolute inset-0 bg-radial-accent opacity-50" />
        <Container>
          <AnimatedSection>
            <div className="relative max-w-3xl mx-auto text-center space-y-8">
              <span className="eyebrow justify-center">Hablemos</span>
              <h2 className="headline text-fluid-5xl text-white">
                ¿Hablamos de <span className="text-gradient-brand">tu caso?</span>
              </h2>
              <p className="text-fluid-xl text-muted leading-relaxed max-w-2xl mx-auto">
                Cuéntame tu situación y vemos juntos qué servicio encaja mejor contigo. Sin compromiso.
              </p>
              <div className="pt-2">
                <MagneticButton strength={0.25}>
                  <Link href="/valoracion" className="btn-brand text-fluid-lg px-10 py-5">
                    Solicitar valoración gratuita
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </MagneticButton>
              </div>
              <p className="text-fluid-xs text-white/40 pt-2">
                Sin compromiso. Respondo personalmente en 24h.
              </p>
            </div>
          </AnimatedSection>
        </Container>
      </section>
    </>
  )
}
