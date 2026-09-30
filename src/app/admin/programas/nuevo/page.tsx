'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Loader2, ShieldCheck, Sparkles } from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'

interface FormState {
  nombre: string
  email: string
  objetivo_principal: string
  objetivos_secundarios: string
  dias_semana: string
  minutos_sesion: string
  donde_entrena: string
  material: string
  experiencia: string
  preferencias_entreno: string
  lesiones: string
  consideraciones: string
  dormir_calidad: string
  comidas_dia: string
  alergias: string
  preferencias_comida: string
  no_le_gusta: string
  estilo_vida: string
}

const INITIAL_FORM: FormState = {
  nombre: '', email: '', objetivo_principal: '', objetivos_secundarios: '', dias_semana: '3',
  minutos_sesion: '45', donde_entrena: '', material: '', experiencia: '', preferencias_entreno: '',
  lesiones: '', consideraciones: '', dormir_calidad: '', comidas_dia: '3', alergias: '',
  preferencias_comida: '', no_le_gusta: '', estilo_vida: '',
}

export default function NuevoProgramaPage() {
  const router = useRouter()
  const [form, setForm] = useState(INITIAL_FORM)
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const update = (field: keyof FormState, value: string) => setForm((current) => ({ ...current, [field]: value }))
  const canContinue = form.nombre.trim() && form.email.trim() && form.objetivo_principal.trim()

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const response = await fetch('/api/generar-programa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          origen: 'admin-tiroides',
          objetivos_secundarios: form.objetivos_secundarios.split(',').map((item) => item.trim()).filter(Boolean),
          dias_semana: Number(form.dias_semana),
          minutos_sesion: Number(form.minutos_sesion),
          comidas_dia: Number(form.comidas_dia),
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'No se pudo generar el plan.')
      router.push(`/admin/programas/${data.programa_id}`)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo generar el plan.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0E0B1E]">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-auto px-5 py-7 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <Link href="/admin/programas" className="inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-white"><ArrowLeft size={16} /> Volver a programas</Link>
          <header className="mt-5 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#FCEE21]"><Sparkles size={15} /> Flujo guiado BASE‑T12</p>
              <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Nuevo plan personalizado</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/50">Introduce la evaluación disponible. El sistema adapta la plantilla maestra y crea un borrador; nunca entrega el plan sin tu revisión.</p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[.06] p-5">
              <p className="flex items-center gap-2 text-sm font-bold text-emerald-300"><ShieldCheck size={17} /> Control humano obligatorio</p>
              <p className="mt-2 text-xs leading-relaxed text-white/45">Crear el borrador no activa el acceso. Primero revisas ejercicios, alternativas, alimentación y progresión.</p>
            </div>
          </header>

          <div className="mt-8 flex gap-2" aria-label="Progreso del formulario">
            {[['1', 'Persona y objetivo'], ['2', 'Entrenamiento'], ['3', 'Recuperación y hábitos']].map(([number, label], index) => (
              <button key={number} type="button" onClick={() => canContinue || index === 0 ? setStep(index + 1) : undefined} className={`flex min-h-11 flex-1 items-center gap-2 rounded-xl border px-3 text-left text-xs font-bold transition ${step === index + 1 ? 'border-[#FCEE21]/40 bg-[#FCEE21]/10 text-[#FCEE21]' : 'border-white/10 bg-white/[.025] text-white/40'}`}>
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-current">{step > index + 1 ? <Check size={13} /> : number}</span><span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 rounded-3xl border border-white/10 bg-[#17132F] p-5 sm:p-8">
            {step === 1 && <section className="grid gap-5 sm:grid-cols-2">
              <Heading title="Persona y objetivo" detail="Los tres campos esenciales para abrir el expediente." />
              <Field label="Nombre completo" required value={form.nombre} onChange={(value) => update('nombre', value)} />
              <Field label="Email" type="email" required value={form.email} onChange={(value) => update('email', value)} />
              <Field label="Objetivo principal" required value={form.objetivo_principal} onChange={(value) => update('objetivo_principal', value)} placeholder="Ej. recuperar fuerza y perder grasa sin agotarme" wide />
              <Field label="Objetivos secundarios" value={form.objetivos_secundarios} onChange={(value) => update('objetivos_secundarios', value)} placeholder="Separados por comas" wide />
            </section>}

            {step === 2 && <section className="grid gap-5 sm:grid-cols-2">
              <Heading title="Entrenamiento y disponibilidad" detail="La plantilla conservará el método y adaptará dosis, material y ejercicios." />
              <SelectField label="Días por semana" value={form.dias_semana} onChange={(value) => update('dias_semana', value)} options={['2', '3', '4']} />
              <SelectField label="Minutos por sesión" value={form.minutos_sesion} onChange={(value) => update('minutos_sesion', value)} options={['30', '45', '60']} />
              <Field label="Dónde entrena" value={form.donde_entrena} onChange={(value) => update('donde_entrena', value)} placeholder="Casa, gimnasio o ambos" />
              <Field label="Material disponible" value={form.material} onChange={(value) => update('material', value)} placeholder="Mancuernas, bandas, máquinas…" />
              <Field label="Experiencia" value={form.experiencia} onChange={(value) => update('experiencia', value)} placeholder="Qué ha entrenado y durante cuánto tiempo" wide />
              <Field label="Preferencias" value={form.preferencias_entreno} onChange={(value) => update('preferencias_entreno', value)} placeholder="Qué disfruta, qué evita y horarios" wide />
              <Field label="Lesiones o limitaciones" value={form.lesiones} onChange={(value) => update('lesiones', value)} placeholder="Solo información aportada por la persona" wide textarea />
            </section>}

            {step === 3 && <section className="grid gap-5 sm:grid-cols-2">
              <Heading title="Recuperación, alimentación y contexto" detail="Completa solo lo que conozcas; lo que falte quedará señalado para revisión." />
              <Field label="Sueño y recuperación" value={form.dormir_calidad} onChange={(value) => update('dormir_calidad', value)} />
              <SelectField label="Comidas al día" value={form.comidas_dia} onChange={(value) => update('comidas_dia', value)} options={['2', '3', '4', '5']} />
              <Field label="Alergias o intolerancias" value={form.alergias} onChange={(value) => update('alergias', value)} />
              <Field label="Preferencias de comida" value={form.preferencias_comida} onChange={(value) => update('preferencias_comida', value)} />
              <Field label="Alimentos que no comerá" value={form.no_le_gusta} onChange={(value) => update('no_le_gusta', value)} />
              <Field label="Estilo de vida" value={form.estilo_vida} onChange={(value) => update('estilo_vida', value)} placeholder="Trabajo, turnos, cuidados, estrés…" />
              <Field label="Consideraciones para revisar" value={form.consideraciones} onChange={(value) => update('consideraciones', value)} placeholder="Contexto de salud o dudas que requieren criterio profesional" wide textarea />
            </section>}

            {error && <p role="alert" className="mt-6 rounded-xl border border-red-400/25 bg-red-400/10 p-4 text-sm text-red-200">{error}</p>}
            <footer className="mt-8 flex flex-col-reverse justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
              <button type="button" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1 || submitting} className="min-h-11 rounded-xl px-5 text-sm font-bold text-white/50 transition hover:text-white disabled:invisible">Anterior</button>
              {step < 3 ? <button type="button" onClick={() => setStep((current) => Math.min(3, current + 1))} disabled={!canContinue} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#FCEE21] px-6 text-sm font-bold text-[#16122B] disabled:cursor-not-allowed disabled:opacity-40">Continuar <ArrowRight size={16} /></button> : <button type="submit" disabled={submitting || !canContinue} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#FCEE21] px-7 text-sm font-bold text-[#16122B] disabled:cursor-not-allowed disabled:opacity-50">{submitting ? <><Loader2 size={17} className="animate-spin" /> Adaptando BASE‑T12…</> : <><Sparkles size={17} /> Generar borrador</>}</button>}
            </footer>
          </form>
        </div>
      </main>
    </div>
  )
}

function Heading({ title, detail }: { title: string; detail: string }) {
  return <div className="sm:col-span-2"><h2 className="text-xl font-bold text-white">{title}</h2><p className="mt-1 text-sm text-white/45">{detail}</p></div>
}

function Field({ label, value, onChange, type = 'text', placeholder, required, wide, textarea }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; required?: boolean; wide?: boolean; textarea?: boolean }) {
  const className = `rounded-xl border border-white/10 bg-[#0E0B1E] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#FCEE21]/50 focus:ring-2 focus:ring-[#FCEE21]/10 ${textarea ? 'min-h-24 resize-y' : 'min-h-12'}`
  return <label className={`grid gap-2 text-xs font-bold text-white/65 ${wide ? 'sm:col-span-2' : ''}`}><span>{label}{required && <b className="ml-1 text-[#FCEE21]">*</b>}</span>{textarea ? <textarea required={required} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={className} /> : <input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={className} />}</label>
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <label className="grid gap-2 text-xs font-bold text-white/65"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-12 rounded-xl border border-white/10 bg-[#0E0B1E] px-4 py-3 text-sm text-white outline-none focus:border-[#FCEE21]/50">{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
}
