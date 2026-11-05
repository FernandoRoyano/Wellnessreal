'use client'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

function withoutPrivateUrl<T extends { url: string }>(event: T): T | null {
  const url = new URL(event.url)
  if (url.pathname.startsWith('/comunidad')) return null
  return { ...event, url: `${url.origin}${url.pathname}` }
}

export default function PrivacyAnalytics() {
  return <><Analytics beforeSend={withoutPrivateUrl} /><SpeedInsights beforeSend={withoutPrivateUrl} /></>
}
