'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
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
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header 
      style={{ backgroundColor: '#16122B', borderBottomColor: '#662D91' }} 
      className="sticky top-0 z-50 shadow-lg border-b"
    >
      <Container>
        <div className="flex items-center justify-between h-24 md:h-28">
          {/* Logo - MUCHO MÁS GRANDE */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logos/WR_AUX_normal_bg.png"
              alt="WellnessReal Logo"
              width={300}
              height={90}
              priority
              className="object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-base font-medium text-gray-300 hover:text-white transition-colors tracking-wide"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Desktop */}
          <div className="hidden lg:block">
            <Link
              href="/valoracion"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-bold transition-all tracking-wide text-base hover:brightness-110"
              style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
            >
              Solicita tu valoración gratis
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-opacity-20"
            style={{ color: '#FCEE21' }}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav 
            className="lg:hidden py-4 border-t" 
            style={{ borderTopColor: '#662D91', backgroundColor: '#16122B' }}
          >
            <div className="flex flex-col gap-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-lg font-medium text-gray-300 hover:text-white tracking-wide"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/valoracion"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-bold transition-all mt-2 tracking-wide text-base hover:brightness-110"
                style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Solicita tu valoración gratis
              </Link>
            </div>
          </nav>
        )}
      </Container>
    </header>
  )
}
