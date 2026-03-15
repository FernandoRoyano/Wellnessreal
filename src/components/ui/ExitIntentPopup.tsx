'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Link from 'next/link'

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('wr_exit_shown')) return

    let ready = false
    const readyTimer = setTimeout(() => { ready = true }, 5000)

    // Desktop: mouse leaves viewport
    const handleMouseLeave = (e: MouseEvent) => {
      if (!ready || e.clientY > 0) return
      sessionStorage.setItem('wr_exit_shown', '1')
      setShow(true)
    }

    // Mobile: show after 30 seconds
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

  if (!show) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}
      onClick={() => setShow(false)}
    >
      <div
        className="relative max-w-md w-full p-8 md:p-10 rounded-2xl text-center animate-in fade-in zoom-in-95 duration-300"
        style={{ backgroundColor: '#16122B', border: '2px solid #FCEE21' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          ¿Te vas sin tu valoración gratuita?
        </h2>
        <p className="text-gray-300 mb-8 leading-relaxed">
          Analizamos tu caso, te decimos exactamente qué plan necesitas y cómo conseguir resultados. Sin compromiso.
        </p>
        <Link
          href="/valoracion"
          className="inline-block w-full py-4 rounded-lg font-bold text-lg transition-all duration-200 hover:scale-105"
          style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
        >
          Solicitar valoración gratuita
        </Link>
        <p className="text-gray-500 text-sm mt-4">
          Solo 2 minutos. Sin presión.
        </p>
      </div>
    </div>
  )
}
