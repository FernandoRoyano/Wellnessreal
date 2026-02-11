'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Layers, Plus, Users, BarChart3, MousePointer, Trash2, X } from 'lucide-react'
import type { MLGroup } from '@/lib/types/mailerlite'

export default function GroupsPage() {
  const [groups, setGroups] = useState<MLGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      const res = await fetch('/api/admin/email/groups')
      const data = await res.json()
      setGroups(data.data || [])
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (groupId: string) => {
    if (!confirm('¿Eliminar este grupo? Esta acción no se puede deshacer.')) return
    setDeletingId(groupId)
    try {
      const res = await fetch(`/api/admin/email/groups/${groupId}`, { method: 'DELETE' })
      if (res.ok) {
        setGroups((prev) => prev.filter((g) => g.id !== groupId))
      }
    } catch {
      // silently fail
    } finally {
      setDeletingId(null)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGroupName.trim()) return

    setCreating(true)
    setError('')
    try {
      const res = await fetch('/api/admin/email/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newGroupName.trim() }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Error al crear grupo')
      }

      const result = await res.json()
      setGroups((prev) => [result.data, ...prev])
      setNewGroupName('')
      setShowCreate(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear grupo')
    } finally {
      setCreating(false)
    }
  }

  const totalSubscribers = groups.reduce((sum, g) => sum + (g.active_count || 0), 0)

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-auto" style={{ backgroundColor: '#16122B' }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Grupos</h1>
            <p className="text-gray-500 text-sm mt-1">
              Segmenta tu audiencia para campañas más efectivas
            </p>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 shadow-lg"
            style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
          >
            <Plus size={20} />
            Crear grupo
          </button>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg" style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)' }}>
                <Layers size={14} style={{ color: '#a855f7' }} />
              </div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Total grupos</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#a855f7' }}>{groups.length}</p>
          </div>
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg" style={{ backgroundColor: 'rgba(252, 238, 33, 0.15)' }}>
                <Users size={14} style={{ color: '#FCEE21' }} />
              </div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Total suscriptores</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#FCEE21' }}>{totalSubscribers}</p>
          </div>
        </div>

        {/* Create form */}
        {showCreate && (
          <div
            className="rounded-xl p-6 mb-8"
            style={{ backgroundColor: '#1a1535', border: '1px solid rgba(168, 85, 247, 0.3)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Nuevo grupo</h3>
              <button
                onClick={() => { setShowCreate(false); setError('') }}
                className="p-1 rounded text-gray-500 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <form onSubmit={handleCreate} className="flex items-center gap-4">
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Nombre del grupo (ej: Clientes VIP, Newsletter semanal...)"
                className="flex-1 px-4 py-3 rounded-lg text-white border focus:outline-none transition focus:border-[#FCEE21]"
                style={{ backgroundColor: '#16122B', borderColor: 'rgba(102, 45, 145, 0.3)' }}
                autoFocus
              />
              <button
                type="submit"
                disabled={creating || !newGroupName.trim()}
                className="px-6 py-3 rounded-lg font-bold transition-all disabled:opacity-50 hover:scale-105"
                style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
              >
                {creating ? 'Creando...' : 'Crear'}
              </button>
            </form>
          </div>
        )}

        {/* Groups grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div
                className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-4"
                style={{ borderColor: '#662D91', borderTopColor: 'transparent' }}
              />
              <p className="text-gray-500">Cargando grupos...</p>
            </div>
          </div>
        ) : groups.length === 0 ? (
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
          >
            <div className="text-center py-16">
              <Layers size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 text-lg mb-2">No hay grupos todavía</p>
              <p className="text-gray-600 text-sm mb-6">
                Crea grupos para segmentar tu audiencia y enviar campañas más efectivas
              </p>
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition hover:scale-105"
                style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
              >
                <Plus size={18} />
                Crear primer grupo
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <div
                key={group.id}
                className="p-6 rounded-xl transition-all hover:scale-[1.02] group/card"
                style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)' }}>
                      <Layers size={18} style={{ color: '#a855f7' }} />
                    </div>
                    <h3 className="text-white font-bold">{group.name}</h3>
                  </div>
                  <button
                    onClick={() => handleDelete(group.id)}
                    disabled={deletingId === group.id}
                    className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition opacity-0 group-hover/card:opacity-100 disabled:opacity-50"
                    title="Eliminar grupo"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Subscriber count - prominent */}
                <div className="mb-4">
                  <p className="text-3xl font-bold" style={{ color: '#FCEE21' }}>
                    {group.active_count}
                  </p>
                  <p className="text-xs text-gray-500">suscriptores activos</p>
                </div>

                <div className="space-y-2 pt-3" style={{ borderTop: '1px solid rgba(102, 45, 145, 0.15)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs flex items-center gap-2">
                      <BarChart3 size={12} />
                      Tasa apertura
                    </span>
                    <span className="text-xs font-bold" style={{ color: '#4ade80' }}>
                      {group.open_rate?.string || '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs flex items-center gap-2">
                      <MousePointer size={12} />
                      Tasa clics
                    </span>
                    <span className="text-xs font-bold" style={{ color: '#60a5fa' }}>
                      {group.click_rate?.string || '—'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 mt-4">
                  Creado el {new Date(group.created_at).toLocaleDateString('es-ES')}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
