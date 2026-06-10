import Image from 'next/image'
import Container from '@/components/common/Container'
import Link from 'next/link'
import { Check, ArrowRight, Sparkles } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import JsonLd, { serviceSchema, breadcrumbSchema } from '@/components/seo/JsonLd'
import FaqSection from '@/components/sections/FaqSection'

export const metadata = buildMetadata({
  title: 'Osteopatía y Recuperación en Madrid',
  description:
    'Osteopatía y recuperación de lesiones en Madrid. Tratamiento personalizado, prevención y optimización del rendimiento físico. Sesiones presenciales.',
  path: '/servicios/osteopatia',
  keywords: [
    'osteopatía Madrid',
    'recuperación lesiones',
    'osteópata Madrid',
    'tratamiento lesiones musculares',
    'fisioterapia Madrid',
  ],
})

const BENEFITS = [
  'Tratamiento personalizado de lesiones, tensiones y bloqueos musculares.',
  'Prevención efectiva: cuida tu cuerpo antes de que falle.',
  'Mejora de rendimiento físico y recuperación acelerada.',
  'Integrado con tu plan de entrenamiento para resultados máximos.',
  'Sesiones presenciales en Madrid con atención profesional.',
] as const

const FAQS = [
  {
    question: '¿Qué problemas trata la osteopatía?',
    answer:
      'Dolores de espalda y cuello, contracturas, tensiones musculares, bloqueos articulares, molestias derivadas de malas posturas y recuperación de lesiones deportivas. Trabajo con técnicas manuales para aliviar el dolor, recuperar movilidad y mejorar cómo se mueve tu cuerpo.',
  },
  {
    question: '¿La primera sesión incluye tratamiento o solo valoración?',
    answer:
      'La primera sesión incluye una valoración completa de tu caso y, salvo que encuentre algo que requiera derivarte, también tratamiento. Reviso tu historial, identifico el origen del problema y empiezo a trabajar sobre él el mismo día.',
  },
  {
    question: '¿Cuántas sesiones voy a necesitar?',
    answer:
      'Depende del problema. Una tensión puntual puede resolverse en 1-2 sesiones; una lesión o un patrón más arraigado requiere un plan de varias sesiones. Tras la primera valoración te doy una estimación realista, sin alargar el tratamiento artificialmente.',
  },
  {
    question: '¿Es compatible con mi entrenamiento?',
    answer:
      'No solo compatible: se potencian. Cuando integro la osteopatía con tu plan de entrenamiento, trato la causa del problema y ajusto los ejercicios para que no reaparezca. Es la mejor forma de entrenar con seguridad y prevenir lesiones futuras.',
  },
  {
    question: '¿Dónde se realizan las sesiones?',
    answer:
      'Las sesiones de osteopatía son presenciales, en Madrid. Si entrenas conmigo de forma presencial, coordinamos ambas cosas para que te resulte cómodo. En la reserva acordamos lugar y horario.',
  },
  {
    question: '¿Es un tratamiento doloroso o invasivo?',
    answer:
      'No. La osteopatía trabaja con técnicas manuales, sin fármacos ni procedimientos invasivos. Puede haber alguna molestia puntual al tratar una zona tensa, pero siempre adapto la intensidad a ti y a tu tolerancia. El objetivo es aliviar, no añadir dolor.',
  },
] as const

export default function OsteopatiaRecuperacionPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'Osteopatía y Recuperación',
          description: 'Tratamiento personalizado de lesiones, prevención y optimización del rendimiento físico en Madrid.',
          url: 'https://wellnessreal.es/servicios/osteopatia',
          areaServed: 'Madrid, Cantabria, ES',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Inicio',    url: 'https://wellnessreal.es' },
          { name: 'Servicios', url: 'https://wellnessreal.es/servicios' },
          { name: 'Osteopatía', url: 'https://wellnessreal.es/servicios/osteopatia' },
        ])}
      />

      <section className="relative py-fluid-xl overflow-hidden bg-brand-deep">
        <div className="absolute inset-0 bg-radial-accent opacity-70" />
        <div className="absolute inset-0 bg-grid-soft opacity-30" />
        <Container>
          <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-fluid-md items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-subtle bg-accent-muted backdrop-blur-sm animate-fade-in">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span className="text-fluid-xs font-semibold tracking-wider uppercase text-accent">
                  Osteopatía · Madrid
                </span>
              </div>

              <h1 className="headline text-fluid-6xl text-white">
                Osteopatía y <span className="text-gradient-brand">recuperación.</span>
              </h1>

              <p className="text-fluid-lg text-muted leading-relaxed">
                Alivia el dolor, recupera movilidad y optimiza tu rendimiento con técnicas manuales avanzadas. Sin
                pastillas, sin tratamientos invasivos.{' '}
                <span className="text-white font-semibold">Solo ciencia aplicada al cuidado de tu cuerpo.</span>
              </p>

              <ul className="space-y-3 pt-2">
                {BENEFITS.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-fluid-base text-white/90">
                    <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-accent" strokeWidth={3} />
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <Link href="/valoracion" className="btn-brand text-fluid-base">
                  Reservar sesión
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <p className="text-fluid-sm text-subtle pt-2">
                Tu cuerpo tiene la capacidad de recuperarse. Dale el impulso que necesita para volver a rendir al 100%.
              </p>
            </div>

            <div className="relative flex justify-center">
              <div className="absolute -inset-8 bg-accent/10 rounded-full blur-3xl" />
              <Image
                src="/images/wr_osteopathy_clinical.png"
                alt="Osteopatía y recuperación"
                width={420}
                height={420}
                className="relative rounded-2xl object-cover border border-border-strong shadow-xl"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ EL MÉTODO ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-dusk">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <Container>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-4 mb-fluid-sm">
              <span className="eyebrow justify-center">Cómo trabajo</span>
              <h2 className="headline text-fluid-4xl text-white">
                Trato la causa, <span className="text-gradient-brand">no solo el síntoma</span>
              </h2>
            </div>
            <div className="space-y-5 text-fluid-base text-white/80 leading-relaxed">
              <p>
                Cuando algo te duele, lo fácil es tratar el punto donde sientes la molestia. El problema es que muchas
                veces el dolor aparece en un sitio y se origina en otro. Mi enfoque de{' '}
                <strong className="text-white">osteopatía en Madrid</strong> empieza por entender de dónde viene
                realmente: tu postura, tus hábitos, tu forma de moverte y la actividad física que haces. Solo así el
                alivio dura y el problema no vuelve a las dos semanas.
              </p>
              <p>
                En cada sesión combino técnicas manuales para liberar tensiones, recuperar movilidad y devolver al
                cuerpo su capacidad natural de moverse sin dolor. Es un tratamiento sin fármacos ni procedimientos
                invasivos, adaptado a tu tolerancia y a tu situación concreta. Tanto si vienes por una lesión deportiva,
                una contractura persistente o simplemente para prevenir, el punto de partida siempre es una valoración
                honesta de tu caso.
              </p>
              <p>
                La gran ventaja de tratarte conmigo es la integración con el entrenamiento. Cuando la osteopatía y tu
                plan de ejercicio van de la mano, no solo resuelvo el problema actual: ajusto cómo entrenas para que no
                reaparezca. Cuidar el cuerpo antes de que falle es mucho más rentable —y menos doloroso— que reparar
                una lesión cuando ya te ha frenado.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <FaqSection faqs={[...FAQS]} background="deep" />
    </>
  )
}
