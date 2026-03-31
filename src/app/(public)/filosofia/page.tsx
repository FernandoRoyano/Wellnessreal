import Container from '@/components/common/Container'
import Link from 'next/link'
import { Heart, Activity, Moon, Check } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import HeroAnimation from '@/components/animations/HeroAnimation'
import AnimatedSection from '@/components/animations/AnimatedSection'
import StaggerChildren from '@/components/animations/StaggerChildren'
import MagneticButton from '@/components/animations/MagneticButton'

export const metadata = buildMetadata({
  title: 'Nuestra Filosofía | Fitness Real Sin Extremos',
  description:
    'La filosofía WellnessReal: salud real basada en actividad física, nutrición y recuperación. Sin postureo, sin excusas. Solo lo que funciona de verdad.',
  path: '/filosofia',
  keywords: [
    'filosofía fitness',
    'salud real',
    'bienestar integral',
    'entrenamiento sin extremos',
    'vida saludable',
  ],
})

export default function FilosofiaPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: '#16122B' }} className="py-20 md:py-32">
        <Container>
          <HeroAnimation>
            <div className="max-w-4xl">
              <h1 style={{ color: '#FCEE21' }} className="text-5xl md:text-7xl font-bold mb-6 tracking-widest">
                FILOSOFÍA
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-6">
                <span style={{ color: '#FCEE21' }} className="font-bold">¿Cansado de postureo y teorías vacías?</span> Aquí venimos a lo que cuenta: resultados reales que se sienten y se ven.
              </p>
              <p className="text-lg text-gray-400">
                La "salud" de verdad es dejarse de excusas y atacar de frente lo que importa. El 80% de tu bienestar es lo que haces cada día, no lo que compras ni los likes que recibes.
              </p>
            </div>
          </HeroAnimation>
        </Container>
      </section>

      {/* Qué es la salud */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-20 md:py-28">
        <Container>
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <h2 style={{ color: '#FCEE21' }} className="text-4xl md:text-5xl font-bold mb-8 tracking-wide">
                ¿Qué es la salud?
              </h2>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
                Hoy abunda la info y reinan las dudas. Aquí desterramos la confusión: el 80% de lo que te mata o te eleva son tus hábitos.
              </p>
              <div className="p-8 rounded-xl mb-8" style={{ backgroundColor: 'rgba(252, 238, 33, 0.1)', border: '2px solid #FCEE21' }}>
                <p className="text-2xl md:text-3xl text-white font-bold text-center leading-relaxed">
                  Si quieres salud: <span style={{ color: '#FCEE21' }}>muévete, come bien y descansa.</span> Tu círculo, tu mente y tus hábitos pueden impulsarte o hundirte. Tú eliges.
                </p>
              </div>
            </div>
          </AnimatedSection>
          <StaggerChildren className="max-w-4xl mx-auto">
            <ul className="grid md:grid-cols-2 gap-4 text-lg text-gray-300 mb-8">
              {[
                'Actividad física (sin piedad)',
                'Nutrición brutal',
                'Descanso real',
                'Control del estrés',
                'Fuerza mental/emocional',
                'Vida social que suma',
                'Higiene y entorno limpio',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check size={18} style={{ color: '#FCEE21' }} className="flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-xl text-gray-300 leading-relaxed">
              ¿Listo para romper el círculo vicioso y crear tu círculo virtuoso?
            </p>
          </StaggerChildren>
        </Container>
      </section>

      {/* Nuestra Filosofía */}
      <section style={{ backgroundColor: '#16122B' }} className="py-20 md:py-28">
        <Container>
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 style={{ color: '#FCEE21' }} className="text-4xl md:text-5xl font-bold mb-8 tracking-wide">
                WellnessReal no es un producto
              </h2>
              <p className="text-2xl md:text-3xl text-white font-semibold mb-6">
                Es una <span style={{ color: '#FCEE21' }}>filosofía de acción.</span>
              </p>
              <p className="text-xl text-gray-300 leading-relaxed">
                Aquí no vendemos sueños. Vendemos el sistema, la comunidad y el choque de realidad que necesitas para lograr lo que pocos logran: salud real, duradera y sin excusas.
              </p>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* El Círculo de la Salud */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-20 md:py-28">
        <Container>
          <AnimatedSection>
            <h2 style={{ color: '#FCEE21' }} className="text-4xl md:text-5xl font-bold mb-12 text-center tracking-wide">
              El Círculo de la Salud
            </h2>
            <p className="text-lg text-gray-300 text-center mb-16 max-w-3xl mx-auto">
              Aquí todo suma o todo resta. Si una pata falla, el circuito revienta. Así de simple.
              Entrena lo físico, lo mental y lo emocional para resultados brutales… ¡o quédate como estás!
            </p>
          </AnimatedSection>
          <StaggerChildren className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: Activity,
                title: 'Actividad Física',
                description: 'Mueve el cuerpo o acepta quedarte atrás. Sube tu nivel: más fuerza, menos excusas.',
              },
              {
                icon: Heart,
                title: 'Nutrición',
                description: 'La gasolina de verdad. Si fallas aquí, fallas allá. Come para rendir y proteger tu salud.',
              },
              {
                icon: Moon,
                title: 'Recuperación',
                description: 'El descanso de campeones. Dormir poco = rendir menos = fracasar antes.',
              },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="p-8 rounded-xl" style={{ backgroundColor: '#16122B', border: '2px solid #662D91' }}>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ backgroundColor: 'rgba(252, 238, 33, 0.1)', border: '2px solid #FCEE21' }}>
                    <Icon size={32} style={{ color: '#FCEE21' }} />
                  </div>
                  <h3 style={{ color: '#FCEE21' }} className="text-2xl font-bold mb-4 tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 text-base leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </StaggerChildren>
          <AnimatedSection>
            <div className="text-center">
              <p className="text-xl md:text-2xl text-white font-semibold mb-4">
                Las <span style={{ color: '#FCEE21' }}>3 áreas están interconectadas</span>
              </p>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Trabájalas en serio o sigue como estás. Aquí no maquillamos resultados: te ayudamos a conseguirlos.
              </p>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#16122B' }} className="py-20">
        <Container className="text-center">
          <AnimatedSection>
            <h2 style={{ color: '#FCEE21' }} className="text-4xl md:text-5xl font-bold mb-8 tracking-wide">
              ¿Te atreves o vas a quedarte en la teoría?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Empieza tu transformación ahora con la primera sesión gratuita. Sin humo, sin excusas.
            </p>
            <MagneticButton>
              <Link
                href="/valoracion"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-bold transition-all tracking-wide text-base"
                style={{
                  backgroundColor: '#FCEE21',
                  color: '#16122B'
                }}
              >
                Empieza tu transformación
              </Link>
            </MagneticButton>
          </AnimatedSection>
        </Container>
      </section>
    </>
  )
}
