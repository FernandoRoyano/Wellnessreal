'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { FileText, Clock, CheckCircle2, ChevronRight } from 'lucide-react'

interface ProgramaRow {
  id: string
  version: number
  vigente: boolean
  revisado: boolean
  revisado_en: string | null
  modelo: string | null
  origen: string
  creado_en: string
  cliente: { nombre: string; email: string } | null
}

const FILTROS = [
  { value: 'pendientes', label: 'Pendientes' },
  { value: '', label: 'Todos' },
  { value: 'revisados', label: 'Revisados' },
]

export default function ProgramasAdminPage() {
  const [programas, setProgramas] = useState<ProgramaRow[]>([])
  const [pendientes, setPendientes] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('pendientes')

  useEffect(() => {
    setLoading(true)
    const params = filtro ? `?filtro=${filtro}` : ''
    fetch(`/api/admin/programas${params}`)
      .then((r) => r.json())
      .then((d) => {
        setProgramas(d.programas || [])
        if (typeof d.pendientes === 'number') setPendientes(d.pendientes)
      })
      .finally(() => setLoading(false))
  }, [filtro])

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto" style={{ backgroundColor: '#16122B' }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Programas IA</h1>
          <p className="text-gray-500 text-sm mt-1">
            Planes generados con el Método BASE · revísalos antes de enviarlos al cliente
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <StatCard icon={<Clock size={18} />} label="Por revisar" value={pendientes} accent="#FCEE21" />
          <StatCard icon={<FileText size={18} />} label="Mostrados" value={programas.length} accent="#60a5fa" />
        </div>

        <div className="flex gap-2 mb-6">
          {FILTROS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFiltro(f.value)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition"
              style={{
                backgroundColor: filtro === f.value ? 'rgba(252,238,33,0.12)' : '#1a1535',
                color: filtro === f.value ? '#FCEE21' : '#9ca3af',
                border: '1px solid #662D91',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Cargando...</div>
        ) : programas.length === 0 ? (
          <div className="text-center py-20">
            <FileText size={48} className="mx-auto mb-4 opacity-20 text-gray-500" />
            <p className="text-gray-500">No hay programas que mostrar</p>
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#662D91' }}>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#0f0c20' }}>
                  <Th>Cliente</Th>
                  <Th>Estado</Th>
                  <Th>Versión</Th>
                  <Th>Modelo</Th>
                  <Th>Generado</Th>
                  <Th> </Th>
                </tr>
              </thead>
              <tbody>
                {programas.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t transition hover:bg-white/5"
                    style={{ borderColor: 'rgba(102,45,145,0.2)' }}
                  >
                    <td className="px-4 py-3">
                      <Link href={`/admin/programas/${p.id}`} className="block">
                        <p className="text-white font-medium text-sm">{p.cliente?.nombre || '—'}</p>
                        <p className="text-gray-500 text-xs">{p.cliente?.email || '—'}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {p.revisado ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(74,222,128,0.15)', color: '#4ade80' }}>
                          <CheckCircle2 size={13} /> Revisado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(252,238,33,0.15)', color: '#FCEE21' }}>
                          <Clock size={13} /> Pendiente
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-sm">
                      v{p.version}
                      <span className="text-gray-600 text-xs ml-1">{p.origen === 'ajuste' ? '(ajuste)' : ''}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{p.modelo || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(p.creado_en).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/programas/${p.id}`} className="inline-flex text-gray-500 hover:text-white">
                        <ChevronRight size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium uppercase">{children}</th>
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number; accent: string }) {
  return (
    <div className="p-5 rounded-xl" style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102,45,145,0.3)' }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${accent}22`, color: accent }}>{icon}</div>
        <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-3xl font-bold" style={{ color: accent }}>{value}</p>
    </div>
  )
}
