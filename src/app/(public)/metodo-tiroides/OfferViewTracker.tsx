'use client'

import { useEffect, useRef } from 'react'
import { trackThyroidFunnel } from '@/lib/analytics'

export default function OfferViewTracker() {
  const tracked = useRef(false)
  useEffect(() => {
    if (tracked.current) return
    tracked.current = true
    trackThyroidFunnel('thyroid_offer_view', { product: 'metodo_tiroides' })
    if (new URLSearchParams(window.location.search).get('origen') === 'comunidad') {
      trackThyroidFunnel('community_program_visit', { source: 'community' })
    }
  }, [])

  return null
}
