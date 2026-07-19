'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ProposalStatusBadge from '@/components/admin/ProposalStatusBadge'
import Link from 'next/link'
import {
  PlusCircle, Euro, Users, FileText, BookOpen,
  TrendingUp, CreditCard, ArrowRightLeft, Clock,
  Pen, Mail, Link2, Copy, ExternalLink, Check,
  PlayCircle, ClipboardList, Gift, MessageCircle, Target,
  AlertTriangle, ChevronRight, UserPlus, ArrowUpRight, ArrowDownRight, ArrowRight,
  Sparkles,
} from 'lucide-react'

interface AttentionItem {
  type: string
  severity: 'critical' | 'warning' | 'info'
  label: string
  count: number
  href: string
}

interface PendingPayment {
  id: string
  clientName: string
  serviceLabel: string
  price: number
  status: string
  signedAt: string | null
  daysSinceSign: number | null
  paymentMethod: string | null
}

interface DashboardStats {
  summary: {
    hour: number
    leadsThisWeek: number
    leadsPrevWeek: number
    thisMonthRevenue: number
    lastMonthRevenue: number
    attentionCount: number
  }
  attention: AttentionItem[]
  proposals: {
    total: number
    statusCounts: Record<string, number>
    activeProposals: number
    revenue: number
    pendingRevenue: number
    conversionRate: number
    thisMonth: number
    lastMonth: number
    thisMonthRevenue: number
    lastMonthRevenue: number
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
    pendingPayments: PendingPayment[]
  }
  leads: {
    total: number
    byStatus: Record<string, number>
    topSources: { source: string; count: number }[]
    thisWeek: number
    prevWeek: number
    uncontactedOver24h: number
    uncontactedSample: { id: string; name: string; hoursAgo: number }[]
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
            {/* ────── Resumen ejecutivo + Atención requerida ────── */}
            <ExecutiveSummary stats={stats} />

            {stats.attention.length > 0 && (
              <AttentionBlock items={stats.attention} />
            )}

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

            {/* Row 2.7: Leads + Próximos cobros */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <LeadsBlock leads={stats.leads} />
              <PendingPaymentsBlock payments={stats.proposals.pendingPayments} pendingRevenue={stats.proposals.pendingRevenue} />
            </div>

            {/* Row 2.5: Páginas de captación */}
            <div
              className="rounded-xl p-6 mb-6"
              style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102,45,145,0.3)' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Link2 size={16} className="text-gray-400" />
                <h3 className="text-white font-bold text-sm">Páginas de captación</h3>
              </div>
              <p className="text-gray-500 text-xs mb-5">
                Pega estas URLs en tus anuncios. El funnel VSL (<span style={{ color: '#FCEE21' }}>/metodo</span>) es el principal.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <CaptureCard
                  icon={Target}
                  title="VSL — Opt-in"
                  description="Página de registro. Aquí aterrizan los anuncios."
                  path="/metodo"
                  highlight
                />
                <CaptureCard
                  icon={PlayCircle}
                  title="VSL — Vídeo"
                  description="Vídeo de 15 min + CTA. Acceso directo."
                  path="/metodo/video"
                />
                <CaptureCard
                  icon={ClipboardList}
                  title="Valoración gratuita"
                  description="Formulario 6 pasos con pre-cualificación de presupuesto."
                  path="/valoracion"
                />
                <CaptureCard
                  icon={Gift}
                  title="Recurso gratis (PDF)"
                  description="Lead magnet — guía descargable."
                  path="/recurso-gratis"
                />
                <CaptureCard
                  icon={MessageCircle}
                  title="Contacto"
                  description="Formulario genérico de contacto."
                  path="/contacto"
                />
                <CaptureCard
                  icon={FileText}
                  title="Tarifas"
                  description="Tráfico orgánico que ya sabe lo que busca."
                  path="/tarifas"
                />
              </div>
            </div>

            {/* Row 2.6: Embudo del plan con IA */}
            <div
              className="rounded-xl p-6 mb-6"
              style={{ backgroundColor: '#1a1535', border: '1px solid rgba(252,238,33,0.25)' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} style={{ color: '#FCEE21' }} />
                <h3 className="text-white font-bold text-sm">Embudo del plan con IA</h3>
              </div>
              <p className="text-gray-500 text-xs mb-5">
                Las dos puertas del onboarding (webinar y cuestionario directo) y tu pantalla para revisar los planes que genera la IA antes de enviarlos.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <CaptureCard
                  icon={PlayCircle}
                  title="Webinar"
                  description="Landing del webinar. Tras reservar plaza, lleva al cuestionario."
                  path="/webinar"
                />
                <CaptureCard
                  icon={ClipboardList}
                  title="Cuestionario (plan IA)"
                  description="Puerta directa: lo rellenan, la IA genera el plan y ven el teaser."
                  path="/cuestionario"
                  highlight
                />
                <AdminLinkCard
                  icon={Sparkles}
                  title="Revisar planes generados"
                  description="Tu cola de revisión: aprueba, ajusta y obtén el enlace del cliente."
                  href="/admin/programas"
                />
              </div>
            </div>

            {/* Row 3: Quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <QuickAction href="/admin/comunidad" label="Comunidad tiroides" icon={MessageCircle} />
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

function CaptureCard({
  icon: Icon,
  title,
  description,
  path,
  highlight,
}: {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  title: string
  description: string
  path: string
  highlight?: boolean
}) {
  const [copied, setCopied] = useState(false)
  const baseUrl = typeof window !== 'undefined'
    ? 'https://wellnessreal.es'
    : 'https://wellnessreal.es'
  const fullUrl = `${baseUrl}${path}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <div
      className="rounded-xl p-4 transition-all hover:border-opacity-60"
      style={{
        backgroundColor: '#16122B',
        border: highlight
          ? '1px solid rgba(252,238,33,0.5)'
          : '1px solid rgba(102,45,145,0.3)',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="p-1.5 rounded-lg"
          style={{
            backgroundColor: highlight ? 'rgba(252,238,33,0.15)' : 'rgba(102,45,145,0.2)',
          }}
        >
          <Icon size={14} style={{ color: highlight ? '#FCEE21' : '#c084fc' }} />
        </div>
        <h4 className="text-white text-sm font-bold">{title}</h4>
        {highlight && (
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto"
            style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
          >
            PRINCIPAL
          </span>
        )}
      </div>
      <p className="text-gray-400 text-xs leading-relaxed mb-3">{description}</p>
      <div
        className="flex items-center gap-1 rounded-lg px-2.5 py-2"
        style={{ backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(102,45,145,0.2)' }}
      >
        <code className="flex-1 text-[11px] text-gray-300 truncate font-mono">
          {fullUrl}
        </code>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded transition-all hover:bg-white/10"
          title="Copiar URL"
          aria-label="Copiar URL"
        >
          {copied ? (
            <Check size={13} style={{ color: '#4ade80' }} />
          ) : (
            <Copy size={13} className="text-gray-400" />
          )}
        </button>
        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded transition-all hover:bg-white/10"
          title="Abrir en pestaña nueva"
          aria-label="Abrir en pestaña nueva"
        >
          <ExternalLink size={13} className="text-gray-400" />
        </a>
      </div>
    </div>
  )
}

function AdminLinkCard({ icon: Icon, title, description, href }: {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl p-4 transition-all hover:scale-[1.01]"
      style={{ backgroundColor: '#16122B', border: '1px solid rgba(102,45,145,0.3)' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg" style={{ backgroundColor: 'rgba(252,238,33,0.15)' }}>
          <Icon size={14} style={{ color: '#FCEE21' }} />
        </div>
        <h4 className="text-white text-sm font-bold">{title}</h4>
        <ArrowRight size={14} className="text-gray-500 ml-auto" />
      </div>
      <p className="text-gray-400 text-xs leading-relaxed">{description}</p>
    </Link>
  )
}

// ════════════════════════════════════════════════════════════════════════
// Bloques nuevos del dashboard
// ════════════════════════════════════════════════════════════════════════

function ExecutiveSummary({ stats }: { stats: DashboardStats }) {
  const { summary } = stats
  const hour = summary.hour
  const greeting = hour < 6 ? 'Buenas noches' : hour < 13 ? 'Buenos días' : hour < 21 ? 'Buenas tardes' : 'Buenas noches'

  const weekDelta = summary.leadsThisWeek - summary.leadsPrevWeek
  const weekDeltaPct = summary.leadsPrevWeek > 0
    ? Math.round((weekDelta / summary.leadsPrevWeek) * 100)
    : (summary.leadsThisWeek > 0 ? 100 : 0)

  const revenueDelta = summary.thisMonthRevenue - summary.lastMonthRevenue
  const revenueDeltaPct = summary.lastMonthRevenue > 0
    ? Math.round((revenueDelta / summary.lastMonthRevenue) * 100)
    : (summary.thisMonthRevenue > 0 ? 100 : 0)

  return (
    <div
      className="rounded-xl p-6 mb-6"
      style={{ backgroundColor: '#1a1535', border: '1px solid rgba(252,238,33,0.2)' }}
    >
      <p className="text-fluid-sm text-gray-400">
        {greeting}, Fernando.
      </p>
      <p className="text-white text-lg md:text-xl font-medium mt-1 leading-relaxed">
        {summary.leadsThisWeek === 0 && summary.thisMonthRevenue === 0 ? (
          <>Hoy es un buen día para construir el embudo. Sin actividad nueva todavía esta semana.</>
        ) : (
          <>
            Esta semana llevas <strong style={{ color: '#FCEE21' }}>{summary.leadsThisWeek} leads</strong>
            {summary.leadsPrevWeek > 0 && (
              <span style={{ color: weekDelta >= 0 ? '#4ade80' : '#f87171' }}>
                {' '}({weekDelta >= 0 ? '+' : ''}{weekDeltaPct}% vs anterior)
              </span>
            )}
            . Este mes <strong style={{ color: '#FCEE21' }}>{summary.thisMonthRevenue.toLocaleString('es-ES')}€</strong> cobrados
            {summary.lastMonthRevenue > 0 && (
              <span style={{ color: revenueDelta >= 0 ? '#4ade80' : '#f87171' }}>
                {' '}({revenueDelta >= 0 ? '+' : ''}{revenueDeltaPct}% vs mes anterior)
              </span>
            )}
            {summary.attentionCount > 0
              ? <>. Tienes <strong style={{ color: '#f87171' }}>{summary.attentionCount} cosa{summary.attentionCount === 1 ? '' : 's'} por atender</strong> abajo.</>
              : <>. Todo al día. 👍</>}
          </>
        )}
      </p>
    </div>
  )
}

function AttentionBlock({ items }: { items: AttentionItem[] }) {
  return (
    <div
      className="rounded-xl p-6 mb-6"
      style={{ backgroundColor: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.3)' }}
    >
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={18} style={{ color: '#f87171' }} />
        <h3 className="text-white font-bold text-sm">
          Atención requerida
          <span className="ml-2 text-xs font-normal text-gray-500">({items.length})</span>
        </h3>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.type}
            href={item.href}
            className="flex items-center justify-between p-3 rounded-lg transition-all hover:bg-white/5 group"
            style={{ border: '1px solid rgba(102,45,145,0.2)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.severity === 'critical' ? '#f87171' : item.severity === 'warning' ? '#FCEE21' : '#60a5fa' }}
              />
              <span className="text-white text-sm group-hover:text-[#FCEE21] transition-colors">
                {item.label}
              </span>
            </div>
            <ChevronRight size={16} className="text-gray-600 group-hover:text-[#FCEE21] transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  )
}

function LeadsBlock({ leads }: { leads: DashboardStats['leads'] }) {
  const delta = leads.thisWeek - leads.prevWeek

  return (
    <Card title="Leads" icon={UserPlus}>
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total</p>
          <p className="text-2xl font-bold text-white">{leads.total}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Esta semana</p>
          <p className="text-2xl font-bold" style={{ color: '#FCEE21' }}>{leads.thisWeek}</p>
          {leads.prevWeek > 0 && (
            <p className="text-[10px] mt-0.5" style={{ color: delta >= 0 ? '#4ade80' : '#f87171' }}>
              {delta >= 0 ? <ArrowUpRight className="inline w-2.5 h-2.5" /> : <ArrowDownRight className="inline w-2.5 h-2.5" />}
              {' '}{delta >= 0 ? '+' : ''}{delta} vs anterior
            </p>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Sin contactar</p>
          <p className="text-2xl font-bold" style={{ color: leads.uncontactedOver24h > 0 ? '#f87171' : '#9ca3af' }}>
            {leads.uncontactedOver24h}
          </p>
          {leads.uncontactedOver24h > 0 && (
            <p className="text-[10px] text-gray-500 mt-0.5">{'>'}24h</p>
          )}
        </div>
      </div>

      {/* Pipeline visual */}
      <div className="mb-5">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Pipeline</p>
        <div className="space-y-2">
          {[
            { key: 'nuevo', label: 'Nuevo', color: '#FCEE21' },
            { key: 'contactado', label: 'Contactado', color: '#60a5fa' },
            { key: 'qualified', label: 'Qualified', color: '#a855f7' },
            { key: 'cliente', label: 'Cliente', color: '#4ade80' },
          ].map(({ key, label, color }) => {
            const count = leads.byStatus[key] || 0
            const pct = leads.total > 0 ? (count / leads.total) * 100 : 0
            return (
              <div key={key} className="flex items-center gap-3">
                <span className="text-gray-400 text-xs w-20 shrink-0">{label}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(102,45,145,0.2)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
                <span className="text-white text-xs font-bold w-6 text-right">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top sources */}
      {leads.topSources.length > 0 && (
        <div className="pt-4 border-t" style={{ borderColor: 'rgba(102,45,145,0.3)' }}>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Origen</p>
          <div className="flex flex-wrap gap-2">
            {leads.topSources.map(({ source, count }) => (
              <span
                key={source}
                className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                style={{ backgroundColor: 'rgba(102,45,145,0.2)', color: '#a78bfa' }}
              >
                {source}
                <span className="text-white font-bold">{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <Link
        href="/admin/leads"
        className="flex items-center justify-center gap-1 mt-4 pt-3 text-sm font-medium hover:underline border-t transition"
        style={{ color: '#FCEE21', borderColor: 'rgba(102,45,145,0.3)' }}
      >
        Ver todos los leads <ArrowRight size={14} />
      </Link>
    </Card>
  )
}

function PendingPaymentsBlock({ payments, pendingRevenue }: { payments: PendingPayment[]; pendingRevenue: number }) {
  return (
    <Card title="Próximos cobros" icon={Clock}>
      {payments.length === 0 ? (
        <div className="py-8 text-center">
          <Euro size={32} className="mx-auto mb-2 opacity-20 text-gray-500" />
          <p className="text-gray-500 text-sm">Sin cobros pendientes</p>
        </div>
      ) : (
        <>
          <div className="mb-4 pb-4 border-b" style={{ borderColor: 'rgba(102,45,145,0.3)' }}>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Total esperando</p>
            <p className="text-3xl font-bold" style={{ color: '#4ade80' }}>
              {pendingRevenue.toLocaleString('es-ES')}€
            </p>
            <p className="text-xs text-gray-500 mt-1">{payments.length} propuesta{payments.length === 1 ? '' : 's'} firmada{payments.length === 1 ? '' : 's'} sin cobrar</p>
          </div>
          <div className="space-y-2">
            {payments.map((p) => (
              <Link
                key={p.id}
                href={`/admin/proposals/${p.id}`}
                className="flex items-center justify-between p-3 rounded-lg transition-all hover:bg-white/5 group"
                style={{ border: '1px solid rgba(102,45,145,0.2)' }}
              >
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate group-hover:text-[#FCEE21] transition">
                      {p.clientName}
                    </p>
                    <p className="text-gray-500 text-xs truncate">
                      {p.serviceLabel}
                      {p.daysSinceSign !== null && (
                        <span className="ml-2 text-gray-600">
                          {p.daysSinceSign === 0 ? 'firmado hoy' : `firmado hace ${p.daysSinceSign}d`}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right ml-3 shrink-0">
                    <p className="text-sm font-bold" style={{ color: '#FCEE21' }}>{p.price}€</p>
                    {p.paymentMethod === 'transfer' && (
                      <p className="text-[10px] text-gray-500">Transferencia</p>
                    )}
                    {p.paymentMethod === 'stripe' && (
                      <p className="text-[10px] text-gray-500">Stripe</p>
                    )}
                  </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </Card>
  )
}
