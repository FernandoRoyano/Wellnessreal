import Image from 'next/image'
import Container from '@/components/common/Container'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Check } from 'lucide-react'
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
          { name: 'Inicio', url: 'https://wellnessreal.es' },
          { name: 'Servicios', url: 'https://wellnessreal.es/servicios' },
          { name: 'Osteopatía', url: 'https://wellnessreal.es/servicios/osteopatia' },
        ])}
      />
    <section style={{ backgroundColor: '#16122B' }} className="py-20">
      <Container>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-wider" style={{ color: '#FCEE21' }}>
              Osteopatía y Recuperación
            </h1>
            <p className="text-2xl text-gray-300 mb-6 font-semibold">
              Alivia el dolor, recupera movilidad y optimiza tu rendimiento con técnicas manuales avanzadas. Sin pastillas. Sin tratamientos invasivos. Solo ciencia aplicada al cuidado de tu cuerpo.
            </p>
            <ul className="mb-8 space-y-4 text-gray-200 text-lg">
              <li className="flex items-start gap-2">
                <Check size={22} style={{ color: '#FCEE21', minWidth: 22 }} />
                <span>Tratamiento personalizado de lesiones, tensiones y bloqueos musculares.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={22} style={{ color: '#FCEE21', minWidth: 22 }} />
                <span>Prevención efectiva: cuida tu cuerpo antes de que falle.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={22} style={{ color: '#FCEE21', minWidth: 22 }} />
                <span>Mejora de rendimiento físico y recuperación acelerada.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={22} style={{ color: '#FCEE21', minWidth: 22 }} />
                <span>Integrado con tu plan de entrenamiento para resultados máximos.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={22} style={{ color: '#FCEE21', minWidth: 22 }} />
                <span>Sesiones presenciales en Madrid con atención profesional.</span>
              </li>
            </ul>
            <Link href="/valoracion">
              <Button size="lg" variant="primary" className="uppercase tracking-widest font-bold px-8 py-3 rounded-xl">
                Reserva tu sesión ahora
              </Button>
            </Link>
            <p className="mt-8 text-base md:text-lg text-gray-400">
              Tu cuerpo tiene la capacidad de recuperarse. Dale el impulso que necesita para volver a rendir al 100%.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <Image
              src="/images/wr_osteopathy_clinical.png"
              alt="Osteopatía y recuperación"
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
