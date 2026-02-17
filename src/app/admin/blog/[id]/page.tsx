'use client'

import { useState, useEffect, useRef, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, X } from 'lucide-react'
import Link from 'next/link'
import BlogEditor from '@/components/admin/blog/BlogEditor'
import type { Category, PostWithCategory } from '@/lib/types/database'

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState('')

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    author: 'Fernando Royano',
    main_image_url: '',
    main_image_alt: '',
    category_id: '',
    read_time: '',
    content: '',
    published: false,
  })

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/blog/${id}`).then(res => res.json()),
      fetch('/api/admin/blog/categories').then(res => res.json()),
    ]).then(([postData, catData]) => {
      const post = postData.post as PostWithCategory
      if (post) {
        setForm({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          author: post.author,
          main_image_url: post.main_image_url || '',
          main_image_alt: post.main_image_alt || '',
          category_id: post.category_id || '',
          read_time: post.read_time || '',
          content: post.content,
          published: post.published,
        })
      }
      setCategories(catData.categories || [])
      setLoading(false)
    })
  }, [id])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/admin/blog/upload', { method: 'POST', body: formData })
    const data = await res.json()
    if (data.url) {
      setForm(prev => ({ ...prev, main_image_url: data.url, main_image_alt: file.name }))
    }
    e.target.value = ''
  }

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return
    const res = await fetch('/api/admin/blog/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newCategory.trim() }),
    })
    const data = await res.json()
    if (data.category) {
      setCategories(prev => [...prev, data.category])
      setForm(prev => ({ ...prev, category_id: data.category.id }))
      setNewCategory('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const res = await fetch(`/api/admin/blog/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push('/admin/blog')
    } else {
      const data = await res.json()
      alert(data.error || 'Error al guardar')
    }
    setSaving(false)
  }

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Cargando...</div>
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/blog" className="text-gray-400 hover:text-white transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-white">Editar artículo</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Título *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg text-white text-lg font-bold outline-none"
            style={{ backgroundColor: '#1a1535', border: '1px solid #662D91' }}
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Slug (URL)</label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">/blog/</span>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
              className="flex-1 px-3 py-2 rounded-lg text-white text-sm outline-none"
              style={{ backgroundColor: '#1a1535', border: '1px solid #662D91' }}
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Extracto * <span className="text-gray-500">({form.excerpt.length}/300)</span>
          </label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg text-gray-300 text-sm outline-none resize-none h-24"
            style={{ backgroundColor: '#1a1535', border: '1px solid #662D91' }}
            maxLength={300}
            required
          />
        </div>

        {/* Row: Category + Author + Read time */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Categoría</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm(prev => ({ ...prev, category_id: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
              style={{ backgroundColor: '#1a1535', border: '1px solid #662D91' }}
            >
              <option value="">Sin categoría</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nueva..."
                className="flex-1 px-2 py-1 rounded text-white text-xs outline-none"
                style={{ backgroundColor: '#1a1535', border: '1px solid #662D91' }}
              />
              <button type="button" onClick={handleAddCategory} className="text-xs px-2 py-1 rounded font-medium" style={{ backgroundColor: '#FCEE21', color: '#16122B' }}>+</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Autor</label>
            <input
              type="text"
              value={form.author}
              onChange={(e) => setForm(prev => ({ ...prev, author: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
              style={{ backgroundColor: '#1a1535', border: '1px solid #662D91' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tiempo de lectura</label>
            <input
              type="text"
              value={form.read_time}
              onChange={(e) => setForm(prev => ({ ...prev, read_time: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
              style={{ backgroundColor: '#1a1535', border: '1px solid #662D91' }}
              placeholder="5 min"
            />
          </div>
        </div>

        {/* Main Image */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Imagen destacada</label>
          {form.main_image_url ? (
            <div className="relative rounded-lg overflow-hidden" style={{ maxHeight: '200px' }}>
              <img src={form.main_image_url} alt={form.main_image_alt} className="w-full object-cover" style={{ maxHeight: '200px' }} />
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, main_image_url: '', main_image_alt: '' }))}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/80 text-white hover:bg-red-500"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-8 rounded-lg border-2 border-dashed flex flex-col items-center gap-2 transition-colors hover:border-[#FCEE21]"
              style={{ borderColor: '#662D91', color: '#9ca3af' }}
            >
              <Upload size={24} />
              <span className="text-sm">Subir imagen</span>
            </button>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          {form.main_image_url && (
            <input
              type="text"
              value={form.main_image_alt}
              onChange={(e) => setForm(prev => ({ ...prev, main_image_alt: e.target.value }))}
              className="w-full px-3 py-2 mt-2 rounded-lg text-white text-sm outline-none"
              style={{ backgroundColor: '#1a1535', border: '1px solid #662D91' }}
              placeholder="Texto alternativo de la imagen"
            />
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Contenido *</label>
          <BlogEditor content={form.content} onChange={(html) => setForm(prev => ({ ...prev, content: html }))} />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: '#662D91' }}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm(prev => ({ ...prev, published: e.target.checked }))}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-300">Publicado</span>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg font-medium text-sm transition-all hover:scale-105 disabled:opacity-50"
            style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}
