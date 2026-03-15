'use client'

import { useEffect } from 'react'
import { Check } from 'lucide-react'
import Container from '@/components/common/Container'
import { trackViewPricing, trackClickPlan } from '@/lib/analytics'

const PHONE = '34633261963'

function whatsappUrl(plan: string) {
  const msg = `Hola, me interesa el plan ${plan}. Me gustaría recibir más información.`
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`
}

export default function PricingCards() {
  useEffect(() => {
    trackViewPricing()
  }, [])

  return (
    <>
      {/* Pricing Cards */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-20 md:py-28">
        <Container>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter 1 mes */}
            <div className="rounded-xl p-8 bg-[#16122B] border border-[#662D91] text-center">
              <h3 className="text-3xl font-bold mb-2 tracking-widest" style={{ color: '#FCEE21' }}>
                STARTER
              </h3>
              <p className="text-gray-400 mb-2">Entrenamiento Online — 1 mes</p>
              <p className="text-gray-300 text-sm mb-4">
                Prueba el método sin compromiso. Plan completo desde el primer día.
              </p>
              <div className="mb-8 pb-8 border-b" style={{ borderBottomColor: '#662D91' }}>
                <span className="text-5xl font-bold" style={{ color: '#FCEE21' }}>€120</span>
                <span className="text-gray-400 ml-2">/mes</span>
              </div>
              <ul className="space-y-3 mb-8 text-gray-300 text-left mx-auto max-w-xs">
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Plan 100% personalizado en app profesional</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Revisión semanal de tu progreso</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Vídeos explicativos de cada ejercicio</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Soporte directo por chat</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Valoración inicial gratuita incluida</span>
                </li>
              </ul>
              <a
                href={whatsappUrl('Starter 1 Mes (€120)')}
                onClick={() => trackClickPlan('starter_1mes')}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 rounded-lg text-center font-bold text-lg transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: '#FCEE21', color: '#16122B', boxShadow: '0 0 20px rgba(252, 238, 33, 0.3)' }}
              >
                Quiero empezar
              </a>
            </div>

            {/* 3 Meses - Pack ahorro */}
            <div className="rounded-xl p-8 border-2 border-[#FCEE21] text-center scale-105 bg-[#16122B] shadow-xl">
              <div className="mb-4 inline-block px-4 py-1 rounded-full text-sm font-bold tracking-wide" style={{ backgroundColor: '#FCEE21', color: '#16122B' }}>
                MÁS POPULAR
              </div>
              <h3 className="text-3xl font-bold mb-2 tracking-widest" style={{ color: '#FCEE21' }}>
                PACK 3 MESES
              </h3>
              <p className="text-gray-400 mb-2">Entrenamiento Online</p>
              <p className="text-gray-300 text-sm mb-4">
                El tiempo necesario para crear un hábito real y ver cambios que se notan.
              </p>
              <div className="mb-8 pb-8 border-b" style={{ borderBottomColor: '#662D91' }}>
                <span className="text-5xl font-bold" style={{ color: '#FCEE21' }}>€300</span>
                <span className="text-gray-400 ml-2">/3 meses</span>
                <p className="text-sm text-green-400 mt-1">Ahorras €60</p>
              </div>
              <ul className="space-y-3 mb-8 text-gray-300 text-left mx-auto max-w-xs">
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Todo lo del plan Starter</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>12 semanas de seguimiento continuo</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Ajustes semanales del plan según tu evolución</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Acceso a biblioteca completa de vídeos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Revisión mensual en profundidad</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Pautas nutricionales básicas incluidas</span>
                </li>
              </ul>
              <a
                href={whatsappUrl('Pack 3 Meses (€300)')}
                onClick={() => trackClickPlan('pack_3meses')}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 rounded-lg text-center font-bold text-lg transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: '#FCEE21', color: '#16122B', boxShadow: '0 0 20px rgba(252, 238, 33, 0.3)' }}
              >
                Elegir este plan
              </a>
            </div>

            {/* PREMIUM */}
            <div className="rounded-xl p-8 bg-[#16122B] border border-[#662D91] text-center">
              <h3 className="text-3xl font-bold mb-2 tracking-widest" style={{ color: '#FCEE21' }}>
                PREMIUM
              </h3>
              <p className="text-gray-400 mb-2">Máxima personalización</p>
              <p className="text-gray-300 text-sm mb-4">
                Para quien quiere el máximo nivel de atención y resultados en el menor tiempo posible.
              </p>
              <div className="mb-8 pb-8 border-b" style={{ borderBottomColor: '#662D91' }}>
                <span className="text-5xl font-bold" style={{ color: '#FCEE21' }}>€500</span>
                <span className="text-gray-400 ml-2">/3 meses</span>
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
                href={whatsappUrl('Premium 3 Meses (€500)')}
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

      {/* Servicios Adicionales */}
      <section style={{ backgroundColor: '#16122B' }} className="py-20 md:py-28">
        <Container>
          <h2 style={{ color: '#FCEE21' }} className="text-4xl md:text-5xl font-bold mb-12 text-center tracking-wide">
            Servicios adicionales
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Consulta Nutrición',
                price: '50',
                description: 'Sesión individual para diseñar tus pautas nutricionales adaptadas a tu objetivo y contexto.'
              },
              {
                name: 'Análisis Corporal',
                price: '40',
                description: 'Medición de composición corporal y seguimiento de cambios reales en tu físico.'
              },
              {
                name: 'Sesión Osteopatía',
                price: '60',
                description: 'Tratamiento de lesiones y recuperación. Presencial en Santander.'
              },
            ].map((service, i) => (
              <div key={i} className="p-8 rounded-xl flex flex-col" style={{ backgroundColor: '#1a1535', border: '1px solid #662D91' }}>
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
