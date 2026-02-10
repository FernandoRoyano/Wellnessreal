'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import StatusTracker from '@/components/cliente/StatusTracker'
import ContractSection from '@/components/cliente/ContractSection'
import PaymentSection from '@/components/cliente/PaymentSection'
import { Dumbbell, Clock, FileText } from 'lucide-react'

interface Proposal {
  clientName: string
  serviceType: string
  serviceLabel: string
  price: number
  duration: string
  description: string
  contractText: string
  status: string
  signedAt: string | null
  signatureFullName: string | null
  paymentMethod: string | null
  transferMarkedAt: string | null
  paidAt: string | null
  confirmedAt: string | null
}

export default function ClienteProposalPage() {
  const params = useParams()
  const token = params.token as string
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchProposal = async () => {
    try {
      const res = await fetch(`/api/cliente/${token}`)
      if (!res.ok) {
        setError('Propuesta no encontrada')
        return
      }
      const data = await res.json()
      setProposal(data.proposal)
    } catch {
      setError('Error al cargar la propuesta')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProposal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#16122B' }}>
        <p className="text-gray-500">Cargando tu propuesta...</p>
      </div>
    )
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#16122B' }}>
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error || 'Propuesta no encontrada'}</p>
          <p className="text-gray-500">Este enlace no es válido o ha expirado.</p>
        </div>
      </div>
    )
  }

  const showContract = ['pending', 'viewed'].includes(proposal.status)
  const showPayment = proposal.status === 'signed'
  const showPaymentPending = proposal.status === 'payment_pending'
  const showCompleted = ['paid', 'confirmed'].includes(proposal.status)

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#16122B' }}>
      <div className="max-w-3xl mx-auto">
        {/* Status tracker */}
        <StatusTracker status={proposal.status} />

        {/* Welcome */}
        <div className="text-center my-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Hola, {proposal.clientName.split(' ')[0]}
          </h1>
          <p className="text-gray-400">Aquí tienes tu propuesta personalizada</p>
        </div>

        {/* Proposal details card */}
        <div
          className="rounded-xl p-6 md:p-8 mb-8"
          style={{ backgroundColor: '#1a1535', border: '2px solid #FCEE21' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Dumbbell size={24} style={{ color: '#FCEE21' }} />
            <h2 className="text-xl font-bold" style={{ color: '#FCEE21' }}>
              {proposal.serviceLabel}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <FileText size={14} />
                Precio
              </div>
              <p className="text-3xl font-bold" style={{ color: '#FCEE21' }}>
                {proposal.price}€
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Clock size={14} />
                Duración
              </div>
              <p className="text-xl font-bold text-white">{proposal.duration}</p>
            </div>
          </div>

          {proposal.description && (
            <div className="pt-4" style={{ borderTop: '1px solid rgba(102, 45, 145, 0.3)' }}>
              <p className="text-gray-300 text-sm leading-relaxed">{proposal.description}</p>
            </div>
          )}
        </div>

        {/* Contract section */}
        {showContract && (
          <div className="mb-8">
            <ContractSection
              contractText={proposal.contractText}
              token={token}
              onSigned={fetchProposal}
            />
          </div>
        )}

        {/* Payment section */}
        {showPayment && (
          <div className="mb-8">
            <PaymentSection
              token={token}
              price={proposal.price}
              onTransferMarked={fetchProposal}
            />
          </div>
        )}

        {/* Payment pending message */}
        {showPaymentPending && (
          <div
            className="rounded-xl p-8 text-center mb-8"
            style={{ backgroundColor: '#1a1535', border: '2px solid #fb923c' }}
          >
            <h3 className="text-xl font-bold text-orange-400 mb-2">Pago en verificación</h3>
            <p className="text-gray-400">
              Hemos recibido tu aviso de transferencia. Estamos verificando el pago.
              <br />
              Te confirmaremos por email en cuanto esté todo listo.
            </p>
          </div>
        )}

        {/* Completed message */}
        {showCompleted && (
          <div
            className="rounded-xl p-8 text-center mb-8"
            style={{ backgroundColor: '#1a1535', border: '2px solid #4ade80' }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'rgba(74, 222, 128, 0.2)' }}
            >
              <span className="text-4xl">✓</span>
            </div>
            <h3 className="text-2xl font-bold text-green-400 mb-2">Todo listo</h3>
            <p className="text-gray-400">
              Tu pago ha sido confirmado. Nos pondremos en contacto contigo
              <br />
              para comenzar con tu {proposal.serviceLabel.toLowerCase()}.
            </p>
          </div>
        )}

        {/* Signed confirmation */}
        {proposal.signedAt && !showContract && (
          <div className="text-center text-sm text-gray-600 mt-4">
            Contrato firmado por {proposal.signatureFullName} el{' '}
            {new Date(proposal.signedAt).toLocaleString('es-ES')}
          </div>
        )}
      </div>
    </div>
  )
}
