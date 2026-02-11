'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import CampaignStatusBadge from '@/components/admin/email/CampaignStatusBadge'
import Link from 'next/link'
import {
  Users,
  Mail,
  UserMinus,
  Layers,
  Plus,
  Send,
  TrendingUp,
  ArrowRight,
  BarChart3,
  MousePointer,
  Eye,
  Clock,
  Zap,
} from 'lucide-react'
import type { MLCampaign, MLGroup } from '@/lib/types/mailerlite'

interface SubscriberCounts {
  total: number
  active: number
  unsubscribed: number
  bounced: number
}

export default function EmailDashboardPage() {
  const [counts, setCounts] = useState<SubscriberCounts>({ total: 0, active: 0, unsubscribed: 0, bounced: 0 })
  const [campaigns, setCampaigns] = useState<MLCampaign[]>([])
  const [groups, setGroups] = useState<MLGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/email/subscribers/count').then((r) => r.json()),
      fetch('/api/admin/email/campaigns?limit=10').then((r) => r.json()),
      fetch('/api/admin/email/groups').then((r) => r.json()),
    ])
      .then(([countsData, campaignsData, groupsData]) => {
        setCounts(countsData)
        setCampaigns(campaignsData.data || [])
        setGroups(groupsData.data || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const engagementRate = counts.active && counts.total
    ? Math.round((counts.active / counts.total) * 100)
    : 0

  const sentCampaigns = campaigns.filter((c) => c.status === 'sent')
  const draftCampaigns = campaigns.filter((c) => c.status === 'draft' || c.status === 'ready')

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-auto" style={{ backgroundColor: '#16122B' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Email Marketing
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Gestiona tus campañas, suscriptores y grupos desde un solo lugar
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

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div
                className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-4"
                style={{ borderColor: '#662D91', borderTopColor: 'transparent' }}
              />
              <p className="text-gray-500">Cargando datos...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Main metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div
                className="p-6 rounded-xl relative overflow-hidden"
                style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                  <Users size={80} />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(252, 238, 33, 0.15)' }}>
                    <Users size={18} style={{ color: '#FCEE21' }} />
                  </div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Total</span>
                </div>
                <p className="text-3xl font-bold text-white">{counts.total}</p>
                <p className="text-xs text-gray-500 mt-1">suscriptores</p>
              </div>

              <div
                className="p-6 rounded-xl relative overflow-hidden"
                style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                  <Mail size={80} />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(74, 222, 128, 0.15)' }}>
                    <Mail size={18} style={{ color: '#4ade80' }} />
                  </div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Activos</span>
                </div>
                <p className="text-3xl font-bold" style={{ color: '#4ade80' }}>{counts.active}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp size={12} style={{ color: '#4ade80' }} />
                  <span className="text-xs" style={{ color: '#4ade80' }}>{engagementRate}% engagement</span>
                </div>
              </div>

              <div
                className="p-6 rounded-xl relative overflow-hidden"
                style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                  <Send size={80} />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(96, 165, 250, 0.15)' }}>
                    <Send size={18} style={{ color: '#60a5fa' }} />
                  </div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Campañas</span>
                </div>
                <p className="text-3xl font-bold" style={{ color: '#60a5fa' }}>{campaigns.length}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {sentCampaigns.length} enviadas · {draftCampaigns.length} borradores
                </p>
              </div>

              <div
                className="p-6 rounded-xl relative overflow-hidden"
                style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                  <Layers size={80} />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)' }}>
                    <Layers size={18} style={{ color: '#a855f7' }} />
                  </div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Grupos</span>
                </div>
                <p className="text-3xl font-bold" style={{ color: '#a855f7' }}>{groups.length}</p>
                <p className="text-xs text-gray-500 mt-1">segmentos de audiencia</p>
              </div>
            </div>

            {/* Two column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Recent campaigns - 2/3 width */}
              <div
                className="lg:col-span-2 rounded-xl p-6"
                style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(252, 238, 33, 0.15)' }}>
                      <Send size={18} style={{ color: '#FCEE21' }} />
                    </div>
                    <h2 className="text-lg font-bold text-white">Campañas recientes</h2>
                  </div>
                  <Link
                    href="/admin/email/campaigns"
                    className="flex items-center gap-1 text-sm font-medium hover:underline transition"
                    style={{ color: '#FCEE21' }}
                  >
                    Ver todas <ArrowRight size={14} />
                  </Link>
                </div>

                {campaigns.length === 0 ? (
                  <div className="text-center py-12">
                    <Send size={40} className="mx-auto mb-3 opacity-20 text-gray-500" />
                    <p className="text-gray-500 mb-3">No hay campañas todavía</p>
                    <Link
                      href="/admin/email/campaigns/new"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition hover:scale-105"
                      style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
                    >
                      <Plus size={16} />
                      Crear primera campaña
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {campaigns.slice(0, 5).map((c) => (
                      <Link
                        key={c.id}
                        href={`/admin/email/campaigns/${c.id}`}
                        className="flex items-center gap-4 p-4 rounded-lg transition-all hover:bg-white/5 group"
                        style={{ border: '1px solid rgba(102, 45, 145, 0.2)' }}
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: c.status === 'sent'
                              ? 'rgba(74, 222, 128, 0.15)'
                              : 'rgba(252, 238, 33, 0.15)',
                          }}
                        >
                          {c.status === 'sent' ? (
                            <Mail size={18} style={{ color: '#4ade80' }} />
                          ) : (
                            <Clock size={18} style={{ color: '#FCEE21' }} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate group-hover:text-[#FCEE21] transition">
                            {c.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {c.emails?.[0]?.subject || 'Sin asunto'}
                          </p>
                        </div>
                        <CampaignStatusBadge status={c.status} />
                        {c.stats?.sent ? (
                          <div className="hidden md:flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye size={12} />
                              {c.stats.open_rate?.string || '0%'}
                            </span>
                            <span className="flex items-center gap-1">
                              <MousePointer size={12} />
                              {c.stats.click_rate?.string || '0%'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-600">
                            {new Date(c.created_at).toLocaleDateString('es-ES')}
                          </span>
                        )}
                        <ArrowRight size={16} className="text-gray-600 group-hover:text-[#FCEE21] transition" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Right sidebar - 1/3 width */}
              <div className="space-y-6">
                {/* Quick actions */}
                <div
                  className="rounded-xl p-6"
                  style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(252, 238, 33, 0.15)' }}>
                      <Zap size={18} style={{ color: '#FCEE21' }} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Acciones rápidas</h3>
                  </div>
                  <div className="space-y-2">
                    <Link
                      href="/admin/email/campaigns/new"
                      className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-white/5 group"
                    >
                      <Plus size={18} style={{ color: '#FCEE21' }} />
                      <span className="text-gray-300 text-sm group-hover:text-white transition">Nueva campaña</span>
                    </Link>
                    <Link
                      href="/admin/email/subscribers"
                      className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-white/5 group"
                    >
                      <Users size={18} style={{ color: '#4ade80' }} />
                      <span className="text-gray-300 text-sm group-hover:text-white transition">Ver suscriptores</span>
                    </Link>
                    <Link
                      href="/admin/email/groups"
                      className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-white/5 group"
                    >
                      <Layers size={18} style={{ color: '#a855f7' }} />
                      <span className="text-gray-300 text-sm group-hover:text-white transition">Gestionar grupos</span>
                    </Link>
                    <Link
                      href="/admin/email/campaigns"
                      className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-white/5 group"
                    >
                      <BarChart3 size={18} style={{ color: '#60a5fa' }} />
                      <span className="text-gray-300 text-sm group-hover:text-white transition">Ver campañas</span>
                    </Link>
                  </div>
                </div>

                {/* Groups overview */}
                <div
                  className="rounded-xl p-6"
                  style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)' }}>
                        <Layers size={18} style={{ color: '#a855f7' }} />
                      </div>
                      <h3 className="text-lg font-bold text-white">Grupos</h3>
                    </div>
                    <Link
                      href="/admin/email/groups"
                      className="text-xs font-medium hover:underline"
                      style={{ color: '#a855f7' }}
                    >
                      Ver todos
                    </Link>
                  </div>
                  {groups.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">Sin grupos</p>
                  ) : (
                    <div className="space-y-3">
                      {groups.slice(0, 5).map((g) => (
                        <Link
                          key={g.id}
                          href="/admin/email/groups"
                          className="flex items-center justify-between p-3 rounded-lg transition hover:bg-white/5"
                        >
                          <span className="text-gray-300 text-sm">{g.name}</span>
                          <div className="flex items-center gap-2">
                            <Users size={12} className="text-gray-600" />
                            <span className="text-xs font-bold" style={{ color: '#FCEE21' }}>
                              {g.active_count}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subscriber breakdown */}
                <div
                  className="rounded-xl p-6"
                  style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(74, 222, 128, 0.15)' }}>
                      <Users size={18} style={{ color: '#4ade80' }} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Audiencia</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-400">Activos</span>
                        <span className="text-sm font-bold" style={{ color: '#4ade80' }}>{counts.active}</span>
                      </div>
                      <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#16122B' }}>
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: counts.total ? `${(counts.active / counts.total) * 100}%` : '0%',
                            backgroundColor: '#4ade80',
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-400">Baja</span>
                        <span className="text-sm font-bold text-gray-500">{counts.unsubscribed}</span>
                      </div>
                      <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#16122B' }}>
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: counts.total ? `${(counts.unsubscribed / counts.total) * 100}%` : '0%',
                            backgroundColor: '#9ca3af',
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-400">Rebotados</span>
                        <span className="text-sm font-bold text-red-400">{counts.bounced}</span>
                      </div>
                      <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#16122B' }}>
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: counts.total ? `${(counts.bounced / counts.total) * 100}%` : '0%',
                            backgroundColor: '#ef4444',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
