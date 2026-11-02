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
    'Sesiones de técnicas manuales en Madrid para trabajar movilidad y bienestar, con valoración previa y límites claros. No sustituyen la atención sanitaria.',
  path: '/servicios/osteopatia',
  keywords: [
    'osteopatía Madrid',
    'recuperación lesiones',
    'osteópata Madrid',
    'tratamiento lesiones musculares',
  ],
})

const BENEFITS = [
  'Técnicas manuales adaptadas a tu tolerancia y contexto.',
  'Trabajo de movilidad y bienestar con valoración previa.',
  'Sin promesas de curación ni plazos de recuperación garantizados.',
  'Coordinación con tu entrenamiento cuando resulte adecuado.',
  'Sesiones presenciales en Madrid con atención profesional.',
] as const

const FAQS = [
  {
    question: '¿Qué puedo esperar de una sesión?',
    answer:
      'Una valoración del contexto y técnicas manuales orientadas a movilidad y bienestar, adaptadas a tu tolerancia. No sustituye el diagnóstico ni el tratamiento de una lesión por un profesional sanitario.',
  },
  {
    question: '¿La primera sesión incluye tratamiento o solo valoración?',
    answer:
      'Primero revisamos tu situación y el alcance de la sesión. Si hay síntomas que requieren valoración sanitaria, esa revisión tiene prioridad sobre cualquier técnica manual.',
  },
  {
    question: '¿Cuántas sesiones voy a necesitar?',
    answer:
      'Depende de tu situación y respuesta. No se garantiza resolver una molestia en un número fijo de sesiones. Revisamos si tiene sentido continuar y cuándo conviene consultar con un profesional sanitario.',
  },
  {
    question: '¿Es compatible con mi entrenamiento?',
    answer:
      'Podemos coordinar el trabajo de movilidad con el entrenamiento, respetando las indicaciones de tu equipo sanitario cuando existan. No se garantiza prevenir lesiones ni evitar que reaparezcan molestias.',
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
          description: 'Técnicas manuales y trabajo de movilidad en Madrid, con valoración previa y sin sustituir atención sanitaria.',
          url: 'https://wellnessreal.es/servicios/osteopatia',
          areaServed: 'Madrid, ES',
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
                Técnicas manuales orientadas a movilidad y bienestar, adaptadas a tu contexto.{' '}
                <span className="text-white font-semibold">No sustituyen un diagnóstico ni un tratamiento sanitario.</span>
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
                Primero el contexto, <span className="text-gradient-brand">después la intervención</span>
              </h2>
            </div>
            <div className="space-y-5 text-fluid-base text-white/80 leading-relaxed">
              <p>
                Antes de una sesión revisamos qué te preocupa, cómo te mueves y qué indicaciones sanitarias tienes.
                El dolor puede tener causas distintas y una sesión manual no permite diagnosticarlas por sí sola.
              </p>
              <p>
                Las técnicas se adaptan a tu tolerancia y se revisa su utilidad según tu respuesta. No se prometen
                curaciones, recuperación acelerada ni prevención garantizada. Si aparecen síntomas nuevos,
                persistentes o preocupantes, corresponde consultar con un profesional sanitario.
              </p>
              <p>
                Cuando también entrenas conmigo, podemos coordinar el trabajo de movilidad y la programación,
                respetando los límites del servicio y las indicaciones de tu equipo sanitario.
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
