'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import CampaignStatusBadge from '@/components/admin/email/CampaignStatusBadge'
import {
  ArrowLeft,
  Send,
  Mail,
  MousePointer,
  UserMinus,
  Trash2,
  Eye,
  Clock,
  User,
  FileText,
  Calendar,
  CheckCircle,
} from 'lucide-react'
import Link from 'next/link'
import type { MLCampaign } from '@/lib/types/mailerlite'

export default function CampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [campaign, setCampaign] = useState<MLCampaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/email/campaigns/${params.id}`)
      .then((r) => r.json())
      .then((data) => setCampaign(data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [params.id])

  const handleSend = async () => {
    if (!campaign) return
    if (!confirm('¿Enviar esta campaña ahora? Esta acción no se puede deshacer.')) return
    setSending(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/email/campaigns/${campaign.id}/send`, {
        method: 'POST',
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Error al enviar')
      }
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar')
    } finally {
      setSending(false)
    }
  }

  const handleDelete = async () => {
    if (!campaign) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/email/campaigns/${campaign.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        router.push('/admin/email/campaigns')
      } else {
        const err = await res.json()
        throw new Error(err.error || 'Error al eliminar')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar')
      setDeleting(false)
    }
  }

  const stats = campaign?.stats
  const email = campaign?.emails?.[0]

  const statCards = stats
    ? [
        { label: 'Enviados', value: stats.sent, icon: Send, color: '#FCEE21', bg: 'rgba(252, 238, 33, 0.15)' },
        {
          label: 'Aperturas',
          value: stats.unique_opens_count,
          extra: stats.open_rate?.string || '0%',
          icon: Eye,
          color: '#4ade80',
          bg: 'rgba(74, 222, 128, 0.15)',
        },
        {
          label: 'Clics',
          value: stats.unique_clicks_count,
          extra: stats.click_rate?.string || '0%',
          icon: MousePointer,
          color: '#60a5fa',
          bg: 'rgba(96, 165, 250, 0.15)',
        },
        { label: 'Bajas', value: stats.unsubscribes_count, icon: UserMinus, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
      ]
    : []

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-auto" style={{ backgroundColor: '#16122B' }}>
        <Link
          href="/admin/email/campaigns"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition mb-6 text-sm"
        >
          <ArrowLeft size={16} />
          Volver a campañas
        </Link>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div
                className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-4"
                style={{ borderColor: '#662D91', borderTopColor: 'transparent' }}
              />
              <p className="text-gray-500">Cargando campaña...</p>
            </div>
          </div>
        ) : !campaign ? (
          <div className="text-center py-20">
            <Mail size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 text-lg">Campaña no encontrada</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-white">{campaign.name}</h1>
                  <CampaignStatusBadge status={sent ? 'sending' : campaign.status} />
                </div>
                <p className="text-gray-500 text-sm">
                  {email?.subject || 'Sin asunto'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {(campaign.status === 'draft' || campaign.status === 'ready') && !sent && (
                  <button
                    onClick={handleSend}
                    disabled={sending}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 disabled:opacity-50 shadow-lg"
                    style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
                  >
                    <Send size={20} />
                    {sending ? 'Enviando...' : 'Enviar ahora'}
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div
                className="p-4 rounded-lg mb-6"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
              >
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {sent && (
              <div
                className="p-4 rounded-lg mb-6 flex items-center gap-3"
                style={{ backgroundColor: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)' }}
              >
                <CheckCircle size={20} style={{ color: '#4ade80' }} />
                <p className="text-green-400 font-bold">La campaña se está enviando correctamente.</p>
              </div>
            )}

            {/* Stats */}
            {statCards.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat) => (
                  <div
                    key={stat.label}
                    className="p-5 rounded-xl"
                    style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: stat.bg }}>
                        <stat.icon size={16} style={{ color: stat.color }} />
                      </div>
                      <span className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</span>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: stat.color }}>
                      {stat.value}
                    </p>
                    {'extra' in stat && stat.extra && (
                      <p className="text-xs mt-1" style={{ color: stat.color, opacity: 0.7 }}>
                        {stat.extra}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Campaign info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div
                className="p-6 rounded-xl"
                style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
              >
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5">Información</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FileText size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Asunto</p>
                      <p className="text-white text-sm">{email?.subject || '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Remitente</p>
                      <p className="text-white text-sm">
                        {email?.from_name || '—'} &lt;{email?.from || '—'}&gt;
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Tipo</p>
                      <p className="text-gray-400 text-sm">{campaign.type}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="p-6 rounded-xl"
                style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
              >
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5">Fechas</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Creada</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(campaign.created_at).toLocaleString('es-ES')}
                      </p>
                    </div>
                  </div>
                  {campaign.sent_at && (
                    <div className="flex items-start gap-3">
                      <Send size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Enviada</p>
                        <p className="text-gray-400 text-sm">
                          {new Date(campaign.sent_at).toLocaleString('es-ES')}
                        </p>
                      </div>
                    </div>
                  )}
                  {campaign.scheduled_for && (
                    <div className="flex items-start gap-3">
                      <Clock size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Programada</p>
                        <p className="text-gray-400 text-sm">
                          {new Date(campaign.scheduled_for).toLocaleString('es-ES')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content preview */}
            {email?.content && (
              <div
                className="rounded-xl p-6 mb-8"
                style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
              >
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                  Preview del contenido
                </h3>
                <div
                  className="rounded-lg overflow-hidden"
                  style={{ border: '1px solid rgba(102, 45, 145, 0.3)' }}
                >
                  <iframe
                    srcDoc={email.content}
                    title="Campaign preview"
                    className="w-full bg-white"
                    style={{ minHeight: '400px' }}
                    sandbox="allow-same-origin"
                  />
                </div>
              </div>
            )}

            {/* Delete zone */}
            <div
              className="p-6 rounded-xl"
              style={{ backgroundColor: '#1a1535', border: '1px solid rgba(239, 68, 68, 0.2)' }}
            >
              <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3">Zona peligrosa</h3>
              {!showDelete ? (
                <button
                  onClick={() => setShowDelete(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-red-400 border transition hover:bg-red-400/10"
                  style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}
                >
                  <Trash2 size={16} />
                  Eliminar campaña
                </button>
              ) : (
                <div>
                  <p className="text-gray-400 text-sm mb-3">
                    Esta acción eliminará la campaña permanentemente. No se puede deshacer.
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="px-4 py-2 rounded-lg text-sm font-bold text-white transition disabled:opacity-50 hover:opacity-90"
                      style={{ backgroundColor: '#ef4444' }}
                    >
                      {deleting ? 'Eliminando...' : 'Confirmar eliminación'}
                    </button>
                    <button
                      onClick={() => setShowDelete(false)}
                      className="px-4 py-2 rounded-lg text-sm font-bold text-gray-400 hover:text-white transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
