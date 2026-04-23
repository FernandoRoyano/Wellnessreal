'use client'

import { useState, useEffect } from 'react'
import { X, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('wr_exit_shown')) return

    let ready = false
    const readyTimer = setTimeout(() => { ready = true }, 5000)

    const handleMouseLeave = (e: MouseEvent) => {
      if (!ready || e.clientY > 0) return
      sessionStorage.setItem('wr_exit_shown', '1')
      setShow(true)
    }

    const mobileTimer = setTimeout(() => {
      if (window.innerWidth < 768 && ready) {
        sessionStorage.setItem('wr_exit_shown', '1')
        setShow(true)
      }
    }, 30000)

    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      clearTimeout(readyTimer)
      clearTimeout(mobileTimer)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  useEffect(() => {
    if (!show) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setShow(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [show])

  if (!show) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={() => setShow(false)}
    >
      <div
        className="relative max-w-md w-full p-8 md:p-10 rounded-2xl text-center surface-card-accent animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShow(false)}
          aria-label="Cerrar"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted hover:text-accent hover:bg-accent-muted transition-colors"
        >
          <X size={18} />
        </button>

        <h2 id="exit-intent-title" className="headline text-fluid-2xl text-white mb-4">
          ¿Te vas sin tu <span className="text-gradient-brand">valoración gratuita?</span>
        </h2>
        <p className="text-fluid-sm text-muted mb-7 leading-relaxed">
          Analizamos tu caso, te decimos exactamente qué plan necesitas y cómo conseguir resultados. Sin compromiso.
        </p>
        <Link
          href="/valoracion"
          className="btn-brand w-full text-fluid-base"
          onClick={() => setShow(false)}
        >
          Solicitar valoración gratuita
          <ArrowRight className="w-4 h-4" />
        </Link>
        <p className="text-fluid-xs text-subtle mt-4">
          Solo 2 minutos. Sin presión.
        </p>
      </div>
    </div>
  )
}
