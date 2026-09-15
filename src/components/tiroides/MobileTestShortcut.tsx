'use client'

import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { trackThyroidFunnel } from '@/lib/analytics'

export default function MobileTestShortcut() {
  const [isStartButtonVisible, setIsStartButtonVisible] = useState(true)
  const [hasConsentChoice, setHasConsentChoice] = useState(false)

  useEffect(() => {
    // El acceso fijo no compite visualmente con el aviso legal inicial.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasConsentChoice(Boolean(window.localStorage.getItem('wr_cookie_consent')))
    const handleConsent = () => setHasConsentChoice(true)
    window.addEventListener('wr-consent-changed', handleConsent)
    const startButton = document.getElementById('thyroid-test-start')
    if (!startButton) return () => window.removeEventListener('wr-consent-changed', handleConsent)
    const observer = new IntersectionObserver(
      ([entry]) => setIsStartButtonVisible(entry.isIntersecting),
      { threshold: 0.7 },
    )
    observer.observe(startButton)
    return () => {
      observer.disconnect()
      window.removeEventListener('wr-consent-changed', handleConsent)
    }
  }, [])

  if (isStartButtonVisible || !hasConsentChoice) return null

  return (
    <a
      href="#test"
      onClick={() => trackThyroidFunnel('thyroid_landing_view', { view_type: 'cta_click', cta_position: 'sticky' })}
      className="fixed inset-x-4 bottom-4 z-40 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-extrabold text-accent-fg shadow-[0_12px_40px_rgba(5,4,20,0.55)] lg:hidden"
    >
      Empezar el test · 1 minuto <ArrowRight className="h-4 w-4" />
    </a>
  )
}
