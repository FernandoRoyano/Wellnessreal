import Container from '@/components/common/Container'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { CheckCircle, Clock, Mail, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mensaje Enviado | WellnessReal',
  description: 'Tu mensaje ha sido enviado correctamente. Te contactaremos en menos de 24 horas.',
  robots: 'noindex, nofollow',
}

export default function GraciasPage() {
  return (
    <>
      {/* Hero confirmación */}
      <section style={{ backgroundColor: '#16122B' }} className="py-20 md:py-32">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            {/* Icono de éxito */}
            <div className="mb-8 flex justify-center">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(76, 175, 80, 0.2)' }}
              >
                <CheckCircle size={56} style={{ color: '#4caf50' }} />
              </div>
            </div>

            <h1 style={{ color: '#FCEE21' }} className="text-4xl md:text-6xl font-bold mb-6 tracking-wide">
              ¡MENSAJE RECIBIDO!
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-4">
              Gracias por contactar con WellnessReal.
            </p>

            <p className="text-lg text-gray-400 mb-10">
              He recibido tu mensaje y te responderé{' '}
              <span style={{ color: '#FCEE21' }} className="font-bold">
                en menos de 24 horas
              </span>.
            </p>
          </div>
        </Container>
      </section>

      {/* Qué esperar */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-16 md:py-24">
        <Container>
          <h2 style={{ color: '#FCEE21' }} className="text-3xl md:text-4xl font-bold text-center mb-12">
            ¿Qué pasa ahora?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: 'rgba(252, 238, 33, 0.1)' }}
              >
                <Mail size={32} style={{ color: '#FCEE21' }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">1. Reviso tu mensaje</h3>
              <p className="text-gray-400">
                Leo personalmente cada mensaje para entender tu situación.
              </p>
            </div>

            <div className="text-center p-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: 'rgba(252, 238, 33, 0.1)' }}
              >
                <Clock size={32} style={{ color: '#FCEE21' }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">2. Te contacto</h3>
              <p className="text-gray-400">
                Respondo por email o teléfono según prefieras, en menos de 24h.
              </p>
            </div>

            <div className="text-center p-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: 'rgba(252, 238, 33, 0.1)' }}
              >
                <ArrowRight size={32} style={{ color: '#FCEE21' }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">3. Hablamos</h3>
              <p className="text-gray-400">
                Analizamos tu caso sin compromiso y vemos si puedo ayudarte.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Mientras tanto */}
      <section style={{ backgroundColor: '#16122B' }} className="py-16 md:py-24">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Mientras esperas mi respuesta...
            </h2>

            <p className="text-gray-400 mb-8">
              Puedes echar un vistazo al blog donde comparto consejos prácticos sobre entrenamiento y nutrición sin complicaciones.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/blog">
                <Button variant="outline" size="lg">
                  Leer el blog
                </Button>
              </Link>
              <Link href="/">
                <Button variant="primary" size="lg">
                  Volver al inicio
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Nota de urgencia */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-12">
        <Container>
          <div
            className="max-w-2xl mx-auto p-6 rounded-xl text-center"
            style={{ backgroundColor: '#16122B', border: '2px solid #662D91' }}
          >
            <p className="text-gray-300">
              <span style={{ color: '#FCEE21' }} className="font-bold">¿Es urgente?</span>{' '}
              Puedes llamarme directamente al{' '}
              <a
                href="tel:+34633261963"
                className="font-bold hover:underline"
                style={{ color: '#FCEE21' }}
              >
                +34 633 261 963
              </a>
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}
