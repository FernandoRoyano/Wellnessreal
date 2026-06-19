'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, RotateCcw, Mail, Loader2 } from 'lucide-react'
import ProgramaDocumento from '@/components/programa/ProgramaDocumento'
import type { Programa } from '@/lib/programa-schema'

interface Registro {
  id: string
  version: number
  revisado: boolean
  revisado_en: string | null
  modelo: string | null
  origen: string
  creado_en: string
  programa: Programa
  cliente: {
    id: string
    nombre: string
    email: string
    objetivo_principal: string | null
    lesiones: string | null
    donde_entrena: string | null
  } | null
}

export default function ProgramaDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [reg, setReg] = useState<Registro | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/programas/${id}`)
      .then((r) => r.json())
      .then((d) => setReg(d.programa || null))
      .finally(() => setLoading(false))
  }, [id])

  const toggleRevisado = async (revisado: boolean) => {
    if (!reg) return
    setSaving(true)
    const res = await fetch(`/api/admin/programas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ revisado }),
    })
    if (res.ok) {
      setReg({ ...reg, revisado, revisado_en: revisado ? new Date().toISOString() : null })
    }
    setSaving(false)
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
  const mailto = c
    ? `mailto:${c.email}?subject=${encodeURIComponent('Tu plan personalizado · WellnessReal')}&body=${encodeURIComponent(`Hola ${c.nombre},\n\nAquí tienes tu plan personalizado del Método BASE. Lo he revisado personalmente y está listo para empezar.\n\nUn abrazo,\nFernando`)}`
    : '#'

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0E0B1E' }}>
      {/* Barra de revisión (sticky) */}
      <div
        className="sticky top-0 z-20 border-b backdrop-blur"
        style={{ backgroundColor: 'rgba(15,12,32,0.92)', borderColor: '#662D91' }}
      >
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center gap-4 flex-wrap">
          <Link href="/admin/programas" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
            <ArrowLeft size={16} /> Programas
          </Link>

          <div className="flex-1 min-w-[180px]">
            <p className="text-white text-sm font-medium leading-tight">{c?.nombre || '—'}</p>
            <p className="text-gray-500 text-xs">
              {c?.email} · v{reg.version} · {reg.modelo}
              {reg.origen === 'ajuste' ? ' · ajuste' : ''}
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
              <a
                href={mailto}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold"
                style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
              >
                <Mail size={15} /> Enviar al cliente
              </a>
              <button
                onClick={() => toggleRevisado(false)}
                disabled={saving}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white"
                title="Marcar como pendiente"
              >
                <RotateCcw size={15} />
              </button>
            </>
          ) : (
            <button
              onClick={() => toggleRevisado(true)}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
              style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
              Aprobar plan
            </button>
          )}
        </div>
      </div>

      {/* Documento de marca tal y como lo ve el cliente */}
      <ProgramaDocumento programa={reg.programa} nombre={c?.nombre} />
    </div>
  )
}
