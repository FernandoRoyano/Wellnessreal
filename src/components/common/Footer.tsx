'use client'

import Link from 'next/link'
import Image from 'next/image'
import Container from './Container'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { useState } from 'react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) throw new Error()

      setStatus('success')
      setEmail('')
      setTimeout(() => setStatus('idle'), 4000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  return (
    <footer className="text-white border-t" style={{ backgroundColor: '#16122B', borderTopColor: '#662D91' }}>
      <Container>
        {/* Newsletter section */}
        <div className="py-12 border-b" style={{ borderBottomColor: '#662D91' }}>
          <div className="max-w-2xl mx-auto text-center">
            <h3 style={{ color: '#FCEE21' }} className="text-2xl font-bold mb-3">
              Consejos que funcionan. Sin spam.
            </h3>
            <p className="text-gray-400 mb-6">
              Recibe en tu email estrategias de entrenamiento y nutrición adaptadas a gente con vida real.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                style={{ backgroundColor: '#1a1535', borderColor: '#662D91' }}
                className="flex-1 px-4 py-3 rounded-lg text-white border focus:border-yellow-400 focus:outline-none transition"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition hover:scale-105 disabled:opacity-50"
                style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
              >
                {status === 'loading' ? (
                  'Enviando...'
                ) : (
                  <>
                    Suscribirme <Send size={18} />
                  </>
                )}
              </button>
            </form>

            {status === 'success' && (
              <p className="text-green-400 text-sm mt-3">¡Listo! Revisa tu email.</p>
            )}
            {status === 'error' && (
              <p className="text-red-400 text-sm mt-3">Algo falló. Inténtalo de nuevo.</p>
            )}

            <p className="text-xs text-gray-500 mt-4">
              Puedes darte de baja cuando quieras. Cero spam, lo prometo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* Brand - LOGO MÁS GRANDE */}
          <div className="col-span-1 md:col-span-2">
            <div className="relative w-72 h-24 mb-6">
              <Image
                src="/images/logos/WR_AUX_normal_bg.png"
                alt="WellnessReal Logo"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-gray-400 text-base max-w-md leading-relaxed">
              Entrenamiento y nutrición para gente con vida real. Sin extremos, sin perfección. Solo lo que funciona.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#FCEE21' }} className="font-semibold mb-4 text-lg tracking-wide">Navegación</h4>
            <ul className="space-y-2 text-base text-gray-400">
              <li>
                <Link href="/filosofia" className="hover:text-white transition">
                  Filosofía
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="hover:text-white transition">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/tarifas" className="hover:text-white transition">
                  Tarifas
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/recurso-gratis" className="hover:text-white transition" style={{ color: '#FCEE21' }}>
                  Recurso gratuito
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: '#FCEE21' }} className="font-semibold mb-4 text-lg tracking-wide">Contacto</h4>
            <ul className="space-y-3 text-base text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-1 flex-shrink-0" style={{ color: '#FCEE21' }} />
                <span>
                  Online Internacional (España)
                  <br />
                  Presencial en Madrid
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} style={{ color: '#FCEE21' }} />
                <a href="mailto:info@wellnessreal.es" className="hover:text-white transition">
                  info@wellnessreal.es
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} style={{ color: '#FCEE21' }} />
                <a href="tel:+34633261963" className="hover:text-white transition">
                  +34 633 261 963
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t py-6" style={{ borderTopColor: '#662D91' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© {currentYear} WellnessReal. CIF: 72171129G. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <Link href="/privacidad" className="hover:text-white transition">
                Privacidad
              </Link>
              <Link href="/terminos" className="hover:text-white transition">
                Términos
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
