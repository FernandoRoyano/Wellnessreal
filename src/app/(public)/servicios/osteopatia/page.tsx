import Image from 'next/image'
import Container from '@/components/common/Container'
import Link from 'next/link'
import { Check, ArrowRight, Sparkles } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import JsonLd, { serviceSchema, breadcrumbSchema } from '@/components/seo/JsonLd'

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
    </>
  )
}
