'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ProposalStatusBadge from '@/components/admin/ProposalStatusBadge'
import Link from 'next/link'
import {
  PlusCircle, Euro, Users, FileText, BookOpen,
  TrendingUp, CreditCard, ArrowRightLeft, Clock,
  Pen, Mail,
} from 'lucide-react'

interface DashboardStats {
  proposals: {
    total: number
    statusCounts: Record<string, number>
    activeProposals: number
    revenue: number
    pendingRevenue: number
    conversionRate: number
    thisMonth: number
    lastMonth: number
    stripePayments: number
    transferPayments: number
    recent: {
      id: string
      clientName: string
      serviceLabel: string
      price: number
      status: string
      createdAt: string
    }[]
  }
  blog: {
    published: number
    drafts: number
    lastPost: { title: string; publishedAt: string } | null
  }
  subscribers: {
    active: number
    unsubscribed: number
    bounced: number
    total: number
  }
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/dashboard/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8" style={{ backgroundColor: '#16122B' }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" style={{ color: '#FCEE21' }}>
            Dashboard
          </h1>
          <Link
            href="/admin/proposals/new"
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all hover:scale-105"
            style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
          >
            <PlusCircle size={20} />
            Nueva propuesta
          </Link>
        </div>

        {loading || !stats ? (
          <div className="text-center py-20 text-gray-400">Cargando métricas...</div>
        ) : (
          <>
            {/* Row 1: KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <KPICard
                label="Ingresos cobrados"
                value={`${stats.proposals.revenue.toLocaleString('es-ES')}€`}
                icon={Euro}
                color="#4ade80"
              />
              <KPICard
                label="Propuestas activas"
                value={stats.proposals.activeProposals}
                icon={FileText}
                color="#FCEE21"
                subtitle={`${stats.proposals.total} total`}
              />
              <KPICard
                label="Suscriptores"
                value={stats.subscribers.active}
                icon={Users}
                color="#60a5fa"
                subtitle={`${stats.subscribers.total} total`}
              />
              <KPICard
                label="Posts publicados"
                value={stats.blog.published}
                icon={BookOpen}
                color="#c084fc"
                subtitle={stats.blog.drafts > 0 ? `${stats.blog.drafts} borrador${stats.blog.drafts > 1 ? 'es' : ''}` : undefined}
              />
            </div>

            {/* Row 2: Detail cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Left: Proposal breakdown */}
              <Card title="Propuestas" icon={TrendingUp}>
                <div className="space-y-3 mb-6">
                  {[
                    { key: 'pending', label: 'Pendientes' },
                    { key: 'viewed', label: 'Vistos' },
                    { key: 'signed', label: 'Firmados' },
                    { key: 'payment_pending', label: 'Pago pendiente' },
                    { key: 'paid', label: 'Pagados' },
                    { key: 'confirmed', label: 'Confirmados' },
                  ].map(({ key, label }) => {
                    const count = stats.proposals.statusCounts[key] || 0
                    const pct = stats.proposals.total > 0
                      ? (count / stats.proposals.total) * 100
                      : 0
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-gray-400 text-sm w-28 shrink-0">{label}</span>
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(102,45,145,0.2)' }}>
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: key === 'paid' || key === 'confirmed' ? '#4ade80' : key === 'signed' ? '#FCEE21' : '#60a5fa',
                            }}
                          />
                        </div>
                        <span className="text-white text-sm font-bold w-8 text-right">{count}</span>
                      </div>
                    )
                  })}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: 'rgba(102,45,145,0.3)' }}>
                  <MiniStat label="Conversión" value={`${stats.proposals.conversionRate}%`} icon={TrendingUp} />
                  <MiniStat label="Pendiente cobro" value={`${stats.proposals.pendingRevenue.toLocaleString('es-ES')}€`} icon={Clock} />
                  <MiniStat label="Stripe" value={stats.proposals.stripePayments} icon={CreditCard} />
                  <MiniStat label="Transferencia" value={stats.proposals.transferPayments} icon={ArrowRightLeft} />
                </div>

                <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: 'rgba(102,45,145,0.3)' }}>
                  <span className="text-gray-400 text-sm">Este mes</span>
                  <span className="text-white font-bold">{stats.proposals.thisMonth} propuestas</span>
                  <span className="text-gray-500 text-xs">
                    (anterior: {stats.proposals.lastMonth})
                  </span>
                </div>
              </Card>

              {/* Right: Activity */}
              <div className="space-y-6">
                <Card title="Últimas propuestas" icon={FileText}>
                  {stats.proposals.recent.length === 0 ? (
                    <p className="text-gray-500 text-sm py-4 text-center">Sin propuestas todavía</p>
                  ) : (
                    <div className="space-y-3">
                      {stats.proposals.recent.map(p => (
                        <Link
                          key={p.id}
                          href={`/admin/proposals/${p.id}`}
                          className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition"
                        >
                          <div className="min-w-0">
                            <p className="text-white text-sm font-medium truncate">{p.clientName}</p>
                            <p className="text-gray-500 text-xs truncate">{p.serviceLabel}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0 ml-3">
                            <span className="text-sm font-bold" style={{ color: '#FCEE21' }}>{p.price}€</span>
                            <ProposalStatusBadge status={p.status} />
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card title="Blog" icon={Pen} compact>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-xs">Publicados</span>
                        <span className="text-white text-sm font-bold">{stats.blog.published}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-xs">Borradores</span>
                        <span className="text-white text-sm font-bold">{stats.blog.drafts}</span>
                      </div>
                      {stats.blog.lastPost && (
                        <div className="pt-2 border-t" style={{ borderColor: 'rgba(102,45,145,0.3)' }}>
                          <p className="text-gray-500 text-xs">Último:</p>
                          <p className="text-white text-xs truncate">{stats.blog.lastPost.title}</p>
                        </div>
                      )}
                    </div>
                  </Card>

                  <Card title="Email" icon={Mail} compact>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-xs">Activos</span>
                        <span className="text-sm font-bold" style={{ color: '#4ade80' }}>{stats.subscribers.active}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-xs">Baja</span>
                        <span className="text-gray-400 text-sm font-bold">{stats.subscribers.unsubscribed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-xs">Rebotados</span>
                        <span className="text-red-400 text-sm font-bold">{stats.subscribers.bounced}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Row 3: Quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <QuickAction href="/admin/proposals/new" label="Nueva propuesta" icon={PlusCircle} />
              <QuickAction href="/admin/blog/new" label="Nuevo artículo" icon={Pen} />
              <QuickAction href="/admin/email/subscribers" label="Ver suscriptores" icon={Users} />
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function KPICard({ label, value, icon: Icon, color, subtitle }: {
  label: string
  value: string | number
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  color: string
  subtitle?: string
}) {
  return (
    <div className="p-5 rounded-xl" style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102,45,145,0.3)' }}>
      <div className="flex items-center gap-2 mb-1">
        <Icon size={18} style={{ color }} />
        <span className="text-gray-500 text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
    </div>
  )
}

function Card({ title, icon: Icon, children, compact }: {
  title: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  children: React.ReactNode
  compact?: boolean
}) {
  return (
    <div
      className={`rounded-xl ${compact ? 'p-4' : 'p-6'}`}
      style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102,45,145,0.3)' }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon size={16} className="text-gray-400" />
        <h3 className="text-white font-bold text-sm">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function MiniStat({ label, value, icon: Icon }: {
  label: string
  value: string | number
  icon: React.ComponentType<{ size?: number; className?: string }>
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={14} className="text-gray-500" />
      <div>
        <p className="text-white text-sm font-bold">{value}</p>
        <p className="text-gray-500 text-xs">{label}</p>
      </div>
    </div>
  )
}

function QuickAction({ href, label, icon: Icon }: {
  href: string
  label: string
  icon: React.ComponentType<{ size?: number }>
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.02]"
      style={{ backgroundColor: 'rgba(102,45,145,0.15)', border: '1px solid rgba(102,45,145,0.3)' }}
    >
      <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(252,238,33,0.1)' }}>
        <Icon size={18} />
      </div>
      <span className="text-white text-sm font-medium">{label}</span>
    </Link>
  )
}
