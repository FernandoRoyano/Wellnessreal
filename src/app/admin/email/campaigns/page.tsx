'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import CampaignStatusBadge from '@/components/admin/email/CampaignStatusBadge'
import Link from 'next/link'
import {
  Plus,
  Send,
  Clock,
  Mail,
  Eye,
  MousePointer,
  UserMinus,
  ArrowRight,
  Trash2,
  BarChart3,
} from 'lucide-react'
import type { MLCampaign } from '@/lib/types/mailerlite'

type FilterType = 'all' | 'sent' | 'draft'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<MLCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ limit: '50' })
    if (filter !== 'all') params.set('status', filter)

    fetch(`/api/admin/email/campaigns?${params}`)
      .then((r) => r.json())
      .then((data) => setCampaigns(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [filter])

  const handleDelete = async (e: React.MouseEvent, campaignId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('¿Eliminar esta campaña? Esta acción no se puede deshacer.')) return

    setDeletingId(campaignId)
    try {
      const res = await fetch(`/api/admin/email/campaigns/${campaignId}`, { method: 'DELETE' })
      if (res.ok) {
        setCampaigns((prev) => prev.filter((c) => c.id !== campaignId))
      }
    } catch {
      // silently fail
    } finally {
      setDeletingId(null)
    }
  }

  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'Todas', count: campaigns.length },
    { key: 'sent', label: 'Enviadas', count: campaigns.filter((c) => c.status === 'sent').length },
    { key: 'draft', label: 'Borradores', count: campaigns.filter((c) => c.status === 'draft' || c.status === 'ready').length },
  ]

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-auto" style={{ backgroundColor: '#16122B' }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Campañas</h1>
            <p className="text-gray-500 text-sm mt-1">
              Gestiona y monitoriza tus campañas de email
            </p>
          </div>
          <Link
            href="/admin/email/campaigns/new"
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 shadow-lg"
            style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
          >
            <Plus size={20} />
            Nueva campaña
          </Link>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
              style={{
                backgroundColor: filter === f.key ? 'rgba(252, 238, 33, 0.15)' : 'transparent',
                color: filter === f.key ? '#FCEE21' : '#9ca3af',
                border: `1px solid ${filter === f.key ? 'rgba(252, 238, 33, 0.3)' : 'rgba(102, 45, 145, 0.3)'}`,
              }}
            >
              {f.label}
              {filter === f.key && (
                <span
                  className="px-1.5 py-0.5 rounded text-xs"
                  style={{ backgroundColor: 'rgba(252, 238, 33, 0.2)' }}
                >
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Campaigns */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div
                className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-4"
                style={{ borderColor: '#662D91', borderTopColor: 'transparent' }}
              />
              <p className="text-gray-500">Cargando campañas...</p>
            </div>
          </div>
        ) : campaigns.length === 0 ? (
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
          >
            <div className="text-center py-16">
              <Send size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 text-lg mb-2">No hay campañas todavía</p>
              <p className="text-gray-600 text-sm mb-6">
                Crea tu primera campaña para empezar a enviar emails
              </p>
              <Link
                href="/admin/email/campaigns/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition hover:scale-105"
                style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
              >
                <Plus size={18} />
                Crear primera campaña
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.map((c) => {
              const isSent = c.status === 'sent'
              const stats = c.stats

              return (
                <Link
                  key={c.id}
                  href={`/admin/email/campaigns/${c.id}`}
                  className="block rounded-xl p-5 transition-all hover:scale-[1.01] group"
                  style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        backgroundColor: isSent
                          ? 'rgba(74, 222, 128, 0.15)'
                          : 'rgba(252, 238, 33, 0.15)',
                      }}
                    >
                      {isSent ? (
                        <Mail size={22} style={{ color: '#4ade80' }} />
                      ) : (
                        <Clock size={22} style={{ color: '#FCEE21' }} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-white font-bold truncate group-hover:text-[#FCEE21] transition">
                          {c.name}
                        </h3>
                        <CampaignStatusBadge status={c.status} />
                      </div>
                      <p className="text-sm text-gray-500 truncate mb-3">
                        {c.emails?.[0]?.subject || 'Sin asunto'}
                      </p>

                      {/* Stats row for sent campaigns */}
                      {isSent && stats?.sent ? (
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <Send size={13} className="text-gray-600" />
                            <span className="text-xs text-gray-400">
                              {stats.sent} enviados
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye size={13} style={{ color: '#4ade80' }} />
                            <span className="text-xs" style={{ color: '#4ade80' }}>
                              {stats.open_rate?.string || '0%'} aperturas
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MousePointer size={13} style={{ color: '#60a5fa' }} />
                            <span className="text-xs" style={{ color: '#60a5fa' }}>
                              {stats.click_rate?.string || '0%'} clics
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <UserMinus size={13} className="text-gray-600" />
                            <span className="text-xs text-gray-500">
                              {stats.unsubscribes_count || 0} bajas
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-600">
                          Creada el {new Date(c.created_at).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => handleDelete(e, c.id)}
                        disabled={deletingId === c.id}
                        className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition opacity-0 group-hover:opacity-100 disabled:opacity-50"
                        title="Eliminar campaña"
                      >
                        <Trash2 size={16} />
                      </button>
                      <ArrowRight size={18} className="text-gray-600 group-hover:text-[#FCEE21] transition" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
