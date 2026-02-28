'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { X, Gift } from 'lucide-react'
import { trackSignUp } from '@/lib/analytics'

const HIDDEN_PATHS = ['/admin', '/studio', '/cliente']
const SESSION_KEY = 'wr_popup_shown'
const LOCAL_KEY = 'wr_lead_submitted'
const SCROLL_THRESHOLD = 0.55

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function LeadMagnetPopup() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return
    if (localStorage.getItem(LOCAL_KEY)) return
    if (sessionStorage.getItem(SESSION_KEY)) return

    const handleScroll = () => {
      const scrolled = window.scrollY + window.innerHeight
      const total = document.documentElement.scrollHeight
      if (scrolled / total >= SCROLL_THRESHOLD) {
        setVisible(true)
        sessionStorage.setItem(SESSION_KEY, '1')
        window.removeEventListener('scroll', handleScroll)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  const close = () => setVisible(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })
      if (!res.ok) throw new Error()
      localStorage.setItem(LOCAL_KEY, '1')
      trackSignUp('popup')
      setStatus('success')
      setTimeout(() => setVisible(false), 3000)
    } catch {
      setStatus('error')
    }
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={close}
    >
      <div
        className="relative w-full max-w-md rounded-2xl p-8 animate-fadeInUp"
        style={{
          backgroundColor: '#1a1535',
          border: '2px solid #662D91',
          zIndex: 45,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>

        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: 'rgba(252, 238, 33, 0.1)' }}
        >
          <Gift size={24} style={{ color: '#FCEE21' }} />
        </div>

        {status === 'success' ? (
          <div className="text-center py-4">
            <p className="text-xl font-bold text-white mb-2">¡Perfecto!</p>
            <p className="text-gray-300">
              Revisa tu email — la guía está en camino.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-white mb-1">
              Antes de irte...
            </h2>
            <p className="text-gray-400 text-sm mb-1">
              Descarga gratis la guía:
            </p>
            <p className="font-bold mb-5" style={{ color: '#FCEE21' }}>
              &ldquo;Fitness real para gente con vida real&rdquo;
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg text-white border border-[#662D91] focus:border-[#FCEE21] focus:outline-none transition"
                style={{ backgroundColor: '#16122B' }}
              />
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg text-white border border-[#662D91] focus:border-[#FCEE21] focus:outline-none transition"
                style={{ backgroundColor: '#16122B' }}
              />
              {status === 'error' && (
                <p className="text-red-400 text-sm">
                  Algo falló. Inténtalo de nuevo.
                </p>
              )}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 rounded-lg font-bold text-lg transition hover:scale-105 disabled:opacity-50"
                style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
              >
                {status === 'loading' ? 'Enviando...' : 'QUIERO LA GUÍA GRATIS'}
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-3">
              Sin spam. Puedes darte de baja cuando quieras.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
