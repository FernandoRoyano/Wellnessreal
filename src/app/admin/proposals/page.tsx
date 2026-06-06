'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ProposalList from '@/components/admin/ProposalList'
import { PlusCircle, Search } from 'lucide-react'

interface Proposal {
  _id: string
  clientName: string
  clientEmail: string
  serviceLabel: string
  price: number
  status: string
  createdAt: string
  paymentMethod?: string | null
  transferMarkedAt?: string | null
}

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'viewed', label: 'Vistas' },
  { value: 'signed', label: 'Firmadas' },
  { value: 'payment_pending', label: 'Pago pendiente' },
  { value: 'paid', label: 'Pagadas' },
  { value: 'confirmed', label: 'Confirmadas' },
]

const SHORTCUT_FILTERS = [
  { label: 'Firmadas sin pago', filter: (p: Proposal) => p.status === 'signed' },
  { label: 'Transferencias por confirmar', filter: (p: Proposal) => p.status === 'payment_pending' && p.paymentMethod === 'transfer' && !!p.transferMarkedAt },
  { label: 'Activas', filter: (p: Proposal) => ['pending', 'viewed', 'signed', 'payment_pending'].includes(p.status) },
  { label: 'Cobradas', filter: (p: Proposal) => ['paid', 'confirmed'].includes(p.status) },
]

export default function AdminProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [shortcutIdx, setShortcutIdx] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  // Leer ?status= o ?filter= de la URL al cargar
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const status = params.get('status')
    const filter = params.get('filter')
    if (status) setStatusFilter(status)
    if (filter) {
      const idx = SHORTCUT_FILTERS.findIndex((f) => f.label.toLowerCase().includes(filter.toLowerCase()))
      if (idx >= 0) setShortcutIdx(idx)
    }
  }, [])

  useEffect(() => {
    fetch('/api/admin/proposals')
      .then((r) => r.json())
      .then((data) => setProposals(data.proposals || []))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let list = proposals
    if (statusFilter) list = list.filter((p) => p.status === statusFilter)
    if (shortcutIdx !== null) list = list.filter(SHORTCUT_FILTERS[shortcutIdx].filter)
    if (search) {
      const term = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.clientName.toLowerCase().includes(term) ||
          p.clientEmail.toLowerCase().includes(term) ||
          p.serviceLabel.toLowerCase().includes(term)
      )
    }
    return list
  }, [proposals, statusFilter, shortcutIdx, search])

  const totalRevenue = useMemo(
    () => filtered.filter((p) => ['paid', 'confirmed'].includes(p.status)).reduce((s, p) => s + Number(p.price), 0),
    [filtered]
  )
  const pendingRevenue = useMemo(
    () => filtered.filter((p) => ['signed', 'payment_pending'].includes(p.status)).reduce((s, p) => s + Number(p.price), 0),
    [filtered]
  )

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto" style={{ backgroundColor: '#16122B' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Propuestas</h1>
            <p className="text-gray-500 text-sm mt-1">
              {filtered.length} de {proposals.length} ·{' '}
              <span style={{ color: '#4ade80' }}>{totalRevenue.toLocaleString('es-ES')}€ cobrados</span>
              {pendingRevenue > 0 && (
                <>
                  {' · '}
                  <span style={{ color: '#FCEE21' }}>{pendingRevenue.toLocaleString('es-ES')}€ esperando</span>
                </>
              )}
            </p>
          </div>
          <Link
            href="/admin/proposals/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition-all hover:scale-105"
            style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
          >
            <PlusCircle size={18} />
            Nueva propuesta
          </Link>
        </div>

        {/* Shortcuts */}
        <div className="flex flex-wrap gap-2 mb-4">
          {SHORTCUT_FILTERS.map((s, i) => (
            <button
              key={s.label}
              onClick={() => {
                setShortcutIdx(shortcutIdx === i ? null : i)
                setStatusFilter('')
              }}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                backgroundColor: shortcutIdx === i ? '#FCEE21' : 'rgba(102,45,145,0.2)',
                color: shortcutIdx === i ? '#16122B' : '#a78bfa',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex-1 min-w-[200px] relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por cliente, email o servicio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-white text-sm outline-none"
              style={{ backgroundColor: '#1a1535', border: '1px solid #662D91' }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setShortcutIdx(null)
            }}
            className="px-3 py-2.5 rounded-lg text-white text-sm outline-none"
            style={{ backgroundColor: '#1a1535', border: '1px solid #662D91' }}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Cargando...</div>
        ) : (
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102,45,145,0.3)' }}
          >
            <ProposalList proposals={filtered} />
          </div>
        )}
      </main>
    </div>
  )
}
