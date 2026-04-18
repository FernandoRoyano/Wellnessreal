'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlayCircle, Loader2 } from 'lucide-react'
import { trackSignUp } from '@/lib/analytics'

export default function MetodoOptInForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !phone) return

    setStatus('loading')
    setError('')

    try {
      const res = await fetch('/api/metodo-optin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      })

      if (!res.ok) throw new Error('Error')

      trackSignUp('metodo_vsl')
      router.push('/metodo/video')
    } catch {
      setStatus('error')
      setError('Algo ha fallado. Inténtalo otra vez o escríbeme por WhatsApp.')
    }
  }

  const inputStyle = {
    backgroundColor: '#1a1535',
    borderColor: '#662D91',
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 md:p-8 rounded-2xl"
      style={{
        backgroundColor: 'rgba(26, 21, 53, 0.7)',
        border: '1px solid rgba(252,238,33,0.25)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="space-y-4 text-left">
        <div>
          <label className="block text-xs font-bold text-gray-300 mb-2 tracking-wide">
            Nombre
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            style={inputStyle}
            className="w-full px-4 py-3 rounded-lg text-white border focus:border-[#FCEE21] focus:outline-none transition"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-300 mb-2 tracking-wide">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            style={inputStyle}
            className="w-full px-4 py-3 rounded-lg text-white border focus:border-[#FCEE21] focus:outline-none transition"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-300 mb-2 tracking-wide">
            Teléfono
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+34 XXX XXX XXX"
            style={inputStyle}
            className="w-full px-4 py-3 rounded-lg text-white border focus:border-[#FCEE21] focus:outline-none transition"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full mt-6 py-4 rounded-lg font-extrabold text-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{
          backgroundColor: '#FCEE21',
          color: '#16122B',
          boxShadow: '0 0 30px rgba(252, 238, 33, 0.35)',
        }}
      >
        {status === 'loading' ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Preparando acceso...
          </>
        ) : (
          <>
            <PlayCircle size={22} />
            Ver el vídeo gratis (15 min)
          </>
        )}
      </button>

      {error && (
        <p className="mt-3 text-sm text-center" style={{ color: '#ff6b6b' }}>
          {error}
        </p>
      )}
    </form>
  )
}
