'use client'

import { useEffect } from 'react'
import { trackConversion } from '@/lib/tracking'

// Dispara la conversión 'purchase' una sola vez tras volver de Stripe (?pago=ok).
// Dedupe por sessionStorage para no contar dos veces al recargar.
export default function PurchaseTracker({
  value,
  tier,
  dedupeKey,
}: {
  value?: number
  tier: string | null
  dedupeKey: string
}) {
  useEffect(() => {
    const key = `wr_purchase_${dedupeKey}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')
    trackConversion('purchase', { value, currency: 'EUR', plan: tier ?? undefined })
  }, [value, tier, dedupeKey])

  return null
}
