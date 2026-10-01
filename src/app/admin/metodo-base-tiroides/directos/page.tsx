'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, ExternalLink, LoaderCircle, PlayCircle, Plus } from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import type { Lesson } from '@/lib/db/comunidad'

export default function AdminThyroidLiveSessionsPage() {
  const [sessions, setSessions] = useState<Lesson[]>([])
  const [spaceId, setSpaceId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ title: '', topic: '', format: 'recorded', block: '1', date: '', videoUrl: '', summary: '' })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/metodo-base-tiroides/directos')
      const data = await response.json() as { sessions?: Lesson[]; spaceId?: string; error?: string }
      if (!response.ok) throw new Error(data.error ?? 'No se pudieron cargar los directos')
      setSessions(data.sessions ?? [])
      setSpaceId(data.spaceId ?? '')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudieron cargar los directos')
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { void load() }, [load])

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setSaving(true); setError('')
    try {
      const response = await fetch('/api/admin/metodo-base-tiroides/directos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await response.json() as { error?: string }
      if (!response.ok) throw new Error(data.error ?? 'No se pudo publicar')
      setForm({ title: '', topic: '', format: 'recorded', block: '1', date: '', videoUrl: '', summary: '' })
      await load()
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'No se pudo publicar') }
    finally { setSaving(false) }
  }

  return <div className="flex min-h-screen bg-[#100d24] text-white"><AdminSidebar /><main className="min-w-0 flex-1 px-5 pb-24 pt-7 sm:px-8 lg:px-12"><div className="mx-auto max-w-5xl">
    <Link href="/admin/metodo-base-tiroides" className="inline-flex items-center gap-2 text-sm text-white/45 hover:text-white"><ArrowLeft size={15} /> Volver a Método BASE</Link>
    <header className="mt-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#FCEE21]">Contenido premium</p><h1 className="headline mt-2 text-4xl">Clases y directos.</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/50">Publica clases grabadas sin fecha y ordénalas por bloque. Los directos son opcionales. Solo los ven miembros con pago confirmado o acceso premium manual.</p></header>
    <form onSubmit={submit} className="mt-8 grid gap-4 rounded-2xl border border-[#FCEE21]/20 bg-[#17132f] p-6 sm:grid-cols-2">
      <Field label="Formato"><select value={form.format} onChange={(event) => setForm({ ...form, format: event.target.value })}><option value="recorded">Clase grabada</option><option value="live">Directo / grabación de directo</option></select></Field>
      <Field label="Bloque del método"><select value={form.block} onChange={(event) => setForm({ ...form, block: event.target.value })}><option value="1">Bloque 1 · Entender y estabilizar</option><option value="2">Bloque 2 · Construir tolerancia</option><option value="3">Bloque 3 · Progresar con criterio</option><option value="4">Bloque 4 · Consolidar autonomía</option></select></Field>
      <Field label="Título"><input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Ej. Cómo ajustar una semana difícil" /></Field>
      <Field label="Temática"><input required value={form.topic} onChange={(event) => setForm({ ...form, topic: event.target.value })} placeholder="Ej. Autorregulación" /></Field>
      <Field label={form.format === 'live' ? 'Fecha del directo' : 'Fecha (opcional)'}><input required={form.format === 'live'} type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></Field>
      <Field label="Enlace privado del vídeo"><input required type="url" value={form.videoUrl} onChange={(event) => setForm({ ...form, videoUrl: event.target.value })} placeholder="https://..." /></Field>
      <div className="sm:col-span-2"><Field label="Resumen"><textarea value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} rows={3} placeholder="Qué se trabajó y qué debe aplicar la participante." /></Field></div>
      {error && <p className="text-sm text-red-300 sm:col-span-2">{error}</p>}
      <button disabled={saving} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#FCEE21] px-5 text-sm font-bold text-[#100d24] disabled:opacity-50 sm:col-span-2 sm:justify-self-start">{saving ? <LoaderCircle className="animate-spin" size={16} /> : <Plus size={16} />}{saving ? 'Publicando…' : 'Publicar contenido'}</button>
    </form>
    <section className="mt-10"><h2 className="headline text-2xl">Biblioteca publicada</h2>{loading ? <p className="mt-5 text-sm text-white/40">Cargando…</p> : sessions.length === 0 ? <div className="mt-5 rounded-2xl border border-dashed border-white/15 p-8 text-center"><PlayCircle className="mx-auto text-white/25" /><p className="mt-3 text-sm text-white/45">Todavía no hay clases publicadas.</p></div> : <div className="mt-5 space-y-3">{sessions.map((session) => <Link key={session.id} href={`/admin/comunidad/${spaceId}/lecciones/${session.id}`} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[.03] p-5 hover:border-[#FCEE21]/30"><span><strong className="block text-sm">{session.title}</strong><small className="mt-1 flex items-center gap-1.5 text-white/35"><CalendarDays size={12} /> {session.slug.startsWith('directo-') ? session.slug.slice(8, 18) : 'Disponible para usuarios de pago'}</small></span><ExternalLink size={16} className="text-[#FCEE21]" /></Link>)}</div>}</section>
  </div></main></div>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-1.5 text-xs font-bold text-white/55">{label}<span className="[&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-white/10 [&_input]:bg-[#100d24] [&_input]:px-4 [&_input]:py-3 [&_input]:text-sm [&_input]:text-white [&_select]:w-full [&_select]:rounded-xl [&_select]:border [&_select]:border-white/10 [&_select]:bg-[#100d24] [&_select]:px-4 [&_select]:py-3 [&_select]:text-sm [&_select]:font-normal [&_select]:text-white [&_textarea]:w-full [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-white/10 [&_textarea]:bg-[#100d24] [&_textarea]:px-4 [&_textarea]:py-3 [&_textarea]:text-sm [&_textarea]:font-normal [&_textarea]:text-white">{children}</span></label> }
