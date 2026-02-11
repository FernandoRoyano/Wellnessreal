'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect, useMemo } from 'react'
import { createCampaignSchema, type CreateCampaignData } from '@/lib/validations/campaign'
import { Check, Send, Plus, Eye, Code, Palette } from 'lucide-react'
import Link from 'next/link'
import type { MLGroup } from '@/lib/types/mailerlite'
import { emailTemplates, getDefaultVars, type TemplateVars } from '@/lib/emailTemplates'

type EditorMode = 'visual' | 'html'

export default function CampaignForm() {
  const [error, setError] = useState('')
  const [groups, setGroups] = useState<MLGroup[]>([])
  const [createdId, setCreatedId] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [creatingGroup, setCreatingGroup] = useState(false)

  // Template state
  const [selectedTemplate, setSelectedTemplate] = useState(emailTemplates[0].id)
  const [templateVars, setTemplateVars] = useState<TemplateVars>(getDefaultVars())
  const [editorMode, setEditorMode] = useState<EditorMode>('visual')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateCampaignData>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      name: '',
      subject: '',
      fromName: 'WellnessReal',
      fromEmail: '',
      content: '',
      groupId: '',
    },
  })

  const contentValue = watch('content')

  // Generate HTML from template + vars
  const generatedHtml = useMemo(() => {
    const template = emailTemplates.find((t) => t.id === selectedTemplate)
    if (!template) return ''
    return template.getHtml(templateVars)
  }, [selectedTemplate, templateVars])

  // Sync generated HTML to form when in visual mode
  useEffect(() => {
    if (editorMode === 'visual') {
      setValue('content', generatedHtml)
    }
  }, [generatedHtml, editorMode, setValue])

  // Preview HTML: use generated in visual mode, raw content in html mode
  const previewHtml = editorMode === 'visual' ? generatedHtml : contentValue

  useEffect(() => {
    fetch('/api/admin/email/groups')
      .then((res) => res.json())
      .then((data) => setGroups(data.data || []))
      .catch(() => {})
  }, [])

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGroupName.trim()) return
    setCreatingGroup(true)
    try {
      const res = await fetch('/api/admin/email/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newGroupName.trim() }),
      })
      if (!res.ok) throw new Error('Error al crear grupo')
      const result = await res.json()
      setGroups((prev) => [...prev, result.data])
      setValue('groupId', result.data.id)
      setNewGroupName('')
      setShowCreateGroup(false)
    } catch {
      setError('Error al crear grupo')
    } finally {
      setCreatingGroup(false)
    }
  }

  const updateVar = (key: keyof TemplateVars, value: string) => {
    setTemplateVars((prev) => ({ ...prev, [key]: value }))
  }

  const onSubmit = async (data: CreateCampaignData) => {
    try {
      setError('')
      const response = await fetch('/api/admin/email/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Error al crear campaña')
      }

      const result = await response.json()
      setCreatedId(result.data.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear campaña')
    }
  }

  const handleSend = async () => {
    if (!createdId) return
    try {
      setSending(true)
      const response = await fetch(`/api/admin/email/campaigns/${createdId}/send`, {
        method: 'POST',
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Error al enviar campaña')
      }

      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar campaña')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: 'rgba(74, 222, 128, 0.2)' }}
        >
          <Send size={40} className="text-green-400" />
        </div>
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FCEE21' }}>
          Campaña enviada
        </h2>
        <p className="text-gray-400 mb-6">Tu campaña se está enviando a los suscriptores.</p>
        <Link
          href="/admin/email/campaigns"
          className="font-bold hover:underline"
          style={{ color: '#FCEE21' }}
        >
          Ver campañas
        </Link>
      </div>
    )
  }

  if (createdId) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: 'rgba(74, 222, 128, 0.2)' }}
        >
          <Check size={40} className="text-green-400" />
        </div>
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FCEE21' }}>
          Campaña creada
        </h2>
        <p className="text-gray-400 mb-6">La campaña se ha guardado como borrador.</p>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleSend}
            disabled={sending}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 disabled:opacity-50"
            style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
          >
            <Send size={20} />
            {sending ? 'Enviando...' : 'Enviar ahora'}
          </button>
          <Link
            href={`/admin/email/campaigns/${createdId}`}
            className="px-6 py-3 rounded-lg font-bold transition-all border"
            style={{ borderColor: '#662D91', color: '#FCEE21' }}
          >
            Ver borrador
          </Link>
        </div>
      </div>
    )
  }

  const inputStyle = (hasError: boolean) => ({
    backgroundColor: '#16122B',
    borderColor: hasError ? '#ff6b6b' : '#662D91',
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && <p className="text-red-400 text-sm">{error}</p>}

      {/* Campaign info + sender - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-bold" style={{ color: '#FCEE21' }}>
            Información
          </h3>
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Nombre *</label>
            <input
              {...register('name')}
              placeholder="Ej: Newsletter Febrero 2026"
              style={inputStyle(!!errors.name)}
              className="w-full px-4 py-3 rounded-lg text-white border focus:outline-none transition"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            <p className="text-xs text-gray-600 mt-1">Solo visible internamente</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Asunto del email *</label>
            <input
              {...register('subject')}
              placeholder="Ej: Nuevos entrenamientos disponibles"
              style={inputStyle(!!errors.subject)}
              className="w-full px-4 py-3 rounded-lg text-white border focus:outline-none transition"
            />
            {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold" style={{ color: '#FCEE21' }}>
            Remitente y grupo
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Nombre *</label>
              <input
                {...register('fromName')}
                placeholder="WellnessReal"
                style={inputStyle(!!errors.fromName)}
                className="w-full px-4 py-3 rounded-lg text-white border focus:outline-none transition"
              />
              {errors.fromName && <p className="text-red-400 text-xs mt-1">{errors.fromName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Email *</label>
              <input
                {...register('fromEmail')}
                type="email"
                placeholder="info@wellnessreal.com"
                style={inputStyle(!!errors.fromEmail)}
                className="w-full px-4 py-3 rounded-lg text-white border focus:outline-none transition"
              />
              {errors.fromEmail && <p className="text-red-400 text-xs mt-1">{errors.fromEmail.message}</p>}
            </div>
          </div>

          {/* Group selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-gray-300">Grupo *</label>
              <button
                type="button"
                onClick={() => setShowCreateGroup(!showCreateGroup)}
                className="text-xs px-3 py-1 rounded-full font-bold transition flex items-center gap-1"
                style={{ backgroundColor: 'rgba(252, 238, 33, 0.1)', color: '#FCEE21' }}
              >
                <Plus size={12} />
                Crear grupo
              </button>
            </div>

            {showCreateGroup && (
              <div
                className="flex items-center gap-3 mb-3 p-3 rounded-lg"
                style={{ backgroundColor: '#16122B', border: '1px solid #662D91' }}
              >
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Nombre del nuevo grupo"
                  className="flex-1 px-3 py-2 rounded-lg text-white text-sm border focus:outline-none transition"
                  style={{ backgroundColor: '#1a1535', borderColor: '#662D91' }}
                />
                <button
                  type="button"
                  onClick={handleCreateGroup}
                  disabled={creatingGroup || !newGroupName.trim()}
                  className="px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                  style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
                >
                  {creatingGroup ? '...' : 'Crear'}
                </button>
              </div>
            )}

            {groups.length > 0 ? (
              <select
                {...register('groupId')}
                style={inputStyle(!!errors.groupId)}
                className="w-full px-4 py-3 rounded-lg text-white border focus:outline-none transition"
              >
                <option value="" style={{ backgroundColor: '#16122B' }}>
                  Selecciona un grupo
                </option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id} style={{ backgroundColor: '#16122B' }}>
                    {g.name} ({g.active_count} suscriptores)
                  </option>
                ))}
              </select>
            ) : (
              <div
                className="px-4 py-3 rounded-lg text-gray-500 text-sm border"
                style={{ backgroundColor: '#16122B', borderColor: '#662D91' }}
              >
                No hay grupos. Crea uno primero.
              </div>
            )}
            {errors.groupId && <p className="text-red-400 text-xs mt-1">{errors.groupId.message}</p>}
          </div>
        </div>
      </div>

      {/* Content editor section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold" style={{ color: '#FCEE21' }}>
            Contenido del email
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditorMode('visual')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition"
              style={{
                backgroundColor: editorMode === 'visual' ? 'rgba(252, 238, 33, 0.1)' : 'transparent',
                color: editorMode === 'visual' ? '#FCEE21' : '#9ca3af',
                border: `1px solid ${editorMode === 'visual' ? '#FCEE21' : 'rgba(102, 45, 145, 0.3)'}`,
              }}
            >
              <Palette size={14} />
              Plantillas
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('html')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition"
              style={{
                backgroundColor: editorMode === 'html' ? 'rgba(252, 238, 33, 0.1)' : 'transparent',
                color: editorMode === 'html' ? '#FCEE21' : '#9ca3af',
                border: `1px solid ${editorMode === 'html' ? '#FCEE21' : 'rgba(102, 45, 145, 0.3)'}`,
              }}
            >
              <Code size={14} />
              HTML
            </button>
          </div>
        </div>

        {editorMode === 'visual' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Template selector + fields */}
            <div className="space-y-4">
              {/* Template selector */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Plantilla</label>
                <div className="grid grid-cols-2 gap-2">
                  {emailTemplates.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTemplate(t.id)}
                      className="p-3 rounded-lg text-left transition-all text-sm"
                      style={{
                        backgroundColor: selectedTemplate === t.id ? 'rgba(252, 238, 33, 0.1)' : '#16122B',
                        border: `1px solid ${selectedTemplate === t.id ? '#FCEE21' : 'rgba(102, 45, 145, 0.3)'}`,
                        color: selectedTemplate === t.id ? '#FCEE21' : '#9ca3af',
                      }}
                    >
                      <p className="font-bold text-white text-xs">{t.name}</p>
                      <p className="text-xs mt-1 opacity-70">{t.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Editable fields */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Título</label>
                <input
                  type="text"
                  value={templateVars.title}
                  onChange={(e) => updateVar('title', e.target.value)}
                  style={inputStyle(false)}
                  className="w-full px-4 py-3 rounded-lg text-white border focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Subtítulo</label>
                <input
                  type="text"
                  value={templateVars.subtitle}
                  onChange={(e) => updateVar('subtitle', e.target.value)}
                  style={inputStyle(false)}
                  className="w-full px-4 py-3 rounded-lg text-white border focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Contenido principal</label>
                <textarea
                  value={templateVars.body}
                  onChange={(e) => updateVar('body', e.target.value)}
                  rows={5}
                  style={inputStyle(false)}
                  className="w-full px-4 py-3 rounded-lg text-white border focus:outline-none transition resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Texto del botón</label>
                  <input
                    type="text"
                    value={templateVars.ctaText}
                    onChange={(e) => updateVar('ctaText', e.target.value)}
                    style={inputStyle(false)}
                    className="w-full px-4 py-3 rounded-lg text-white border focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">URL del botón</label>
                  <input
                    type="text"
                    value={templateVars.ctaUrl}
                    onChange={(e) => updateVar('ctaUrl', e.target.value)}
                    style={inputStyle(false)}
                    className="w-full px-4 py-3 rounded-lg text-white border focus:outline-none transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Texto del pie</label>
                <input
                  type="text"
                  value={templateVars.footerText}
                  onChange={(e) => updateVar('footerText', e.target.value)}
                  style={inputStyle(false)}
                  className="w-full px-4 py-3 rounded-lg text-white border focus:outline-none transition"
                />
              </div>
            </div>

            {/* Right: Live preview */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Eye size={14} style={{ color: '#FCEE21' }} />
                <label className="text-sm font-bold text-gray-300">Preview en vivo</label>
              </div>
              <div
                className="rounded-lg overflow-hidden"
                style={{ border: '1px solid rgba(102, 45, 145, 0.3)' }}
              >
                <iframe
                  srcDoc={previewHtml}
                  title="Email preview"
                  className="w-full bg-white"
                  style={{ minHeight: '500px' }}
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          </div>
        ) : (
          /* HTML mode */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Código HTML</label>
              <textarea
                {...register('content')}
                rows={20}
                placeholder="Pega aquí tu HTML personalizado..."
                style={inputStyle(!!errors.content)}
                className="w-full px-4 py-3 rounded-lg text-white border focus:outline-none transition resize-none font-mono text-sm"
              />
              {errors.content && <p className="text-red-400 text-xs mt-1">{errors.content.message}</p>}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Eye size={14} style={{ color: '#FCEE21' }} />
                <label className="text-sm font-bold text-gray-300">Preview</label>
              </div>
              <div
                className="rounded-lg overflow-hidden"
                style={{ border: '1px solid rgba(102, 45, 145, 0.3)' }}
              >
                <iframe
                  srcDoc={previewHtml || '<p style="padding:20px;color:#999;">Escribe HTML para ver el preview...</p>'}
                  title="Email preview"
                  className="w-full bg-white"
                  style={{ minHeight: '500px' }}
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          </div>
        )}

        {/* Hidden content field for visual mode */}
        {editorMode === 'visual' && <input type="hidden" {...register('content')} />}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 rounded-lg font-bold text-lg transition-all disabled:opacity-50"
        style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
      >
        {isSubmitting ? 'Creando campaña...' : 'Crear campaña como borrador'}
      </button>
    </form>
  )
}
