import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'WellnessReal - Entrenamiento, Nutrición y Osteopatía en Madrid',
  description:
    'Transforma tu salud con planes personalizados de entrenamiento, nutrición y recuperación. Primera sesión gratuita.',
  keywords: 'entrenamiento personal, nutrición, osteopatía, madrid, wellness, fitness',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${montserrat.variable}`}>
      <body className="font-sans bg-morado-intenso text-white">
        {children}
      </body>
    </html>
  )
}
