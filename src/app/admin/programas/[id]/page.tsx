'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle2, RotateCcw, Mail, Loader2, History, Wand2, Clock, Link2, Copy, ExternalLink } from 'lucide-react'
import ProgramaDocumento from '@/components/programa/ProgramaDocumento'
import type { Programa } from '@/lib/programa-schema'

interface Cliente {
  id: string
  nombre: string
  email: string
  objetivo_principal: string | null
  lesiones: string | null
  donde_entrena: string | null
  semana_actual: number | null
  token: string | null
}

interface Registro {
  id: string
  version: number
  vigente: boolean
  revisado: boolean
  revisado_en: string | null
  modelo: string | null
  origen: string
  creado_en: string
  programa: Programa
  meta: { resumen_cambios?: string[] } | null
  cliente: Cliente | null
}

interface VersionRow {
  id: string
  version: number
  vigente: boolean
  revisado: boolean
  origen: string
  creado_en: string
}

interface Evento {
  id: string
  creado_en: string
  semana: number | null
  tipo: string
  contenido: Record<string, unknown>
}

export default function ProgramaDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [reg, setReg] = useState<Registro | null>(null)
  const [versiones, setVersiones] = useState<VersionRow[]>([])
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // formulario de ajuste
  const [cambio, setCambio] = useState('')
  const [semana, setSemana] = useState('')
  const [ajustando, setAjustando] = useState(false)
  const [errAjuste, setErrAjuste] = useState('')
  const [copiado, setCopiado] = useState(false)

  const cargar = () => {
    setLoading(true)
    fetch(`/api/admin/programas/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setReg(d.programa || null)
        setVersiones(d.versiones || [])
        setEventos(d.eventos || [])
      })
      .finally(() => setLoading(false))
  }

  useEffect(cargar, [id])

  const toggleRevisado = async (revisado: boolean) => {
    if (!reg) return
    setSaving(true)
    const res = await fetch(`/api/admin/programas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ revisado }),
    })
    if (res.ok) setReg({ ...reg, revisado, revisado_en: revisado ? new Date().toISOString() : null })
    setSaving(false)
  }

  const ajustar = async () => {
    if (!reg?.cliente || !cambio.trim()) return
    setAjustando(true)
    setErrAjuste('')
    const res = await fetch('/api/ajustar-programa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cliente_id: reg.cliente.id,
        cambio: cambio.trim(),
        semana: semana ? Number(semana) : undefined,
      }),
    })
    const data = await res.json()
    setAjustando(false)
    if (res.ok && data.programa_id) {
      router.push(`/admin/programas/${data.programa_id}`)
    } else {
      setErrAjuste(data.error || 'No se pudo generar el ajuste.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#16122B' }}>
        <Loader2 className="animate-spin text-yellow-300" size={32} />
      </div>
    )
  }

  if (!reg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: '#16122B' }}>
        <p className="text-gray-400">No se encontró el programa.</p>
        <Link href="/admin/programas" className="text-yellow-300 text-sm underline">Volver a la lista</Link>
      </div>
    )
  }

  const c = reg.cliente
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://wellnessreal.es'
  const clientUrl = c?.token ? `${origin}/programa/${c.token}` : ''
  const mailto = c
    ? `mailto:${c.email}?subject=${encodeURIComponent('Tu plan personalizado · WellnessReal')}&body=${encodeURIComponent(`Hola ${c.nombre},\n\nAquí tienes tu plan personalizado del Método BASE. Lo he revisado personalmente y está listo para empezar:\n\n${clientUrl}\n\nÁbrelo cuando quieras, es tu enlace privado.\n\nUn abrazo,\nFernando`)}`
    : '#'

  const copiarEnlace = async () => {
    if (!clientUrl) return
    try {
      await navigator.clipboard.writeText(clientUrl)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1800)
    } catch {
      setErrAjuste('No se pudo copiar el enlace.')
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0E0B1E' }}>
      {/* Barra de revisión (sticky) */}
      <div className="sticky top-0 z-20 border-b backdrop-blur" style={{ backgroundColor: 'rgba(15,12,32,0.92)', borderColor: '#662D91' }}>
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center gap-4 flex-wrap">
          <Link href="/admin/programas" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
            <ArrowLeft size={16} /> Programas
          </Link>
          <div className="flex-1 min-w-[180px]">
            <p className="text-white text-sm font-medium leading-tight">{c?.nombre || '—'}</p>
            <p className="text-gray-500 text-xs">
              {c?.email} · v{reg.version} · {reg.modelo}{reg.origen === 'ajuste' ? ' · ajuste' : ''}
              {!reg.vigente && ' · (archivada)'}
            </p>
          </div>
          {reg.revisado ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(74,222,128,0.15)', color: '#4ade80' }}>
              <CheckCircle2 size={14} /> Revisado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(252,238,33,0.15)', color: '#FCEE21' }}>
              Pendiente
            </span>
          )}
          {reg.revisado ? (
            <>
              <a href={mailto} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold" style={{ backgroundColor: '#FCEE21', color: '#16122B' }}>
                <Mail size={15} /> Enviar al cliente
              </a>
              <button onClick={() => toggleRevisado(false)} disabled={saving} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white" title="Marcar como pendiente">
                <RotateCcw size={15} />
              </button>
            </>
          ) : (
            <button onClick={() => toggleRevisado(true)} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50" style={{ backgroundColor: '#FCEE21', color: '#16122B' }}>
              {saving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />} Aprobar plan
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 px-5 py-6">
        {/* Documento de marca */}
        <div className="flex-1 min-w-0 rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(102,45,145,0.4)' }}>
          <ProgramaDocumento programa={reg.programa} nombre={c?.nombre} />
        </div>

        {/* Panel de trabajo */}
        <aside className="lg:w-80 flex-none space-y-5">
          {/* Enlace privado del cliente */}
          {clientUrl && (
            <Panel title="Enlace del cliente" icon={<Link2 size={15} />}>
              <p className="text-xs text-gray-500 mb-2">
                Enlace privado donde el cliente ve su plan aprobado. Se actualiza solo cuando apruebas una versión.
              </p>
              <div className="text-[11px] text-gray-400 break-all rounded-lg px-3 py-2 mb-2" style={{ backgroundColor: '#16122B', border: '1px solid rgba(102,45,145,0.3)' }}>
                {clientUrl}
              </div>
              <div className="flex gap-2">
                <button onClick={copiarEnlace} className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: copiado ? 'rgba(74,222,128,0.15)' : '#16122B', color: copiado ? '#4ade80' : '#d1d5db', border: '1px solid rgba(102,45,145,0.3)' }}>
                  {copiado ? <><CheckCircle2 size={14} /> Copiado</> : <><Copy size={14} /> Copiar</>}
                </button>
                <a href={clientUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white" style={{ border: '1px solid rgba(102,45,145,0.3)' }} title="Abrir como lo ve el cliente">
                  <ExternalLink size={14} />
                </a>
              </div>
            </Panel>
          )}

          {/* Resumen de cambios si esta versión es un ajuste */}
          {reg.origen === 'ajuste' && reg.meta?.resumen_cambios && reg.meta.resumen_cambios.length > 0 && (
            <Panel title="Qué cambió en esta versión" icon={<Wand2 size={15} />}>
              <ul className="space-y-2">
                {reg.meta.resumen_cambios.map((r, i) => (
                  <li key={i} className="text-xs text-gray-300 pl-3 relative before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-yellow-300">
                    {r}
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {/* Ajustar plan */}
          <Panel title="Ajustar plan" icon={<Wand2 size={15} />}>
            <p className="text-xs text-gray-500 mb-3">
              Apunta lo que el cliente ha reportado. La IA ajusta el plan vigente sin empezar de cero y crea una versión nueva para que la revises.
            </p>
            <textarea
              value={cambio}
              onChange={(e) => setCambio(e.target.value)}
              placeholder="Ej. La semana pasada me sobró energía en pierna y me molesta el hombro en press militar..."
              className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none resize-none h-28 mb-2"
              style={{ backgroundColor: '#16122B', border: '1px solid #662D91' }}
            />
            <input
              type="number"
              value={semana}
              onChange={(e) => setSemana(e.target.value)}
              placeholder={`Semana (actual: ${c?.semana_actual ?? 1})`}
              className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none mb-3"
              style={{ backgroundColor: '#16122B', border: '1px solid #662D91' }}
            />
            {errAjuste && <p className="text-red-400 text-xs mb-2">{errAjuste}</p>}
            <button
              onClick={ajustar}
              disabled={ajustando || !cambio.trim() || !reg.vigente}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm disabled:opacity-50"
              style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
            >
              {ajustando ? <><Loader2 size={15} className="animate-spin" /> Ajustando...</> : <><Wand2 size={15} /> Generar ajuste</>}
            </button>
            {!reg.vigente && <p className="text-xs text-gray-600 mt-2">Solo se puede ajustar desde la versión vigente.</p>}
          </Panel>

          {/* Versiones */}
          <Panel title="Versiones" icon={<History size={15} />}>
            <div className="space-y-1.5">
              {versiones.map((v) => (
                <Link
                  key={v.id}
                  href={`/admin/programas/${v.id}`}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs transition"
                  style={{ backgroundColor: v.id === reg.id ? 'rgba(252,238,33,0.1)' : '#16122B', border: '1px solid rgba(102,45,145,0.3)' }}
                >
                  <span style={{ color: v.id === reg.id ? '#FCEE21' : '#d1d5db' }}>
                    v{v.version} {v.origen === 'ajuste' ? '· ajuste' : '· inicial'}
                    {v.vigente && ' · vigente'}
                  </span>
                  {v.revisado ? <CheckCircle2 size={13} className="text-green-400" /> : <Clock size={13} className="text-yellow-300" />}
                </Link>
              ))}
            </div>
          </Panel>

          {/* Historial */}
          <Panel title="Historial del cliente" icon={<Clock size={15} />}>
            {eventos.length === 0 ? (
              <p className="text-xs text-gray-600">Sin eventos todavía.</p>
            ) : (
              <div className="space-y-3">
                {eventos.map((e) => (
                  <div key={e.id} className="text-xs">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide" style={{ backgroundColor: 'rgba(102,45,145,0.3)', color: '#a78bfa' }}>{e.tipo}</span>
                      <span className="text-gray-600">{new Date(e.creado_en).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}{e.semana ? ` · sem ${e.semana}` : ''}</span>
                    </div>
                    <p className="text-gray-400 leading-snug">{describirEvento(e)}</p>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </aside>
      </div>
    </div>
  )
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102,45,145,0.3)' }}>
      <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
        <span className="text-yellow-300">{icon}</span> {title}
      </h3>
      {children}
    </div>
  )
}

function describirEvento(e: Evento): string {
  const cont = e.contenido || {}
  if (typeof cont.texto === 'string') return cont.texto
  if (typeof cont.mensaje === 'string') return cont.mensaje
  if (Array.isArray(cont.resumen_cambios)) return (cont.resumen_cambios as string[]).join(' · ')
  return JSON.stringify(cont)
}
