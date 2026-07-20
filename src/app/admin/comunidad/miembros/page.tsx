'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { ArrowLeft, Users, Check, Ban, RotateCcw } from 'lucide-react'
import type { MemberProfile } from '@/lib/db/comunidad'

function edad(birth: string | null): string {
  if (!birth) return '—'
  const b = new Date(birth)
  const now = new Date()
  let a = now.getFullYear() - b.getFullYear()
  const m = now.getMonth() - b.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) a--
  return a > 0 && a < 130 ? `${a}` : '—'
}

const sexoLabel: Record<string, string> = { mujer: 'Mujer', hombre: 'Hombre', otro: 'Otro' }

const statusStyle: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pendiente', color: '#FCEE21', bg: 'rgba(252,238,33,0.15)' },
  approved: { label: 'Aprobado', color: '#4ade80', bg: 'rgba(74,222,128,0.15)' },
  blocked: { label: 'Bloqueado', color: '#f87171', bg: 'rgba(248,113,113,0.15)' },
}

export default function AdminMiembrosPage() {
  const [members, setMembers] = useState<MemberProfile[]>([])
  const [onlineIds, setOnlineIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  const load = useCallback(() => {
    fetch('/api/admin/comunidad/members')
      .then((r) => r.json())
      .then((d) => {
        setMembers(d.members ?? [])
        setOnlineIds(d.onlineIds ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(load, [load])

  const cambiarEstado = async (id: string, status: 'approved' | 'blocked' | 'pending') => {
    setSaving(id)
    try {
      await fetch(`/api/admin/comunidad/members/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      load()
    } finally {
      setSaving(null)
    }
  }

  // Pendientes primero: es la cola de trabajo.
  const orden = { pending: 0, approved: 1, blocked: 2 } as Record<string, number>
  const ordenados = [...members].sort(
    (a, b) => (orden[a.status] ?? 9) - (orden[b.status] ?? 9)
  )
  const pendientes = members.filter((m) => m.status === 'pending').length

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8" style={{ backgroundColor: '#16122B' }}>
        <Link
          href="/admin/comunidad"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
        >
          <ArrowLeft size={16} /> Volver a la comunidad
        </Link>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#FCEE21' }}>
              Miembros
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              {members.length} registrados · {onlineIds.length} en línea
            </p>
          </div>
          <Users size={28} className="text-gray-600" />
        </div>

        {pendientes > 0 && (
          <div
            className="mb-6 rounded-xl p-4"
            style={{ backgroundColor: 'rgba(252,238,33,0.07)', border: '1px solid rgba(252,238,33,0.3)' }}
          >
            <p className="text-sm text-white">
              <strong style={{ color: '#FCEE21' }}>
                {pendientes} solicitud{pendientes === 1 ? '' : 'es'} pendiente
                {pendientes === 1 ? '' : 's'}
              </strong>{' '}
              — aprueba o bloquea abajo. Al aprobar, la persona recibe un email avisándole.
            </p>
          </div>
        )}

        {loading ? (
          <p className="py-12 text-center text-gray-400">Cargando…</p>
        ) : members.length === 0 ? (
          <p className="py-12 text-center text-gray-500">Aún no hay miembros registrados.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(102,45,145,0.3)' }}>
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr
                  className="text-left text-xs uppercase tracking-wider text-gray-500"
                  style={{ backgroundColor: '#1a1535' }}
                >
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Sexo</th>
                  <th className="px-4 py-3">Edad</th>
                  <th className="px-4 py-3">Localidad</th>
                  <th className="px-4 py-3">Alta</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ordenados.map((m) => {
                  const isOnline = onlineIds.includes(m.id)
                  const st = statusStyle[m.status] ?? statusStyle.pending
                  return (
                    <tr key={m.id} className="border-t" style={{ borderColor: 'rgba(102,45,145,0.2)' }}>
                      <td className="px-4 py-3 font-medium text-white">
                        {m.display_name}
                        {isOnline && (
                          <span
                            className="ml-2 inline-block h-2 w-2 rounded-full align-middle"
                            style={{ backgroundColor: '#34d399' }}
                            title="En línea"
                          />
                        )}
                        {m.role !== 'member' && (
                          <span
                            className="ml-2 rounded px-1.5 py-0.5 text-[10px] font-bold"
                            style={{ backgroundColor: 'rgba(252,238,33,0.15)', color: '#FCEE21' }}
                          >
                            {m.role}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400">{m.email}</td>
                      <td className="px-4 py-3 text-gray-300">
                        {m.gender ? (sexoLabel[m.gender] ?? m.gender) : '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-300">{edad(m.birth_date)}</td>
                      <td className="px-4 py-3 text-gray-300">{m.location || '—'}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(m.creado_en).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="rounded px-2 py-1 text-[11px] font-bold"
                          style={{ backgroundColor: st.bg, color: st.color }}
                        >
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {m.status !== 'approved' && (
                            <button
                              onClick={() => cambiarEstado(m.id, 'approved')}
                              disabled={saving === m.id}
                              className="inline-flex items-center gap-1 rounded px-2.5 py-1.5 text-xs font-bold disabled:opacity-50"
                              style={{ backgroundColor: '#4ade80', color: '#16122B' }}
                            >
                              <Check size={13} /> Aprobar
                            </button>
                          )}
                          {m.status !== 'blocked' && (
                            <button
                              onClick={() => cambiarEstado(m.id, 'blocked')}
                              disabled={saving === m.id}
                              className="inline-flex items-center gap-1 rounded border px-2.5 py-1.5 text-xs text-red-400 disabled:opacity-50"
                              style={{ borderColor: 'rgba(248,113,113,0.4)' }}
                            >
                              <Ban size={13} /> Bloquear
                            </button>
                          )}
                          {m.status === 'blocked' && (
                            <button
                              onClick={() => cambiarEstado(m.id, 'pending')}
                              disabled={saving === m.id}
                              className="inline-flex items-center gap-1 rounded border px-2.5 py-1.5 text-xs text-gray-300 disabled:opacity-50"
                              style={{ borderColor: '#662D91' }}
                            >
                              <RotateCcw size={13} /> Reactivar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
