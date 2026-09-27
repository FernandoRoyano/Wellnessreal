'use client'

import { useEffect } from 'react'
import { trackThyroidFunnel } from '@/lib/analytics'

export default function OfferViewTracker() {
  useEffect(() => {
    trackThyroidFunnel('thyroid_offer_view', { product: 'metodo_tiroides' })
  }, [])

  return null
}
