import Container from '@/components/common/Container'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Image from 'next/image'
import { Smartphone, Utensils, Bone, Dumbbell } from 'lucide-react'

export default function ServiciosPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: '#16122B' }} className="py-20 md:py-32">
        <Container>
          <div className="max-w-4xl">
            <h1 style={{ color: '#FCEE21' }} className="text-5xl md:text-7xl font-bold mb-6 tracking-widest">
              SERVICIOS
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Entrenamiento y nutrición adaptados a tu vida real.
              <br />
              <span style={{ color: '#FCEE21' }} className="font-bold">
                Sin extremos, sin perfección. Solo lo que funciona para ti.
              </span>
            </p>
          </div>
        </Container>
      </section>

      {/* Servicio Principal: Entrenamiento Online */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-24">
        <Container>
          <div className="bg-[#16122B] rounded-2xl overflow-hidden border-4 border-[#FCEE21] shadow-2xl">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-80 md:h-full">
                <Image
                  src="/images/portada-WR.jpg"
                  alt="Entrenamiento Online"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-10 md:p-14 flex flex-col justify-center">
                <div className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-4 w-fit" style={{ backgroundColor: '#FCEE21', color: '#16122B' }}>
                  SERVICIO PRINCIPAL
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#FCEE21' }}>
                  Entrenamiento Online
                </h2>
                <p className="text-xl text-gray-300 mb-6">
                  Tu plan personalizado en una app profesional. Entrena cuando puedas, donde quieras, con seguimiento real cada semana.
                </p>
                <ul className="space-y-3 text-gray-200 mb-8">
                  <li className="flex items-start gap-3">
                    <Smartphone size={20} style={{ color: '#FCEE21' }} className="mt-1 flex-shrink-0" />
                    <span>App móvil con tu plan, vídeos y tracking de progreso</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span style={{ color: '#FCEE21' }} className="text-xl">✓</span>
                    <span>Ajustes semanales según tu evolución</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span style={{ color: '#FCEE21' }} className="text-xl">✓</span>
                    <span>Adaptado a tu horario, material y nivel</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span style={{ color: '#FCEE21' }} className="text-xl">✓</span>
                    <span>Soporte directo cuando lo necesites</span>
                  </li>
                </ul>
                <Link href="/servicios/entrenamiento-online">
                  <Button variant="primary" size="lg" className="w-full md:w-auto">
                    Ver más detalles
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Otros Servicios */}
      <section style={{ backgroundColor: '#16122B' }} className="py-24">
        <Container>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16" style={{ color: '#FCEE21' }}>
            Más servicios
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Entrenamiento Personalizado */}
            <div className="p-8 rounded-xl bg-[#1a1535] border-2 border-[#662D91] hover:border-[#FCEE21] transition-all">
              <Dumbbell size={48} style={{ color: '#FCEE21' }} className="mb-4" />
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#FCEE21' }}>
                Entrenamiento Presencial
              </h3>
              <p className="text-gray-300 mb-6">
                Sesiones 1 a 1 donde te guío en cada ejercicio. Técnica perfecta, motivación constante. Disponible en Madrid y Santander.
              </p>
              <Link href="/servicios/entrenamiento-personalizado">
                <Button variant="outline" size="md" className="w-full">
                  Más información
                </Button>
              </Link>
            </div>

            {/* Nutrición */}
            <div className="p-8 rounded-xl bg-[#1a1535] border-2 border-[#662D91] hover:border-[#FCEE21] transition-all">
              <Utensils size={48} style={{ color: '#FCEE21' }} className="mb-4" />
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#FCEE21' }}>
                Nutrición Personalizada
              </h3>
              <p className="text-gray-300 mb-6">
                Pautas adaptadas a tu vida, tus gustos y tu contexto. Sin dietas imposibles, sin prohibiciones absurdas. Resultados que se mantienen.
              </p>
              <Link href="/servicios/nutricion">
                <Button variant="outline" size="md" className="w-full">
                  Más información
                </Button>
              </Link>
            </div>

            {/* Osteopatía */}
            <div className="p-8 rounded-xl bg-[#1a1535] border-2 border-[#662D91] hover:border-[#FCEE21] transition-all">
              <Bone size={48} style={{ color: '#FCEE21' }} className="mb-4" />
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#FCEE21' }}>
                Osteopatía
              </h3>
              <p className="text-gray-300 mb-6">
                Recuperación de lesiones, alivio de tensiones y optimización del rendimiento. Sesiones presenciales en Santander.
              </p>
              <Link href="/servicios/osteopatia">
                <Button variant="outline" size="md" className="w-full">
                  Más información
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Lead Magnet */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-16">
        <Container>
          <div
            className="max-w-3xl mx-auto p-8 md:p-12 rounded-2xl text-center"
            style={{ backgroundColor: '#16122B', border: '2px solid #FCEE21' }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              ¿No sabes por dónde empezar?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
              Descarga la guía gratuita:{' '}
              <span style={{ color: '#FCEE21' }} className="font-bold">
                "Fitness real para gente con vida real"
              </span>
              . Te ayudará a entender qué necesitas.
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
      <section style={{ backgroundColor: '#16122B' }} className="py-20">
        <Container className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ color: '#FCEE21' }}>
            ¿Hablamos de tu caso?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Cuéntame tu situación y vemos juntos qué servicio encaja mejor contigo. Sin compromiso.
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
