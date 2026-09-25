'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { CalendarDays, ClipboardList, ExternalLink, Mail, Search, X } from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { FICHA_360_GROUPS, FICHA_360_LABELS, formatFicha360Answer, type Ficha360Answer } from '@/lib/ficha-360'

interface Ficha360 {
  id: string
  nombre: string
  email: string
  telefono: string | null
  respuestas: Record<string, Ficha360Answer>
  created_at: string
}

export default function Fichas360AdminPage() {
  const [fichas, setFichas] = useState<Ficha360[]>([])
  const [selected, setSelected] = useState<Ficha360 | null>(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadFichas = useCallback(async (term = '') => {
    setLoading(true); setError('')
    try {
      const params = new URLSearchParams()
      if (term.trim()) params.set('search', term.trim())
      const response = await fetch(`/api/admin/fichas-360?${params}`)
      const result = await response.json() as { fichas?: Ficha360[]; error?: string }
      if (!response.ok) throw new Error(result.error || 'No se pudieron cargar las fichas.')
      setFichas(result.fichas ?? [])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar las fichas.')
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { void loadFichas() }, [loadFichas])
  const recentCount = useMemo(() => fichas.filter((ficha) => Date.now() - new Date(ficha.created_at).getTime() < 30 * 86400000).length, [fichas])

  return (
    <div className="flex min-h-screen bg-[#16122B]">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-auto p-5 pb-24 sm:p-8 lg:pb-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-[#FCEE21]">Clientes</p><h1 className="text-3xl font-bold text-white">Fichas 360</h1><p className="mt-1 text-sm text-gray-500">Contexto, hábitos y preferencias de cada cliente.</p></div>
          <a href="/ficha-360" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FCEE21] px-5 py-2.5 text-xs font-bold text-[#16122B]"><ExternalLink size={15} /> Abrir cuestionario</a>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:max-w-md">
          <Stat icon={<ClipboardList size={17} />} label="Total" value={fichas.length} />
          <Stat icon={<CalendarDays size={17} />} label="Últimos 30 días" value={recentCount} />
        </div>

        <form onSubmit={(event) => { event.preventDefault(); void loadFichas(search) }} className="relative mb-6 max-w-xl">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, email o teléfono…" className="w-full rounded-xl border border-[#662D91]/70 bg-[#1a1535] py-3 pl-10 pr-24 text-sm text-white outline-none placeholder:text-gray-600 focus:border-[#FCEE21]/60" />
          <button type="submit" className="absolute right-1.5 top-1.5 rounded-lg bg-white/[.07] px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/[.12]">Buscar</button>
        </form>

        {error && <p role="alert" className="mb-5 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}
        {loading ? <div className="py-20 text-center text-sm text-gray-500">Cargando fichas…</div> : fichas.length === 0 ? (
          <div className="rounded-2xl border border-white/[.08] bg-[#1a1535] px-6 py-16 text-center"><ClipboardList size={42} className="mx-auto mb-4 text-white/15" /><h2 className="font-semibold text-white">Todavía no hay fichas</h2><p className="mt-2 text-sm text-gray-500">Las nuevas respuestas aparecerán aquí automáticamente.</p></div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/[.08] bg-[#1a1535]">
            <div className="hidden grid-cols-[1.4fr_1fr_180px] border-b border-white/[.07] bg-black/20 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 sm:grid"><span>Cliente</span><span>Contacto</span><span>Fecha</span></div>
            {fichas.map((ficha) => <button key={ficha.id} type="button" onClick={() => setSelected(ficha)} className="grid w-full gap-2 border-b border-white/[.06] px-5 py-4 text-left transition-colors last:border-0 hover:bg-white/[.04] sm:grid-cols-[1.4fr_1fr_180px] sm:items-center"><span><strong className="block text-sm text-white">{ficha.nombre}</strong><small className="text-xs text-gray-600">{ficha.id.slice(0, 8)}</small></span><span className="text-xs text-gray-400"><span className="block">{ficha.email}</span>{ficha.telefono && <span className="block text-gray-600">{ficha.telefono}</span>}</span><span className="text-xs text-gray-500">{new Date(ficha.created_at).toLocaleString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></button>)}
          </div>
        )}
      </main>
      {selected && <FichaDrawer ficha={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return <div className="rounded-xl border border-white/[.08] bg-[#1a1535] p-4"><div className="mb-2 flex items-center gap-2 text-[#FCEE21]">{icon}<span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</span></div><p className="text-2xl font-bold text-white">{value}</p></div>
}

function FichaDrawer({ ficha, onClose }: { ficha: Ficha360; onClose: () => void }) {
  const phone = ficha.telefono?.replace(/[^0-9]/g, '') ?? ''
  return <div className="fixed inset-0 z-[300] flex justify-end" role="dialog" aria-modal="true" aria-label={`Ficha de ${ficha.nombre}`}><button type="button" aria-label="Cerrar detalle" onClick={onClose} className="absolute inset-0 bg-black/70" /><aside className="relative h-full w-full max-w-3xl overflow-y-auto border-l border-[#662D91]/60 bg-[#0f0c20] p-5 sm:p-8"><div className="mb-7 flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-[#FCEE21]">Ficha 360</p><h2 className="mt-1 text-2xl font-bold text-white">{ficha.nombre}</h2><p className="mt-1 text-xs text-gray-500">Recibida el {new Date(ficha.created_at).toLocaleString('es-ES')}</p></div><button type="button" onClick={onClose} className="rounded-lg p-2 text-gray-500 hover:bg-white/[.06] hover:text-white"><X size={20} /></button></div><div className="mb-8 flex flex-wrap gap-2"><a href={`mailto:${ficha.email}`} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/75 hover:bg-white/[.05]"><Mail size={14} />{ficha.email}</a>{phone && <a href={`https://wa.me/${phone.startsWith('34') ? phone : `34${phone}`}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366]/15 px-4 py-2 text-xs font-semibold text-[#69e895]"><ExternalLink size={14} /> WhatsApp</a>}</div><div className="space-y-8">{FICHA_360_GROUPS.map((group) => { const fields = group.ids.flatMap((id) => { const value = ficha.respuestas[id]; return value && (!Array.isArray(value) || value.length > 0) ? [{ id, value }] : [] }); if (fields.length === 0) return []; return <section key={group.title}><h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-white"><span className="h-2 w-2 rounded-full bg-[#FCEE21]" />{group.title}</h3><div className="grid gap-2 sm:grid-cols-2">{fields.map(({ id, value }) => <div key={id} className={`rounded-xl border border-white/[.06] bg-white/[.03] px-4 py-3 ${['dia_normal', 'registro_ayer', 'historial_entreno', 'rechazo_ejercicios', 'exito_tres_meses', 'algo_mas'].includes(id) ? 'sm:col-span-2' : ''}`}><p className="text-[10px] font-bold uppercase tracking-wider text-gray-600">{FICHA_360_LABELS[id] ?? id}</p><p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-gray-200">{formatFicha360Answer(value)}</p></div>)}</div></section> })}</div></aside></div>
}
