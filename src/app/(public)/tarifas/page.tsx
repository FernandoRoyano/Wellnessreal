import Container from '@/components/common/Container'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import JsonLd, { offerSchema, faqSchema } from '@/components/seo/JsonLd'

export const metadata = buildMetadata({
  title: 'Tarifas | Planes de Entrenamiento Online',
  description:
    'Planes de entrenamiento online personalizados desde €120/mes. Pack 3 meses, Premium con videollamadas. Valoración gratuita incluida.',
  path: '/tarifas',
  keywords: [
    'tarifas entrenamiento online',
    'precios entrenador personal',
    'planes entrenamiento personalizado',
    'entrenamiento online precio',
  ],
})

export default function TarifasPage() {
  return (
    <>
      <JsonLd
        data={offerSchema([
          { name: 'Starter - 1 Mes', price: '120', description: 'Plan personalizado en app, revisión semanal, vídeos explicativos, soporte por chat.' },
          { name: 'Pack 3 Meses', price: '300', description: 'Todo lo del Starter + 12 semanas de seguimiento, ajustes semanales y revisión mensual.' },
          { name: 'Premium - 3 Meses', price: '500', description: 'Todo lo del pack 3 meses + videollamada semanal, soporte prioritario y pautas nutricionales.' },
        ])}
      />
      <JsonLd
        data={faqSchema([
          { question: '¿Puedo cambiar de plan?', answer: 'Sí, puedes cambiar o cancelar en cualquier momento. Sin permanencia ni penalización.' },
          { question: '¿Cómo es la valoración gratuita?', answer: 'Hablamos de tu situación, objetivos y disponibilidad. Te digo si puedo ayudarte y cómo. Sin compromiso.' },
          { question: '¿Incluye nutrición?', answer: 'Los planes incluyen pautas nutricionales básicas. El plan Premium incluye seguimiento nutricional completo.' },
          { question: '¿Qué pasa si no veo resultados?', answer: 'Si después de seguir el plan correctamente no ves progreso, revisamos todo y ajustamos sin coste extra.' },
          { question: '¿Puedo combinar servicios?', answer: 'Sí, puedes añadir nutrición, osteopatía o análisis corporal a cualquier plan.' },
        ])}
      />
      {/* Hero */}
      <section style={{ backgroundColor: '#16122B' }} className="py-20 md:py-28">
        <Container>
          <div className="max-w-4xl">
            <h1 style={{ color: '#FCEE21' }} className="text-5xl md:text-7xl font-bold mb-6 tracking-widest">
              TARIFAS
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Planes flexibles que se adaptan a ti.
              <span style={{ color: '#FCEE21' }} className="font-bold">
                {' '}La valoración inicial siempre es gratuita.
              </span>
            </p>
          </div>
        </Container>
      </section>

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
                Ideal para empezar y ver si encajamos. Plan completo desde el primer día.
              </p>
              <div className="mb-8 pb-8 border-b" style={{ borderBottomColor: '#662D91' }}>
                <span className="text-5xl font-bold" style={{ color: '#FCEE21' }}>€120</span>
                <span className="text-gray-400 ml-2">/mes</span>
              </div>
              <ul className="space-y-3 mb-8 text-gray-300 text-left mx-auto max-w-xs">
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Plan personalizado en app</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Revisión semanal de progreso</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Vídeos explicativos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Soporte por chat</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Valoración inicial gratuita</span>
                </li>
              </ul>
              <Link href="/contacto">
                <Button variant="primary" size="lg" className="w-full">Empezar ahora</Button>
              </Link>
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
                El tiempo necesario para crear un hábito real y ver cambios significativos.
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
                  <span>12 semanas de seguimiento</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Ajustes semanales del plan</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Acceso a biblioteca de vídeos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Revisión mensual en profundidad</span>
                </li>
              </ul>
              <Link href="/contacto">
                <Button variant="primary" size="lg" className="w-full">Elegir este plan</Button>
              </Link>
            </div>

            {/* PREMIUM */}
            <div className="rounded-xl p-8 bg-[#16122B] border border-[#662D91] text-center">
              <h3 className="text-3xl font-bold mb-2 tracking-widest" style={{ color: '#FCEE21' }}>
                PREMIUM
              </h3>
              <p className="text-gray-400 mb-2">Máxima personalización</p>
              <p className="text-gray-300 text-sm mb-4">
                Seguimiento intensivo con videollamadas semanales y atención prioritaria.
              </p>
              <div className="mb-8 pb-8 border-b" style={{ borderBottomColor: '#662D91' }}>
                <span className="text-5xl font-bold" style={{ color: '#FCEE21' }}>€500</span>
                <span className="text-gray-400 ml-2">/3 meses</span>
              </div>
              <ul className="space-y-3 mb-8 text-gray-300 text-left mx-auto max-w-xs">
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Todo lo del pack 3 meses</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Videollamada semanal</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Análisis mensual de progreso</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Soporte prioritario (WhatsApp)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={20} style={{ color: '#FCEE21', minWidth: 20 }} />
                  <span>Pautas nutricionales incluidas</span>
                </li>
              </ul>
              <Link href="/contacto">
                <Button variant="primary" size="lg" className="w-full">Consultar disponibilidad</Button>
              </Link>
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
                <Link href="/contacto">
                  <Button variant="outline" size="md" className="w-full">Reservar</Button>
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-20 md:py-28">
        <Container>
          <h2 style={{ color: '#FCEE21' }} className="text-4xl md:text-5xl font-bold mb-12 tracking-wide">
            Preguntas frecuentes
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            {[
              {
                q: '¿Puedo cambiar de plan?',
                a: 'Sí, puedes cambiar o cancelar en cualquier momento. Sin permanencia ni penalización.'
              },
              {
                q: '¿Cómo es la valoración gratuita?',
                a: 'Hablamos de tu situación, objetivos y disponibilidad. Te digo si puedo ayudarte y cómo. Sin compromiso.'
              },
              {
                q: '¿Hay descuento por pago anual?',
                a: 'Sí, contacta conmigo para ver las opciones de pago anual con descuento adicional.'
              },
              {
                q: '¿Incluye nutrición?',
                a: 'Los planes incluyen pautas nutricionales básicas. El plan Premium incluye seguimiento nutricional completo.'
              },
              {
                q: '¿Qué pasa si no veo resultados?',
                a: 'Si después de seguir el plan correctamente no ves progreso, revisamos todo y ajustamos sin coste extra.'
              },
              {
                q: '¿Puedo combinar servicios?',
                a: 'Sí, puedes añadir nutrición, osteopatía o análisis corporal a cualquier plan. Hablamos y lo adaptamos.'
              },
            ].map((faq, index) => (
              <div key={index} className="p-8 rounded-xl" style={{ backgroundColor: '#16122B', borderLeft: '4px solid #FCEE21' }}>
                <h3 style={{ color: '#FCEE21' }} className="text-xl font-bold mb-3 tracking-wide">
                  {faq.q}
                </h3>
                <p className="text-gray-300 text-base leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Lead Magnet */}
      <section style={{ backgroundColor: '#16122B' }} className="py-16">
        <Container>
          <div
            className="max-w-3xl mx-auto p-8 md:p-10 rounded-2xl text-center"
            style={{ backgroundColor: '#1a1535', border: '2px solid #FCEE21' }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              ¿Todavía no lo tienes claro?
            </h2>
            <p className="text-lg text-gray-300 mb-6 max-w-xl mx-auto">
              Descarga la guía gratuita y empieza a entender qué necesitas realmente.
            </p>
            <Link href="/recurso-gratis">
              <Button variant="primary" size="lg">
                Descargar guía gratis
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* CTA Final */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-20">
        <Container className="text-center">
          <h2 style={{ color: '#FCEE21' }} className="text-4xl md:text-5xl font-bold mb-6">
            ¿Dudas? Hablemos
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Cuéntame tu situación y te ayudo a elegir el plan que mejor encaja contigo.
          </p>
          <Link href="/contacto">
            <Button variant="primary" size="lg">
              Solicitar valoración gratuita
            </Button>
          </Link>
        </Container>
      </section>
    </>
  )
}
