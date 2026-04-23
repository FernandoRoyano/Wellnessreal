'use client'

import { useEffect, useRef } from 'react'

export default function HeroAnimation({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let cancelled = false
    let timeline: ReturnType<typeof import('gsap').gsap.timeline> | null = null

    // Lazy-load GSAP tras el primer paint para no bloquear el TBT
    import('gsap').then(({ gsap }) => {
      if (cancelled || !el) return

      const h1 = el.querySelector('h1')
      const paragraphs = el.querySelectorAll('p')
      const buttons = el.querySelector('.flex')

      const targets = [h1, paragraphs, buttons].filter(Boolean)
      gsap.set(targets, { opacity: 0, y: 40 })

      timeline = gsap.timeline({ defaults: { ease: 'power4.out' } })
      timeline
        .to(h1, { opacity: 1, y: 0, duration: 1 }, 0.1)
        .to(paragraphs, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 }, 0.35)
        .to(buttons, { opacity: 1, y: 0, duration: 0.8 }, 0.7)
    })

    return () => {
      cancelled = true
      timeline?.kill()
    }
  }, [])

  return <div ref={ref}>{children}</div>
}
