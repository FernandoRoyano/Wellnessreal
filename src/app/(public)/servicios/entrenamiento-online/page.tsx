import Image from 'next/image'
import Container from '@/components/common/Container'
import Link from 'next/link'
import { Check, Smartphone, Clock, Target, MessageCircle, ArrowRight, Sparkles } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import JsonLd, { serviceSchema, breadcrumbSchema } from '@/components/seo/JsonLd'

export const metadata = buildMetadata({
  title: 'Entrenamiento Online Personalizado',
  description:
    'Entrenamiento personalizado 100% online con app profesional. Seguimiento semanal, vídeos explicativos y plan adaptado a tu vida real. Sin horarios fijos.',
  path: '/servicios/entrenamiento-online',
  keywords: [
    'entrenamiento online personalizado',
    'entrenador personal online',
    'app entrenamiento personalizado',
    'plan entrenamiento online',
    'fitness online',
  ],
})

const STEPS = [
  { step: '01', title: 'Hablamos',       desc: 'Me cuentas tu situación, objetivos y disponibilidad. Sin compromiso.' },
  { step: '02', title: 'Diseño tu plan', desc: 'Creo un programa 100% personalizado a tu contexto.' },
  { step: '03', title: 'Entrenas',       desc: 'Sigues tu plan desde la app. Vídeos, instrucciones, todo claro.' },
  { step: '04', title: 'Ajustamos',      desc: 'Cada semana revisamos y adaptamos según tu evolución.' },
] as const

const INCLUDED = [
  { icon: Smartphone,    title: 'App profesional',        desc: 'Tu plan en iOS/Android con vídeos explicativos, tracking de progreso y recordatorios.' },
  { icon: Target,        title: 'Plan 100% personalizado', desc: 'Diseñado para tu objetivo, tu nivel, tu material disponible y tu tiempo.' },
  { icon: Clock,         title: 'Flexibilidad total',     desc: 'Sin horarios fijos. Entrenas cuando te venga bien, yo superviso tu progreso.' },
  { icon: MessageCircle, title: 'Soporte directo',        desc: 'Dudas, ajustes, motivación. Estoy disponible cuando me necesites.' },
] as const

const FIT_ITEMS = [
  'Tienes poco tiempo pero quieres resultados reales',
  'Prefieres entrenar en casa, en el gimnasio o donde sea',
  'Quieres un plan adaptado a TU situación, no algo genérico',
  'Valoras tener a alguien que te guíe y te ajuste el plan',
  'Has probado apps o rutinas de internet sin éxito',
] as const

export default function EntrenamientoOnlinePage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'Entrenamiento Online Personalizado',
          description: 'Plan de entrenamiento personalizado con app profesional, seguimiento semanal y vídeos explicativos.',
          url: 'https://wellnessreal.es/servicios/entrenamiento-online',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Inicio',               url: 'https://wellnessreal.es' },
          { name: 'Servicios',            url: 'https://wellnessreal.es/servicios' },
          { name: 'Entrenamiento Online', url: 'https://wellnessreal.es/servicios/entrenamiento-online' },
        ])}
      />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative py-fluid-xl overflow-hidden bg-brand-deep">
        <div className="absolute inset-0 bg-radial-accent opacity-70" />
        <div className="absolute inset-0 bg-grid-soft opacity-40" />
        <Container>
          <div className="relative grid md:grid-cols-2 gap-fluid-md items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-subtle bg-accent-muted backdrop-blur-sm animate-fade-in">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span className="text-fluid-xs font-semibold tracking-wider uppercase text-accent">
                  Servicio principal
                </span>
              </div>

              <h1 className="headline text-fluid-6xl text-white animate-fade-up">
                Entrenamiento <span className="text-gradient-brand">online.</span>
              </h1>

              <p className="text-fluid-xl text-white/85 leading-relaxed max-w-xl font-medium animate-fade-up [animation-delay:100ms]">
                Tu plan personalizado en una app profesional. Entrena cuando puedas, donde quieras, con seguimiento real
                cada semana.{' '}
                <span className="text-accent font-semibold">Adaptado a tu vida, no al revés.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up [animation-delay:200ms]">
                <Link href="/valoracion" className="btn-brand text-fluid-base">
                  Solicitar valoración gratuita
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/tarifas" className="btn-ghost text-fluid-base">
                  Ver tarifas
                </Link>
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="absolute -inset-8 bg-accent/10 rounded-full blur-3xl" />
              <Image
                src="/images/wr_app_interface.png"
                alt="App de entrenamiento online"
                width={350}
                height={450}
                className="relative rounded-2xl border border-border-strong shadow-xl"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ CÓMO FUNCIONA ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-dusk">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-fluid-lg">
            <span className="eyebrow justify-center">Cuatro pasos</span>
            <h2 className="headline text-fluid-4xl text-white">¿Cómo funciona?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {STEPS.map((item, i) => (
              <article key={i} className="surface-card rounded-2xl p-7 text-center hover-lift">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 stat-figure text-fluid-xl bg-accent text-accent-fg"
                  style={{ boxShadow: '0 10px 28px -8px rgba(252, 238, 33, 0.5)' }}
                >
                  {item.step}
                </div>
                <h3 className="text-fluid-lg text-white mb-2 tracking-tight">{item.title}</h3>
                <p className="text-fluid-sm text-muted leading-relaxed">{item.desc}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════ QUÉ INCLUYE ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-deep">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-fluid-lg">
            <span className="eyebrow justify-center">Lo que llevas</span>
            <h2 className="headline text-fluid-4xl text-white">¿Qué incluye?</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {INCLUDED.map(({ icon: Icon, title, desc }, i) => (
              <article key={i} className="surface-card rounded-2xl p-6 flex items-start gap-4 hover-lift">
                <span className="shrink-0 w-12 h-12 rounded-xl bg-accent-muted border border-border-strong flex items-center justify-center">
                  <Icon className="w-5 h-5 text-accent" strokeWidth={2.2} />
                </span>
                <div>
                  <h3 className="text-fluid-lg text-white mb-2 tracking-tight">{title}</h3>
                  <p className="text-fluid-sm text-muted leading-relaxed">{desc}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════ PARA QUIÉN ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-dusk">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-4 mb-fluid-md">
              <span className="eyebrow justify-center">Encaja contigo si</span>
              <h2 className="headline text-fluid-4xl text-white">
                Esto es <span className="text-gradient-brand">para ti si...</span>
              </h2>
            </div>

            <div className="space-y-3">
              {FIT_ITEMS.map((item, i) => (
                <div key={i} className="surface-card rounded-2xl flex items-start gap-4 p-5">
                  <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-accent" strokeWidth={3} />
                  </span>
                  <span className="text-fluid-base text-white/90 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ LEAD MAGNET ═══════════════ */}
      <section className="relative py-fluid-lg bg-brand-deep">
        <Container>
          <div className="max-w-3xl mx-auto surface-card-accent rounded-2xl p-fluid-md text-center space-y-5">
            <h2 className="headline text-fluid-3xl text-white">
              ¿Todavía <span className="text-gradient-brand">no lo tienes claro?</span>
            </h2>
            <p className="text-fluid-lg text-muted max-w-xl mx-auto leading-relaxed">
              Descarga la guía gratuita{' '}
              <span className="text-accent font-semibold">&ldquo;Fitness real para gente con vida real&rdquo;</span>.
            </p>
            <div className="pt-2">
              <Link href="/recurso-gratis" className="btn-brand text-fluid-base">
                Descargar guía gratis
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ CTA FINAL ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-dusk overflow-hidden">
        <div className="absolute inset-0 bg-radial-accent opacity-40" />
        <Container>
          <div className="relative max-w-3xl mx-auto text-center space-y-8">
            <span className="eyebrow justify-center">Último paso</span>
            <h2 className="headline text-fluid-5xl text-white">
              ¿<span className="text-gradient-brand">Empezamos?</span>
            </h2>
            <p className="text-fluid-xl text-muted leading-relaxed max-w-2xl mx-auto">
              La valoración inicial es gratuita. Me cuentas tu situación y vemos si puedo ayudarte. Sin compromiso.
            </p>
            <div className="pt-2">
              <Link href="/valoracion" className="btn-brand text-fluid-lg px-10 py-5">
                Solicitar valoración gratuita
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
