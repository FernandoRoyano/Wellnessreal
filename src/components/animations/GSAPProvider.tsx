'use client'

import { useGsapReady } from '@/hooks/useGSAP'

/**
 * Wrapper que dispara la carga diferida de GSAP + refresca ScrollTrigger
 * cuando la página termina de cargar (imágenes, fuentes, etc.).
 * GSAP ya NO se importa de forma eager en el bundle principal.
 */
export default function GSAPProvider({ children }: { children: React.ReactNode }) {
  useGsapReady()
  return <>{children}</>
}
