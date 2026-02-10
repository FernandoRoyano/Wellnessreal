'use client'

import { useState } from 'react'

interface ContractSectionProps {
  contractText: string
  token: string
  onSigned: () => void
}

export default function ContractSection({ contractText, token, onSigned }: ContractSectionProps) {
  const [accepted, setAccepted] = useState(false)
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSign = async () => {
    if (!accepted) {
      setError('Debes aceptar los términos y condiciones')
      return
    }
    if (fullName.trim().length < 3) {
      setError('Introduce tu nombre completo')
      return
    }

    setError('')
    setLoading(true)
    try {
      const res = await fetch(`/api/cliente/${token}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: fullName.trim(), accepted: true }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al firmar')
      }

      onSigned()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al firmar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="rounded-xl p-6 md:p-8"
      style={{ backgroundColor: '#1a1535', border: '2px solid #662D91' }}
    >
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#FCEE21' }}>
        Contrato de servicio
      </h2>

      {/* Contract text */}
      <div
        className="max-h-80 overflow-y-auto p-6 rounded-lg mb-6 text-sm leading-relaxed text-gray-300 whitespace-pre-wrap"
        style={{ backgroundColor: '#16122B', border: '1px solid rgba(102, 45, 145, 0.3)' }}
      >
        {contractText}
      </div>

      {/* Acceptance */}
      <div className="space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1 w-5 h-5 rounded accent-yellow-400"
          />
          <span className="text-gray-300 text-sm">
            He leído y acepto los términos y condiciones del contrato
          </span>
        </label>

        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">
            Firma digital: escribe tu nombre completo
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Tu nombre completo"
            className="w-full px-4 py-3 rounded-lg text-white border focus:outline-none transition"
            style={{ backgroundColor: '#16122B', borderColor: '#662D91' }}
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleSign}
          disabled={loading || !accepted || fullName.trim().length < 3}
          className="w-full py-4 rounded-lg font-bold text-lg transition-all disabled:opacity-50"
          style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
        >
          {loading ? 'Firmando...' : 'Firmar contrato'}
        </button>
      </div>
    </div>
  )
}
