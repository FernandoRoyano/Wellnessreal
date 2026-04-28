'use client'

import { useEffect } from 'react'
import { Check, ArrowRight } from 'lucide-react'
import Container from '@/components/common/Container'
import { trackViewPricing, trackClickPlan } from '@/lib/analytics'
import { useStagger, useReveal } from '@/hooks/useGSAP'

const PHONE = '34633261963'

function whatsappUrl(plan: string) {
  const msg = `Hola, me interesa el plan ${plan}. Me gustaría recibir más información.`
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`
}

type PlanProps = {
  id: string
  name: string
  subtitle: string
  description: string
  price: string
  periodLabel: string
  monthly: string
  features: string[]
  cta: string
  trackId: string
  featured?: boolean
  bestPriceNote?: string
}

function PlanCard({ plan }: { plan: PlanProps }) {
  return (
    <div
      id={plan.id}
      className={
        'relative rounded-2xl p-8 flex flex-col scroll-mt-24 transition-all duration-300 ' +
        (plan.featured
          ? 'surface-card-accent md:-translate-y-3 md:scale-[1.03] shadow-xl'
          : 'surface-card hover:-translate-y-1')
      }
    >
      {plan.featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-fg text-fluid-xs font-bold px-4 py-1.5 rounded-full tracking-wide uppercase shadow-lg whitespace-nowrap">
          Más elegido
        </span>
      )}

      <div className="mb-6">
        <h3 className="text-fluid-2xl text-white tracking-tight">{plan.name}</h3>
        <p className="text-fluid-sm text-accent font-semibold mt-1">{plan.subtitle}</p>
        <p className="text-fluid-sm text-muted mt-2 leading-relaxed">{plan.description}</p>
      </div>

      <div className="mb-6 pb-6 border-b border-border-subtle">
        <div className="flex items-baseline gap-1">
          <span className="stat-figure text-fluid-6xl text-accent">{plan.price}</span>
          <span className="text-fluid-xl text-accent font-bold">€</span>
          <span className="text-fluid-sm text-muted ml-2">/ {plan.periodLabel}</span>
        </div>
        <p className={'text-fluid-xs mt-1 ' + (plan.bestPriceNote ? 'text-success font-semibold' : 'text-subtle')}>
          {plan.bestPriceNote ?? `${plan.monthly}/mes`}
        </p>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-3 text-fluid-sm text-white/85">
            <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center">
              <Check className="w-3 h-3 text-accent" strokeWidth={3} />
            </span>
            <span className="leading-relaxed">{f}</span>
          </li>
        ))}
      </ul>

      <a
        href={whatsappUrl(`${plan.name} (${plan.price}€)`)}
        onClick={() => trackClickPlan(plan.trackId)}
        target="_blank"
        rel="noopener noreferrer"
        className={
          'mt-auto inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-fluid-sm transition-all ' +
          (plan.featured
            ? 'btn-brand'
            : 'border border-border text-white hover:bg-accent-muted hover:border-border-strong')
        }
      >
        {plan.cta}
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  )
}

const ONLINE_PLANS: PlanProps[] = [
  {
    id: 'pack3',
    name: 'Pack 3 meses',
    subtitle: 'Entrenamiento online',
    description: 'La entrada estándar. El tiempo mínimo para que los cambios empiecen a asentarse.',
    price: '450',
    periodLabel: '3 meses',
    monthly: '150€',
    features: [
      'Plan 100% personalizado en app profesional',
      '12 semanas de seguimiento con ajustes semanales',
      'Vídeos explicativos de cada ejercicio',
      'Revisión mensual en profundidad',
      'Pautas nutricionales básicas incluidas',
      'Valoración inicial gratuita',
    ],
    cta: 'Quiero empezar',
    trackId: 'pack_3meses',
  },
  {
    id: 'pack6',
    name: 'Pack 6 meses',
    subtitle: 'Transformación online',
    description:
      '6 meses es el tiempo real en el que los hábitos se consolidan y los resultados se quedan. El que más eligen los que van en serio.',
    price: '750',
    periodLabel: '6 meses',
    monthly: '125€',
    features: [
      'Todo lo del Pack 3 meses',
      '26 semanas de seguimiento continuo',
      'Adaptaciones al plan según evoluciona tu vida',
      'Tiempo real para consolidar hábitos que se quedan',
      'Mejor precio mensual del catálogo',
      'Pautas nutricionales básicas incluidas',
    ],
    cta: 'Elegir este plan',
    trackId: 'pack_6meses_transformacion',
    featured: true,
    bestPriceNote: '125€/mes — mejor precio mensual',
  },
  {
    id: 'premium',
    name: 'Premium',
    subtitle: 'Acompañamiento 1-a-1',
    description:
      'El máximo nivel de atención. Videollamada semanal conmigo, plan nutricional completo y respuesta inmediata. Pensado para quien quiere ir en serio y necesita acompañamiento real.',
    price: '990',
    periodLabel: '3 meses',
    monthly: '330€',
    features: [
      'Sesión inicial 1-a-1 de 90 minutos para mapear objetivos, historial y calendario real',
      'Videollamada semanal de 30-45 min conmigo (slot fijo reservado)',
      'Plan nutricional completo: macros, menú semanal, lista de la compra y recetas',
      'WhatsApp prioritario directo conmigo: respuesta en menos de 2h en horario laboral',
      'Revisión quincenal del plan (no mensual): ajustes más finos y rápidos',
      'Análisis de composición corporal mensual con protocolo guiado',
      'Adaptación express ante viajes, lesiones o imprevistos en menos de 24h',
    ],
    cta: 'Consultar disponibilidad',
    trackId: 'premium_3meses',
  },
]

type ExtraProps = {
  name: string
  description: string
  price: string
  unit: string
  trackId: string
}

function ExtraCard({ item }: { item: ExtraProps }) {
  return (
    <div className="surface-card rounded-2xl p-8 flex flex-col hover-lift">
      <h3 className="text-fluid-xl text-white mb-2 tracking-tight">{item.name}</h3>
      <p className="text-fluid-sm text-muted mb-6 flex-grow leading-relaxed">{item.description}</p>
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="stat-figure text-fluid-4xl text-accent">{item.price}</span>
          <span className="text-fluid-lg text-accent font-bold">€</span>
          <span className="text-fluid-sm text-muted ml-2">/ {item.unit}</span>
        </div>
      </div>
      <a
        href={whatsappUrl(`${item.name} (${item.price}€)`)}
        onClick={() => trackClickPlan(item.trackId)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-fluid-sm border border-border-strong text-accent hover:bg-accent hover:text-accent-fg transition-all"
      >
        Reservar
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  )
}

function SectionLabel({ variant, children }: { variant: 'online' | 'presencial'; children: React.ReactNode }) {
  const styles =
    variant === 'online'
      ? 'border-success/40 text-success bg-success/10'
      : 'border-blue-400/40 text-blue-300 bg-blue-400/10'
  return (
    <div className="flex items-center gap-4 mb-fluid-sm">
      <span
        className={
          'text-fluid-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full whitespace-nowrap border ' +
          styles
        }
      >
        {children}
      </span>
      <div className="flex-1 h-px bg-border-subtle" />
    </div>
  )
}

export default function PricingCards() {
  const onlineCardsRef = useStagger<HTMLDivElement>({ y: 60, stagger: 0.15, duration: 0.8 })
  const nutricionRef   = useReveal<HTMLDivElement>({ y: 50 })
  const presencialRef  = useStagger<HTMLDivElement>({ y: 50, stagger: 0.15 })

  useEffect(() => {
    trackViewPricing()
  }, [])

  return (
    <>
      {/* ═══════ Planes online ═══════ */}
      <section className="relative py-fluid-xl bg-brand-dusk">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <Container>
          <SectionLabel variant="online">Online · España</SectionLabel>
          <div ref={onlineCardsRef} className="grid md:grid-cols-3 gap-6 items-stretch">
            {ONLINE_PLANS.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════ Nutrición online ═══════ */}
      <section className="relative py-fluid-lg bg-brand-deep">
        <Container>
          <SectionLabel variant="online">Online · España</SectionLabel>
          <div ref={nutricionRef} className="max-w-md">
            <ExtraCard
              item={{
                name: 'Consulta Nutrición',
                description:
                  'Sesión individual para diseñar tus pautas nutricionales adaptadas a tu objetivo y contexto.',
                price: '50',
                unit: 'sesión',
                trackId: 'consulta_nutricion',
              }}
            />
          </div>
        </Container>
      </section>

      {/* ═══════ Presencial Madrid ═══════ */}
      <section className="relative py-fluid-lg bg-brand-dusk">
        <Container>
          <SectionLabel variant="presencial">Presencial · Madrid</SectionLabel>
          <div ref={presencialRef} className="grid md:grid-cols-2 gap-6 max-w-3xl">
            <ExtraCard
              item={{
                name: 'Análisis Corporal',
                description: 'Medición de composición corporal y seguimiento de cambios reales en tu físico.',
                price: '40',
                unit: 'sesión',
                trackId: 'analisis_corporal',
              }}
            />
            <ExtraCard
              item={{
                name: 'Sesión Osteopatía',
                description: 'Tratamiento de lesiones y recuperación. Sesión presencial en Madrid.',
                price: '60',
                unit: 'sesión',
                trackId: 'sesion_osteopatia',
              }}
            />
          </div>
        </Container>
      </section>
    </>
  )
}
