'use client'

import { useEffect, useRef } from 'react'
import type { gsap as GsapType } from 'gsap'

/* ───────────────────────────────────────────────
   Lazy-load dinámico de GSAP.
   Objetivo: sacar ~70 KiB de gsap+ScrollTrigger del
   bundle inicial. Se carga tras el primer paint,
   en paralelo, sin bloquear el TBT.
   ─────────────────────────────────────────────── */

type GsapModule = typeof GsapType
let gsapCache: GsapModule | null = null
let loadPromise: Promise<GsapModule> | null = null

function loadGsap(): Promise<GsapModule> {
  if (gsapCache) return Promise.resolve(gsapCache)
  if (!loadPromise) {
    loadPromise = Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]).then(([gsapMod, stMod]) => {
      gsapMod.gsap.registerPlugin(stMod.ScrollTrigger)
      gsapCache = gsapMod.gsap
      return gsapCache
    })
  }
  return loadPromise
}

/* Refresca ScrollTrigger cuando ha terminado de cargar todo (fuentes/imágenes) */
export function useGsapReady() {
  useEffect(() => {
    let cleanup: (() => void) | null = null
    loadGsap().then(async () => {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      const handleLoad = () => ScrollTrigger.refresh()
      if (document.readyState === 'complete') {
        ScrollTrigger.refresh()
      } else {
        window.addEventListener('load', handleLoad, { once: true })
      }
      cleanup = () => {
        window.removeEventListener('load', handleLoad)
        ScrollTrigger.getAll().forEach((t) => t.kill())
      }
    })
    return () => { cleanup?.() }
  }, [])
}

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
    let tween: ReturnType<GsapModule['to']> | null = null
    let cancelled = false

    loadGsap().then((gsap) => {
      if (cancelled || !el) return
      gsap.set(el, { opacity: 0, y })
      tween = gsap.to(el, {
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
    })

    return () => {
      cancelled = true
      if (tween) {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
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
    let tween: ReturnType<GsapModule['to']> | null = null
    let cancelled = false

    loadGsap().then((gsap) => {
      if (cancelled || !container) return

      const children = childSelector
        ? container.querySelectorAll(childSelector)
        : Array.from(container.children)
      if (!children.length) return

      gsap.set(children, { opacity: 0, y })
      tween = gsap.to(children, {
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
    })

    return () => {
      cancelled = true
      if (tween) {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
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
    let tween: ReturnType<GsapModule['to']> | null = null
    let cancelled = false

    loadGsap().then((gsap) => {
      if (cancelled || !el) return
      tween = gsap.to(el, {
        yPercent: speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    })

    return () => {
      cancelled = true
      if (tween) {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
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
    let tween: ReturnType<GsapModule['to']> | null = null
    let cancelled = false

    loadGsap().then((gsap) => {
      if (cancelled || !el) return
      const obj = { val: 0 }
      tween = gsap.to(obj, {
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
    })

    return () => {
      cancelled = true
      if (tween) {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    }
  }, [end, duration, prefix, suffix])

  return ref
}

/* ─── Text line reveal (simple fade-up) ─── */
export function useTextReveal<T extends HTMLElement>(options?: {
  duration?: number
  delay?: number
  staggerLines?: number
}) {
  const ref = useRef<T>(null)
  const { duration = 0.9, delay = 0 } = options ?? {}

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let tween: ReturnType<GsapModule['to']> | null = null
    let cancelled = false

    loadGsap().then((gsap) => {
      if (cancelled || !el) return
      gsap.set(el, { opacity: 0, y: 40 })
      tween = gsap.to(el, {
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
    })

    return () => {
      cancelled = true
      if (tween) {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    }
  }, [duration, delay])

  return ref
}

/* ─── Magnetic hover effect ─── */
export function useMagnetic<T extends HTMLElement>(strength = 0.3) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Solo activar en dispositivos con puntero fino (desktop) — skip en táctil
    if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) return

    let cancelled = false
    let gsapRef: GsapModule | null = null
    let handleMove: ((e: MouseEvent) => void) | null = null
    let handleLeave: (() => void) | null = null

    loadGsap().then((gsap) => {
      if (cancelled || !el) return
      gsapRef = gsap

      handleMove = (e: MouseEvent) => {
        if (!gsapRef) return
        const rect = el.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        gsapRef.to(el, {
          x: x * strength,
          y: y * strength,
          duration: 0.3,
          ease: 'power2.out',
        })
      }

      handleLeave = () => {
        if (!gsapRef) return
        gsapRef.to(el, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)',
        })
      }

      el.addEventListener('mousemove', handleMove)
      el.addEventListener('mouseleave', handleLeave)
    })

    return () => {
      cancelled = true
      if (handleMove) el.removeEventListener('mousemove', handleMove)
      if (handleLeave) el.removeEventListener('mouseleave', handleLeave)
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
    let tween: ReturnType<GsapModule['to']> | null = null
    let cancelled = false

    loadGsap().then((gsap) => {
      if (cancelled || !el) return
      tween = gsap.to(el, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
      })
    })

    return () => {
      cancelled = true
      if (tween) {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    }
  }, [])

  return ref
}
