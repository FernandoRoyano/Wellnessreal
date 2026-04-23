'use client'

import Link from 'next/link'
import Image from 'next/image'
import Container from './Container'
import { Mail, MapPin, Phone, Send, Check, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { trackSignUp } from '@/lib/analytics'

const NAV_LINKS = [
  { href: '/filosofia', label: 'Filosofía' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/tarifas',   label: 'Tarifas' },
  { href: '/blog',      label: 'Blog' },
  { href: '/caso-real', label: 'Caso real' },
] as const

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail]   = useState('')
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
      trackSignUp('footer')
      setEmail('')
      setTimeout(() => setStatus('idle'), 4000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  return (
    <footer className="relative bg-brand-deep text-white border-t border-border-subtle overflow-hidden">
      {/* glow decorativo superior */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
      <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] rounded-full bg-accent/5 blur-3xl" />

      <Container>
        {/* ═══════ Newsletter ═══════ */}
        <div className="relative py-fluid-md border-b border-border-subtle">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <span className="eyebrow justify-center">Newsletter</span>
            <h3 className="headline text-fluid-3xl text-white">
              Consejos que funcionan. <span className="text-gradient-brand">Sin spam.</span>
            </h3>
            <p className="text-fluid-base text-muted max-w-xl mx-auto leading-relaxed">
              Recibe estrategias de entrenamiento y nutrición adaptadas a gente con vida real.
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                disabled={status === 'loading'}
                className="flex-1 min-w-0 px-4 py-3 rounded-xl text-white bg-brand-night border border-border-subtle
                           placeholder:text-dim
                           focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30
                           transition-all disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="btn-brand px-6 py-3 shrink-0 disabled:opacity-70"
              >
                {status === 'loading'  && 'Enviando…'}
                {status === 'success'  && <> <Check className="w-4 h-4" /> Suscrito </>}
                {(status === 'idle' || status === 'error') && <> Suscribirme <Send className="w-4 h-4" /> </>}
              </button>
            </form>

            <div className="min-h-[1.5rem] pt-1" aria-live="polite">
              {status === 'success' && (
                <p className="text-fluid-sm text-success inline-flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> ¡Listo! Revisa tu email.
                </p>
              )}
              {status === 'error' && (
                <p className="text-fluid-sm text-danger inline-flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Algo falló. Inténtalo de nuevo.
                </p>
              )}
            </div>

            <p className="text-fluid-xs text-subtle">
              Puedes darte de baja cuando quieras. Cero spam, lo prometo.
            </p>
          </div>
        </div>

        {/* ═══════ Columnas ═══════ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-fluid-md">
          {/* Brand */}
          <div className="md:col-span-2 space-y-5">
            <Link href="/" aria-label="WellnessReal — inicio" className="inline-flex">
              <Image
                src="/images/logos/WR_AUX_normal_bg.png"
                alt="WellnessReal"
                width={220}
                height={66}
                className="h-14 md:h-16 w-auto max-w-[200px] md:max-w-[220px] object-contain"
              />
            </Link>
            <p className="text-fluid-base text-muted max-w-md leading-relaxed">
              Entrenamiento y nutrición para gente con vida real. Sin extremos, sin perfección. Solo lo que funciona.
            </p>
            <Link
              href="/recurso-gratis"
              className="inline-flex items-center gap-2 text-fluid-sm text-accent hover:gap-3 transition-all"
            >
              Descarga la guía gratis →
            </Link>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="font-display font-bold text-fluid-sm text-white uppercase tracking-[0.2em] mb-5">
              Navegación
            </h4>
            <ul className="space-y-3 text-fluid-base text-muted">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1 hover:text-accent transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-display font-bold text-fluid-sm text-white uppercase tracking-[0.2em] mb-5">
              Contacto
            </h4>
            <ul className="space-y-4 text-fluid-base text-muted">
              <li className="flex items-start gap-3">
                <span className="shrink-0 mt-0.5 w-8 h-8 rounded-lg bg-accent-muted border border-border-subtle flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-accent" />
                </span>
                <span className="leading-relaxed">
                  Online internacional
                  <br />
                  Presencial en Madrid
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="shrink-0 w-8 h-8 rounded-lg bg-accent-muted border border-border-subtle flex items-center justify-center">
                  <Mail className="w-4 h-4 text-accent" />
                </span>
                <a href="mailto:info@wellnessreal.es" className="hover:text-accent transition-colors">
                  info@wellnessreal.es
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="shrink-0 w-8 h-8 rounded-lg bg-accent-muted border border-border-subtle flex items-center justify-center">
                  <Phone className="w-4 h-4 text-accent" />
                </span>
                <a href="tel:+34633261963" className="hover:text-accent transition-colors">
                  +34 633 261 963
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ═══════ Bottom bar ═══════ */}
        <div className="border-t border-border-subtle py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-fluid-xs text-muted">
            <p>© {currentYear} WellnessReal. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <Link href="/privacidad" className="hover:text-accent transition-colors">
                Privacidad
              </Link>
              <Link href="/terminos" className="hover:text-accent transition-colors">
                Términos
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
