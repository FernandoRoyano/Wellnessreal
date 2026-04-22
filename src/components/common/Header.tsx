'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Container from './Container'
import { Menu, X } from 'lucide-react'

const navigationItems = [
  { href: '/filosofia', label: 'Filosofía' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/tarifas',   label: 'Tarifas' },
  { href: '/blog',      label: 'Blog' },
  { href: '/contacto',  label: 'Contacto' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled]     = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={
        'sticky top-0 z-50 transition-all duration-300 ' +
        (scrolled
          ? 'bg-brand-deep/85 backdrop-blur-xl border-b border-border-subtle shadow-lg'
          : 'bg-brand-deep/60 backdrop-blur-sm border-b border-transparent')
      }
    >
      <Container>
        <div className="flex items-center justify-between gap-4 h-20 md:h-24 min-w-0">
          <Link
            href="/"
            className="flex items-center shrink min-w-0"
            aria-label="WellnessReal — inicio"
          >
            <Image
              src="/images/logos/WR_AUX_normal_bg.png"
              alt="WellnessReal"
              width={220}
              height={66}
              priority
              className="h-11 md:h-14 w-auto max-w-[180px] md:max-w-[220px] object-contain"
              style={{ width: 'auto' }}
            />
          </Link>

          {/* Desktop nav + CTA — agrupados en un contenedor para que display:none en mobile sea limpio */}
          <div className="hidden lg:flex items-center gap-9 shrink-0">
            <nav className="flex items-center gap-9">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative text-fluid-sm font-medium text-white/75 hover:text-white transition-colors group"
                >
                  {item.label}
                  <span className="absolute -bottom-1.5 left-0 right-0 h-px bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Link>
              ))}
            </nav>
            <Link href="/valoracion" className="btn-brand text-fluid-sm px-5 py-2.5">
              Valoración gratis
            </Link>
          </div>

          {/* Mobile menu btn — shrink-0 para que nunca colapse, y margin left auto por si acaso */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden shrink-0 p-2 rounded-lg text-accent hover:bg-accent-muted transition-colors"
            aria-label="Abrir menú"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile nav */}
        {isMenuOpen && (
          <nav className="lg:hidden py-5 border-t border-border-subtle animate-fade-in">
            <div className="flex flex-col gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-3 px-2 text-fluid-base font-medium text-white/80 hover:text-accent hover:bg-accent-muted rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/valoracion"
                className="btn-brand mt-3 w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                Valoración gratis
              </Link>
            </div>
          </nav>
        )}
      </Container>
    </header>
  )
}
