import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import Script from 'next/script'
import JsonLd, { organizationSchema } from '@/components/seo/JsonLd'
import WhatsAppBubble from '@/components/common/WhatsAppBubble'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export const metadata: Metadata = {
  metadataBase: new URL('https://wellnessreal.es'),
  title: {
    default: 'WellnessReal | Entrenamiento Online Personalizado en Madrid',
    template: '%s | WellnessReal',
  },
  description:
    'Entrenamiento online personalizado, nutrición y osteopatía. Planes adaptados a tu vida real con app profesional y seguimiento semanal. Primera valoración gratis.',
  keywords:
    'entrenamiento online personalizado, entrenador personal Madrid, nutrición personalizada, osteopatía, fitness online, entrenamiento a distancia, app entrenamiento',
  authors: [{ name: 'WellnessReal' }],
  creator: 'WellnessReal',
  publisher: 'WellnessReal',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://wellnessreal.es',
    siteName: 'WellnessReal',
    title: 'WellnessReal | Entrenamiento Online Personalizado en Madrid',
    description:
      'Entrenamiento online personalizado, nutrición y osteopatía. Planes adaptados a tu vida real con app profesional y seguimiento semanal.',
    images: [
      {
        url: '/portada-WR.jpg',
        width: 1200,
        height: 630,
        alt: 'WellnessReal - Entrenamiento Online Personalizado',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WellnessReal | Entrenamiento Online Personalizado',
    description:
      'Planes de entrenamiento y nutrición adaptados a tu vida real. App profesional + seguimiento semanal.',
    images: ['/portada-WR.jpg'],
  },
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION && {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    }),
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${montserrat.variable}`}>
      <head>
        <JsonLd data={organizationSchema()} />
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
      </head>
      <body className="font-sans bg-morado-intenso text-white">
        {children}
        <WhatsAppBubble />
      </body>
    </html>
  )
}
