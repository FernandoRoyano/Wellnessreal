'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { ArrowLeft, Users } from 'lucide-react'
import type { MemberProfile } from '@/lib/db/comunidad'

function edad(birth: string | null): string {
  if (!birth) return '—'
  const b = new Date(birth)
  const now = new Date('2026-07-19')
  let a = now.getFullYear() - b.getFullYear()
  const m = now.getMonth() - b.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) a--
  return a > 0 && a < 130 ? `${a}` : '—'
}

const sexoLabel: Record<string, string> = {
  mujer: 'Mujer',
  hombre: 'Hombre',
  otro: 'Otro',
}

export default function AdminMiembrosPage() {
  const [members, setMembers] = useState<MemberProfile[]>([])
  const [onlineIds, setOnlineIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/comunidad/members')
      .then((r) => r.json())
      .then((d) => {
        setMembers(d.members ?? [])
        setOnlineIds(d.onlineIds ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

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
              {members.length} registrados · {onlineIds.length} en línea ahora
            </p>
          </div>
          <Users size={28} className="text-gray-600" />
        </div>

        {loading ? (
          <p className="py-12 text-center text-gray-400">Cargando…</p>
        ) : members.length === 0 ? (
          <p className="py-12 text-center text-gray-500">Aún no hay miembros registrados.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(102,45,145,0.3)' }}>
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gray-500" style={{ backgroundColor: '#1a1535' }}>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Sexo</th>
                  <th className="px-4 py-3">Edad</th>
                  <th className="px-4 py-3">Localidad</th>
                  <th className="px-4 py-3">Alta</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => {
                  const isOnline = onlineIds.includes(m.id)
                  return (
                    <tr key={m.id} className="border-t" style={{ borderColor: 'rgba(102,45,145,0.2)' }}>
                      <td className="px-4 py-3 font-medium text-white">
                        {m.display_name}
                        {m.role !== 'member' && (
                          <span className="ml-2 rounded px-1.5 py-0.5 text-[10px] font-bold" style={{ backgroundColor: 'rgba(252,238,33,0.15)', color: '#FCEE21' }}>
                            {m.role}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400">{m.email}</td>
                      <td className="px-4 py-3 text-gray-300">{m.gender ? (sexoLabel[m.gender] ?? m.gender) : '—'}</td>
                      <td className="px-4 py-3 text-gray-300">{edad(m.birth_date)}</td>
                      <td className="px-4 py-3 text-gray-300">{m.location || '—'}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(m.creado_en).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-4 py-3">
                        {isOnline ? (
                          <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: '#34d399' }}>
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: '#34d399' }} />
                            En línea
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">Offline</span>
                        )}
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
