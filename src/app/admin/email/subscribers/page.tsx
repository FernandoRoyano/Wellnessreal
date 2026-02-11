'use client'

import { useEffect, useState, useCallback } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import SubscriberStatusBadge from '@/components/admin/email/SubscriberStatusBadge'
import Link from 'next/link'
import { Search, Users, Mail, UserMinus, ArrowRight, AlertTriangle } from 'lucide-react'
import type { MLSubscriber } from '@/lib/types/mailerlite'

interface SubscriberCounts {
  total: number
  active: number
  unsubscribed: number
  bounced: number
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<MLSubscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [cursor, setCursor] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [counts, setCounts] = useState<SubscriberCounts>({ total: 0, active: 0, unsubscribed: 0, bounced: 0 })

  const fetchSubscribers = useCallback(async (nextCursor?: string) => {
    const isLoadMore = !!nextCursor
    if (isLoadMore) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }

    try {
      const params = new URLSearchParams({ limit: '50' })
      if (nextCursor) params.set('cursor', nextCursor)

      const res = await fetch(`/api/admin/email/subscribers?${params}`)
      const data = await res.json()

      if (isLoadMore) {
        setSubscribers((prev) => [...prev, ...(data.data || [])])
      } else {
        setSubscribers(data.data || [])
      }
      setCursor(data.meta?.next_cursor || null)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    fetchSubscribers()
    fetch('/api/admin/email/subscribers/count')
      .then((r) => r.json())
      .then((data) => setCounts(data))
      .catch(() => {})
  }, [fetchSubscribers])

  const filtered = search
    ? subscribers.filter(
        (s) =>
          s.email.toLowerCase().includes(search.toLowerCase()) ||
          (s.fields?.name || '').toLowerCase().includes(search.toLowerCase())
      )
    : subscribers

  const statCards = [
    { label: 'Total', value: counts.total, icon: Users, color: '#FCEE21' },
    { label: 'Activos', value: counts.active, icon: Mail, color: '#4ade80' },
    { label: 'Baja', value: counts.unsubscribed, icon: UserMinus, color: '#9ca3af' },
    { label: 'Rebotados', value: counts.bounced, icon: AlertTriangle, color: '#ef4444' },
  ]

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-auto" style={{ backgroundColor: '#16122B' }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Suscriptores</h1>
            <p className="text-gray-500 text-sm mt-1">
              Gestiona tu audiencia y segmentos
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-xl"
              style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${stat.color}15` }}>
                  <stat.icon size={14} style={{ color: stat.color }} />
                </div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-lg border transition-all focus-within:border-[#FCEE21]"
            style={{ backgroundColor: '#1a1535', borderColor: 'rgba(102, 45, 145, 0.3)' }}
          >
            <Search size={20} className="text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por email o nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-white outline-none text-sm placeholder-gray-600"
            />
            {search && (
              <span className="text-xs text-gray-500">
                {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Table */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div
                  className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-4"
                  style={{ borderColor: '#662D91', borderTopColor: 'transparent' }}
                />
                <p className="text-gray-500">Cargando suscriptores...</p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Users size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 text-lg mb-2">
                {search ? 'No se encontraron resultados' : 'No hay suscriptores todavía'}
              </p>
              <p className="text-gray-600 text-sm">
                {search ? 'Prueba con otro término de búsqueda' : 'Los suscriptores aparecerán aquí cuando se registren'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      className="text-left text-xs text-gray-500 uppercase tracking-wider"
                      style={{ backgroundColor: 'rgba(102, 45, 145, 0.1)' }}
                    >
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Nombre</th>
                      <th className="px-6 py-4 font-medium">Estado</th>
                      <th className="px-6 py-4 font-medium">Grupos</th>
                      <th className="px-6 py-4 font-medium">Fecha</th>
                      <th className="px-6 py-4 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s) => (
                      <tr
                        key={s.id}
                        className="border-t cursor-pointer hover:bg-white/5 transition group"
                        style={{ borderTopColor: 'rgba(102, 45, 145, 0.15)' }}
                      >
                        <td className="px-6 py-4">
                          <Link href={`/admin/email/subscribers/${s.id}`} className="block">
                            <p className="font-medium text-white group-hover:text-[#FCEE21] transition">
                              {s.email}
                            </p>
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-gray-300 text-sm">
                          <Link href={`/admin/email/subscribers/${s.id}`} className="block">
                            {s.fields?.name || '—'}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/admin/email/subscribers/${s.id}`} className="block">
                            <SubscriberStatusBadge status={s.status} />
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-sm">
                          <Link href={`/admin/email/subscribers/${s.id}`} className="block">
                            {s.groups?.length || 0}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          <Link href={`/admin/email/subscribers/${s.id}`} className="block">
                            {new Date(s.subscribed_at || s.created_at).toLocaleDateString('es-ES')}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/admin/email/subscribers/${s.id}`} className="block">
                            <ArrowRight size={16} className="text-gray-600 group-hover:text-[#FCEE21] transition" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {cursor && !search && (
                <div className="text-center py-6 border-t" style={{ borderTopColor: 'rgba(102, 45, 145, 0.15)' }}>
                  <button
                    onClick={() => fetchSubscribers(cursor)}
                    disabled={loadingMore}
                    className="px-6 py-3 rounded-lg font-bold transition-all border disabled:opacity-50 hover:scale-105"
                    style={{ borderColor: 'rgba(102, 45, 145, 0.3)', color: '#FCEE21' }}
                  >
                    {loadingMore ? 'Cargando...' : 'Cargar más suscriptores'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
