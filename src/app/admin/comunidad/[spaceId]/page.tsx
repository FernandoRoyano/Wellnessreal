'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import {
  PlusCircle, ArrowLeft, Clock, Eye, EyeOff, Trash2, GripVertical, MessagesSquare,
} from 'lucide-react'
import type { Space, Lesson } from '@/lib/db/comunidad'

export default function AdminSpacePage({ params }: { params: Promise<{ spaceId: string }> }) {
  const { spaceId } = use(params)
  const router = useRouter()
  const [space, setSpace] = useState<Space | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [newTitle, setNewTitle] = useState('')

  const load = () => {
    fetch(`/api/admin/comunidad/spaces/${spaceId}`)
      .then((r) => r.json())
      .then((d) => {
        setSpace(d.space ?? null)
        setLessons(d.lessons ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(load, [spaceId])

  const toggleSpacePublished = async () => {
    if (!space) return
    await fetch(`/api/admin/comunidad/spaces/${spaceId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !space.published }),
    })
    load()
  }

  const deleteSpace = async () => {
    if (!confirm('¿Eliminar este espacio y todas sus lecciones? No se puede deshacer.')) return
    await fetch(`/api/admin/comunidad/spaces/${spaceId}`, { method: 'DELETE' })
    router.push('/admin/comunidad')
  }

  const createLesson = async () => {
    if (!newTitle.trim()) return
    const res = await fetch('/api/admin/comunidad/lessons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ space_id: spaceId, title: newTitle, sort_order: lessons.length }),
    })
    const data = await res.json()
    setNewTitle('')
    if (data.lesson) router.push(`/admin/comunidad/${spaceId}/lecciones/${data.lesson.id}`)
  }

  const isForum = space?.type === 'forum'

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8" style={{ backgroundColor: '#16122B' }}>
        <Link
          href="/admin/comunidad"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft size={16} /> Volver a la comunidad
        </Link>

        {loading ? (
          <p className="text-gray-400 text-center py-12">Cargando…</p>
        ) : !space ? (
          <p className="text-gray-500 text-center py-12">Espacio no encontrado.</p>
        ) : (
          <>
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold" style={{ color: '#FCEE21' }}>
                  {space.name}
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  /{space.slug} · {isForum ? 'Espacio de foro' : 'Espacio de contenido'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSpacePublished}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border"
                  style={{ borderColor: '#662D91', color: space.published ? '#4ade80' : '#9ca3af' }}
                >
                  {space.published ? <Eye size={15} /> : <EyeOff size={15} />}
                  {space.published ? 'Publicado' : 'Oculto'}
                </button>
                <button
                  onClick={deleteSpace}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border text-red-400"
                  style={{ borderColor: 'rgba(248,113,113,0.4)' }}
                >
                  <Trash2 size={15} /> Eliminar
                </button>
              </div>
            </div>

            {isForum ? (
              <div
                className="rounded-xl p-8 text-center"
                style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102,45,145,0.3)' }}
              >
                <MessagesSquare size={32} className="mx-auto mb-3 text-gray-500" />
                <p className="text-white font-medium">Espacio de foro</p>
                <p className="text-gray-400 text-sm mt-1">
                  Los miembros crean los hilos. La moderación llegará en la fase del foro.
                </p>
              </div>
            ) : (
              <>
                {/* Crear lección */}
                <div
                  className="rounded-xl p-5 mb-6"
                  style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102,45,145,0.3)' }}
                >
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Título de la nueva lección"
                      className="flex-1 px-4 py-2.5 rounded-lg text-white text-sm border focus:outline-none"
                      style={{ backgroundColor: '#0f0c20', borderColor: '#662D91' }}
                    />
                    <button
                      onClick={createLesson}
                      disabled={!newTitle.trim()}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm disabled:opacity-50"
                      style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
                    >
                      <PlusCircle size={16} /> Crear y editar
                    </button>
                  </div>
                </div>

                {/* Lista de lecciones */}
                {lessons.length === 0 ? (
                  <p className="text-gray-500 text-center py-10">
                    Sin lecciones todavía. Crea la primera arriba.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {lessons.map((l) => (
                      <Link
                        key={l.id}
                        href={`/admin/comunidad/${spaceId}/lecciones/${l.id}`}
                        className="flex items-center justify-between p-4 rounded-xl transition hover:bg-white/5 group"
                        style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102,45,145,0.3)' }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <GripVertical size={16} className="text-gray-600 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-white text-sm font-medium truncate group-hover:text-[#FCEE21] transition">
                              {l.title}
                            </p>
                            <p className="text-gray-500 text-xs flex items-center gap-2">
                              /{l.slug}
                              {l.drip_days > 0 && (
                                <span className="inline-flex items-center gap-1 text-amber-300">
                                  <Clock size={11} /> drip {l.drip_days}d
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        {l.published ? (
                          <Eye size={15} className="text-gray-500 shrink-0" />
                        ) : (
                          <EyeOff size={15} className="text-red-400 shrink-0" />
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}
