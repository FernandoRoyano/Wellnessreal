'use client'

import { useState } from 'react'
import { ChevronDown, ArrowRight } from 'lucide-react'

type Plan = {
  id: string
  badge: string
  badgeTone: 'neutral' | 'accent' | 'outline'
  question: string
  description: string
  highlights: string[]
  ctaLabel: string
  ctaHref: string
}

const PLANS: Plan[] = [
  {
    id: 'pack3',
    badge: 'Entrada',
    badgeTone: 'neutral',
    question: '¿Quieres probar el método con compromiso razonable?',
    description:
      '3 meses es el mínimo que acepto. Es el tiempo real que necesita el cuerpo para empezar a responder y los hábitos para empezar a asentarse. No es magia — es biología. La mayoría de los resultados tangibles aparecen en este rango.',
    highlights: [
      '12 semanas de seguimiento con ajustes semanales',
      'Pautas nutricionales básicas incluidas',
      'Revisión mensual en profundidad',
      'Valoración inicial gratuita',
    ],
    ctaLabel: 'Ver precio del Pack 3 meses',
    ctaHref: '#pack3',
  },
  {
    id: 'pack6',
    badge: 'Más elegido',
    badgeTone: 'accent',
    question: '¿Quieres resultados que se queden y no volver al punto de partida?',
    description:
      '6 meses es el tiempo necesario para que los cambios se consoliden de verdad. No es un programa "rápido" — es el tiempo real en el que los hábitos se vuelven automáticos y dejan de depender de fuerza de voluntad. El que más eligen los que van en serio.',
    highlights: [
      '26 semanas de seguimiento continuo',
      'Adaptaciones al plan según evoluciona tu vida',
      'El mejor precio mensual del catálogo (125€/mes)',
      'El compromiso largo es el que cambia cosas',
    ],
    ctaLabel: 'Ver precio del Pack 6 meses',
    ctaHref: '#pack6',
  },
  {
    id: 'premium',
    badge: 'Premium',
    badgeTone: 'outline',
    question: '¿Quieres máxima atención, videollamada semanal y nutrición completa?',
    description:
      'Para quien quiere el nivel más alto de personalización y no quiere dejar ningún cabo suelto. Videollamada semanal para revisar todo en detalle, plan nutricional completo integrado con el entrenamiento, y acceso directo cuando lo necesites.',
    highlights: [
      'Videollamada semanal de seguimiento — no solo mensajes',
      'Plan nutricional completo y personalizado incluido',
      'Soporte prioritario con respuesta en menos de 24h',
      'Análisis mensual completo de composición corporal',
    ],
    ctaLabel: 'Ver precio del Premium',
    ctaHref: '#premium',
  },
]

const BADGE_STYLES: Record<Plan['badgeTone'], string> = {
  neutral: 'bg-brand-night text-muted border border-border-subtle',
  accent:  'bg-accent text-accent-fg font-bold border border-accent',
  outline: 'bg-brand-night text-accent border border-accent/60',
}

export default function PlanSelector() {
  const [openId, setOpenId] = useState<string | null>(null)
  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-4 mb-fluid-md">
        <span className="eyebrow">Orientación</span>
        <h2 className="headline text-fluid-3xl text-white">
          ¿Por dónde <span className="text-gradient-brand">empezar?</span>
        </h2>
        <p className="text-fluid-base text-muted leading-relaxed">
          Elige según tu situación — cada plan está pensado para un momento concreto.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {PLANS.map((plan) => {
          const isOpen = openId === plan.id
          return (
            <div
              key={plan.id}
              className={
                'rounded-2xl overflow-hidden transition-all duration-300 border bg-brand-deep ' +
                (isOpen ? 'border-border-strong shadow-lg' : 'border-border-subtle')
              }
            >
              <button
                type="button"
                onClick={() => toggle(plan.id)}
                aria-expanded={isOpen}
                className={
                  'w-full flex items-center justify-between gap-3 px-5 py-5 text-left transition-colors duration-200 ' +
                  (isOpen ? 'bg-brand-dusk' : 'hover:bg-brand-dusk/60')
                }
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span
                    className={
                      'text-fluid-xs font-medium px-3 py-1 rounded-full whitespace-nowrap shrink-0 ' +
                      BADGE_STYLES[plan.badgeTone]
                    }
                  >
                    {plan.badge}
                  </span>
                  <span className="text-fluid-sm md:text-fluid-base font-medium text-white leading-snug">
                    {plan.question}
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={
                    'text-muted flex-shrink-0 transition-transform duration-300 ' +
                    (isOpen ? 'rotate-180 text-accent' : '')
                  }
                />
              </button>

              <div
                className={
                  'grid transition-[grid-template-rows] duration-300 ease-out ' +
                  (isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')
                }
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 bg-brand-dusk">
                    <p className="text-fluid-sm text-muted leading-relaxed mb-4">{plan.description}</p>
                    <ul className="flex flex-col gap-2.5 mb-5">
                      {plan.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-3 text-fluid-sm text-white/85">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                          <span className="leading-relaxed">{h}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={plan.ctaHref}
                      className="inline-flex items-center gap-2 text-fluid-sm font-semibold rounded-xl px-5 py-2.5 bg-accent text-accent-fg hover:brightness-110 transition-all hover:gap-3"
                    >
                      {plan.ctaLabel}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
