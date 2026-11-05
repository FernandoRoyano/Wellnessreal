'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { trackThyroidFunnel } from '@/lib/analytics'

export function CommunityLink({ source, ...props }: ComponentProps<typeof Link> & { source: string }) {
  return <Link {...props} onClick={event => {
    props.onClick?.(event)
    if (!event.defaultPrevented) trackThyroidFunnel('community_entry_click', { position: source })
  }} />
}
