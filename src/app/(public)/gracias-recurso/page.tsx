import Container from '@/components/common/Container'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { CheckCircle, Download, MessageCircle, ArrowRight, BookOpen, PenLine } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Descarga tu Guía | WellnessReal',
  description: 'Descarga tu guía gratuita de fitness real.',
  robots: 'noindex, nofollow',
}

export default function GraciasRecursoPage() {
  return (
    <>
      {/* Hero confirmación */}
      <section style={{ backgroundColor: '#16122B' }} className="py-16 md:py-24">
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

            <h1 style={{ color: '#FCEE21' }} className="text-4xl md:text-5xl font-bold mb-6 tracking-wide">
              ¡TU GUÍA ESTÁ LISTA!
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Descárgala ahora y empieza a entrenar con sentido.
            </p>

            <a
              href="/guia-wellness-real.pdf"
              download
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-bold transition-transform hover:scale-105"
              style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
            >
              <Download size={24} />
              DESCARGAR GUÍA GRATIS
            </a>

            <p className="text-sm text-gray-500 mt-4">
              PDF · Lectura de 10 minutos
            </p>
          </div>
        </Container>
      </section>

      {/* Siguiente paso - CTA a consulta */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-16 md:py-20">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div
              className="p-8 md:p-12 rounded-2xl text-center"
              style={{ backgroundColor: '#16122B', border: '2px solid #FCEE21' }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                ¿Quieres ir más rápido?
              </h2>

              <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
                La guía te da las bases. Pero si quieres un{' '}
                <span style={{ color: '#FCEE21' }} className="font-bold">
                  plan 100% personalizado
                </span>{' '}
                a tu situación, podemos hablar.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Link href="/valoracion">
                  <Button variant="primary" size="lg" className="px-8">
                    Solicitar valoración gratuita
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-gray-500">
                Sin compromiso. Solo una conversación para ver si puedo ayudarte.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Qué vas a encontrar */}
      <section style={{ backgroundColor: '#16122B' }} className="py-16 md:py-20">
        <Container>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-12">
            Mientras tanto, lee la guía y...
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(252, 238, 33, 0.1)', border: '2px solid #FCEE21' }}>
                  <BookOpen size={28} style={{ color: '#FCEE21' }} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Léela con calma</h3>
              <p className="text-gray-400 text-sm">
                No es un PDF de 100 páginas. Es directo y al grano. Puedes leerla en 10 minutos.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(252, 238, 33, 0.1)', border: '2px solid #FCEE21' }}>
                  <PenLine size={28} style={{ color: '#FCEE21' }} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Aplica una cosa</h3>
              <p className="text-gray-400 text-sm">
                No intentes cambiar todo a la vez. Elige UNA idea de la guía y ponla en práctica esta semana.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(252, 238, 33, 0.1)', border: '2px solid #FCEE21' }}>
                  <MessageCircle size={28} style={{ color: '#FCEE21' }} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Cuéntame qué tal</h3>
              <p className="text-gray-400 text-sm">
                Si tienes dudas o quieres contarme tu caso, responde al email o escríbeme por aquí.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Más contenido */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-16">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
              ¿Quieres más contenido como este?
            </h2>

            <p className="text-gray-400 mb-8">
              En el blog comparto artículos con consejos prácticos sobre entrenamiento y nutrición. Sin rollos, sin postureo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/blog">
                <Button variant="outline" size="lg">
                  <span className="flex items-center gap-2">
                    Ver el blog <ArrowRight size={18} />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Contacto directo */}
      <section style={{ backgroundColor: '#16122B' }} className="py-12">
        <Container>
          <div
            className="max-w-2xl mx-auto p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ backgroundColor: '#1a1535', border: '1px solid #662D91' }}
          >
            <div className="flex items-center gap-3">
              <MessageCircle size={24} style={{ color: '#FCEE21' }} />
              <span className="text-gray-300">
                ¿Alguna duda?{' '}
                <a
                  href="mailto:info@wellnessreal.es"
                  className="font-bold hover:underline"
                  style={{ color: '#FCEE21' }}
                >
                  info@wellnessreal.es
                </a>
              </span>
            </div>
            <Link href="/">
              <Button variant="outline" size="md">
                Volver al inicio
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
