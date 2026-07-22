'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import type { PostWithCategory } from '@/lib/types/database'

type EstadoFiltro = 'todos' | 'publicados' | 'borradores'

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<PostWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [estado, setEstado] = useState<EstadoFiltro>('todos')
  const [categoria, setCategoria] = useState('todas')

  useEffect(() => {
    fetch('/api/admin/blog')
      .then(res => res.json())
      .then(data => setPosts(data.posts || []))
      .finally(() => setLoading(false))
  }, [])

  const publicados = posts.filter(p => p.published).length
  const borradores = posts.length - publicados

  const categorias = useMemo(
    () => Array.from(new Set(posts.map(p => p.category?.title || 'Sin categoría'))).sort(),
    [posts]
  )

  const filtered = useMemo(
    () =>
      posts.filter(p => {
        const okEstado =
          estado === 'todos' || (estado === 'publicados' ? p.published : !p.published)
        const cat = p.category?.title || 'Sin categoría'
        const okCat = categoria === 'todas' || cat === categoria
        return okEstado && okCat
      }),
    [posts, estado, categoria]
  )

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Eliminar "${title}"?`)) return

    const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setPosts(posts.filter(p => p.id !== id))
    }
  }

  const togglePublished = async (id: string, published: boolean) => {
    const res = await fetch(`/api/admin/blog/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !published }),
    })
    if (res.ok) {
      setPosts(posts.map(p => p.id === id ? { ...p, published: !published } : p))
    }
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8" style={{ backgroundColor: '#16122B' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog</h1>
          <p className="text-gray-400 text-sm mt-1">
            {filtered.length} de {posts.length} artículos
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all hover:scale-105"
          style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
        >
          <Plus size={18} />
          Nuevo artículo
        </Link>
      </div>

      {/* ── Filtros ── */}
      {!loading && posts.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: '#662D91' }}>
            {([
              ['todos', `Todos (${posts.length})`],
              ['publicados', `Publicados (${publicados})`],
              ['borradores', `Borradores (${borradores})`],
            ] as [EstadoFiltro, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setEstado(key)}
                className="px-3.5 py-2 text-xs font-semibold transition-colors"
                style={{
                  backgroundColor: estado === key ? '#FCEE21' : 'transparent',
                  color: estado === key ? '#16122B' : '#9ca3af',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <select
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            className="px-3.5 py-2 rounded-lg text-xs font-medium text-white border focus:outline-none"
            style={{ backgroundColor: '#0f0c20', borderColor: '#662D91' }}
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {(estado !== 'todos' || categoria !== 'todas') && (
            <button
              onClick={() => { setEstado('todos'); setCategoria('todas') }}
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-400">Cargando...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-4">No hay artículos todavía</p>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm"
            style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
          >
            <Plus size={16} />
            Crear el primero
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No hay artículos con este filtro.
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#662D91' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#0f0c20' }}>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium uppercase">Título</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium uppercase">Categoría</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium uppercase">Estado</th>
                <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium uppercase">Fecha</th>
                <th className="text-right px-4 py-3 text-xs text-gray-400 font-medium uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr
                  key={post.id}
                  className="border-t transition-colors"
                  style={{ borderColor: 'rgba(102, 45, 145, 0.2)' }}
                >
                  <td className="px-4 py-3">
                    <p className="text-white font-medium text-sm truncate max-w-[300px]">{post.title}</p>
                    <p className="text-gray-500 text-xs">/blog/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(102, 45, 145, 0.2)', color: '#a78bfa' }}>
                      {post.category?.title || 'Sin categoría'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublished(post.id, post.published)}
                      className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full transition-colors"
                      style={{
                        backgroundColor: post.published ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: post.published ? '#22c55e' : '#ef4444',
                      }}
                    >
                      {post.published ? <Eye size={12} /> : <EyeOff size={12} />}
                      {post.published ? 'Publicado' : 'Borrador'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm">
                    {new Date(post.published_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
                        style={{ backgroundColor: 'rgba(102, 45, 145, 0.1)' }}
                      >
                        <Edit2 size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                        style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
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
