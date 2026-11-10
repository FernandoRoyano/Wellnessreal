import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Fuerza para la vida real | Guía gratuita',
  description:
    'Fuerza para la vida real: guía gratuita de 20 páginas con ejercicios ilustrados, variantes, nutrición para la salud y un plan rellenable. Mira dos páginas de muestra.',
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
