'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { ArrowLeft, Users, Check, X, Phone, Mail } from 'lucide-react'
import type { AsesoriaSolicitud } from '@/lib/db/comunidad'

// Primer contacto ya redactado: abrir conversación y proponer hablar.
// No se cierra la venta aquí, se abre el diálogo.
function primerMensaje(nombre: string): string {
  const n = nombre.split(' ')[0]
  return `Hola ${n}, soy Fernando de WellnessReal.

He leído tu solicitud para el Grupo Tiroides y me encaja lo que cuentas.

Antes de nada quiero entender bien cómo es tu día a día: cómo te va con el entrenamiento y la comida, qué tal duermes y de energía, y sobre todo qué es lo que más se te atraganta ahora mismo.

Con eso te digo con sinceridad si el grupo es lo que necesitas o si te viene mejor otra cosa.`
}

function waLink(nombre: string, telefono: string): string {
  const num = telefono.replace(/\D/g, '')
  const con34 = num.startsWith('34') ? num : `34${num}`
  return `https://wa.me/${con34}?text=${encodeURIComponent(primerMensaje(nombre))}`
}

function mailLink(nombre: string, email: string): string {
  const asunto = encodeURIComponent('Tu solicitud para el Grupo Tiroides')
  return `mailto:${email}?subject=${asunto}&body=${encodeURIComponent(primerMensaje(nombre))}`
}

const estadoStyle: Record<string, { label: string; color: string; bg: string }> = {
  nueva: { label: 'Nueva', color: '#FCEE21', bg: 'rgba(252,238,33,0.15)' },
  contactada: { label: 'Contactada', color: '#60a5fa', bg: 'rgba(96,165,250,0.15)' },
  aceptada: { label: 'Aceptada', color: '#4ade80', bg: 'rgba(74,222,128,0.15)' },
  descartada: { label: 'Descartada', color: '#9ca3af', bg: 'rgba(156,163,175,0.15)' },
}

export default function AdminAsesoriaPage() {
  const [items, setItems] = useState<AsesoriaSolicitud[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    setError(null)
    fetch('/api/admin/comunidad/asesoria')
      .then(async (r) => {
        const body = await r.text()
        if (!r.ok) throw new Error(`HTTP ${r.status} — ${body.slice(0, 300)}`)
        return JSON.parse(body)
      })
      .then((d) => setItems(d.solicitudes ?? []))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false))
  }, [])

  useEffect(load, [load])

  const cambiar = async (id: string, estado: string) => {
    setSaving(id)
    try {
      await fetch('/api/admin/comunidad/asesoria', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, estado }),
      })
      load()
    } finally {
      setSaving(null)
    }
  }

  const nuevas = items.filter((i) => i.estado === 'nueva').length
  const aceptadas = items.filter((i) => i.estado === 'aceptada').length

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
              Grupo Tiroides — Solicitudes
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              {items.length} solicitudes · {nuevas} sin contactar ·{' '}
              <span style={{ color: '#4ade80' }}>{aceptadas} aceptadas</span> (plazas: 8-12)
            </p>
          </div>
          <Users size={28} className="text-gray-600" />
        </div>

        {error && (
          <div
            className="mb-6 rounded-xl p-4"
            style={{ backgroundColor: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.4)' }}
          >
            <p className="text-sm font-bold text-red-300">No se pudieron cargar las solicitudes</p>
            <p className="mt-1 break-all font-mono text-xs text-red-200/80">{error}</p>
            <p className="mt-2 text-xs text-gray-400">
              Si pone 401, tu sesión de admin ha caducado: vuelve a entrar en /admin.
            </p>
          </div>
        )}

        {loading ? (
          <p className="py-12 text-center text-gray-400">Cargando…</p>
        ) : items.length === 0 && !error ? (
          <p className="py-12 text-center text-gray-500">
            Todavía no hay solicitudes. Aparecerán aquí en cuanto alguien pida plaza.
          </p>
        ) : (
          <div className="space-y-4">
            {items.map((s) => {
              const st = estadoStyle[s.estado] ?? estadoStyle.nueva
              return (
                <div
                  key={s.id}
                  className="rounded-xl p-5"
                  style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102,45,145,0.3)' }}
                >
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-white">{s.nombre}</p>
                      <p className="text-sm text-gray-400">
                        {s.email}
                        {s.telefono && ` · ${s.telefono}`}
                      </p>
                    </div>
                    <span
                      className="rounded px-2 py-1 text-[11px] font-bold"
                      style={{ backgroundColor: st.bg, color: st.color }}
                    >
                      {st.label}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-sm">
                    <p className="text-gray-300">
                      <span className="text-gray-500">Objetivo:</span> {s.objetivo || '—'}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-500">Días:</span> {s.dias_semana || '—'}
                      {' · '}
                      <span className="text-gray-500">Directo:</span>{' '}
                      {s.disponibilidad_directo || '—'}
                    </p>
                    {s.lesiones && (
                      <p className="text-gray-300">
                        <span className="text-gray-500">A tener en cuenta:</span> {s.lesiones}
                      </p>
                    )}
                    <p className="text-xs text-gray-600">
                      Solicitado el {new Date(s.creado_en).toLocaleDateString('es-ES')}
                    </p>
                  </div>

                  {/* Contacto: mensaje ya redactado para no escribirlo cada vez */}
                  <div
                    className="mt-4 flex flex-wrap gap-2 border-t pt-4"
                    style={{ borderColor: 'rgba(102,45,145,0.25)' }}
                  >
                    {s.telefono && (
                      <a
                        href={waLink(s.nombre, s.telefono)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-bold"
                        style={{ backgroundColor: '#25D366', color: '#0b2e13' }}
                      >
                        <Phone size={13} /> WhatsApp
                      </a>
                    )}
                    <a
                      href={mailLink(s.nombre, s.email)}
                      className="inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-medium text-white"
                      style={{ borderColor: '#662D91' }}
                    >
                      <Mail size={13} /> Email
                    </a>
                    {!s.telefono && (
                      <span className="self-center text-xs text-gray-500">
                        No dejó teléfono — contáctala por email
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {s.estado === 'nueva' && (
                      <button
                        onClick={() => cambiar(s.id, 'contactada')}
                        disabled={saving === s.id}
                        className="rounded border px-3 py-1.5 text-xs text-blue-300 disabled:opacity-50"
                        style={{ borderColor: 'rgba(96,165,250,0.4)' }}
                      >
                        Marcar contactada
                      </button>
                    )}
                    {s.estado !== 'aceptada' && (
                      <button
                        onClick={() => cambiar(s.id, 'aceptada')}
                        disabled={saving === s.id}
                        className="inline-flex items-center gap-1 rounded px-3 py-1.5 text-xs font-bold disabled:opacity-50"
                        style={{ backgroundColor: '#4ade80', color: '#16122B' }}
                      >
                        <Check size={13} /> Aceptar en el grupo
                      </button>
                    )}
                    {s.estado !== 'descartada' && (
                      <button
                        onClick={() => cambiar(s.id, 'descartada')}
                        disabled={saving === s.id}
                        className="inline-flex items-center gap-1 rounded border px-3 py-1.5 text-xs text-gray-400 disabled:opacity-50"
                        style={{ borderColor: '#662D91' }}
                      >
                        <X size={13} /> Descartar
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
