'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie } from 'lucide-react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('wr_cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('wr_cookie_consent', 'accepted')
    setVisible(false)
  }

  const reject = () => {
    localStorage.setItem('wr_cookie_consent', 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed bottom-0 left-0 right-0 z-[220] p-3 md:p-5 animate-fade-in"
    >
      <div className="max-w-5xl mx-auto surface-card-accent rounded-2xl p-5 md:p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="flex items-start md:items-center gap-3 flex-1 min-w-0">
            <span className="shrink-0 w-10 h-10 rounded-xl bg-accent-muted border border-border-strong flex items-center justify-center">
              <Cookie className="w-5 h-5 text-accent" />
            </span>
            <p className="text-fluid-sm text-muted leading-relaxed">
              Utilizo cookies propias y de terceros para mejorar tu experiencia, analizar el tráfico y personalizar
              contenido. Puedes aceptar todas, rechazar las no esenciales o consultar la{' '}
              <Link href="/privacidad" className="text-accent underline underline-offset-2 hover:opacity-80 transition">
                política de privacidad
              </Link>.
            </p>
          </div>

          <div className="flex gap-3 shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={reject}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl text-fluid-sm font-semibold border border-border-subtle text-muted hover:text-white hover:border-border-strong transition-all"
            >
              Solo esenciales
            </button>
            <button
              type="button"
              onClick={accept}
              className="btn-brand flex-1 md:flex-none px-5 py-2.5 text-fluid-sm"
            >
              Aceptar todas
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
