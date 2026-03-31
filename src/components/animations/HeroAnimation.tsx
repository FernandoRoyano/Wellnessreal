'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function HeroAnimation({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

    const h1 = el.querySelector('h1')
    const paragraphs = el.querySelectorAll('p')
    const buttons = el.querySelector('.flex')

    // Set initial states
    gsap.set([h1, paragraphs, buttons].filter(Boolean), { opacity: 0, y: 40 })

    tl.to(h1, { opacity: 1, y: 0, duration: 1 }, 0.2)
      .to(paragraphs, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 }, 0.5)
      .to(buttons, { opacity: 1, y: 0, duration: 0.8 }, 0.8)

    return () => {
      tl.kill()
    }
  }, [])

  return <div ref={ref}>{children}</div>
}
