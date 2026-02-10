'use client'

import { useState } from 'react'
import { CreditCard, Building2, Check } from 'lucide-react'

interface PaymentSectionProps {
  token: string
  price: number
  onTransferMarked: () => void
}

export default function PaymentSection({ token, price, onTransferMarked }: PaymentSectionProps) {
  const [loadingStripe, setLoadingStripe] = useState(false)
  const [loadingTransfer, setLoadingTransfer] = useState(false)
  const [transferDone, setTransferDone] = useState(false)
  const [error, setError] = useState('')

  const handleStripePayment = async () => {
    setError('')
    setLoadingStripe(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al crear sesión de pago')
      }

      const { sessionUrl } = await res.json()
      window.location.href = sessionUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar pago')
      setLoadingStripe(false)
    }
  }

  const handleTransferConfirm = async () => {
    setError('')
    setLoadingTransfer(true)
    try {
      const res = await fetch(`/api/cliente/${token}/payment`, {
        method: 'POST',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al confirmar')
      }

      setTransferDone(true)
      onTransferMarked()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoadingTransfer(false)
    }
  }

  if (transferDone) {
    return (
      <div
        className="rounded-xl p-8 text-center"
        style={{ backgroundColor: '#1a1535', border: '2px solid #4ade80' }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: 'rgba(74, 222, 128, 0.2)' }}
        >
          <Check size={32} className="text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-green-400 mb-2">Transferencia marcada</h3>
        <p className="text-gray-400">
          Hemos registrado tu aviso. Verificaremos la transferencia y te confirmaremos por email.
        </p>
      </div>
    )
  }

  return (
    <div
      className="rounded-xl p-6 md:p-8"
      style={{ backgroundColor: '#1a1535', border: '2px solid #662D91' }}
    >
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#FCEE21' }}>
        Método de pago
      </h2>
      <p className="text-gray-400 mb-6">
        Importe a pagar: <span className="text-2xl font-bold" style={{ color: '#FCEE21' }}>{price}€</span>
      </p>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stripe card payment */}
        <div
          className="p-6 rounded-xl text-center"
          style={{ backgroundColor: '#16122B', border: '1px solid rgba(102, 45, 145, 0.5)' }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'rgba(252, 238, 33, 0.1)' }}
          >
            <CreditCard size={28} style={{ color: '#FCEE21' }} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Tarjeta de crédito/débito</h3>
          <p className="text-gray-500 text-sm mb-6">Pago seguro con Stripe</p>
          <button
            onClick={handleStripePayment}
            disabled={loadingStripe}
            className="w-full py-3 rounded-lg font-bold transition-all disabled:opacity-50"
            style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
          >
            {loadingStripe ? 'Redirigiendo...' : 'Pagar con tarjeta'}
          </button>
        </div>

        {/* Bank transfer */}
        <div
          className="p-6 rounded-xl"
          style={{ backgroundColor: '#16122B', border: '1px solid rgba(102, 45, 145, 0.5)' }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'rgba(252, 238, 33, 0.1)' }}
          >
            <Building2 size={28} style={{ color: '#FCEE21' }} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2 text-center">Transferencia bancaria</h3>

          <div className="space-y-3 text-sm mb-6">
            <div>
              <p className="text-gray-500">IBAN</p>
              <p className="text-white font-mono">{process.env.NEXT_PUBLIC_BANK_IBAN || 'Contactar para datos'}</p>
            </div>
            <div>
              <p className="text-gray-500">Beneficiario</p>
              <p className="text-white">{process.env.NEXT_PUBLIC_BANK_BENEFICIARY || 'WellnessReal'}</p>
            </div>
            <div>
              <p className="text-gray-500">Concepto</p>
              <p className="text-white font-mono text-xs">WR-{token.slice(0, 8)}</p>
            </div>
          </div>

          <button
            onClick={handleTransferConfirm}
            disabled={loadingTransfer}
            className="w-full py-3 rounded-lg font-bold transition-all disabled:opacity-50 border-2"
            style={{ borderColor: '#FCEE21', color: '#FCEE21', backgroundColor: 'transparent' }}
          >
            {loadingTransfer ? 'Confirmando...' : 'He realizado la transferencia'}
          </button>
        </div>
      </div>
    </div>
  )
}
