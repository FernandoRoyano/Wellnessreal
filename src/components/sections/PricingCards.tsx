'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, MessageCircle } from 'lucide-react'
import Container from '@/components/common/Container'
import { trackClickPlan, trackViewPricing } from '@/lib/analytics'
import { useReveal } from '@/hooks/useGSAP'

const PHONE = '34633261963'
const SERVICE_ID = 'personal_12_semanas'

const FEATURES = [
  'Valoración inicial individual',
  'Plan de entrenamiento completamente personalizado',
  'Seguimiento semanal y ajustes según tu respuesta',
  'Revisión periódica de objetivos, cargas y contexto',
  'Contacto directo con Fernando dentro de los límites acordados',
] as const

function whatsappUrl() {
  const message = 'Hola, me interesa el entrenamiento personalizado de 12 semanas. Me gustaría saber si encaja conmigo.'
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`
}

export default function PricingCards() {
  const cardRef = useReveal<HTMLDivElement>({ y: 50 })

  useEffect(() => {
    trackViewPricing()
  }, [])

  return (
    <section className="relative bg-brand-dusk py-fluid-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
      <Container>
        <div className="mx-auto mb-fluid-md max-w-3xl text-center">
          <span className="eyebrow justify-center">Plazas limitadas</span>
          <h2 className="headline mt-4 text-fluid-4xl text-white">Entrenamiento personalizado</h2>
          <p className="mt-4 text-fluid-base leading-relaxed text-muted">
            Para quien necesita una programación y un seguimiento completamente individuales. Primero
            revisamos tu caso; si no es el formato adecuado, te lo diré con claridad.
          </p>
        </div>

        <div ref={cardRef} className="surface-card-accent mx-auto max-w-2xl rounded-2xl p-7 md:p-9">
          <div className="border-b border-border-subtle pb-6">
            <p className="text-fluid-sm font-semibold text-accent">Acompañamiento individual · 12 semanas</p>
            <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="stat-figure text-fluid-6xl text-accent">750</span>
              <span className="text-fluid-xl font-bold text-accent">€</span>
              <span className="text-fluid-sm text-muted">pago único</span>
            </div>
            <p className="mt-2 text-fluid-xs text-subtle">También disponible en 3 pagos de 270 €.</p>
          </div>

          <ul className="my-7 grid gap-3 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-fluid-sm text-white/85">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/15">
                  <Check className="h-3 w-3 text-accent" strokeWidth={3} />
                </span>
                <span className="leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <Link
              href={`/valoracion?plan=${SERVICE_ID}`}
              onClick={() => trackClickPlan(SERVICE_ID)}
              className="btn-brand justify-center py-3.5 text-fluid-sm"
            >
              Solicitar valoración individual <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3.5 text-fluid-sm font-semibold text-white transition hover:border-border-strong hover:bg-accent-muted"
            >
              <MessageCircle className="h-4 w-4" /> Consultar
            </a>
          </div>
          <p className="mt-4 text-center text-fluid-xs text-subtle">
            Solicitar la valoración no implica contratar el servicio.
          </p>
        </div>
      </Container>
    </section>
  )
}
