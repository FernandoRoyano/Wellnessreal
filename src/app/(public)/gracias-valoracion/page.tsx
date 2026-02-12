import Container from '@/components/common/Container'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { CheckCircle, Clock, MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Valoración Recibida | WellnessReal',
  robots: { index: false, follow: false },
}

export default function GraciasValoracionPage() {
  return (
    <>
      <section style={{ backgroundColor: '#16122B' }} className="py-20 md:py-32">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
              style={{ backgroundColor: 'rgba(252, 238, 33, 0.15)' }}
            >
              <CheckCircle size={40} style={{ color: '#FCEE21' }} />
            </div>

            <h1 style={{ color: '#FCEE21' }} className="text-4xl md:text-5xl font-bold mb-6">
              Valoración recibida
            </h1>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Hemos recibido tu información. Ahora me toca a mí analizarla y preparar
              una propuesta adaptada a tu situación real.
            </p>
          </div>
        </Container>
      </section>

      <section style={{ backgroundColor: '#1a1535' }} className="py-16">
        <Container>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              ¿Qué pasa ahora?
            </h2>
            <div className="space-y-6">
              {[
                {
                  icon: Clock,
                  title: 'Analizo tu caso',
                  description: 'Reviso tus respuestas, tu situación y tus objetivos para entender qué necesitas exactamente.',
                },
                {
                  icon: MessageCircle,
                  title: 'Te contacto en menos de 24h',
                  description: 'Te escribo por WhatsApp o email con mi análisis y una propuesta de plan personalizado.',
                },
                {
                  icon: CheckCircle,
                  title: 'Empezamos cuando tú quieras',
                  description: 'Sin presión. Te explico todo, resuelvo tus dudas, y si encajamos, arrancamos.',
                },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4 p-6 rounded-xl" style={{ backgroundColor: '#16122B' }}>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(252, 238, 33, 0.15)' }}
                  >
                    <step.icon size={24} style={{ color: '#FCEE21' }} />
                  </div>
                  <div>
                    <h3 style={{ color: '#FCEE21' }} className="font-bold text-lg mb-1">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section style={{ backgroundColor: '#16122B' }} className="py-16">
        <Container className="text-center">
          <p className="text-gray-400 mb-6">Mientras tanto, echa un vistazo al blog:</p>
          <Link href="/blog">
            <Button variant="outline" size="lg">
              Ver artículos del blog
            </Button>
          </Link>
        </Container>
      </section>
    </>
  )
}
