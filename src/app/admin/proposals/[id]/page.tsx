'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ProposalStatusBadge from '@/components/admin/ProposalStatusBadge'
import { useRouter } from 'next/navigation'
import { Copy, Check, User, Mail, Phone, FileText, CreditCard, Clock, Trash2, Settings } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente (sin abrir)' },
  { value: 'viewed', label: 'Vista por cliente' },
  { value: 'signed', label: 'Firmada' },
  { value: 'payment_pending', label: 'Pago pendiente' },
  { value: 'paid', label: 'Pagada' },
  { value: 'confirmed', label: 'Confirmada (cobrada)' },
] as const

const PAYMENT_METHOD_OPTIONS = [
  { value: '', label: 'No seleccionado' },
  { value: 'stripe', label: 'Stripe (tarjeta)' },
  { value: 'transfer', label: 'Transferencia' },
  { value: 'cash', label: 'Efectivo / fuera del sistema' },
] as const

interface Proposal {
  _id: string
  clientName: string
  clientEmail: string
  clientPhone: string
  serviceType: string
  serviceLabel: string
  price: number
  duration: string
  description: string
  contractText: string
  token: string
  status: string
  signedAt: string | null
  signatureFullName: string | null
  paymentMethod: string | null
  transferMarkedAt: string | null
  paidAt: string | null
  confirmedAt: string | null
  confirmedBy: string | null
  viewedAt: string | null
  notes: string
  createdAt: string
}

export default function ProposalDetailPage() {
  const params = useParams()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [notes, setNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [newPaymentMethod, setNewPaymentMethod] = useState('')
  const [savingStatus, setSavingStatus] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/admin/proposals/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProposal(data.proposal)
        setNotes(data.proposal?.notes || '')
        setNewStatus(data.proposal?.status || '')
        setNewPaymentMethod(data.proposal?.paymentMethod || '')
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [params.id])

  const copyUrl = async () => {
    if (!proposal) return
    const url = `${window.location.origin}/cliente/${proposal.token}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const confirmPayment = async () => {
    if (!proposal) return
    setConfirming(true)
    try {
      const res = await fetch(`/api/admin/proposals/${proposal._id}/confirm-payment`, {
        method: 'POST',
      })
      if (res.ok) {
        const data = await res.json()
        setProposal(data.proposal)
      }
    } catch {
      // ignore
    } finally {
      setConfirming(false)
    }
  }

  const saveNotes = async () => {
    if (!proposal) return
    setSavingNotes(true)
    try {
      await fetch(`/api/admin/proposals/${proposal._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      })
    } catch {
      // ignore
    } finally {
      setSavingNotes(false)
    }
  }

  const saveStatusChange = async () => {
    if (!proposal) return
    if (newStatus === proposal.status && newPaymentMethod === (proposal.paymentMethod || '')) return
    setSavingStatus(true)
    try {
      const body: Record<string, unknown> = {}
      if (newStatus !== proposal.status) body.status = newStatus
      if (newPaymentMethod !== (proposal.paymentMethod || '')) body.payment_method = newPaymentMethod || null
      const res = await fetch(`/api/admin/proposals/${proposal._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        const data = await res.json()
        setProposal(data.proposal)
        setNewStatus(data.proposal.status)
        setNewPaymentMethod(data.proposal.paymentMethod || '')
      }
    } catch {
      // ignore
    } finally {
      setSavingStatus(false)
    }
  }

  const markAsPaid = async () => {
    if (!proposal) return
    setSavingStatus(true)
    try {
      const res = await fetch(`/api/admin/proposals/${proposal._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'confirmed',
          payment_method: newPaymentMethod || 'cash',
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setProposal(data.proposal)
        setNewStatus(data.proposal.status)
        setNewPaymentMethod(data.proposal.paymentMethod || '')
      }
    } catch {
      // ignore
    } finally {
      setSavingStatus(false)
    }
  }

  const deleteProposal = async () => {
    if (!proposal) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/proposals/${proposal._id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        router.push('/admin/dashboard')
      }
    } catch {
      // ignore
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleString('es-ES')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8 flex items-center justify-center" style={{ backgroundColor: '#16122B' }}>
          <p className="text-gray-500">Cargando...</p>
        </main>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8 flex items-center justify-center" style={{ backgroundColor: '#16122B' }}>
          <p className="text-red-400">Propuesta no encontrada</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8" style={{ backgroundColor: '#16122B' }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">{proposal.clientName}</h1>
            <div className="flex items-center gap-3 mt-2">
              <ProposalStatusBadge status={proposal.status} />
              <span className="text-gray-500 text-sm">{proposal.serviceLabel}</span>
            </div>
          </div>
          <button
            onClick={copyUrl}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
            style={{ backgroundColor: 'rgba(252, 238, 33, 0.1)', color: '#FCEE21' }}
          >
            {copied ? <><Check size={16} /> Copiado</> : <><Copy size={16} /> Copiar enlace cliente</>}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client info */}
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
          >
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <User size={18} style={{ color: '#FCEE21' }} />
              Datos del cliente
            </h3>
            <div className="space-y-3 text-sm">
              <p className="flex items-center gap-2 text-gray-400">
                <Mail size={14} /> {proposal.clientEmail}
              </p>
              <p className="flex items-center gap-2 text-gray-400">
                <Phone size={14} /> {proposal.clientPhone}
              </p>
            </div>
          </div>

          {/* Service info */}
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
          >
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <FileText size={18} style={{ color: '#FCEE21' }} />
              Servicio
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-400">Tipo: <span className="text-white">{proposal.serviceLabel}</span></p>
              <p className="text-gray-400">Duración: <span className="text-white">{proposal.duration}</span></p>
              <p className="text-2xl font-bold mt-3" style={{ color: '#FCEE21' }}>{proposal.price}€</p>
            </div>
          </div>

          {/* Payment info */}
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
          >
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <CreditCard size={18} style={{ color: '#FCEE21' }} />
              Pago
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-400">
                Método: <span className="text-white">{proposal.paymentMethod || 'No seleccionado'}</span>
              </p>
              {proposal.transferMarkedAt && (
                <p className="text-gray-400">
                  Transferencia marcada: <span className="text-white">{formatDate(proposal.transferMarkedAt)}</span>
                </p>
              )}
              {proposal.paidAt && (
                <p className="text-gray-400">
                  Pagado: <span className="text-green-400">{formatDate(proposal.paidAt)}</span>
                </p>
              )}
            </div>

            {(proposal.status === 'payment_pending' || proposal.status === 'signed') && (
              <button
                onClick={confirmPayment}
                disabled={confirming}
                className="w-full mt-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                style={{ backgroundColor: '#4ade80', color: '#16122B' }}
              >
                {confirming ? 'Confirmando...' : 'Confirmar pago'}
              </button>
            )}

            {proposal.status !== 'confirmed' && proposal.status !== 'paid' && (
              <button
                onClick={markAsPaid}
                disabled={savingStatus}
                className="w-full mt-2 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50 border"
                style={{ borderColor: 'rgba(74,222,128,0.4)', color: '#4ade80', backgroundColor: 'transparent' }}
              >
                {savingStatus ? 'Guardando...' : 'Marcar como cobrado manualmente'}
              </button>
            )}
          </div>
        </div>

        {/* Control manual de estado y método de pago */}
        <div
          className="rounded-xl p-6 mt-6"
          style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
        >
          <h3 className="font-bold text-white mb-1 flex items-center gap-2">
            <Settings size={18} style={{ color: '#FCEE21' }} />
            Cambiar estado manualmente
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Forzar el estado o el método de pago si el cliente te pagó por fuera del sistema o necesitas corregir algo. Las fechas del historial se ajustan solas.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Estado</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-white text-sm outline-none"
                style={{ backgroundColor: '#16122B', border: '1px solid #662D91' }}
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Método de pago</label>
              <select
                value={newPaymentMethod}
                onChange={(e) => setNewPaymentMethod(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-white text-sm outline-none"
                style={{ backgroundColor: '#16122B', border: '1px solid #662D91' }}
              >
                {PAYMENT_METHOD_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={saveStatusChange}
            disabled={savingStatus || (newStatus === proposal.status && newPaymentMethod === (proposal.paymentMethod || ''))}
            className="mt-4 px-5 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
            style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
          >
            {savingStatus ? 'Aplicando...' : 'Aplicar cambio'}
          </button>
        </div>

        {/* Timeline */}
        <div
          className="rounded-xl p-6 mt-6"
          style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
        >
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Clock size={18} style={{ color: '#FCEE21' }} />
            Historial
          </h3>
          <div className="space-y-3 text-sm">
            <p className="text-gray-400">Creada: <span className="text-white">{formatDate(proposal.createdAt)}</span></p>
            {proposal.viewedAt && (
              <p className="text-gray-400">Vista por cliente: <span className="text-white">{formatDate(proposal.viewedAt)}</span></p>
            )}
            {proposal.signedAt && (
              <p className="text-gray-400">
                Firmada por: <span className="text-white">{proposal.signatureFullName}</span> el {formatDate(proposal.signedAt)}
              </p>
            )}
            {proposal.confirmedAt && (
              <p className="text-gray-400">
                Confirmada: <span className="text-green-400">{formatDate(proposal.confirmedAt)}</span>
                <span className="text-gray-600 ml-2">({proposal.confirmedBy})</span>
              </p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div
          className="rounded-xl p-6 mt-6"
          style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
        >
          <h3 className="font-bold text-white mb-4">Notas internas</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-lg text-white border focus:outline-none transition resize-none text-sm"
            style={{ backgroundColor: '#16122B', borderColor: '#662D91' }}
          />
          <button
            onClick={saveNotes}
            disabled={savingNotes}
            className="mt-3 px-6 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
            style={{ backgroundColor: 'rgba(252, 238, 33, 0.1)', color: '#FCEE21' }}
          >
            {savingNotes ? 'Guardando...' : 'Guardar notas'}
          </button>
        </div>

        {/* Delete */}
        <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(239, 68, 68, 0.3)' }}>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all text-red-400 hover:text-red-300 border border-red-900 hover:border-red-700"
            >
              <Trash2 size={16} />
              Eliminar propuesta
            </button>
          ) : (
            <div
              className="rounded-xl p-6"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.4)' }}
            >
              <p className="text-red-400 font-bold mb-2">Esta acción es irreversible</p>
              <p className="text-gray-400 text-sm mb-4">
                Se eliminará la propuesta de <strong className="text-white">{proposal.clientName}</strong> permanentemente, incluyendo todos los datos de firma y pago asociados.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={deleteProposal}
                  disabled={deleting}
                  className="px-5 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                  style={{ backgroundColor: '#ef4444', color: 'white' }}
                >
                  {deleting ? 'Eliminando...' : 'Sí, eliminar definitivamente'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-5 py-2 rounded-lg text-sm font-bold transition-all text-gray-400 border border-gray-700 hover:border-gray-500"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
