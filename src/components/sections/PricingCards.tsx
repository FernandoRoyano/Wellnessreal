'use client'

import { useEffect } from 'react'
import { Check } from 'lucide-react'
import Container from '@/components/common/Container'
import { trackViewPricing, trackClickPlan } from '@/lib/analytics'
import { useStagger, useReveal } from '@/hooks/useGSAP'

const PHONE = '34633261963'

function whatsappUrl(plan: string) {
  const msg = `Hola, me interesa el plan ${plan}. Me gustaría recibir más información.`
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`
}

export default function PricingCards() {
  const onlineCardsRef = useStagger<HTMLDivElement>({ y: 60, stagger: 0.15, duration: 0.8 })
  const nutricionRef = useReveal<HTMLDivElement>({ y: 50 })
  const presencialRef = useStagger<HTMLDivElement>({ y: 50, stagger: 0.15 })

  useEffect(() => {
    trackViewPricing()
  }, [])

  return (
    <>
      {/* Pricing Cards */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-20 md:py-28">
        <Container>
          {/* Section Label */}
          <div className="flex items-center gap-4 mb-10">
            <span className="text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full whitespace-nowrap border border-green-500/30 text-green-400 bg-green-500/10">
              Online — España
            </span>
            <div className="flex-1 h-px bg-[#662D91]/40" />
          </div>
          <div ref={onlineCardsRef} className="grid md:grid-cols-3 gap-8">
            {/* Pack 3 Meses - Entrada */}
            <div id="pack3" className="rounded-xl p-8 bg-[#16122B] border border-[#662D91] text-center scroll-mt-24">
              <h3 className="text-3xl font-bold mb-2 tracking-widest" style={{ color: '#FCEE21' }}>
                PACK 3 MESES
              </h3>
              <p className="text-gray-400 mb-2">Entrenamiento Online — 3 meses</p>
              <p className="text-gray-300 text-sm mb-4">
                La entrada estándar. El tiempo mínimo para que los cambios empiecen a asentarse.
              </p>
              <div className="mb-8 pb-8 border-b" style={{ borderBottomColor: '#662D91' }}>
                <span className="text-5xl font-bold" style={{ color: '#FCEE21' }}>€450</span>
                <span className="text-gray-400 ml-2">/3 meses</span>
                <p className="text-sm text-gray-400 mt-1">150€/mes</p>
              </div>
              <ul className="space-y-3 mb-8 text-gray-300 text-left mx-auto max-w-xs">
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Plan 100% personalizado en app profesional</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>12 semanas de seguimiento con ajustes semanales</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Vídeos explicativos de cada ejercicio</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Revisión mensual en profundidad</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Pautas nutricionales básicas incluidas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Valoración inicial gratuita</span>
                </li>
              </ul>
              <a
                href={whatsappUrl('Pack 3 Meses (450€)')}
                onClick={() => trackClickPlan('pack_3meses')}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 rounded-lg text-center font-bold text-lg transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: '#FCEE21', color: '#16122B', boxShadow: '0 0 20px rgba(252, 238, 33, 0.3)' }}
              >
                Quiero empezar
              </a>
            </div>

            {/* Pack 6 Meses Transformación - Más popular */}
            <div id="pack6" className="rounded-xl p-8 border-2 border-[#FCEE21] text-center scale-105 bg-[#16122B] shadow-xl scroll-mt-24">
              <div className="mb-4 inline-block px-4 py-1 rounded-full text-sm font-bold tracking-wide" style={{ backgroundColor: '#FCEE21', color: '#16122B' }}>
                MÁS POPULAR
              </div>
              <h3 className="text-3xl font-bold mb-2 tracking-widest" style={{ color: '#FCEE21' }}>
                PACK 6 MESES
              </h3>
              <p className="text-gray-400 mb-2">Transformación — Entrenamiento Online</p>
              <p className="text-gray-300 text-sm mb-4">
                6 meses es el tiempo real en el que los hábitos se consolidan y los resultados se quedan. El que más eligen los que van en serio.
              </p>
              <div className="mb-8 pb-8 border-b" style={{ borderBottomColor: '#662D91' }}>
                <span className="text-5xl font-bold" style={{ color: '#FCEE21' }}>€750</span>
                <span className="text-gray-400 ml-2">/6 meses</span>
                <p className="text-sm text-green-400 mt-1">125€/mes — mejor precio mensual</p>
              </div>
              <ul className="space-y-3 mb-8 text-gray-300 text-left mx-auto max-w-xs">
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Todo lo del Pack 3 meses</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>26 semanas de seguimiento continuo</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Adaptaciones al plan según evoluciona tu vida</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>El tiempo real para consolidar hábitos que se quedan</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Mejor precio mensual del catálogo</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Pautas nutricionales básicas incluidas</span>
                </li>
              </ul>
              <a
                href={whatsappUrl('Pack 6 Meses Transformación (750€)')}
                onClick={() => trackClickPlan('pack_6meses_transformacion')}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 rounded-lg text-center font-bold text-lg transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: '#FCEE21', color: '#16122B', boxShadow: '0 0 20px rgba(252, 238, 33, 0.3)' }}
              >
                Elegir este plan
              </a>
            </div>

            {/* Premium 3M - Máxima intensidad */}
            <div id="premium" className="rounded-xl p-8 bg-[#16122B] border border-[#662D91] text-center scroll-mt-24">
              <h3 className="text-3xl font-bold mb-2 tracking-widest" style={{ color: '#FCEE21' }}>
                PREMIUM
              </h3>
              <p className="text-gray-400 mb-2">Máxima personalización — 3 meses</p>
              <p className="text-gray-300 text-sm mb-4">
                Para quien quiere el máximo nivel de atención y nutrición incluida. Videollamada semanal conmigo.
              </p>
              <div className="mb-8 pb-8 border-b" style={{ borderBottomColor: '#662D91' }}>
                <span className="text-5xl font-bold" style={{ color: '#FCEE21' }}>€750</span>
                <span className="text-gray-400 ml-2">/3 meses</span>
                <p className="text-sm text-gray-400 mt-1">250€/mes</p>
              </div>
              <ul className="space-y-3 mb-8 text-gray-300 text-left mx-auto max-w-xs">
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Todo lo del Pack 3 meses</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Videollamada semanal de seguimiento</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Análisis mensual completo de composición corporal</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Soporte prioritario por WhatsApp (respuesta en menos de 24h)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Plan nutricional completo y personalizado</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Acceso directo para consultas en cualquier momento</span>
                </li>
              </ul>
              <a
                href={whatsappUrl('Premium 3 Meses (750€)')}
                onClick={() => trackClickPlan('premium_3meses')}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 rounded-lg text-center font-bold text-lg transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: '#FCEE21', color: '#16122B', boxShadow: '0 0 20px rgba(252, 238, 33, 0.3)' }}
              >
                Consultar disponibilidad
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Nutrición Online */}
      <section style={{ backgroundColor: '#16122B' }} className="py-16 md:py-20">
        <Container>
          {/* Section Label */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full whitespace-nowrap border border-green-500/30 text-green-400 bg-green-500/10">
              Online — España
            </span>
            <div className="flex-1 h-px bg-[#662D91]/40" />
          </div>
          <div ref={nutricionRef} className="max-w-md">
            <div className="p-8 rounded-xl flex flex-col" style={{ backgroundColor: '#1a1535', border: '1px solid #662D91' }}>
              <h3 style={{ color: '#FCEE21' }} className="text-2xl font-bold mb-2 tracking-wide">
                Consulta Nutrición
              </h3>
              <p className="text-gray-300 mb-6 flex-grow">
                Sesión individual para diseñar tus pautas nutricionales adaptadas a tu objetivo y contexto.
              </p>
              <div className="mb-6">
                <span style={{ color: '#FCEE21' }} className="text-3xl font-bold">€50</span>
                <span className="text-gray-400 ml-2">/ sesión</span>
              </div>
              <a
                href={whatsappUrl('Consulta Nutrición (€50)')}
                onClick={() => trackClickPlan('consulta_nutricion')}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 rounded-lg text-center font-bold transition-all duration-200 border-2 border-[#FCEE21] text-[#FCEE21] hover:bg-[#FCEE21] hover:text-[#16122B] hover:scale-105"
              >
                Reservar
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Presencial Madrid */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-16 md:py-20">
        <Container>
          {/* Section Label */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full whitespace-nowrap border border-blue-500/30 text-blue-400 bg-blue-500/10">
              Presencial — Madrid
            </span>
            <div className="flex-1 h-px bg-[#662D91]/40" />
          </div>
          <div ref={presencialRef} className="grid md:grid-cols-2 gap-8 max-w-3xl">
            {[
              {
                name: 'Análisis Corporal',
                price: '40',
                description: 'Medición de composición corporal y seguimiento de cambios reales en tu físico.',
              },
              {
                name: 'Sesión Osteopatía',
                price: '60',
                description: 'Tratamiento de lesiones y recuperación. Sesión presencial en Madrid.',
              },
            ].map((service, i) => (
              <div key={i} className="p-8 rounded-xl flex flex-col" style={{ backgroundColor: '#16122B', border: '1px solid #662D91' }}>
                <h3 style={{ color: '#FCEE21' }} className="text-2xl font-bold mb-2 tracking-wide">
                  {service.name}
                </h3>
                <p className="text-gray-300 mb-6 flex-grow">{service.description}</p>
                <div className="mb-6">
                  <span style={{ color: '#FCEE21' }} className="text-3xl font-bold">€{service.price}</span>
                  <span className="text-gray-400 ml-2">/ sesión</span>
                </div>
                <a
                  href={whatsappUrl(`${service.name} (€${service.price})`)}
                  onClick={() => trackClickPlan(service.name.toLowerCase().replace(/\s+/g, '_'))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 rounded-lg text-center font-bold transition-all duration-200 border-2 border-[#FCEE21] text-[#FCEE21] hover:bg-[#FCEE21] hover:text-[#16122B] hover:scale-105"
                >
                  Reservar
                </a>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
