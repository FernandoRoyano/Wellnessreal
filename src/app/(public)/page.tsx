import Image from 'next/image'
import Container from '@/components/common/Container'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Smartphone, Target, BarChart3, Flame, Clock, TrendingUp, Check } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import JsonLd, { localBusinessSchema, webSiteSchema } from '@/components/seo/JsonLd'

export const metadata = buildMetadata({
  title: 'WellnessReal | Entrenamiento Online Personalizado en Madrid',
  description:
    'Entrenamiento online personalizado, nutrición y osteopatía. Planes adaptados a tu vida real con app profesional y seguimiento semanal. Primera valoración gratis.',
  path: '/',
  keywords: [
    'entrenamiento online personalizado',
    'entrenador personal Madrid',
    'entrenamiento a distancia',
    'fitness online personalizado',
    'plan entrenamiento app',
    'nutrición personalizada',
  ],
})

export default function HomePage() {
  return (
    <>
      <JsonLd data={localBusinessSchema()} />
      <JsonLd data={webSiteSchema()} />
      {/* HERO ULTRA POTENTE */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-[#16122B] py-16">
        <Image
          src="/images/portada-WR.jpg"
          alt="Entrenamiento Online WellnessReal"
          fill
          className="object-cover object-center opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#16122B]/90 to-[#662D91]/80 z-0"></div>
        <div className="relative flex flex-col items-center justify-center z-10 px-4 text-center">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold mb-4 md:mb-6 gradient-text leading-tight">
            PONTE EN FORMA<br/>SIN VIVIR EN EL GIMNASIO
          </h1>
          <p className="text-lg sm:text-2xl md:text-3xl text-white mb-3 md:mb-4 max-w-3xl font-semibold">
            Entrenamiento online para gente con trabajo, familia y poco tiempo.
            <br className="hidden sm:block" />
            <span style={{ color: '#FCEE21' }} className="font-extrabold"> Sin dietas extremas. Sin perfección. Solo resultados.</span>
          </p>
          <p className="text-base md:text-lg text-gray-300 mb-8 md:mb-10 max-w-2xl">
            Plan personalizado + app profesional + seguimiento semanal. Adaptado a TU vida real.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center w-full px-2">
            <Link href="/valoracion">
              <button className="px-8 py-4 sm:px-10 sm:py-5 rounded-full bg-[#FCEE21] text-[#16122B] text-lg sm:text-2xl font-extrabold shadow-xl hover:scale-105 transition-all duration-200">
                QUIERO MI PLAN PERSONALIZADO
              </button>
            </Link>
            <Link href="/recurso-gratis">
              <button className="px-6 py-3 sm:px-8 sm:py-4 rounded-full border-2 border-white text-white text-base sm:text-lg font-bold hover:bg-white hover:text-[#16122B] transition-all duration-200">
                Descargar guía gratis
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* POR QUÉ ENTRENAMIENTO ONLINE */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-24">
        <Container>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text">
            ¿Por qué entrenar online conmigo?
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: Smartphone,
                title: 'App profesional exclusiva',
                desc: 'Recibes tu plan en una app móvil súper intuitiva. Entrena con vídeos, tracking automático y soporte directo desde tu móvil.'
              },
              {
                icon: Target,
                title: '100% Personalizado',
                desc: 'Tu plan se adapta a TU espacio, TU material, TU nivel y TUS objetivos. Nada de rutinas genéricas.'
              },
              {
                icon: BarChart3,
                title: 'Seguimiento real cada semana',
                desc: 'Análisis de tu progreso, ajustes constantes y feedback profesional. No estás solo: estoy contigo en cada paso.'
              },
              {
                icon: Flame,
                title: 'Resultados comprobados',
                desc: 'Método basado en ciencia, experiencia real con +100 clientes y transformaciones documentadas.'
              },
              {
                icon: Clock,
                title: 'Entrena a tu ritmo',
                desc: 'Sin horarios fijos ni citas obligatorias. Tú decides cuándo y dónde entrenar. Yo te guío siempre.'
              },
              {
                icon: TrendingUp,
                title: 'Mejor precio que presencial',
                desc: 'Servicio profesional de élite por una fracción del coste del entrenamiento presencial tradicional.'
              }
            ].map((item, i) => {
              const Icon = item.icon
              return (
              <div key={i} className="p-8 rounded-xl bg-[#16122B] border-2 border-[#662D91] text-center hover-lift">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(252, 238, 33, 0.1)', border: '2px solid #FCEE21' }}>
                    <Icon size={32} style={{ color: '#FCEE21' }} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: '#FCEE21' }}>{item.title}</h3>
                <p className="text-gray-300 text-base">{item.desc}</p>
              </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="py-24 bg-[#16122B]">
        <Container>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16" style={{ color: '#FCEE21' }}>
            Cómo funciona (es muy fácil)
          </h2>
          <div className="max-w-4xl mx-auto space-y-12">
            {[
              {
                step: '01',
                title: 'Solicita tu valoración gratis',
                desc: 'Valoración profesional 100% online. Analizamos tu situación, objetivos y diseñamos tu plan personalizado.'
              },
              {
                step: '02',
                title: 'Recibes acceso a tu app',
                desc: 'Te envío invitación a la app móvil (iOS/Android). Descargas, entras y ¡ya tienes tu plan esperándote!'
              },
              {
                step: '03',
                title: 'Empiezas tu transformación',
                desc: 'Sigues tu plan desde el móvil. Vídeos explicativos, ejercicios personalizados, tracking automático de progreso.'
              },
              {
                step: '04',
                title: 'Seguimiento constante',
                desc: 'Cada semana revisamos tu evolución. Ajusto el plan según tus resultados y te doy feedback profesional.'
              }
            ].map((item, i) => (
              <div key={i} className="flex gap-8 items-start">
                <div className="flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center text-4xl font-extrabold" style={{ backgroundColor: '#FCEE21', color: '#16122B' }}>
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3" style={{ color: '#FCEE21' }}>{item.title}</h3>
                  <p className="text-gray-300 text-lg">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* TECNOLOGÍA PROFESIONAL */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-20">
        <Container>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <Image
                src="/images/wr_app_interface.png"
                alt="App profesional entrenamiento"
                width={400}
                height={500}
                className="rounded-xl border-4 border-[#FCEE21] shadow-2xl"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                Tecnología profesional que marca la diferencia
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Trabajo con la plataforma líder en entrenamiento online para ofrecerte la mejor experiencia:
              </p>
              <ul className="space-y-4 text-gray-200 text-lg">
                <li className="flex items-start gap-3">
                  <Check size={22} style={{ color: '#FCEE21', minWidth: 22 }} className="mt-0.5 flex-shrink-0" />
                  <span>App móvil nativa (iOS y Android) súper intuitiva</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={22} style={{ color: '#FCEE21', minWidth: 22 }} className="mt-0.5 flex-shrink-0" />
                  <span>Vídeos explicativos de cada ejercicio</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={22} style={{ color: '#FCEE21', minWidth: 22 }} className="mt-0.5 flex-shrink-0" />
                  <span>Tracking automático de peso, sensaciones y progreso</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={22} style={{ color: '#FCEE21', minWidth: 22 }} className="mt-0.5 flex-shrink-0" />
                  <span>Notificaciones y recordatorios personalizados</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={22} style={{ color: '#FCEE21', minWidth: 22 }} className="mt-0.5 flex-shrink-0" />
                  <span>Conexión directa conmigo desde la app</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* TESTIMONIOS */}
      <section className="py-24 bg-[#16122B]">
        <Container>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16" style={{ color: '#FCEE21' }}>
            Lo que dicen mis clientes
          </h2>
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {[
              {
                text: 'Llegué con 92kg, varios intentos fallidos a mis espaldas y sin creerme que esto fuera a funcionar. En 14 meses bajé 21kg. Pero lo que más me sorprendió no fue la báscula — fue darme cuenta de que por primera vez en años no estaba a dieta. Estaba viviendo.',
                name: 'Padre de familia, 41 años',
                result: '-21kg en 14 meses'
              },
              {
                text: 'No quería perder peso, quería verme diferente. Empecé en 88kg y terminé en 86kg — casi igual en la báscula. Pero la ropa me queda completamente distinta. Tengo músculo donde antes no había nada. Nadie se cree que no haya adelgazado más.',
                name: 'Mujer, 34 años',
                result: 'Recomposición corporal'
              },
              {
                text: 'A los 45 años me dijeron que tenía el colesterol alto y tensión límite. Mi médico me recomendó cambiar hábitos. En 12 meses perdí 19kg, normalicé los valores y dejé la medicación preventiva que me habían recetado. Mi médico no se lo creía.',
                name: 'Hombre, 45 años',
                result: '-19kg y sin medicación'
              },
              {
                text: 'Lo que cambió no fue solo mi cuerpo. Cambié yo. Empecé a ir a sitios que antes evitaba, a ponerme ropa que tenía guardada, a sentirme cómoda en mi propio cuerpo por primera vez desde que era adolescente. Eso no te lo da ninguna báscula.',
                name: 'Mujer, 29 años',
                result: 'Cambio de vida'
              }
            ].map((testimonial, i) => (
              <div key={i} className="p-8 rounded-xl bg-[#1a1535] border-2 border-[#FCEE21] shadow-xl">
                <p className="text-gray-200 text-lg mb-6 italic leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{testimonial.name}</span>
                  <span className="px-4 py-2 rounded-full text-sm font-bold" style={{ backgroundColor: '#FCEE21', color: '#16122B' }}>
                    {testimonial.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* TARIFAS RÁPIDAS */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-24">
        <Container>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text">
            Elige tu plan
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'STARTER', price: '120', period: '1 mes', desc: 'Prueba el método', popular: false },
              { name: 'PACK 3 MESES', price: '300', period: '3 meses', desc: 'Ahorra €60', popular: true },
              { name: 'PREMIUM', price: '500', period: '3 meses', desc: 'Máxima personalización', popular: false }
            ].map((plan, i) => (
              <div key={i} className={`p-8 rounded-xl text-center ${plan.popular ? 'border-4 scale-105' : 'border-2'} border-[#FCEE21] bg-[#16122B]`}>
                {plan.popular && <div className="mb-3 text-sm font-bold px-3 py-1 rounded-full inline-block" style={{ backgroundColor: '#FCEE21', color: '#16122B' }}>MÁS POPULAR</div>}
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#FCEE21' }}>{plan.name}</h3>
                <div className="text-5xl font-extrabold mb-2" style={{ color: '#FCEE21' }}>€{plan.price}</div>
                <p className="text-gray-400 mb-4">{plan.period}</p>
                <p className="text-gray-300 mb-6">{plan.desc}</p>
                <Link href="/tarifas">
                  <Button variant="primary" size="lg" className="w-full">Ver detalles</Button>
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA FINAL AGRESIVO */}
      <section className="relative py-28 flex items-center justify-center bg-[#16122B]">
        <Image
          src="/images/lifestyle.jpg"
          alt="Transforma tu vida"
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#16122B]/95 via-[#662D91]/85 to-transparent z-1"></div>
        <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-8 gradient-text">
            No necesitas más información.<br/>Necesitas empezar.
          </h2>
          <p className="text-2xl text-white mb-10 font-semibold">
            Valoración profesional <span style={{ color: '#FCEE21' }}>GRATIS</span>. Analizamos tu caso y te digo si puedo ayudarte.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link href="/valoracion">
              <button className="px-12 py-6 rounded-full bg-[#FCEE21] text-[#16122B] text-2xl font-extrabold shadow-2xl hover:scale-110 transition-all duration-200">
                QUIERO EMPEZAR
              </button>
            </Link>
            <Link href="/recurso-gratis">
              <button className="px-8 py-4 rounded-full border-2 border-[#FCEE21] text-[#FCEE21] text-lg font-bold hover:bg-[#FCEE21] hover:text-[#16122B] transition-all duration-200">
                Primero quiero la guía gratis
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
