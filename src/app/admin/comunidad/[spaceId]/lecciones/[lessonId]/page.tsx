'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import BlogEditor from '@/components/admin/blog/BlogEditor'
import { ArrowLeft, Save, Trash2, Check } from 'lucide-react'
import type { Lesson } from '@/lib/db/comunidad'

export default function AdminLessonEditor({
  params,
}: {
  params: Promise<{ spaceId: string; lessonId: string }>
}) {
  const { spaceId, lessonId } = use(params)
  const router = useRouter()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/comunidad/lessons/${lessonId}`)
      .then((r) => r.json())
      .then((d) => setLesson(d.lesson ?? null))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [lessonId])

  const patch = (p: Partial<Lesson>) => setLesson((prev) => (prev ? { ...prev, ...p } : prev))

  const save = async () => {
    if (!lesson) return
    setSaving(true)
    setSaved(false)
    try {
      await fetch(`/api/admin/comunidad/lessons/${lessonId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: lesson.title,
          slug: lesson.slug,
          content: lesson.content,
          cover_url: lesson.cover_url,
          drip_days: lesson.drip_days,
          published: lesson.published,
        }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!confirm('¿Eliminar esta lección?')) return
    await fetch(`/api/admin/comunidad/lessons/${lessonId}`, { method: 'DELETE' })
    router.push(`/admin/comunidad/${spaceId}`)
  }

  const inputStyle = { backgroundColor: '#0f0c20', borderColor: '#662D91' }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8" style={{ backgroundColor: '#16122B' }}>
        <Link
          href={`/admin/comunidad/${spaceId}`}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft size={16} /> Volver al espacio
        </Link>

        {loading ? (
          <p className="text-gray-400 text-center py-12">Cargando…</p>
        ) : !lesson ? (
          <p className="text-gray-500 text-center py-12">Lección no encontrada.</p>
        ) : (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Editar lección</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={remove}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border text-red-400"
                  style={{ borderColor: 'rgba(248,113,113,0.4)' }}
                >
                  <Trash2 size={15} /> Eliminar
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm disabled:opacity-50"
                  style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
                >
                  {saved ? <Check size={16} /> : <Save size={16} />}
                  {saved ? 'Guardado' : saving ? 'Guardando…' : 'Guardar'}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Título</label>
                <input
                  value={lesson.title}
                  onChange={(e) => patch({ title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg text-white text-sm border focus:outline-none"
                  style={inputStyle}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Slug (URL)</label>
                  <input
                    value={lesson.slug}
                    onChange={(e) => patch({ slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg text-white text-sm border focus:outline-none font-mono"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                    Drip (días tras registro)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={lesson.drip_days}
                    onChange={(e) => patch({ drip_days: Math.max(0, Number(e.target.value) || 0) })}
                    className="w-full px-4 py-2.5 rounded-lg text-white text-sm border focus:outline-none"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                  Imagen de portada (URL, opcional)
                </label>
                <input
                  value={lesson.cover_url ?? ''}
                  onChange={(e) => patch({ cover_url: e.target.value || null })}
                  placeholder="https://…"
                  className="w-full px-4 py-2.5 rounded-lg text-white text-sm border focus:outline-none"
                  style={inputStyle}
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lesson.published}
                  onChange={(e) => patch({ published: e.target.checked })}
                  className="accent-[#FCEE21]"
                />
                Publicada (visible para los miembros)
              </label>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Contenido</label>
                <BlogEditor content={lesson.content} onChange={(html) => patch({ content: html })} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
