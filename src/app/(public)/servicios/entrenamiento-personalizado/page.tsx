import Container from '@/components/common/Container'
import Link from 'next/link'
import { MapPin, Clock, Users, Target, Dumbbell, CheckCircle, ArrowRight, Sparkles } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import JsonLd, { serviceSchema, breadcrumbSchema } from '@/components/seo/JsonLd'
import FaqSection from '@/components/sections/FaqSection'

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

const FEATURES = [
  { icon: Target,   title: 'Plan 100% personalizado', desc: 'Diseñado para tus objetivos específicos, tu nivel actual y tu disponibilidad de tiempo.' },
  { icon: Dumbbell, title: 'Supervisión constante',   desc: 'Corrección de técnica en tiempo real para maximizar resultados y evitar lesiones.' },
  { icon: Users,    title: 'Atención exclusiva',      desc: 'Sesiones individuales donde toda mi atención está puesta en ti y tu progreso.' },
] as const

const FIT_ITEMS = [
  'Prefieres que alguien te guíe en cada ejercicio',
  'Quieres asegurarte de hacer los ejercicios correctamente',
  'Necesitas esa motivación extra que da tener a alguien contigo',
  'Tienes un objetivo específico y quieres el camino más directo',
  'Has tenido lesiones y quieres entrenar con seguridad',
] as const

const FAQS = [
  {
    question: '¿Dónde se realizan las sesiones de entrenamiento personal?',
    answer:
      'Entreno a domicilio o en gimnasio dentro de Madrid, según lo que te resulte más cómodo. Llevo el material necesario y adapto la sesión al espacio disponible. Si prefieres tu propio gimnasio, también trabajo allí contigo.',
  },
  {
    question: '¿Cuánto dura cada sesión y con qué frecuencia entreno?',
    answer:
      'Cada sesión dura 60 minutos. Para la mayoría de objetivos recomiendo 2-3 sesiones a la semana, pero lo ajustamos a tu disponibilidad y a tu nivel. Lo importante es la constancia, no la intensidad puntual.',
  },
  {
    question: '¿Necesito tener experiencia previa entrenando?',
    answer:
      'No. Empiezo desde donde estés. De hecho, el entrenamiento presencial es ideal si nunca has entrenado, porque corrijo tu técnica en tiempo real desde el primer día y evitamos que cojas malos hábitos o te lesiones.',
  },
  {
    question: '¿Puedo combinar las sesiones presenciales con el seguimiento online?',
    answer:
      'Sí, es la opción que mejores resultados da. Nos vemos en persona para trabajar técnica y los ejercicios clave, y el resto de la semana entrenas con tu plan en la app, con mi seguimiento. Tienes lo mejor de los dos mundos.',
  },
  {
    question: '¿Qué pasa si tengo una lesión o una limitación física?',
    answer:
      'Lo tengo en cuenta desde el principio. En la valoración inicial revisamos tu historial y cualquier lesión o molestia, y diseño las sesiones para trabajar con seguridad. Si hace falta, coordino el entrenamiento con tratamiento de osteopatía.',
  },
  {
    question: '¿Cómo es la primera sesión?',
    answer:
      'La primera sesión es una valoración: hablamos de tus objetivos, valoro tu nivel y movilidad, y definimos un punto de partida. Sales de ahí con un plan claro y sabiendo exactamente cómo vamos a trabajar. Sin compromiso.',
  },
] as const

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
          { name: 'Inicio',                      url: 'https://wellnessreal.es' },
          { name: 'Servicios',                   url: 'https://wellnessreal.es/servicios' },
          { name: 'Entrenamiento Personalizado', url: 'https://wellnessreal.es/servicios/entrenamiento-personalizado' },
        ])}
      />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative py-fluid-xl overflow-hidden bg-brand-deep">
        <div className="absolute inset-0 bg-radial-accent opacity-70" />
        <div className="absolute inset-0 bg-grid-soft opacity-40" />
        <Container>
          <div className="relative max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-subtle bg-accent-muted backdrop-blur-sm animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-fluid-xs font-semibold tracking-wider uppercase text-accent">
                Entrenamiento presencial · Madrid
              </span>
            </div>

            <h1 className="headline text-fluid-7xl text-white animate-fade-up">
              Entrenamiento <span className="text-gradient-brand">personalizado.</span>
            </h1>

            <p className="text-fluid-xl text-white/85 leading-relaxed max-w-2xl font-medium animate-fade-up [animation-delay:100ms]">
              Sesiones 1 a 1 donde <span className="text-accent font-semibold">tú eres el centro</span>. Técnica
              perfecta, motivación constante y resultados que se ven.
            </p>

            <div className="pt-2 animate-fade-up [animation-delay:200ms]">
              <Link href="/valoracion" className="btn-brand text-fluid-base">
                Reservar sesión de prueba
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ QUÉ INCLUYE ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-dusk">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-fluid-lg">
            <span className="eyebrow justify-center">Lo que llevas</span>
            <h2 className="headline text-fluid-4xl text-white">¿Qué incluye?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <article key={i} className="surface-card rounded-2xl p-8 text-center hover-lift">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-accent-muted border border-border-strong mx-auto mb-5">
                  <Icon className="w-6 h-6 text-accent" strokeWidth={2.2} />
                </div>
                <h3 className="text-fluid-xl text-white mb-3 tracking-tight">{title}</h3>
                <p className="text-fluid-sm text-muted leading-relaxed">{desc}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════ PARA QUIÉN ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-deep">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-4 mb-fluid-md">
              <span className="eyebrow justify-center">Encaja contigo si</span>
              <h2 className="headline text-fluid-4xl text-white">
                Ideal <span className="text-gradient-brand">para ti si...</span>
              </h2>
            </div>

            <div className="space-y-3">
              {FIT_ITEMS.map((item, i) => (
                <div key={i} className="surface-card rounded-2xl flex items-start gap-4 p-5">
                  <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-accent" strokeWidth={2.2} />
                  </span>
                  <span className="text-fluid-base text-white/90 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ INFO PRÁCTICA ═══════════════ */}
      <section className="relative py-fluid-lg bg-brand-dusk">
        <Container>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <article className="surface-card rounded-2xl p-7 border-l-4 border-l-accent">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-5 h-5 text-accent" />
                <h3 className="text-fluid-lg font-semibold text-white">Ubicación</h3>
              </div>
              <p className="text-fluid-base text-muted leading-relaxed">
                Sesiones a domicilio o en gimnasio en Madrid.
              </p>
            </article>

            <article className="surface-card rounded-2xl p-7 border-l-4 border-l-accent">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-accent" />
                <h3 className="text-fluid-lg font-semibold text-white">Duración</h3>
              </div>
              <p className="text-fluid-base text-muted leading-relaxed">
                Sesiones de 60 minutos. Horarios flexibles adaptados a ti.
              </p>
            </article>
          </div>
        </Container>
      </section>

      {/* ═══════════════ EL MÉTODO ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-deep">
        <Container>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-4 mb-fluid-sm">
              <span className="eyebrow justify-center">Cómo trabajo</span>
              <h2 className="headline text-fluid-4xl text-white">
                Un entrenador personal <span className="text-gradient-brand">de verdad</span>
              </h2>
            </div>
            <div className="space-y-5 text-fluid-base text-white/80 leading-relaxed">
              <p>
                Buscar un <strong className="text-white">entrenador personal en Madrid</strong> no debería significar
                pagar por que alguien cuente repeticiones. Mi trabajo empieza antes de la primera serie: valoro tu
                nivel, tu movilidad, tu historial de lesiones y tus objetivos reales para construir un plan que tenga
                sentido para ti, no una sesión genérica que sirve para cualquiera.
              </p>
              <p>
                En cada sesión corrijo tu técnica en tiempo real, ajusto las cargas según cómo respondes ese día y me
                aseguro de que cada ejercicio suma. Esa supervisión directa es lo que diferencia entrenar bien de
                entrenar a ciegas: avanzas más rápido, con menos riesgo de lesión y entendiendo por qué haces cada
                cosa. Con 14 años de experiencia y más de 100 personas acompañadas, sé leer lo que tu cuerpo necesita
                en cada fase.
              </p>
              <p>
                Y no te dejo solo entre sesiones. Combino el trabajo presencial con seguimiento a través de la app, de
                forma que los días que entrenas por tu cuenta también sabes exactamente qué hacer. El objetivo es que
                ganes autonomía y resultados que se mantengan, no que dependas de mí para siempre.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <FaqSection faqs={[...FAQS]} background="dusk" />

      {/* ═══════════════ CTA FINAL ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-deep overflow-hidden">
        <div className="absolute inset-0 bg-radial-accent opacity-40" />
        <Container>
          <div className="relative max-w-3xl mx-auto text-center space-y-8">
            <span className="eyebrow justify-center">Último paso</span>
            <h2 className="headline text-fluid-5xl text-white">
              ¿<span className="text-gradient-brand">Empezamos?</span>
            </h2>
            <p className="text-fluid-xl text-muted leading-relaxed max-w-2xl mx-auto">
              Reserva tu primera sesión de valoración. Sin compromiso, sin presión. Solo hablamos de ti y tus objetivos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link href="/valoracion" className="btn-brand text-fluid-base px-8">
                Reservar sesión de prueba
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/34633261963?text=Hola%2C%20me%20interesa%20el%20entrenamiento%20presencial%20en%20Madrid.%20Me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-fluid-base px-8"
              >
                Consultar disponibilidad
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
