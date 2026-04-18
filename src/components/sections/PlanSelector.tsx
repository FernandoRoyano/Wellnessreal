'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const plans = [
  {
    id: 'pack3',
    badge: 'Entrada',
    badgeStyle: 'bg-[#1a1535] text-gray-300 border border-[#662D91]',
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
    badgeStyle: 'text-[#16122B] font-bold',
    badgeBg: '#FCEE21',
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
    badgeStyle: 'bg-[#1a1535] text-[#FCEE21] border border-[#FCEE21]',
    question:
      '¿Quieres máxima atención, videollamada semanal y nutrición completa?',
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

export default function PlanSelector() {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 style={{ color: '#FCEE21' }} className="text-3xl md:text-4xl font-bold mb-2">
        ¿Por dónde empezar?
      </h2>
      <p className="text-gray-400 mb-8 text-base">
        Elige según tu situación — cada plan está pensado para un momento concreto.
      </p>

      <div className="flex flex-col gap-3">
        {plans.map((plan) => {
          const isOpen = openId === plan.id
          return (
            <div
              key={plan.id}
              className={`rounded-xl overflow-hidden transition-all duration-300 border ${
                isOpen ? 'border-[#FCEE21]' : 'border-[#662D91]'
              }`}
              style={{ backgroundColor: '#16122B' }}
            >
              {/* Trigger */}
              <button
                onClick={() => toggle(plan.id)}
                className={`w-full flex items-center justify-between gap-3 px-5 py-5 text-left transition-colors duration-200 ${
                  isOpen ? 'bg-[#1a1535]' : ''
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${plan.badgeStyle}`}
                    style={plan.badgeBg ? { backgroundColor: plan.badgeBg } : undefined}
                  >
                    {plan.badge}
                  </span>
                  <span className="text-sm md:text-base font-medium text-gray-200 leading-snug">
                    {plan.question}
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Body */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? 'max-h-[500px]' : 'max-h-0'
                }`}
              >
                <div className="px-5 pb-5 bg-[#1a1535]">
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">
                    {plan.description}
                  </p>
                  <ul className="flex flex-col gap-2 mb-5">
                    {plan.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#FCEE21' }} />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={plan.ctaHref}
                    className="inline-flex items-center gap-1.5 text-sm font-bold rounded-lg px-5 py-2.5 transition-all duration-200 hover:scale-105"
                    style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
                  >
                    {plan.ctaLabel} →
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
