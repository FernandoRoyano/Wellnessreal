import Container from '@/components/common/Container'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import JsonLd, { offerSchema, faqSchema } from '@/components/seo/JsonLd'
import PricingCards from '@/components/sections/PricingCards'

const PHONE = '34633261963'

function whatsappUrl(plan: string) {
  const msg = `Hola, me interesa el plan ${plan}. Me gustaría recibir más información.`
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`
}

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

      <PricingCards />

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
          <a
            href={whatsappUrl('Valoración gratuita')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: '#FCEE21', color: '#16122B', boxShadow: '0 0 20px rgba(252, 238, 33, 0.3)' }}
          >
            Solicitar valoración gratuita
          </a>
        </Container>
      </section>
    </>
  )
}
