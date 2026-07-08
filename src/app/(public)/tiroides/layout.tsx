import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Guía gratis: entrenar y adelgazar con hipotiroidismo',
  description:
    'Descarga gratis la guía sin milagros para entender tu tiroides y tu peso. Qué funciona de verdad con hipotiroidismo y Hashimoto, sin dietas extremas.',
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
