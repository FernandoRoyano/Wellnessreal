import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import { Montserrat, Bricolage_Grotesque } from 'next/font/google'
import Script from 'next/script'
import PrivacyAnalytics from '@/components/analytics/PrivacyAnalytics'
import JsonLd, { organizationSchema } from '@/components/seo/JsonLd'
import WhatsAppBubble from '@/components/common/WhatsAppBubble'
import TrackingScripts from '@/components/analytics/TrackingScripts'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: 'variable',
})

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
  weight: 'variable',
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
        url: '/images/portada-WR.jpg',
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
    images: ['/images/portada-WR.jpg'],
  },
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION && {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    }),
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#16122b',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning data-scroll-behavior="smooth" className={`${montserrat.variable} ${bricolage.variable}`}>
      <head>
        <script id="cookie-display" dangerouslySetInnerHTML={{ __html: `try{var c=localStorage.getItem('wr_cookie_consent_v2');if(c==='accepted'||c==='rejected')document.documentElement.dataset.cookieConsent=c;}catch(e){}` }} />
        <JsonLd data={organizationSchema()} />
        {GA_ID && (
          <>
            {/* Consent Mode v2: por defecto TODO denegado hasta que el usuario
                acepte en el banner (RGPD). Si ya aceptó antes, se concede. */}
            <Script id="consent-default" strategy="beforeInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;var c;try{c=localStorage.getItem('wr_cookie_consent_v2');}catch(e){}var g=c==='accepted'?'granted':'denied';gtag('consent','default',{ad_storage:g,analytics_storage:g,ad_user_data:g,ad_personalization:g,functionality_storage:'granted',security_storage:'granted',wait_for_update:500});`}
            </Script>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`if(!location.pathname.startsWith('/comunidad')){gtag('js',new Date());var r;try{var u=new URL(document.referrer);r=u.origin+u.pathname;}catch(e){}gtag('config','${GA_ID}',{page_location:location.origin+location.pathname,page_referrer:r});}`}
            </Script>
          </>
        )}
      </head>
      <body className="bg-brand-deep text-white antialiased">
        <Suspense fallback={null}>
          <TrackingScripts />
        </Suspense>
        {children}
        <WhatsAppBubble />
        <PrivacyAnalytics />
      </body>
    </html>
  )
}
