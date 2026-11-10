'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { getThyroidTrackingContext } from '@/lib/analytics'

export function CommunityActivityTracker() {
  const pathname = usePathname()
  const sent = useRef(new Set<string>())

  useEffect(() => {
    async function report(action: 'visit' | 'resource') {
      const tracking = getThyroidTrackingContext()
      if (!tracking) return
      const key = `${new Date().toISOString().slice(0, 10)}:${action}`
      if (sent.current.has(key)) return
      sent.current.add(key)
      try {
        const response = await fetch('/api/comunidad/activity', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, consent: true, tracking }), keepalive: true,
        })
        if (!response.ok) sent.current.delete(key)
      } catch { sent.current.delete(key) }
    }
    const visit = () => { void report('visit') }
    const resource = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!(target instanceof HTMLAnchorElement) || event.defaultPrevented) return
      const url = new URL(target.href, window.location.origin)
      if (url.origin === window.location.origin && url.pathname.startsWith('/community/resources/')) void report('resource')
    }
    visit()
    window.addEventListener('wr-consent-changed', visit)
    document.addEventListener('click', resource)
    return () => {
      window.removeEventListener('wr-consent-changed', visit)
      document.removeEventListener('click', resource)
    }
  }, [pathname])
  return null
}
