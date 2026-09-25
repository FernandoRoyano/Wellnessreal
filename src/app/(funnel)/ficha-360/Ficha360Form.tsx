'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Clock3, LoaderCircle, ShieldCheck } from 'lucide-react'
import { MEAL_OPTIONS, MEAL_ROWS, SECTIONS, getVisibleQuestions, type AnswerValue, type FormAnswers, type Question } from './questions'

const STORAGE_KEY = 'wellnessreal-ficha-360-draft'
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SECTION_LABELS = ['Datos', 'Tu semana', 'Alimentación', 'Ejercicio', 'Bienestar', 'Objetivo']
const SECTION_MINUTES = [1, 2, 3, 1, 1, 1]
const TOTAL_MINUTES = SECTION_MINUTES.reduce((total, minutes) => total + minutes, 0)

function OptionButton({ selected, children, onClick }: { selected: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={selected} onClick={onClick} className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${selected ? 'border-accent bg-accent/10 text-accent' : 'border-white/10 bg-white/[0.035] text-white/75 hover:border-white/25 hover:text-white'}`}>
      <span className="flex items-center justify-between gap-3">{children}{selected && <Check size={16} aria-hidden="true" />}</span>
    </button>
  )
}

function QuestionField({ question, value, onChange }: { question: Question; value: AnswerValue | undefined; onChange: (value: AnswerValue) => void }) {
  if (question.type === 'text' || question.type === 'textarea') {
    const shared = { value: typeof value === 'string' ? value : '', onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value), placeholder: question.placeholder, className: 'w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20' }
    return question.type === 'textarea' ? <textarea {...shared} rows={4} /> : <input {...shared} type={question.id === 'email' ? 'email' : question.id === 'telefono' ? 'tel' : 'text'} />
  }

  if (question.type === 'scale') {
    const current = typeof value === 'string' ? value : '5'
    return <div><input type="range" min="0" max="10" step="1" value={current} onChange={(event) => onChange(event.target.value)} className="w-full accent-[#FCEE21]" aria-label={question.label} /><div className="mt-2 flex justify-between text-xs text-white/45"><span>0</span><strong className="text-lg text-accent">{current}</strong><span>10</span></div></div>
  }

  const selectedValues = Array.isArray(value) ? value : []
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {question.options?.map((option) => {
        const selected = question.type === 'multiple' ? selectedValues.includes(option) : value === option
        return <OptionButton key={option} selected={selected} onClick={() => {
          if (question.type === 'single') return onChange(option)
          if (selected) return onChange(selectedValues.filter((item) => item !== option))
          if (question.maxChoices && selectedValues.length >= question.maxChoices) return
          onChange([...selectedValues, option])
        }}>{option}</OptionButton>
      })}
    </div>
  )
}

export default function Ficha360Form() {
  const [sectionIndex, setSectionIndex] = useState(0)
  const [answers, setAnswers] = useState<FormAnswers>({ estres: '5' })
  const [mealLocations, setMealLocations] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false)

  useEffect(() => {
    try {
      const draft = localStorage.getItem(STORAGE_KEY)
      if (draft) {
        const parsed = JSON.parse(draft) as { answers?: FormAnswers; mealLocations?: Record<string, string>; sectionIndex?: number }
        if (parsed.answers) setAnswers(parsed.answers)
        if (parsed.mealLocations) setMealLocations(parsed.mealLocations)
        if (typeof parsed.sectionIndex === 'number') setSectionIndex(Math.min(parsed.sectionIndex, SECTIONS.length - 1))
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    } finally {
      setHasLoadedDraft(true)
    }
  }, [])

  useEffect(() => {
    if (!hasLoadedDraft || status === 'success') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, mealLocations, sectionIndex }))
  }, [answers, mealLocations, sectionIndex, hasLoadedDraft, status])

  const section = SECTIONS[sectionIndex]
  const visibleQuestions = useMemo(() => getVisibleQuestions(section, answers), [section, answers])
  const progress = ((sectionIndex + 1) / SECTIONS.length) * 100
  const remainingMinutes = SECTION_MINUTES.slice(sectionIndex).reduce((total, minutes) => total + minutes, 0)

  const updateAnswer = (id: string, value: AnswerValue) => setAnswers((current) => ({ ...current, [id]: value }))
  const isSectionValid = visibleQuestions.every((question) => {
    if (!question.required) return true
    const value = answers[question.id]
    if (question.id === 'email') return typeof value === 'string' && EMAIL_REGEX.test(value)
    return Array.isArray(value) ? value.length > 0 : typeof value === 'string' && value.trim().length > 0
  })

  const handleNext = () => {
    if (!isSectionValid) { setError('Completa las preguntas marcadas como obligatorias para continuar.'); return }
    setError('')
    setSectionIndex((current) => Math.min(current + 1, SECTIONS.length - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    if (!isSectionValid) { setError('Completa las preguntas marcadas como obligatorias.'); return }
    setStatus('sending'); setError('')
    try {
      const response = await fetch('/api/ficha-360', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers: { ...answers, ubicacion_comidas: mealLocations } }) })
      const result = await response.json() as { error?: string }
      if (!response.ok) throw new Error(result.error || 'No se pudo enviar la ficha.')
      localStorage.removeItem(STORAGE_KEY)
      setStatus('success')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo enviar la ficha. Inténtalo de nuevo.')
      setStatus('error')
    }
  }

  if (status === 'success') return (
    <main className="flex min-h-screen items-center justify-center bg-brand-deep px-5 py-12 text-white">
      <div className="max-w-lg text-center"><div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-accent text-brand-deep"><Check size={30} /></div><h1 className="headline text-fluid-4xl">Ya tengo tu foto completa.</h1><p className="mt-4 text-fluid-lg leading-relaxed text-white/65">Gracias por contarme cómo es tu vida de verdad. Revisaré tus respuestas para adaptar el plan a tu contexto, tus preferencias y lo que puedes sostener.</p></div>
    </main>
  )

  return (
    <main className="min-h-screen bg-brand-deep text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-brand-deep/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center gap-5 px-5 py-3"><Image src="/images/logos/WR_AUX_normal_bg.png" alt="WellnessReal" width={150} height={42} priority className="h-8 w-auto" /><div className="ml-auto flex items-center gap-2 rounded-full border border-accent/20 bg-accent/[0.07] px-3 py-1.5 text-xs font-semibold text-accent"><Clock3 size={14} aria-hidden="true" /><span>{sectionIndex === 0 ? `Aprox. ${TOTAL_MINUTES} min` : `${remainingMinutes} min restantes`}</span></div></div>
        <nav aria-label="Progreso del cuestionario" className="mx-auto max-w-4xl px-5 pb-3">
          <ol className="grid grid-cols-6 gap-1.5 sm:gap-3">
            {SECTION_LABELS.map((label, index) => {
              const isCurrent = index === sectionIndex
              const isCompleted = index < sectionIndex
              return (
                <li key={label} aria-current={isCurrent ? 'step' : undefined} className="min-w-0">
                  <button type="button" disabled={!isCompleted} onClick={() => { setError(''); setSectionIndex(index); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className={`group flex w-full flex-col items-center gap-1.5 text-center disabled:cursor-default ${isCurrent ? 'text-accent' : isCompleted ? 'text-white/70' : 'text-white/30'}`}>
                    <span className={`flex size-7 items-center justify-center rounded-full border text-[11px] font-bold transition-colors sm:size-8 ${isCurrent ? 'border-accent bg-accent text-brand-deep shadow-[0_0_18px_rgba(252,238,33,0.2)]' : isCompleted ? 'border-accent/50 bg-accent/10 text-accent group-hover:bg-accent/20' : 'border-white/10 bg-white/[0.03]'}`}>{isCompleted ? <Check size={14} aria-hidden="true" /> : index + 1}</span>
                    <span className="hidden truncate text-[10px] font-semibold sm:block">{label}</span>
                  </button>
                </li>
              )
            })}
          </ol>
          <div className="mt-2 flex items-center justify-between sm:hidden"><span className="text-[11px] font-semibold text-accent">{SECTION_LABELS[sectionIndex]}</span><span className="text-[11px] text-white/35">Paso {sectionIndex + 1} de {SECTIONS.length}</span></div>
        </nav>
        <div className="h-1 bg-white/5"><div className="h-full bg-accent transition-[width] duration-500" style={{ width: `${progress}%` }} /></div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-fluid-lg">
        {sectionIndex === 0 && <div className="mb-8 rounded-2xl border border-accent/25 bg-accent/[0.07] p-5"><div className="flex gap-3"><ShieldCheck className="mt-0.5 shrink-0 text-accent" size={20} /><p className="text-sm leading-relaxed text-white/70">Quiero entender tu realidad, no examinarte. No hay respuestas buenas o malas y la información se utilizará únicamente para preparar y adaptar tu acompañamiento.</p></div></div>}
        <div className="mb-8"><p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">{section.eyebrow}</p><h1 className="headline text-fluid-4xl">{section.title}</h1><p className="mt-3 max-w-2xl text-fluid-base leading-relaxed text-white/55">{section.description}</p></div>

        <section className="space-y-8 rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl sm:p-8">
          {section.id === 'alimentacion' && <div><div className="mb-3"><label className="text-base font-semibold">¿Dónde haces normalmente cada comida?</label><p className="mt-1 text-sm text-white/45">Elige la opción que más se repite.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[580px] border-separate border-spacing-1"><thead><tr><th /><>{MEAL_OPTIONS.map((option) => <th key={option} className="p-2 text-center text-xs font-medium text-white/45">{option}</th>)}</></tr></thead><tbody>{MEAL_ROWS.map((meal) => <tr key={meal}><th className="pr-3 text-left text-sm font-medium text-white/75">{meal}</th>{MEAL_OPTIONS.map((option) => <td key={option} className="text-center"><button type="button" aria-label={`${meal}: ${option}`} aria-pressed={mealLocations[meal] === option} onClick={() => setMealLocations((current) => ({ ...current, [meal]: option }))} className={`size-9 rounded-lg border transition-colors ${mealLocations[meal] === option ? 'border-accent bg-accent text-brand-deep' : 'border-white/10 bg-black/15 hover:border-white/30'}`}>{mealLocations[meal] === option && <Check className="mx-auto" size={15} />}</button></td>)}</tr>)}</tbody></table></div></div>}
          {visibleQuestions.map((question) => <div key={question.id}><div className="mb-3"><label className="text-base font-semibold">{question.label}{question.required && <span className="ml-1 text-accent">*</span>}</label>{question.hint && <p className="mt-1 text-sm leading-relaxed text-white/45">{question.hint}</p>}{question.maxChoices && <p className="mt-1 text-xs text-accent/75">Elige hasta {question.maxChoices}</p>}</div><QuestionField question={question} value={answers[question.id]} onChange={(value) => updateAnswer(question.id, value)} /></div>)}
        </section>

        {error && <p role="alert" className="mt-5 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}
        <div className="mt-6 flex items-center justify-between gap-4"><button type="button" onClick={() => { setError(''); setSectionIndex((current) => Math.max(0, current - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }} disabled={sectionIndex === 0 || status === 'sending'} className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white/60 hover:bg-white/5 hover:text-white disabled:invisible"><ArrowLeft size={17} /> Atrás</button>{sectionIndex < SECTIONS.length - 1 ? <button type="button" onClick={handleNext} className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-brand-deep transition-transform hover:-translate-y-0.5">Continuar <ArrowRight size={17} /></button> : <button type="button" onClick={handleSubmit} disabled={status === 'sending'} className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold text-brand-deep disabled:cursor-wait disabled:opacity-70">{status === 'sending' ? <><LoaderCircle className="animate-spin" size={17} /> Enviando…</> : <>Enviar mi ficha <ArrowRight size={17} /></>}</button>}</div>
        <p className="mt-8 text-center text-xs leading-relaxed text-white/30">Tus datos se tratan de forma confidencial según la <a href="/privacidad" target="_blank" className="underline hover:text-white/60">política de privacidad</a>.</p>
      </div>
    </main>
  )
}
