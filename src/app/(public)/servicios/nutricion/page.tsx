import Image from 'next/image'
import Container from '@/components/common/Container'
import Link from 'next/link'
import { Check, ArrowRight, Sparkles } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import JsonLd, { serviceSchema, breadcrumbSchema } from '@/components/seo/JsonLd'
import FaqSection from '@/components/sections/FaqSection'

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

const FAQS = [
  {
    question: '¿Es una dieta cerrada con menús fijos?',
    answer:
      'No. Trabajo con pautas flexibles, no con menús de cartón que abandonas a la semana. Aprendes a construir tus comidas con los alimentos que te gustan y a adaptarlas a tu día a día. El objetivo es que comas bien sin sentir que estás a dieta.',
  },
  {
    question: '¿Tengo que renunciar a comer fuera o a mi vida social?',
    answer:
      'En absoluto. Una pauta que te impide salir a cenar o tomar algo con amigos no sirve, porque no se sostiene. Te enseño a gestionar esas situaciones para que disfrutes sin tirar por tierra tu progreso. La flexibilidad es parte del método, no la excepción.',
  },
  {
    question: '¿Necesito comprar suplementos o productos especiales?',
    answer:
      'No vendo suplementos ni te obligo a comprar nada. Trabajo con comida normal que encuentras en cualquier supermercado. Si en algún caso un suplemento concreto tiene sentido para tu situación, te lo explico con argumentos, sin venderte humo.',
  },
  {
    question: '¿Puedo combinar la nutrición con el entrenamiento?',
    answer:
      'Sí, y es donde mejores resultados se ven. Cuando entrenamiento y nutrición van coordinados, cada uno potencia al otro: progresas más rápido y los cambios se mantienen. Diseño ambos planes para que encajen entre sí y con tu vida.',
  },
  {
    question: '¿Cómo es el seguimiento si todo es online?',
    answer:
      'Revisamos tu evolución de forma periódica con datos reales y ajusto las pautas según cómo respondes. Tienes comunicación directa conmigo para dudas y cambios sobre la marcha. Estar a distancia no significa estar solo: el acompañamiento es constante.',
  },
  {
    question: '¿Sirve si mi objetivo no es perder peso?',
    answer:
      'Claro. Trabajo perder grasa, ganar masa muscular, mejorar el rendimiento, recomposición corporal o simplemente comer mejor y tener más energía. La pauta se diseña en torno a tu objetivo concreto, sea cual sea.',
  },
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

      {/* ═══════════════ EL MÉTODO ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-dusk">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <Container>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-4 mb-fluid-sm">
              <span className="eyebrow justify-center">Cómo trabajo</span>
              <h2 className="headline text-fluid-4xl text-white">
                Nutrición sin dietas <span className="text-gradient-brand">imposibles</span>
              </h2>
            </div>
            <div className="space-y-5 text-fluid-base text-white/80 leading-relaxed">
              <p>
                La mayoría de las dietas fracasan por lo mismo: son tan rígidas que no aguantas más de dos semanas. Mi
                enfoque de <strong className="text-white">nutrición personalizada online</strong> parte de lo contrario.
                En lugar de imponerte un menú cerrado, construyo unas pautas flexibles alrededor de tus horarios, tus
                gustos, tu presupuesto y tu vida social. Si no puedes mantenerlo, no me sirve, por muy bien diseñado que
                esté sobre el papel.
              </p>
              <p>
                Más que darte de comer, te enseño a comer. Entender qué aporta cada alimento, cómo montar un plato
                equilibrado o gestionar una cena fuera te da autonomía para tomar buenas decisiones cuando yo no estoy
                delante. Esa educación nutricional es lo que convierte un cambio temporal en un hábito que se sostiene
                solo, sin contar calorías obsesivamente ni pesar cada gramo.
              </p>
              <p>
                Todo el seguimiento es online, con revisiones periódicas y ajustes según cómo respondes. Y si además
                entrenas conmigo, coordino nutrición y entrenamiento para que se potencien entre sí. El resultado no es
                un número en la báscula a corto plazo: es una relación sana y sostenible con la comida que te acompaña
                el resto de tu vida.
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
