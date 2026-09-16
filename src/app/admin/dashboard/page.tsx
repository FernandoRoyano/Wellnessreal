'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Check, ChevronRight, CircleAlert, Copy, Euro, ExternalLink, FileText, Link2, LoaderCircle, MessageCircle, Plus, RefreshCw, Sparkles, UserRound } from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ProposalStatusBadge from '@/components/admin/ProposalStatusBadge'
import styles from './dashboard.module.css'

interface AttentionItem { type: string; severity: 'critical' | 'warning' | 'info'; label: string; count: number; href: string }
interface PendingPayment { id: string; clientName: string; serviceLabel: string; price: number; status: string; signedAt: string | null; daysSinceSign: number | null; paymentMethod: string | null }
interface DashboardStats {
  summary: { hour: number; leadsThisWeek: number; leadsPrevWeek: number; thisMonthRevenue: number; lastMonthRevenue: number; attentionCount: number }
  attention: AttentionItem[]
  proposals: { total: number; statusCounts: Record<string, number>; activeProposals: number; revenue: number; pendingRevenue: number; conversionRate: number; thisMonth: number; lastMonth: number; thisMonthRevenue: number; lastMonthRevenue: number; stripePayments: number; transferPayments: number; recent: { id: string; clientName: string; serviceLabel: string; price: number; status: string; createdAt: string }[]; pendingPayments: PendingPayment[] }
  leads: { total: number; byStatus: Record<string, number>; topSources: { source: string; count: number }[]; thisWeek: number; prevWeek: number; uncontactedOver24h: number; uncontactedSample: { id: string; name: string; hoursAgo: number }[] }
  blog: { published: number; drafts: number; lastPost: { title: string; publishedAt: string } | null }
  subscribers: { active: number; unsubscribed: number; bounced: number; total: number }
}

const stages = [{ key: 'nuevo', label: 'Nuevos' }, { key: 'contactado', label: 'Contactados' }, { key: 'qualified', label: 'Cualificados' }, { key: 'cliente', label: 'Clientes' }] as const
const tools = [
  { label: 'Funnel tiroides', note: 'Conversión del test y seguimiento', href: '/admin/funnel-tiroides', icon: UserRound },
  { label: 'Comunidad', note: 'Contenido, módulos y publicaciones', href: '/admin/comunidad', icon: MessageCircle },
  { label: 'Programas IA', note: 'Revisar planes antes de enviarlos', href: '/admin/programas', icon: Sparkles },
  { label: 'Guiones', note: 'Biblioteca de vídeos y contenidos', href: '/admin/guiones', icon: FileText },
] as const
const publicLinks = [
  { title: 'Test de tiroides', path: '/tiroides', note: 'Entrada principal desde campañas' },
  { title: 'Valoración gratuita', path: '/valoracion', note: 'Formulario de precualificación' },
  { title: 'Cuestionario IA', path: '/cuestionario', note: 'Generación del plan personalizado' },
  { title: 'Webinar', path: '/webinar', note: 'Onboarding desde el webinar' },
] as const

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const loadStats = async () => {
    setLoading(true); setError(false)
    try {
      const response = await fetch('/api/admin/dashboard/stats')
      if (!response.ok) throw new Error(`Dashboard stats returned ${response.status}`)
      setStats(await response.json())
    } catch (cause) {
      console.error('[Dashboard:loadStats] No se pudieron cargar las métricas', cause); setError(true)
    } finally { setLoading(false) }
  }
  useEffect(() => { void loadStats() }, [])
  return <div className={styles.shell}><AdminSidebar /><main className={styles.main}>
    {loading && <Loading />}
    {!loading && error && <ErrorState onRetry={loadStats} />}
    {!loading && stats && !error && <Dashboard stats={stats} />}
  </main></div>
}

function Dashboard({ stats }: { stats: DashboardStats }) {
  const greeting = stats.summary.hour < 6 ? 'Buenas noches' : stats.summary.hour < 13 ? 'Buenos días' : stats.summary.hour < 21 ? 'Buenas tardes' : 'Buenas noches'
  const date = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date())
  return <div className={styles.content}>
    <header className={styles.header}><div><p className={styles.eyebrow}>Pulso WellnessReal · {date}</p><h1>{greeting}, Fernando.</h1></div><Link href="/admin/proposals/new" className={styles.primary}><Plus size={18} /><span>Nueva propuesta</span></Link></header>
    <Brief stats={stats} />
    <div className={styles.commandGrid}>
      <div className={styles.primaryColumn}><Funnel stats={stats} /><Activity stats={stats} /></div>
      <aside className={styles.secondaryColumn}><Attention stats={stats} /><Revenue stats={stats} /></aside>
    </div>
    <section className={styles.tools}><div><p className={styles.label}>Gestión</p><h2>Espacios de trabajo</h2></div><div className={styles.toolGrid}>{tools.map(tool => { const Icon = tool.icon; return <Link key={tool.href} href={tool.href} className={styles.tool}><Icon size={18}/><span><strong>{tool.label}</strong><small>{tool.note}</small></span><ArrowUpRight size={15}/></Link> })}</div></section>
    <Links />
  </div>
}

function Brief({ stats }: { stats: DashboardStats }) {
  const delta = stats.summary.leadsThisWeek - stats.summary.leadsPrevWeek
  return <section className={styles.brief} aria-labelledby="brief-title"><div className={styles.pulse}><span /></div><div><p id="brief-title" className={styles.label}>Ahora mismo</p><p className={styles.sentence}>Esta semana han llegado <strong>{stats.summary.leadsThisWeek} personas</strong>{stats.leads.uncontactedOver24h > 0 && <> y <strong className={styles.danger}>{stats.leads.uncontactedOver24h} esperan respuesta</strong></>}. Hay <strong>{stats.proposals.pendingRevenue.toLocaleString('es-ES')} €</strong> pendientes de cobro.</p></div><div className={styles.metrics}><Metric label="Leads" value={stats.summary.leadsThisWeek} note={`${delta >= 0 ? '+' : ''}${delta} vs. anterior`} /><Metric label="Propuestas" value={stats.proposals.activeProposals} note={`${stats.proposals.conversionRate}% conversión`} /><Metric label="Ingresos" value={`${stats.summary.thisMonthRevenue.toLocaleString('es-ES')} €`} note="este mes" /></div></section>
}
function Metric({ label, value, note }: { label: string; value: string | number; note: string }) { return <div className={styles.metric}><span>{label}</span><strong>{value}</strong><small>{note}</small></div> }

function Funnel({ stats }: { stats: DashboardStats }) {
  const maximum = Math.max(...stages.map(stage => stats.leads.byStatus[stage.key] || 0), 1)
  return <section className={styles.panel} aria-labelledby="funnel-title"><PanelHeader label="Conversión" title="Del interés al cliente" id="funnel-title" href="/admin/leads" link="Ver leads" /><div className={styles.funnel}>{stages.map((stage, index) => { const value = stats.leads.byStatus[stage.key] || 0; const previous = index ? stats.leads.byStatus[stages[index - 1].key] || 0 : stats.leads.total; const conversion = previous ? Math.round(value / previous * 100) : 0; return <div className={styles.stage} key={stage.key}><div><span>{stage.label}</span><strong>{value}</strong></div><i><b style={{ width: `${Math.max(value / maximum * 100, value ? 7 : 0)}%` }} /></i><small>{index ? `${conversion}% desde la fase anterior` : `${stats.leads.total} en total`}</small></div> })}</div>{stats.leads.topSources.length > 0 && <div className={styles.sources}><span>Principales orígenes</span><div>{stats.leads.topSources.slice(0, 4).map(item => <span key={item.source}>{item.source} <b>{item.count}</b></span>)}</div></div>}</section>
}

function PanelHeader({ label, title, id, href, link }: { label: string; title: string; id: string; href?: string; link?: string }) { return <div className={styles.panelHeader}><div><p className={styles.label}>{label}</p><h2 id={id}>{title}</h2></div>{href && <Link href={href} className={styles.textLink}>{link} <ArrowUpRight size={15}/></Link>}</div> }

function Attention({ stats }: { stats: DashboardStats }) {
  const payment: AttentionItem[] = stats.proposals.pendingPayments.length ? [{ type: 'payments', severity: 'warning', label: `${stats.proposals.pendingPayments.length} cobro${stats.proposals.pendingPayments.length === 1 ? '' : 's'} pendiente${stats.proposals.pendingPayments.length === 1 ? '' : 's'}`, count: stats.proposals.pendingPayments.length, href: '/admin/proposals' }] : []
  const items = [...stats.attention, ...payment].slice(0, 5)
  return <section className={`${styles.panel} ${styles.attention}`} aria-labelledby="attention-title"><div className={styles.panelHeader}><div><p className={styles.label}>Prioridad</p><h2 id="attention-title">Atención ahora</h2></div>{items.length > 0 && <b className={styles.count}>{items.length}</b>}</div>{items.length ? <div className={styles.attentionList}>{items.map(item => <Link key={item.type} href={item.href}><i className={styles[item.severity]} /><span>{item.label}</span><ChevronRight size={16}/></Link>)}</div> : <div className={styles.calm}><Check size={18}/><span><strong>Todo al día</strong><small>No hay tareas urgentes.</small></span></div>}</section>
}

function Revenue({ stats }: { stats: DashboardStats }) { return <section className={`${styles.panel} ${styles.revenue}`} aria-labelledby="revenue-title"><p className={styles.label}>Por cobrar</p><div className={styles.revenueTitle}><h2 id="revenue-title">{stats.proposals.pendingRevenue.toLocaleString('es-ES')} €</h2><Euro size={18}/></div>{stats.proposals.pendingPayments.length ? <div className={styles.payments}>{stats.proposals.pendingPayments.slice(0, 3).map(item => <Link href={`/admin/proposals/${item.id}`} key={item.id}><span><strong>{item.clientName}</strong><small>{item.serviceLabel}</small></span><b>{item.price.toLocaleString('es-ES')} €</b></Link>)}</div> : <p className={styles.muted}>No hay pagos pendientes.</p>}</section> }

function Activity({ stats }: { stats: DashboardStats }) { return <section className={`${styles.panel} ${styles.activity}`} aria-labelledby="activity-title"><PanelHeader label="Actividad" title="Últimos movimientos" id="activity-title" href="/admin/proposals" link="Ver todo" />{stats.proposals.recent.length ? <div className={styles.timeline}>{stats.proposals.recent.slice(0, 4).map(item => <Link href={`/admin/proposals/${item.id}`} key={item.id}><i /><span><strong>{item.clientName}</strong><small>{item.serviceLabel} · {item.price.toLocaleString('es-ES')} €</small></span><ProposalStatusBadge status={item.status}/></Link>)}</div> : <div className={styles.empty}><i /><p><strong>El pulso empieza aquí.</strong> La actividad aparecerá cuando lleguen nuevas propuestas.</p></div>}</section> }

function Links() { return <details className={styles.drawer}><summary><span><Link2 size={17}/> Enlaces públicos y campañas</span><small>Copiar accesos</small></summary><div className={styles.linkGrid}>{publicLinks.map(item => <PublicLink key={item.path} {...item}/>)}<Link href="/admin/enlaces" className={styles.manage}>Gestionar todos los enlaces <ArrowRight size={15}/></Link></div></details> }
function PublicLink({ title, path, note }: { title: string; path: string; note: string }) { const [copied, setCopied] = useState(false); const url = `https://wellnessreal.es${path}`; const copy = async () => { try { await navigator.clipboard.writeText(url); setCopied(true); window.setTimeout(() => setCopied(false), 1800) } catch (cause) { console.error('[Dashboard:copyLink] No se pudo copiar el enlace', cause) } }; return <div className={styles.publicLink}><span><strong>{title}</strong><small>{note}</small></span><code>{path}</code><div><button type="button" onClick={copy} aria-label={`Copiar enlace de ${title}`}>{copied ? <Check size={16}/> : <Copy size={16}/>}</button><a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${title}`}><ExternalLink size={16}/></a></div></div> }
function Loading() { return <div className={styles.state} role="status"><LoaderCircle size={24} className={styles.spinner}/><span>Tomando el pulso al negocio…</span></div> }
function ErrorState({ onRetry }: { onRetry: () => Promise<void> }) { return <div className={styles.state}><CircleAlert size={26}/><h1>No he podido cargar el dashboard</h1><p>Los datos no están disponibles ahora mismo. Puedes volver a intentarlo.</p><button onClick={() => void onRetry()}><RefreshCw size={17}/> Reintentar</button></div> }
