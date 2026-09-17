'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { trackThyroidFunnel } from '@/lib/analytics'

export default function ThyroidVslCta({ position }: { position: 'primary' | 'final' }) {
  return (
    <Link
      href="/metodo-tiroides?source=thyroid-vsl#solicitud"
      onClick={() => {
        trackThyroidFunnel('thyroid_vsl_cta_click', { position })
        trackThyroidFunnel('thyroid_valuation_click', { source: 'thyroid_vsl', position })
      }}
      className="btn-brand min-h-14 px-7 text-fluid-base"
    >
      Solicitar mi valoración <ArrowRight className="h-4 w-4" />
    </Link>
  )
}
