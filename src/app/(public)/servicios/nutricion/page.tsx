import Image from 'next/image'
import Container from '@/components/common/Container'
import Link from 'next/link'
import { Check, ArrowRight, Sparkles } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import JsonLd, { serviceSchema, breadcrumbSchema } from '@/components/seo/JsonLd'

export const metadata = buildMetadata({
  title: 'Nutrición Personalizada Online',
  description:
    'Pautas nutricionales adaptadas a tu vida, tus gustos y tu contexto. Sin dietas imposibles ni prohibiciones. Resultados que se mantienen.',
  path: '/servicios/nutricion',
  keywords: [
    'nutrición personalizada online',
    'pautas nutricionales',
    'dietista online',
    'nutricionista online España',
    'plan nutricional personalizado',
  ],
})

const BENEFITS = [
  'Pautas flexibles ajustadas a tu contexto: horarios, familia, trabajo y preferencias.',
  'Recetas y opciones adaptadas (con lista de compra automática) para que no pierdas tiempo ni energía.',
  'Seguimiento real, progresos visibles y ajustes al vuelo. Sin burocracia, sin demora.',
  'Educación nutricional sencilla para que entiendas, disfrutes y seas autónomo.',
  'Nada de prohibiciones absurdas: aprendes a comer sin sacrificar tu vida social.',
] as const

export default function NutricionPersonalizadaPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'Nutrición Personalizada Online',
          description: 'Pautas nutricionales adaptadas a tu vida, tus gustos y tu contexto. Sin dietas imposibles.',
          url: 'https://wellnessreal.es/servicios/nutricion',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Inicio',    url: 'https://wellnessreal.es' },
          { name: 'Servicios', url: 'https://wellnessreal.es/servicios' },
          { name: 'Nutrición', url: 'https://wellnessreal.es/servicios/nutricion' },
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
                  Nutrición online
                </span>
              </div>

              <h1 className="headline text-fluid-6xl text-white">
                Nutrición <span className="text-gradient-brand">personalizada.</span>
              </h1>

              <p className="text-fluid-lg text-muted leading-relaxed">
                Nunca más menús de cartón ni reglas imposibles. Tus pautas se adaptan a tu ritmo, tus gustos y tu realidad.
                Cada recomendación, receta y ajuste lo hago contigo y para ti, para que no solo veas resultados:{' '}
                <span className="text-white font-semibold">los mantengas y los disfrutes.</span>
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
                  Valoración nutricional gratis
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <p className="text-fluid-sm text-subtle pt-2">
                Empieza hoy y verás que cuidar tu nutrición nunca ha sido tan sencillo, motivador y efectivo.
              </p>
            </div>

            <div className="relative flex justify-center">
              <div className="absolute -inset-8 bg-accent/10 rounded-full blur-3xl" />
              <Image
                src="/images/wr_nutrition_european.png"
                alt="Nutrición personalizada"
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
