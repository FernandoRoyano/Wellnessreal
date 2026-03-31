'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ─── Reveal on scroll (fade-in + slide up) ─── */
export function useReveal<T extends HTMLElement>(options?: {
  y?: number
  duration?: number
  delay?: number
  once?: boolean
}) {
  const ref = useRef<T>(null)
  const { y = 60, duration = 0.8, delay = 0, once = true } = options ?? {}

  useEffect(() => {
    const el = ref.current
    if (!el) return

    gsap.set(el, { opacity: 0, y })

    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: once ? 'play none none none' : 'play none none reverse',
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [y, duration, delay, once])

  return ref
}

/* ─── Stagger children on scroll ─── */
export function useStagger<T extends HTMLElement>(options?: {
  y?: number
  stagger?: number
  duration?: number
  childSelector?: string
}) {
  const ref = useRef<T>(null)
  const { y = 50, stagger = 0.12, duration = 0.7, childSelector } = options ?? {}

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const children = childSelector
      ? container.querySelectorAll(childSelector)
      : Array.from(container.children)

    if (!children.length) return

    gsap.set(children, { opacity: 0, y })

    const tween = gsap.to(children, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [y, stagger, duration, childSelector])

  return ref
}

/* ─── Parallax background ─── */
export function useParallax<T extends HTMLElement>(speed = 0.3) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const tween = gsap.to(el, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [speed])

  return ref
}

/* ─── Counter animation ─── */
export function useCounter<T extends HTMLElement>(
  end: number,
  options?: { duration?: number; prefix?: string; suffix?: string }
) {
  const ref = useRef<T>(null)
  const { duration = 2, prefix = '', suffix = '' } = options ?? {}

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obj = { val: 0 }

    const tween = gsap.to(obj, {
      val: end,
      duration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        el.textContent = `${prefix}${Math.round(obj.val)}${suffix}`
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [end, duration, prefix, suffix])

  return ref
}

/* ─── Text line reveal (clip-path) ─── */
export function useTextReveal<T extends HTMLElement>(options?: {
  duration?: number
  delay?: number
  staggerLines?: number
}) {
  const ref = useRef<T>(null)
  const { duration = 0.9, delay = 0, staggerLines = 0.15 } = options ?? {}

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Wrap each line in a span with overflow hidden
    const text = el.textContent || ''
    // For simple headings, animate the whole element with clipPath
    gsap.set(el, { opacity: 0, y: 40 })

    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [duration, delay, staggerLines])

  return ref
}

/* ─── Magnetic hover effect ─── */
export function useMagnetic<T extends HTMLElement>(strength = 0.3) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    const handleLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
      })
    }

    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)

    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [strength])

  return ref
}

/* ─── Scroll Progress Bar ─── */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const tween = gsap.to(el, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return ref
}
