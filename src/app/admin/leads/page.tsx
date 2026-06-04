'use client'

import { useEffect, useState, useMemo } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Users, TrendingUp, Calendar, Search, X, ExternalLink, Trash2 } from 'lucide-react'

interface Lead {
  id: string
  email: string
  name: string | null
  phone: string | null
  source: string
  status: string
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  landing_page: string | null
  notes: string | null
  tags: string[]
  form_data: Record<string, unknown> | null
  created_at: string
  contacted_at: string | null
  converted_at: string | null
}

interface Stats {
  total: number
  nuevo: number
  contactado: number
  qualified: number
  cliente: number
  descartado: number
  last_7_days: number
  last_30_days: number
}

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'contactado', label: 'Contactado' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'cliente', label: 'Cliente' },
  { value: 'descartado', label: 'Descartado' },
]

const SOURCE_OPTIONS = [
  { value: '', label: 'Todas' },
  { value: 'guia', label: 'Guía' },
  { value: 'valoracion', label: 'Valoración' },
  { value: 'metodo-optin', label: 'VSL' },
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'contacto', label: 'Contacto' },
]

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  nuevo: { bg: 'rgba(252,238,33,0.15)', color: '#FCEE21' },
  contactado: { bg: 'rgba(96,165,250,0.15)', color: '#60a5fa' },
  qualified: { bg: 'rgba(168,85,247,0.15)', color: '#a855f7' },
  cliente: { bg: 'rgba(74,222,128,0.15)', color: '#4ade80' },
  descartado: { bg: 'rgba(156,163,175,0.15)', color: '#9ca3af' },
}

export default function LeadsAdminPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Lead | null>(null)

  const fetchLeads = async () => {
    setLoading(true)
    const params = new URLSearchParams({ stats: '1' })
    if (statusFilter) params.set('status', statusFilter)
    if (sourceFilter) params.set('source', sourceFilter)
    if (search) params.set('search', search)

    const res = await fetch(`/api/admin/leads?${params}`)
    const data = await res.json()
    setLeads(data.leads || [])
    setStats(data.stats)
    setLoading(false)
  }

  useEffect(() => {
    fetchLeads()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, sourceFilter])

  const conversionRate = useMemo(() => {
    if (!stats || stats.total === 0) return 0
    return Math.round((stats.cliente / stats.total) * 100)
  }, [stats])

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto" style={{ backgroundColor: '#16122B' }}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Leads</h1>
          <p className="text-gray-500 text-sm mt-1">Captados desde formularios + UTMs de campañas</p>
        </div>

        {/* Stats cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={<Users size={18} />}
              label="Total"
              value={stats.total}
              accent="#FCEE21"
            />
            <StatCard
              icon={<Calendar size={18} />}
              label="Últimos 7 días"
              value={stats.last_7_days}
              accent="#60a5fa"
            />
            <StatCard
              icon={<TrendingUp size={18} />}
              label="Clientes"
              value={stats.cliente}
              accent="#4ade80"
              subtext={`${conversionRate}% conversión`}
            />
            <StatCard
              icon={<Users size={18} />}
              label="Sin contactar"
              value={stats.nuevo}
              accent="#a855f7"
            />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex-1 min-w-[200px] relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por email, nombre o teléfono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchLeads()}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-white text-sm outline-none"
              style={{ backgroundColor: '#1a1535', border: '1px solid #662D91' }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg text-white text-sm outline-none"
            style={{ backgroundColor: '#1a1535', border: '1px solid #662D91' }}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg text-white text-sm outline-none"
            style={{ backgroundColor: '#1a1535', border: '1px solid #662D91' }}
          >
            {SOURCE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Cargando...</div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20">
            <Users size={48} className="mx-auto mb-4 opacity-20 text-gray-500" />
            <p className="text-gray-500">No hay leads que mostrar</p>
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#662D91' }}>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#0f0c20' }}>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium uppercase">Lead</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium uppercase">Origen</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium uppercase">Campaña</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium uppercase">Estado</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium uppercase">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelected(lead)}
                    className="border-t cursor-pointer hover:bg-white/5 transition"
                    style={{ borderColor: 'rgba(102,45,145,0.2)' }}
                  >
                    <td className="px-4 py-3">
                      <p className="text-white font-medium text-sm">{lead.name || '—'}</p>
                      <p className="text-gray-500 text-xs">{lead.email}</p>
                      {lead.phone && <p className="text-gray-500 text-xs">{lead.phone}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(102,45,145,0.2)', color: '#a78bfa' }}>
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {lead.utm_campaign ? (
                        <div>
                          <p className="text-white">{lead.utm_campaign}</p>
                          <p className="text-gray-600">{lead.utm_source} · {lead.utm_medium}</p>
                        </div>
                      ) : (
                        <span className="text-gray-600">— orgánico —</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(lead.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {selected && (
        <LeadDetailDrawer
          lead={selected}
          onClose={() => setSelected(null)}
          onSaved={() => { fetchLeads(); setSelected(null) }}
          onDeleted={() => { fetchLeads(); setSelected(null) }}
        />
      )}
    </div>
  )
}

function StatCard({ icon, label, value, accent, subtext }: {
  icon: React.ReactNode; label: string; value: number; accent: string; subtext?: string
}) {
  return (
    <div className="p-5 rounded-xl" style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102,45,145,0.3)' }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${accent}22`, color: accent }}>
          {icon}
        </div>
        <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-3xl font-bold" style={{ color: accent }}>{value}</p>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] || { bg: 'rgba(156,163,175,0.15)', color: '#9ca3af' }
  return (
    <span className="text-xs font-medium px-2 py-1 rounded-full inline-block" style={{ backgroundColor: c.bg, color: c.color }}>
      {status}
    </span>
  )
}

function LeadDetailDrawer({ lead, onClose, onSaved, onDeleted }: {
  lead: Lead; onClose: () => void; onSaved: () => void; onDeleted: () => void
}) {
  const [status, setStatus] = useState(lead.status)
  const [notes, setNotes] = useState(lead.notes || '')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    await fetch(`/api/admin/leads/${lead.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    })
    setSaving(false)
    onSaved()
  }

  const remove = async () => {
    if (!confirm(`¿Eliminar lead de ${lead.email}?`)) return
    await fetch(`/api/admin/leads/${lead.id}`, { method: 'DELETE' })
    onDeleted()
  }

  const phoneClean = lead.phone?.replace(/[^0-9]/g, '') || ''

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative w-full max-w-md overflow-y-auto p-6"
        style={{ backgroundColor: '#0f0c20', borderLeft: '1px solid #662D91' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Detalle del lead</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <Field label="Nombre" value={lead.name || '—'} />
          <Field label="Email" value={lead.email} />
          <Field label="Teléfono" value={lead.phone || '—'} />
          {phoneClean && (
            <a
              href={`https://wa.me/${phoneClean.startsWith('34') ? phoneClean : '34' + phoneClean}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold"
              style={{ backgroundColor: '#25D366', color: 'white' }}
            >
              <ExternalLink size={14} /> Abrir WhatsApp
            </a>
          )}
        </div>

        <div className="space-y-4 mb-6 pt-4 border-t" style={{ borderColor: 'rgba(102,45,145,0.3)' }}>
          <Field label="Origen" value={lead.source} />
          <Field label="UTM source" value={lead.utm_source || '—'} />
          <Field label="UTM medium" value={lead.utm_medium || '—'} />
          <Field label="UTM campaign" value={lead.utm_campaign || '—'} />
          <Field label="Landing" value={lead.landing_page || '—'} />
          {lead.tags && lead.tags.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Tags</p>
              <div className="flex flex-wrap gap-1">
                {lead.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(102,45,145,0.3)', color: '#a78bfa' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {lead.form_data && Object.keys(lead.form_data).length > 0 && (
          <div className="mb-6 pt-4 border-t" style={{ borderColor: 'rgba(102,45,145,0.3)' }}>
            <p className="text-xs text-gray-500 mb-2 uppercase">Datos del formulario</p>
            <div className="text-xs text-gray-300 space-y-1">
              {Object.entries(lead.form_data).map(([k, v]) => (
                v ? <div key={k}><span className="text-gray-500">{k}:</span> {String(v)}</div> : null
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3 pt-4 border-t" style={{ borderColor: 'rgba(102,45,145,0.3)' }}>
          <div>
            <label className="block text-xs text-gray-500 mb-1 uppercase">Estado</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
              style={{ backgroundColor: '#1a1535', border: '1px solid #662D91' }}
            >
              {STATUS_OPTIONS.filter((o) => o.value).map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1 uppercase">Notas internas</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none resize-none h-24"
              style={{ backgroundColor: '#1a1535', border: '1px solid #662D91' }}
              placeholder="¿Qué se ha hablado? ¿Próximos pasos?"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-6">
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 py-2.5 rounded-lg font-bold text-sm"
            style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <button
            onClick={remove}
            className="px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10"
            title="Eliminar lead"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-sm text-white break-all">{value}</p>
    </div>
  )
}
