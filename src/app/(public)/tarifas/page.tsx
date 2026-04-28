import Container from '@/components/common/Container'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
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

const PROCESS_STEPS = [
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
] as const

const TESTIMONIALS = [
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
] as const

const FAQ_ITEMS = [
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
] as const

export default function TarifasPage() {
  return (
    <>
      <JsonLd
        data={offerSchema([
          { name: 'Pack 3 Meses', price: '450', description: 'Plan personalizado en app, 12 semanas de seguimiento con ajustes semanales, revisión mensual en profundidad y pautas nutricionales básicas.' },
          { name: 'Pack 6 Meses Transformación', price: '750', description: '26 semanas de seguimiento continuo. El tiempo real para consolidar hábitos. Mejor precio mensual del catálogo (125€/mes).' },
          { name: 'Premium - 3 Meses', price: '990', description: 'Acompañamiento 1-a-1: sesión inicial de 90 min, videollamada semanal con slot fijo, plan nutricional completo, WhatsApp prioritario con respuesta en menos de 2h y revisión quincenal del plan.' },
        ])}
      />
      <JsonLd data={faqSchema(FAQ_ITEMS.map(({ q, a }) => ({ question: q, answer: a })))} />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative py-fluid-xl overflow-hidden bg-brand-deep">
        <div className="absolute inset-0 bg-radial-accent opacity-80" />
        <div className="absolute inset-0 bg-grid-soft opacity-40" />
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full bg-brand-violet/20 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <Container>
          <HeroAnimation>
            <div className="relative max-w-4xl space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-subtle bg-accent-muted backdrop-blur-sm animate-fade-in">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span className="text-fluid-xs font-semibold tracking-wider uppercase text-accent">
                  Planes y tarifas
                </span>
              </div>

              <h1 className="headline text-fluid-7xl text-white animate-fade-up">
                Planes que se <span className="text-gradient-brand">adaptan a ti.</span>
              </h1>

              <p className="text-fluid-xl text-white/85 leading-relaxed max-w-2xl font-medium animate-fade-up [animation-delay:100ms]">
                Sin permanencias, sin letra pequeña.{' '}
                <span className="text-accent font-semibold">La valoración inicial siempre es gratuita.</span>
              </p>

              <p className="text-fluid-base text-muted max-w-2xl leading-relaxed animate-fade-up [animation-delay:200ms]">
                Elige el plan que mejor encaje con tu momento. Todos incluyen plan personalizado, app profesional y
                seguimiento semanal. La diferencia está en la intensidad y el acompañamiento.
              </p>
            </div>
          </HeroAnimation>
        </Container>
      </section>

      {/* ═══════════════ PROCESO ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-dusk">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <Container>
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-fluid-lg">
              <span className="eyebrow justify-center">El camino</span>
              <h2 className="headline text-fluid-4xl text-white">Así es el proceso</h2>
              <p className="text-fluid-lg text-muted leading-relaxed">
                Cuatro pasos. Claros, sencillos, sin humo.
              </p>
            </div>
          </AnimatedSection>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((item) => (
              <article
                key={item.step}
                className="step-card group relative surface-card rounded-2xl p-7 overflow-hidden cursor-default"
              >
                <span
                  aria-hidden
                  className="absolute top-3 right-4 font-display text-fluid-5xl font-extrabold text-accent/15 leading-none select-none"
                >
                  {item.step}
                </span>
                <div className="relative">
                  <span className="eyebrow text-fluid-xs mb-3">Paso {item.step}</span>
                  <h3 className="text-fluid-xl text-white mt-3 mb-3 tracking-tight">{item.title}</h3>
                  <p className="text-fluid-sm text-muted leading-relaxed">{item.desc}</p>
                </div>
              </article>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* ═══════════════ SELECTOR ACORDEÓN ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-deep">
        <Container>
          <AnimatedSection>
            <PlanSelector />
          </AnimatedSection>
        </Container>
      </section>

      {/* ═══════════════ PRICING CARDS ═══════════════ */}
      <PricingCards />

      {/* ═══════════════ TESTIMONIOS ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-deep">
        <Container>
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-fluid-lg">
              <span className="eyebrow justify-center">Prueba social</span>
              <h2 className="headline text-fluid-4xl text-white">
                Lo que dicen <span className="text-gradient-brand">quienes ya pasaron por aquí</span>
              </h2>
            </div>
          </AnimatedSection>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {TESTIMONIALS.map((t, index) => (
              <figure key={index} className="surface-card rounded-2xl p-8 relative hover-lift">
                <span
                  aria-hidden
                  className="absolute top-4 right-6 font-display text-fluid-6xl text-accent/20 leading-none select-none"
                >
                  &ldquo;
                </span>
                <blockquote className="text-fluid-base text-white/90 leading-relaxed italic relative">
                  {t.text}
                </blockquote>
                <figcaption className="flex items-center justify-between flex-wrap gap-3 mt-6 pt-5 border-t border-border-subtle">
                  <span className="text-fluid-sm font-semibold text-white">{t.name}</span>
                  <span className="shrink-0 px-3 py-1 rounded-full text-fluid-xs font-bold bg-accent text-accent-fg">
                    {t.badge}
                  </span>
                </figcaption>
              </figure>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-dusk">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <Container>
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-fluid-lg">
              <span className="eyebrow justify-center">Dudas</span>
              <h2 className="headline text-fluid-4xl text-white">Preguntas frecuentes</h2>
              <p className="text-fluid-lg text-muted leading-relaxed">
                Todo lo que normalmente se pregunta antes de dar el paso.
              </p>
            </div>
          </AnimatedSection>

          <StaggerChildren className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto" stagger={0.08}>
            {FAQ_ITEMS.map((faq, index) => (
              <article
                key={index}
                className="surface-card rounded-2xl p-7 border-l-4 border-l-accent hover-lift"
              >
                <h3 className="text-fluid-lg font-semibold text-white mb-3 tracking-tight">{faq.q}</h3>
                <p className="text-fluid-sm text-muted leading-relaxed">{faq.a}</p>
              </article>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* ═══════════════ LEAD MAGNET CTA ═══════════════ */}
      <section className="relative py-fluid-lg bg-brand-deep">
        <Container>
          <AnimatedSection>
            <div className="max-w-3xl mx-auto surface-card-accent rounded-2xl p-fluid-md text-center space-y-5">
              <h2 className="headline text-fluid-3xl text-white">
                ¿Todavía <span className="text-gradient-brand">no lo tienes claro?</span>
              </h2>
              <p className="text-fluid-lg text-muted max-w-xl mx-auto leading-relaxed">
                Descarga la guía gratuita y empieza a entender qué necesitas realmente.
              </p>
              <div className="pt-2">
                <Link href="/recurso-gratis" className="btn-brand text-fluid-base">
                  Descargar guía gratis
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* ═══════════════ CTA FINAL ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-dusk overflow-hidden">
        <div className="absolute inset-0 bg-grid-soft opacity-30" />
        <div className="absolute inset-0 bg-radial-accent opacity-40" />
        <Container>
          <AnimatedSection>
            <div className="relative max-w-3xl mx-auto text-center space-y-8">
              <span className="eyebrow justify-center">Último paso</span>
              <h2 className="headline text-fluid-5xl text-white">
                ¿Dudas? <span className="text-gradient-brand">Hablemos.</span>
              </h2>
              <p className="text-fluid-xl text-muted leading-relaxed max-w-2xl mx-auto">
                Cuéntame tu situación y te ayudo a elegir el plan que mejor encaja contigo.
              </p>
              <div className="pt-2">
                <MagneticButton strength={0.25}>
                  <a
                    href={whatsappUrl('Valoración gratuita')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-brand text-fluid-lg px-10 py-5"
                  >
                    Solicitar valoración gratuita
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </MagneticButton>
              </div>
              <p className="text-fluid-xs text-white/40 pt-2">
                Sin compromiso. Respondo personalmente por WhatsApp.
              </p>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      <ExitIntentPopup />
    </>
  )
}
