'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Container from './Container'
import { Menu, X } from 'lucide-react'

const navigationItems = [
  { href: '/filosofia', label: 'Filosofía' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/tarifas', label: 'Tarifas' },
  { href: '/blog', label: 'Blog' },
  { href: '/contacto', label: 'Contacto' },
]

export default function Header() {
  const pathname = usePathname()
  const isThyroidSalesPage = pathname === '/metodo-tiroides'
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  return (
    <header
      className={
        'sticky top-0 z-50 transition-all duration-300 ' +
        (scrolled
          ? 'bg-brand-deep/95 border-b border-border-subtle shadow-lg md:bg-brand-deep/85 md:backdrop-blur-xl'
          : 'bg-brand-deep/95 border-b border-transparent md:bg-brand-deep/60 md:backdrop-blur-sm')
      }
    >
      <Container>
        <div className="flex items-center justify-between gap-4 h-[4.5rem] md:h-20 min-w-0">
          <Link
            href={isThyroidSalesPage ? '/metodo-tiroides' : '/'}
            className="flex items-center shrink min-w-0"
            aria-label={
              isThyroidSalesPage ? 'Método BASE Tiroides — inicio' : 'WellnessReal — inicio'
            }
          >
            <Image
              src="/images/logos/WR_AUX_normal_bg.png"
              alt="WellnessReal"
              width={220}
              height={66}
              priority
              className="h-10 md:h-12 w-auto max-w-[180px] md:max-w-[210px] object-contain"
              style={{ width: 'auto' }}
            />
          </Link>

          {isThyroidSalesPage ? (
            <a href="#solicitud" className="btn-brand shrink-0 px-4 py-2.5 text-fluid-sm sm:px-6">
              Solicitar plaza
            </a>
          ) : (
            <>
              {/* Navegación general: se oculta en la página de venta para evitar fugas del embudo. */}
              <div className="hidden lg:flex items-center gap-9 shrink-0">
                <nav className="flex items-center gap-9">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={pathname === item.href ? 'page' : undefined}
                      className={
                        'relative text-fluid-sm font-medium transition-colors group ' +
                        (pathname === item.href ? 'text-white' : 'text-white/75 hover:text-white')
                      }
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={
                          'absolute -bottom-1.5 left-0 right-0 h-px bg-accent origin-left transition-transform duration-300 ' +
                          (pathname === item.href
                            ? 'scale-x-100'
                            : 'scale-x-0 group-hover:scale-x-100')
                        }
                      />
                    </Link>
                  ))}
                </nav>
                <Link href="/valoracion" className="btn-brand text-fluid-sm px-5 py-2.5">
                  Valoración gratis
                </Link>
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="min-h-11 min-w-11 lg:hidden shrink-0 p-2 rounded-lg text-accent hover:bg-accent-muted transition-colors"
                aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-navigation"
              >
                {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </>
          )}
        </div>

        {/* Mobile nav */}
        {!isThyroidSalesPage && isMenuOpen && (
          <nav id="mobile-navigation" aria-label="Navegación principal" className="lg:hidden py-5 border-t border-border-subtle animate-fade-in">
            <div className="flex flex-col gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  className={
                    'py-3 px-3 text-fluid-base font-medium rounded-lg transition-colors ' +
                    (pathname === item.href
                      ? 'text-accent bg-accent-muted'
                      : 'text-white/80 hover:text-accent hover:bg-accent-muted')
                  }
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
