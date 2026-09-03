import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Entrenamiento y hábitos con hipotiroidismo | Test gratis',
  description:
    'Descubre qué priorizar en fuerza, hábitos y seguimiento si tienes hipotiroidismo o Hashimoto. Test orientativo gratuito, sin milagros ni promesas médicas.',
  path: '/tiroides',
  keywords: [
    'hipotiroidismo adelgazar',
    'entrenar con hipotiroidismo',
    'hashimoto perder peso',
    'guía tiroides gratis',
    'metabolismo lento',
  ],
})

export default function TiroidesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
