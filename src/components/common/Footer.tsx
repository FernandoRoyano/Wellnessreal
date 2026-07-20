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

// Iconos de marca como SVG inline (lucide deprecó sus iconos de marca por temas de marca registrada)
const iconClass = 'w-5 h-5'
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden>
    <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-10.4a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
  </svg>
)
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden>
    <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.08 0 12 0 12s0 3.92.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.8zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
  </svg>
)
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={iconClass} aria-hidden>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zm1.78 13.02H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
)

const SOCIALS = [
  { href: 'https://www.instagram.com/wellnessrealoficial', label: 'Instagram', Icon: InstagramIcon },
  { href: 'https://www.youtube.com/@wellnessreal',         label: 'YouTube',   Icon: YoutubeIcon },
  { href: 'https://www.linkedin.com/in/fernando-royano/',  label: 'LinkedIn',  Icon: LinkedinIcon },
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
      const { getAttributionForSubmit } = await import('@/lib/tracking')
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, _source: 'footer', _attribution: getAttributionForSubmit() }),
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
              Lo que aplico con mis clientes, <span className="text-gradient-brand">cada semana en tu email.</span>
            </h3>
            <p className="text-fluid-base text-muted max-w-xl mx-auto leading-relaxed">
              Estrategias reales de entrenamiento y nutrición, escritas por alguien que ha acompañado a clientes a perder 35 kg en 9 meses o ganar 8 kg de músculo a los 50.
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

            <div className="flex items-center gap-3 pt-1">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-lg bg-accent-muted border border-border-subtle flex items-center justify-center text-muted hover:text-accent hover:border-border-strong transition-colors"
                >
                  <Icon />
                </a>
              ))}
            </div>
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
              {/* Acceso discreto para miembros ya registrados de la comunidad.
                  Si hay sesión entra directo; si no, el middleware lleva al login. */}
              <Link href="/comunidad" className="hover:text-accent transition-colors">
                Acceso miembros
              </Link>
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
