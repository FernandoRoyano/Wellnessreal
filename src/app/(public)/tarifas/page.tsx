import Container from '@/components/common/Container'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import JsonLd, { offerSchema, faqSchema } from '@/components/seo/JsonLd'
import PricingCards from '@/components/sections/PricingCards'
import PlanSelector from '@/components/sections/PlanSelector'
import ExitIntentPopup from '@/components/ui/ExitIntentPopup'
import HeroAnimation from '@/components/animations/HeroAnimation'
import AnimatedSection from '@/components/animations/AnimatedSection'
import StaggerChildren from '@/components/animations/StaggerChildren'
import MagneticButton from '@/components/animations/MagneticButton'

const PHONE = '34633261963'

function whatsappUrl(plan: string) {
  const msg = `Hola, me interesa el plan ${plan}. Me gustaría recibir más información.`
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`
}

export const metadata = buildMetadata({
  title: 'Tarifas | Planes de Entrenamiento Online',
  description:
    'Planes de entrenamiento online personalizados desde €125/mes. Pack 3 meses, Pack 6 meses Transformación y Premium con videollamadas. Valoración gratuita incluida.',
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
          { name: 'Pack 3 Meses', price: '450', description: 'Plan personalizado en app, 12 semanas de seguimiento con ajustes semanales, revisión mensual en profundidad y pautas nutricionales básicas.' },
          { name: 'Pack 6 Meses Transformación', price: '750', description: '26 semanas de seguimiento continuo. El tiempo real para consolidar hábitos. Mejor precio mensual del catálogo (125€/mes).' },
          { name: 'Premium - 3 Meses', price: '750', description: 'Todo lo del Pack 3 meses + videollamada semanal, análisis mensual de composición corporal, soporte prioritario y plan nutricional completo.' },
        ])}
      />
      <JsonLd
        data={faqSchema([
          { question: '¿Cómo es la valoración gratuita?', answer: 'Es una conversación de 20-30 minutos donde me cuentas tu situación, historial, objetivos y disponibilidad. Analizo tu caso y te digo honestamente si puedo ayudarte y cómo. Si no eres el perfil adecuado para lo que ofrezco, también te lo digo. Sin presión ni ventas agresivas.' },
          { question: '¿Puedo cambiar de plan?', answer: 'Sí, sin ningún problema. Puedes cambiar, pausar o cancelar en cualquier momento. Sin permanencia, sin penalización, sin letra pequeña.' },
          { question: '¿Incluye nutrición?', answer: 'El Pack 3 meses y el Pack 6 meses Transformación incluyen pautas nutricionales básicas adaptadas a tu objetivo. El plan Premium incluye un plan nutricional completo y seguimiento continuo. Si quieres nutrición más detallada en cualquier plan, puedes añadir una consulta individual de nutrición por 50€.' },
          { question: '¿Qué pasa si no veo resultados?', answer: 'Si sigues el plan correctamente y no ves progreso, revisamos todo sin coste adicional y ajustamos hasta que funcione. En más de 100 clientes nunca he tenido que aplicar esta garantía porque el método funciona — pero existe porque confío en el proceso y en que si algo no avanza, hay una razón que encontraremos juntos.' },
          { question: '¿Hay descuento por pago anual?', answer: 'Sí. Si quieres comprometerte a 6 o 12 meses, contacta directamente y te hago una propuesta con descuento adicional. Es la opción más rentable para quien tiene claro que quiere un cambio definitivo.' },
          { question: '¿Qué necesito para empezar?', answer: 'Solo un móvil con la app instalada. Puedes entrenar en casa, en el gimnasio, en un parque — donde quieras. El plan se adapta al espacio y material que tengas disponible, no al contrario.' },
          { question: '¿Puedo combinar servicios?', answer: 'Sí. Puedes añadir consultas de nutrición, sesiones de osteopatía o análisis corporal a cualquier plan. Cuéntame tu situación en la valoración gratuita y buscamos la combinación que más te conviene.' },
          { question: '¿Funciona si tengo muy poco tiempo?', answer: 'Es precisamente para quien tiene poco tiempo. Las sesiones están diseñadas para ser efectivas en 30-45 minutos. Lo importante no es cuánto tiempo tienes — es usarlo bien.' },
        ])}
      />
      {/* Hero */}
      <section style={{ backgroundColor: '#16122B' }} className="py-20 md:py-28">
        <Container>
          <HeroAnimation>
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
          </HeroAnimation>
        </Container>
      </section>

      {/* Así es el proceso */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-20 md:py-28">
        <Container>
          <AnimatedSection>
            <h2 style={{ color: '#FCEE21' }} className="text-4xl md:text-5xl font-bold mb-14 tracking-wide">
              Así es el proceso
            </h2>
          </AnimatedSection>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Valoración gratuita',
                desc: 'Hablamos de tu situación, tus objetivos y tu vida real. Analizamos qué necesitas y si puedo ayudarte. Sin vender, sin presionar.',
              },
              {
                step: '02',
                title: 'Tu plan en 48h',
                desc: 'Diseño tu plan personalizado y te envío acceso a la app. Desde el primer día tienes todo listo para empezar.',
              },
              {
                step: '03',
                title: 'Empiezas y yo te acompaño',
                desc: 'Entrenas con tu plan, yo reviso tu evolución cada semana y ajusto lo que haga falta. No estás solo en ningún momento.',
              },
              {
                step: '04',
                title: 'Resultados que se quedan',
                desc: 'No trabajamos para que llegues a un número en la báscula. Trabajamos para que los hábitos que construimos duren el resto de tu vida.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="step-card group relative p-6 rounded-xl border border-[#662D91] cursor-default"
                style={{ backgroundColor: '#16122B' }}
              >
                <span className="step-num block text-sm font-bold tracking-widest transition-all duration-300 group-hover:tracking-[4px]" style={{ color: '#FCEE21' }}>
                  PASO {item.step}
                </span>
                <h3 className="text-xl font-bold text-white mt-2 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-base leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* ¿Por dónde empezar? — Acordeón */}
      <section style={{ backgroundColor: '#16122B' }} className="py-20 md:py-28">
        <Container>
          <AnimatedSection>
            <PlanSelector />
          </AnimatedSection>
        </Container>
      </section>

      <PricingCards />

      {/* Testimonios */}
      <section style={{ backgroundColor: '#16122B' }} className="py-20 md:py-28">
        <Container>
          <AnimatedSection>
            <h2 style={{ color: '#FCEE21' }} className="text-4xl md:text-5xl font-bold mb-14 tracking-wide">
              Lo que dicen quienes ya han pasado por aquí
            </h2>
          </AnimatedSection>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
            {[
              {
                text: 'Llegué con 92kg, varios intentos fallidos a mis espaldas y sin creerme que esto fuera a funcionar. En 14 meses bajé 21kg. Pero lo que más me sorprendió no fue la báscula — fue darme cuenta de que por primera vez en años no estaba a dieta. Estaba viviendo.',
                name: 'Hombre, 41 años',
                badge: '21kg menos en 14 meses',
              },
              {
                text: 'No quería perder peso, quería verme diferente. Empecé en 88kg y terminé en 86kg — casi igual en la báscula. Pero la ropa me queda completamente distinta. Tengo músculo donde antes no había nada. Nadie se cree que no haya adelgazado más.',
                name: 'Mujer, 34 años',
                badge: 'Recomposición corporal',
              },
              {
                text: 'A los 45 años me dijeron que tenía el colesterol alto y tensión límite. En 12 meses perdí 19kg, normalicé los valores y dejé la medicación preventiva. Mi médico no se lo creía.',
                name: 'Hombre, 45 años',
                badge: '19kg menos, valores normalizados',
              },
              {
                text: 'Lo que cambió no fue solo mi cuerpo. Cambié yo. Empecé a ir a sitios que antes evitaba, a ponerme ropa que tenía guardada. Me sentí cómoda en mi propio cuerpo por primera vez desde que era adolescente.',
                name: 'Mujer, 29 años',
                badge: 'Cambio de autopercepción',
              },
            ].map((t, index) => (
              <div
                key={index}
                className="p-8 rounded-xl"
                style={{ backgroundColor: '#1a1535', border: '2px solid #FCEE21' }}
              >
                <p className="text-gray-300 text-base leading-relaxed italic mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-white font-bold">{t.name}</span>
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
                  >
                    {t.badge}
                  </span>
                </div>
              </div>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* FAQ */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-20 md:py-28">
        <Container>
          <AnimatedSection>
            <h2 style={{ color: '#FCEE21' }} className="text-4xl md:text-5xl font-bold mb-12 tracking-wide">
              Preguntas frecuentes
            </h2>
          </AnimatedSection>
          <StaggerChildren className="grid md:grid-cols-2 gap-8 max-w-4xl" stagger={0.08}>
            {[
              {
                q: '¿Cómo es la valoración gratuita?',
                a: 'Es una conversación de 20-30 minutos donde me cuentas tu situación, historial, objetivos y disponibilidad. Analizo tu caso y te digo honestamente si puedo ayudarte y cómo. Si no eres el perfil adecuado para lo que ofrezco, también te lo digo. Sin presión ni ventas agresivas.',
              },
              {
                q: '¿Puedo cambiar de plan?',
                a: 'Sí, sin ningún problema. Puedes cambiar, pausar o cancelar en cualquier momento. Sin permanencia, sin penalización, sin letra pequeña.',
              },
              {
                q: '¿Incluye nutrición?',
                a: 'El Pack 3 meses y el Pack 6 meses Transformación incluyen pautas nutricionales básicas adaptadas a tu objetivo. El plan Premium incluye un plan nutricional completo y seguimiento continuo. Si quieres nutrición más detallada en cualquier plan, puedes añadir una consulta individual de nutrición por 50€.',
              },
              {
                q: '¿Qué pasa si no veo resultados?',
                a: 'Si sigues el plan correctamente y no ves progreso, revisamos todo sin coste adicional y ajustamos hasta que funcione. En más de 100 clientes nunca he tenido que aplicar esta garantía porque el método funciona — pero existe porque confío en el proceso y en que si algo no avanza, hay una razón que encontraremos juntos.',
              },
              {
                q: '¿Hay descuento por pago anual?',
                a: 'Sí. Si quieres comprometerte a 6 o 12 meses, contacta directamente y te hago una propuesta con descuento adicional. Es la opción más rentable para quien tiene claro que quiere un cambio definitivo.',
              },
              {
                q: '¿Qué necesito para empezar?',
                a: 'Solo un móvil con la app instalada. Puedes entrenar en casa, en el gimnasio, en un parque — donde quieras. El plan se adapta al espacio y material que tengas disponible, no al contrario.',
              },
              {
                q: '¿Puedo combinar servicios?',
                a: 'Sí. Puedes añadir consultas de nutrición, sesiones de osteopatía o análisis corporal a cualquier plan. Cuéntame tu situación en la valoración gratuita y buscamos la combinación que más te conviene.',
              },
              {
                q: '¿Funciona si tengo muy poco tiempo?',
                a: 'Es precisamente para quien tiene poco tiempo. Las sesiones están diseñadas para ser efectivas en 30-45 minutos. Lo importante no es cuánto tiempo tienes — es usarlo bien.',
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
          </StaggerChildren>
        </Container>
      </section>

      {/* CTA Lead Magnet */}
      <section style={{ backgroundColor: '#16122B' }} className="py-16">
        <Container>
          <AnimatedSection>
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
          </AnimatedSection>
        </Container>
      </section>

      {/* CTA Final */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-20">
        <Container className="text-center">
          <AnimatedSection>
            <h2 style={{ color: '#FCEE21' }} className="text-4xl md:text-5xl font-bold mb-6">
              ¿Dudas? Hablemos
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Cuéntame tu situación y te ayudo a elegir el plan que mejor encaja contigo.
            </p>
            <MagneticButton>
              <a
                href={whatsappUrl('Valoración gratuita')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: '#FCEE21', color: '#16122B', boxShadow: '0 0 20px rgba(252, 238, 33, 0.3)' }}
              >
                Solicitar valoración gratuita
              </a>
            </MagneticButton>
          </AnimatedSection>
        </Container>
      </section>

      <ExitIntentPopup />
    </>
  )
}
