import Container from '@/components/common/Container'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Image from 'next/image'
import { Smartphone, Utensils, Bone, Dumbbell, Video, BarChart3, RefreshCw, MessageCircle, MapPin, Quote } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import JsonLd, { serviceSchema, breadcrumbSchema } from '@/components/seo/JsonLd'

export const metadata = buildMetadata({
  title: 'Servicios | Entrenamiento, Nutrición y Osteopatía',
  description:
    'Servicios de entrenamiento online personalizado, nutrición adaptada y osteopatía. Planes flexibles para gente con vida real. Sin extremos, solo resultados.',
  path: '/servicios',
  keywords: [
    'servicios entrenamiento online',
    'nutrición personalizada online',
    'osteopatía Madrid',
    'entrenador personal online',
    'entrenamiento presencial Madrid',
  ],
})

export default function ServiciosPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Inicio', url: 'https://wellnessreal.es' },
          { name: 'Servicios', url: 'https://wellnessreal.es/servicios' },
        ])}
      />
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
                Sin excusas de tiempo. Sin planes imposibles. Solo lo que funciona para ti.
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
                  Tu plan personalizado en una app profesional. Entrena cuando puedas, donde quieras, con seguimiento real cada semana. No es una rutina de YouTube ni un PDF genérico. Es un plan diseñado para ti — tu horario, tu material, tu nivel, tu objetivo — con ajustes semanales según cómo vas evolucionando.
                </p>
                <ul className="space-y-3 text-gray-200 mb-8">
                  <li className="flex items-start gap-3">
                    <Smartphone size={20} style={{ color: '#FCEE21' }} className="mt-1 flex-shrink-0" />
                    <span>Plan 100% personalizado en app móvil profesional</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Video size={20} style={{ color: '#FCEE21' }} className="mt-1 flex-shrink-0" />
                    <span>Vídeos explicativos de cada ejercicio</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BarChart3 size={20} style={{ color: '#FCEE21' }} className="mt-1 flex-shrink-0" />
                    <span>Tracking automático de tu progreso</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <RefreshCw size={20} style={{ color: '#FCEE21' }} className="mt-1 flex-shrink-0" />
                    <span>Revisión y ajuste semanal</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <MessageCircle size={20} style={{ color: '#FCEE21' }} className="mt-1 flex-shrink-0" />
                    <span>Soporte directo cuando lo necesites</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin size={20} style={{ color: '#FCEE21' }} className="mt-1 flex-shrink-0" />
                    <span>Adaptado a casa, gimnasio o donde entrenes</span>
                  </li>
                </ul>
                <Link href="/tarifas">
                  <Button variant="primary" size="lg" className="w-full md:w-auto">
                    Ver tarifas
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
                Sesiones individuales en Madrid donde te guío en cada ejercicio. Técnica perfecta, corrección en tiempo real, motivación constante. Ideal si prefieres el contacto directo o estás en una fase inicial donde la supervisión marca la diferencia.
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
                Pautas adaptadas a tu vida real — tus horarios, tus gustos, tu contexto. Sin dietas imposibles que nadie puede mantener, sin prohibiciones absurdas, sin contar calorías de por vida. Un sistema nutricional que puedas sostener en el tiempo y que trabaje en la misma dirección que tu entrenamiento.
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
                Recuperación de lesiones, alivio de tensiones crónicas y optimización del rendimiento físico. Si llevas tiempo con una molestia que no termina de resolverse, o quieres prevenir lesiones antes de que aparezcan, esta es la pieza que muchos entrenamientos ignoran. Sesiones presenciales en Madrid.
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

      {/* Por qué WellnessReal es diferente */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-12" style={{ color: '#FCEE21' }}>
              Por qué WellnessReal es diferente
            </h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              Hay cientos de entrenadores online. La diferencia no está en la app ni en los vídeos — está en el criterio.
            </p>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              Llevo más de 10 años en esto. He visto qué funciona y qué no. No sigo modas — sigo principios. No voy a ponerte el ejercicio viral de Instagram si no tiene sentido para tu caso. No voy a darte una dieta de moda si no encaja con tu vida.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Lo que sí voy a hacer es analizar tu contexto en profundidad, diseñar algo específico para ti y estar ahí cada semana para asegurarme de que avanzas. Más de 100 personas han pasado por este proceso. Algunas han perdido 20-30 kilos. Otras han ganado músculo por primera vez en su vida. Todas han cambiado algo más que el cuerpo.
            </p>
          </div>
        </Container>
      </section>

      {/* Testimonios */}
      <section style={{ backgroundColor: '#16122B' }} className="py-24">
        <Container>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="p-8 rounded-xl bg-[#1a1535] border-2 border-[#FCEE21]">
              <Quote size={32} style={{ color: '#FCEE21' }} className="mb-4" />
              <p className="text-gray-300 italic text-lg mb-6 leading-relaxed">
                &ldquo;Llevaba años probando cosas por mi cuenta. Lo que cambió con WellnessReal fue tener a alguien que entiende realmente mi situación y ajusta el plan cuando la vida se complica. Eso no lo da ninguna app.&rdquo;
              </p>
              <p className="text-white font-bold">— Cliente online, 38 años</p>
            </div>
            <div className="p-8 rounded-xl bg-[#1a1535] border-2 border-[#FCEE21]">
              <Quote size={32} style={{ color: '#FCEE21' }} className="mb-4" />
              <p className="text-gray-300 italic text-lg mb-6 leading-relaxed">
                &ldquo;Pensaba que no tenía tiempo para esto. Con 45 minutos tres veces a la semana he conseguido más que en años de ir al gimnasio sin rumbo.&rdquo;
              </p>
              <p className="text-white font-bold">— Cliente online, 43 años</p>
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
          <Link href="/valoracion">
            <Button variant="primary" size="lg" className="px-12 py-5 text-xl tracking-wide shadow-[0_0_25px_rgba(252,238,33,0.4)]">
              Solicitar valoración gratuita
            </Button>
          </Link>
        </Container>
      </section>
    </>
  )
}
