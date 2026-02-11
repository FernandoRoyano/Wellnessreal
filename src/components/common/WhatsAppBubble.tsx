'use client'

import { usePathname } from 'next/navigation'

const PHONE = '34633261963'
const MESSAGE = 'Hola, me gustaría recibir información sobre vuestros servicios de entrenamiento.'

const HIDDEN_PATHS = ['/admin', '/studio', '/cliente']

export default function WhatsAppBubble() {
  const pathname = usePathname()

  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null

  const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-transform hover:scale-110"
      style={{ backgroundColor: '#25D366' }}
    >
      <svg viewBox="0 0 32 32" className="w-9 h-9 fill-white">
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.132 6.744 3.054 9.378L1.056 31.2l6.042-1.94a15.9 15.9 0 008.906 2.704C24.828 31.964 32 24.788 32 16.004S24.828 0 16.004 0zm9.31 22.616c-.39 1.098-1.932 2.01-3.164 2.276-.844.18-1.946.324-5.66-1.216-4.752-1.97-7.81-6.79-8.046-7.104-.228-.314-1.866-2.486-1.866-4.742s1.18-3.366 1.6-3.826c.42-.46.916-.576 1.222-.576.304 0 .608.002.874.016.28.014.656-.106.026 1.576-.232.614-1.278 3.116-1.39 3.342-.112.228-.186.494-.038.788.15.296.224.48.448.74.224.262.47.586.672.786.224.224.458.466.696.712.224.228.46.474.78.654.322.18.608.15.832-.076.224-.228.968-1.128 1.224-1.514.258-.39.516-.32.868-.192s2.248 1.062 2.632 1.254c.384.192.64.288.734.45.094.158.094.92-.296 2.018z" />
      </svg>
    </a>
  )
}
