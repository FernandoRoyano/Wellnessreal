import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Guía Gratis de Fitness Real',
  description:
    'Descarga gratis la guía de fitness real para gente con vida real. Sin dietas extremas, sin vivir en el gimnasio. Aprende a ponerte en forma con sentido.',
  path: '/recurso-gratis',
  keywords: [
    'guía fitness gratis',
    'recurso entrenamiento gratuito',
    'guía ponerse en forma',
    'fitness para principiantes',
    'ebook fitness gratis',
  ],
})

export default function RecursoGratisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
