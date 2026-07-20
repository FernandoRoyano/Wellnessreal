'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { PlusCircle, MessagesSquare, BookOpen, ChevronRight, Eye, EyeOff, Users, Sparkles } from 'lucide-react'
import type { Space } from '@/lib/db/comunidad'

export default function AdminComunidadPage() {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState<'content' | 'forum'>('content')

  const load = () => {
    fetch('/api/admin/comunidad/spaces')
      .then((r) => r.json())
      .then((d) => setSpaces(d.spaces ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const createSpace = async () => {
    if (!name.trim()) return
    setCreating(true)
    try {
      await fetch('/api/admin/comunidad/spaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, sort_order: spaces.length }),
      })
      setName('')
      setType('content')
      load()
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8" style={{ backgroundColor: '#16122B' }}>
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#FCEE21' }}>
              Comunidad Tiroides
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Organiza la comunidad en espacios de contenido (lecciones) y de foro.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/comunidad/asesoria"
              className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition hover:opacity-90"
              style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
            >
              <Sparkles size={16} /> Grupo Tiroides
            </Link>
            <Link
              href="/admin/comunidad/miembros"
              className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/5"
              style={{ borderColor: '#662D91' }}
            >
              <Users size={16} /> Ver miembros
            </Link>
          </div>
        </div>

        {/* Crear espacio */}
        <div
          className="rounded-xl p-5 mb-8"
          style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102,45,145,0.3)' }}
        >
          <h2 className="text-white font-bold text-sm mb-4">Nuevo espacio</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del espacio (ej. Aprende sobre tiroides)"
              className="flex-1 px-4 py-2.5 rounded-lg text-white text-sm border focus:outline-none"
              style={{ backgroundColor: '#0f0c20', borderColor: '#662D91' }}
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'content' | 'forum')}
              className="px-4 py-2.5 rounded-lg text-white text-sm border focus:outline-none"
              style={{ backgroundColor: '#0f0c20', borderColor: '#662D91' }}
            >
              <option value="content">Contenido</option>
              <option value="forum">Foro</option>
            </select>
            <button
              onClick={createSpace}
              disabled={creating || !name.trim()}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm disabled:opacity-50"
              style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
            >
              <PlusCircle size={16} /> Crear
            </button>
          </div>
        </div>

        {/* Lista de espacios */}
        {loading ? (
          <p className="text-gray-400 text-center py-12">Cargando…</p>
        ) : spaces.length === 0 ? (
          <p className="text-gray-500 text-center py-12">Aún no hay espacios. Crea el primero arriba.</p>
        ) : (
          <div className="space-y-3">
            {spaces.map((s) => (
              <Link
                key={s.id}
                href={`/admin/comunidad/${s.id}`}
                className="flex items-center justify-between p-4 rounded-xl transition hover:bg-white/5 group"
                style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102,45,145,0.3)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(102,45,145,0.2)' }}>
                    {s.type === 'forum' ? (
                      <MessagesSquare size={18} style={{ color: '#c084fc' }} />
                    ) : (
                      <BookOpen size={18} style={{ color: '#c084fc' }} />
                    )}
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold group-hover:text-[#FCEE21] transition">
                      {s.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      /{s.slug} · {s.type === 'forum' ? 'Foro' : 'Contenido'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {s.published ? (
                    <Eye size={15} className="text-gray-500" />
                  ) : (
                    <EyeOff size={15} className="text-red-400" />
                  )}
                  <ChevronRight size={16} className="text-gray-600 group-hover:text-[#FCEE21]" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
