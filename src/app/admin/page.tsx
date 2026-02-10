'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        setError('Contraseña incorrecta')
        return
      }

      router.push('/admin/dashboard')
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#16122B' }}>
      <div
        className="w-full max-w-sm p-8 rounded-2xl"
        style={{ backgroundColor: '#1a1535', border: '2px solid #662D91' }}
      >
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'rgba(252, 238, 33, 0.1)' }}
          >
            <Lock size={32} style={{ color: '#FCEE21' }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: '#FCEE21' }}>
            WR Admin
          </h1>
          <p className="text-gray-500 text-sm mt-1">Panel de gestión de clientes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Introduce la contraseña"
              required
              style={{ backgroundColor: '#16122B', borderColor: '#662D91' }}
              className="w-full px-4 py-3 rounded-lg text-white border focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold transition-all disabled:opacity-50"
            style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
          >
            {loading ? 'Accediendo...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
