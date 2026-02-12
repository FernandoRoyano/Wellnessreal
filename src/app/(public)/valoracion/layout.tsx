import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Valoración Gratuita | Tu Plan Personalizado',
  description:
    'Solicita tu valoración gratuita. Respondemos unas preguntas sobre tu situación y te diseñamos un plan de entrenamiento personalizado. Sin compromiso.',
  path: '/valoracion',
  keywords: [
    'valoración gratuita entrenamiento',
    'plan personalizado fitness',
    'consulta gratis entrenador personal',
    'análisis fitness gratuito',
  ],
})

export default function ValoracionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
