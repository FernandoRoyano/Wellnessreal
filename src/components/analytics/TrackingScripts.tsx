'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { captureAttribution } from '@/lib/tracking'
import { META_PIXEL_ID, canTrackMeta, syncMetaConsent, trackMetaEvent } from '@/lib/meta-pixel'
import { clearTrackingData, hasTrackingConsent } from '@/lib/cookie-consent'

/**
 * Carga los pixels de Meta y TikTok SOLO tras aceptar cookies (RGPD) y dispara
 * el pageview en cada navegación cliente. Google (GA4) se gestiona aparte con
 * Consent Mode v2 en el layout.
 *
 * Variables de entorno:
 *   NEXT_PUBLIC_TIKTOK_PIXEL_ID
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: unknown
    ttq?: {
      load: (id: string) => void
      page: () => void
      track: (event: string, params?: Record<string, unknown>) => void
      identify: (params: Record<string, unknown>) => void
      grantConsent?: () => void
      revokeConsent?: () => void
    }
  }
}

const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID

export default function TrackingScripts() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastMetaPage = useRef<string | null>(null)

  // Meta y TikTok no tienen Consent Mode: solo se cargan si el usuario aceptó.
  const [consentido, setConsentido] = useState(false)
  useEffect(() => {
    const leer = () => {
      const accepted = hasTrackingConsent()
      setConsentido(accepted)
      syncMetaConsent()
      if (accepted) window.ttq?.grantConsent?.()
      else window.ttq?.revokeConsent?.()
      if (!accepted) { clearTrackingData(); lastMetaPage.current = null }
    }
    leer()
    window.addEventListener('wr-consent-changed', leer)
    return () => window.removeEventListener('wr-consent-changed', leer)
  }, [])

  // Captura UTMs (first-party) y dispara pageview en los pixels ya cargados.
  useEffect(() => {
    captureAttribution()
    syncMetaConsent()
    const page = `${pathname}?${searchParams.toString()}`
    const trackPage = () => {
      if (window.fbq && canTrackMeta() && lastMetaPage.current !== page) {
        trackMetaEvent('PageView')
        lastMetaPage.current = page
      }
    }
    trackPage()
    if (consentido && window.ttq) window.ttq.page()
    window.addEventListener('wr-meta-ready', trackPage)
    return () => window.removeEventListener('wr-meta-ready', trackPage)
  }, [pathname, searchParams, consentido])

  return (
    <>
      {consentido && canTrackMeta() && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('consent', 'revoke');
            fbq('set', 'autoConfig', false, '${META_PIXEL_ID}');
            fbq('init','${META_PIXEL_ID}');
            window.dispatchEvent(new Event('wr-meta-ready'));
          `}
        </Script>
      )}
      {consentido && TIKTOK_PIXEL_ID && (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
              ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
              for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
              ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
              ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
              ttq.load('${TIKTOK_PIXEL_ID}');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
      )}
    </>
  )
}
