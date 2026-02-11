import Image from 'next/image'
import Container from '@/components/common/Container'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Check } from 'lucide-react'
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
          { name: 'Inicio', url: 'https://wellnessreal.es' },
          { name: 'Servicios', url: 'https://wellnessreal.es/servicios' },
          { name: 'Nutrición', url: 'https://wellnessreal.es/servicios/nutricion' },
        ])}
      />
    <section style={{ backgroundColor: '#16122B' }} className="py-20">
      <Container>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-wider" style={{ color: '#FCEE21' }}>
              Nutrición Personalizada
            </h1>
            <p className="text-2xl text-gray-300 mb-6 font-semibold">
              Nunca más menús de cartón ni reglas imposibles. Aquí tus pautas se adaptan a tu ritmo, tus gustos y tu realidad. Cada recomendación, receta y ajuste lo hago contigo y para ti, para que no sólo veas resultados: los mantengas y los disfrutes.
            </p>
            <ul className="mb-8 space-y-4 text-gray-200 text-lg">
              <li className="flex items-start gap-2">
                <Check size={22} style={{ color: '#FCEE21', minWidth: 22 }} />
                <span>Pautas flexibles ajustadas a tu contexto: horarios, familia, trabajo y preferencias.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={22} style={{ color: '#FCEE21', minWidth: 22 }} />
                <span>Recetas y opciones adaptadas (con lista de compra automática) para que no pierdas tiempo ni energía.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={22} style={{ color: '#FCEE21', minWidth: 22 }} />
                <span>Seguimiento real, progresos visibles y ajustes al vuelo. Sin burocracia, sin demora.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={22} style={{ color: '#FCEE21', minWidth: 22 }} />
                <span>Educación nutricional sencilla para que entiendas, disfrutes y seas autónomo.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={22} style={{ color: '#FCEE21', minWidth: 22 }} />
                <span>¡Nada de prohibiciones absurdas! Aprendes a comer para sentirte y verte mejor sin sacrificar tu vida social.</span>
              </li>
            </ul>
            <Link href="/contacto">
              <Button size="lg" variant="primary" className="uppercase tracking-widest font-bold px-8 py-3 rounded-xl">
                🚀 Quiero mi valoración nutricional gratis
              </Button>
            </Link>
            <p className="mt-8 text-base md:text-lg text-gray-400">
              Empieza hoy y verás que cuidar tu nutrición nunca ha sido tan sencillo, motivador y efectivo.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
          <Image
            src="/images/wr_nutrition_european.png"
            alt="Nutrición personalizada"
            width={420}
            height={420}
            className="rounded-xl object-cover border-4 border-[#662D91]"
          />
          </div>
        </div>
      </Container>
    </section>
    </>
  )
}
