'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import AnimatedSection from '@/components/animations/AnimatedSection'
import MagneticButton from '@/components/animations/MagneticButton'

export default function FinalCTA() {
  return (
    <AnimatedSection>
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-4xl font-extrabold gradient-text mb-6 leading-tight">
          Si encajas con lo que has visto,<br />
          aquí empieza
        </h2>
        <p className="text-gray-300 text-base md:text-lg mb-3 leading-relaxed">
          Rellena la valoración — son 2 minutos. Yo la leo personalmente y,
          si creo que puedo ayudarte, te contacto en menos de 24h.
        </p>
        <p className="text-gray-500 text-sm mb-10">
          Si no encajas con lo que hago, también te lo digo. Sin presión, sin venta agresiva.
        </p>

        <MagneticButton strength={0.2}>
          <Link href="/valoracion">
            <button
              className="inline-flex items-center gap-3 px-8 md:px-10 py-5 md:py-6 rounded-full text-lg md:text-xl font-extrabold transition-transform duration-200 hover:scale-105"
              style={{
                backgroundColor: '#FCEE21',
                color: '#16122B',
                boxShadow: '0 0 40px rgba(252, 238, 33, 0.4)',
              }}
            >
              Solicitar mi valoración gratuita
              <ArrowRight size={22} />
            </button>
          </Link>
        </MagneticButton>

        <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-gray-500">
          <span>✓ Sin compromiso</span>
          <span>✓ Sin pago por adelantado</span>
          <span>✓ Respuesta personal en &lt;24h</span>
        </div>
      </div>
    </AnimatedSection>
  )
}
