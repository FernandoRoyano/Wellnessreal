'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('wr_cookie_consent')
    if (!consent) {
      setVisible(true)
    }
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
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      style={{ backgroundColor: 'rgba(15, 12, 32, 0.97)', borderTop: '1px solid #662D91' }}
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm text-gray-300 leading-relaxed">
            Utilizamos cookies propias y de terceros para mejorar tu experiencia, analizar el tráfico
            y personalizar contenido. Puedes aceptar todas, rechazar las no esenciales o consultar
            nuestra{' '}
            <Link href="/privacidad" className="underline" style={{ color: '#FCEE21' }}>
              política de privacidad
            </Link>.
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={reject}
            className="px-5 py-2 rounded-lg text-sm font-bold transition-all border"
            style={{ borderColor: '#662D91', color: '#9ca3af' }}
          >
            Solo esenciales
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
            style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
          >
            Aceptar todas
          </button>
        </div>
      </div>
    </div>
  )
}
