import Container from '@/components/common/Container'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { MapPin, Clock, Users, Target, Dumbbell, CheckCircle } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import JsonLd, { serviceSchema, breadcrumbSchema } from '@/components/seo/JsonLd'

export const metadata = buildMetadata({
  title: 'Entrenamiento Personalizado Presencial en Madrid',
  description:
    'Entrenamiento personal 1 a 1 en Madrid. Sesiones adaptadas a tu nivel, objetivos y disponibilidad. Técnica perfecta y resultados garantizados.',
  path: '/servicios/entrenamiento-personalizado',
  keywords: [
    'entrenador personal Madrid',
    'entrenamiento personalizado presencial',
    'personal trainer Madrid',
    'entrenamiento 1 a 1',
    'sesiones entrenamiento Madrid',
  ],
})

export default function EntrenamientoPersonalizadoPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'Entrenamiento Personalizado Presencial',
          description: 'Sesiones de entrenamiento personal 1 a 1 en Madrid. Técnica perfecta, motivación constante y resultados.',
          url: 'https://wellnessreal.es/servicios/entrenamiento-personalizado',
          areaServed: 'Madrid, ES',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Inicio', url: 'https://wellnessreal.es' },
          { name: 'Servicios', url: 'https://wellnessreal.es/servicios' },
          { name: 'Entrenamiento Personalizado', url: 'https://wellnessreal.es/servicios/entrenamiento-personalizado' },
        ])}
      />
      {/* Hero */}
      <section style={{ backgroundColor: '#16122B' }} className="py-20 md:py-32">
        <Container>
          <div className="max-w-4xl">
            <div
              className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-6"
              style={{ backgroundColor: 'rgba(252, 238, 33, 0.1)', color: '#FCEE21' }}
            >
              ENTRENAMIENTO PRESENCIAL
            </div>
            <h1 style={{ color: '#FCEE21' }} className="text-5xl md:text-7xl font-bold mb-6 tracking-widest">
              ENTRENAMIENTO PERSONALIZADO
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8">
              Sesiones 1 a 1 donde <span style={{ color: '#FCEE21' }} className="font-bold">tú eres el centro</span>.
              Técnica perfecta, motivación constante y resultados que se ven.
            </p>
            <Link href="/valoracion">
              <Button variant="primary" size="lg">
                Reservar sesión de prueba
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Qué incluye */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-20 md:py-28">
        <Container>
          <h2 style={{ color: '#FCEE21' }} className="text-4xl md:text-5xl font-bold mb-12 text-center">
            ¿Qué incluye?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Target,
                title: 'Plan 100% personalizado',
                desc: 'Diseñado para tus objetivos específicos, tu nivel actual y tu disponibilidad de tiempo.'
              },
              {
                icon: Dumbbell,
                title: 'Supervisión constante',
                desc: 'Corrección de técnica en tiempo real para maximizar resultados y evitar lesiones.'
              },
              {
                icon: Users,
                title: 'Atención exclusiva',
                desc: 'Sesiones individuales donde toda mi atención está puesta en ti y tu progreso.'
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-8 rounded-xl text-center"
                style={{ backgroundColor: '#16122B', border: '2px solid #662D91' }}
              >
                <item.icon size={48} style={{ color: '#FCEE21' }} className="mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Para quién es */}
      <section style={{ backgroundColor: '#16122B' }} className="py-20 md:py-28">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 style={{ color: '#FCEE21' }} className="text-3xl md:text-4xl font-bold mb-8 text-center">
              Ideal para ti si...
            </h2>

            <div className="space-y-4">
              {[
                'Prefieres que alguien te guíe en cada ejercicio',
                'Quieres asegurarte de hacer los ejercicios correctamente',
                'Necesitas esa motivación extra que da tener a alguien contigo',
                'Tienes un objetivo específico y quieres el camino más directo',
                'Has tenido lesiones y quieres entrenar con seguridad',
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-lg"
                  style={{ backgroundColor: '#1a1535' }}
                >
                  <CheckCircle size={24} style={{ color: '#FCEE21' }} className="flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Info práctica */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-20">
        <Container>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div
              className="p-8 rounded-xl"
              style={{ backgroundColor: '#16122B', borderLeft: '4px solid #FCEE21' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={24} style={{ color: '#FCEE21' }} />
                <h3 className="text-xl font-bold text-white">Ubicación</h3>
              </div>
              <p className="text-gray-400">
                Sesiones a domicilio o en gimnasio en Madrid.
              </p>
            </div>

            <div
              className="p-8 rounded-xl"
              style={{ backgroundColor: '#16122B', borderLeft: '4px solid #FCEE21' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Clock size={24} style={{ color: '#FCEE21' }} />
                <h3 className="text-xl font-bold text-white">Duración</h3>
              </div>
              <p className="text-gray-400">
                Sesiones de 60 minutos.
                <br />
                Horarios flexibles adaptados a ti.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Final */}
      <section style={{ backgroundColor: '#16122B' }} className="py-20">
        <Container className="text-center">
          <h2 style={{ color: '#FCEE21' }} className="text-4xl md:text-5xl font-bold mb-6">
            ¿Empezamos?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Reserva tu primera sesión de valoración. Sin compromiso, sin presión. Solo hablamos de ti y tus objetivos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/valoracion">
              <Button variant="primary" size="lg" className="px-8">
                Reservar sesión de prueba
              </Button>
            </Link>
            <Link href="/tarifas">
              <Button variant="outline" size="lg" className="px-8">
                Ver tarifas
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
