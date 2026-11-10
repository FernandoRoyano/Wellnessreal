'use client'

import type { ReactNode } from 'react'
import { trackResourceDownload } from '@/lib/analytics'
import { POPUP_GUIDES, type GuideResource } from '@/lib/guide-popup'

export default function GuideDownloadLink({
  resource,
  placement,
  className,
  children,
}: {
  resource: GuideResource
  placement: 'confirmation' | 'popup'
  className?: string
  children: ReactNode
}) {
  return (
    <a
      href={POPUP_GUIDES[resource].file}
      download
      onClick={() => trackResourceDownload(resource === 'guia' ? 'fitness_guide' : 'free_guide', placement)}
      className={className}
    >
      {children}
    </a>
  )
}
