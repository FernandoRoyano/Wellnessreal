'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, ShieldCheck } from 'lucide-react'
import {
  buildTestResult,
  getNextQuestionId,
  getQuestion,
  type QuestionId,
  type TestAnswers,
  type TestResult,
} from '@/lib/test-tiroides'
import { trackSignUp, trackThyroidFunnel } from '@/lib/analytics'

type Phase = 'intro' | 'questions' | 'email' | 'result'

const inputClass =
  'w-full px-4 py-3.5 rounded-xl bg-brand-night text-white border border-border-subtle text-fluid-base ' +
  'placeholder:text-dim focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all'

export default function TestTiroides({ onWantGuide }: { onWantGuide?: () => void }) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [currentId, setCurrentId] = useState<QuestionId>('situacion')
  const [history, setHistory] = useState<QuestionId[]>([])
  const [answers, setAnswers] = useState<TestAnswers>({})
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<TestResult | null>(null)

  const question = getQuestion(currentId, answers)
  const step = history.length + 1
  const total = 8

  const start = () => {
    trackThyroidFunnel('thyroid_test_start')
    setPhase('questions')
  }

  const pick = (value: string) => {
    const activeIds = new Set([...history, currentId])
    const cleanAnswers = Object.fromEntries(Object.entries(answers).filter(([id]) => activeIds.has(id as QuestionId)))
    const nextAnswers = { ...cleanAnswers, [currentId]: value }
    const nextId = getNextQuestionId(currentId, nextAnswers)

    trackThyroidFunnel('thyroid_test_question', {
      question_id: currentId,
      answer: value,
      step,
      intent: nextAnswers.objetivo || 'unknown',
    })
    setAnswers(nextAnswers)

    if (!nextId) {
      trackThyroidFunnel('thyroid_test_complete', { intent: nextAnswers.objetivo })
      setPhase('email')
      return
    }
    setHistory((previous) => [...previous, currentId])
    setCurrentId(nextId)
  }

  const back = () => {
    if (phase === 'email') {
      setPhase('questions')
      return
    }
    const previousId = history.at(-1)
    if (!previousId) return
    setCurrentId(previousId)
    setHistory((previous) => previous.slice(0, -1))
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Introduce un email válido.')
      return
    }
    setSending(true)
    setError('')
    try {
      const { getAttributionForSubmit } = await import('@/lib/tracking')
      const response = await fetch('/api/test-tiroides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, answers, _attribution: getAttributionForSubmit() }),
      })
      const data = (await response.json()) as { error?: string; result?: TestResult }
      if (!response.ok || !data.result) throw new Error(data.error || 'No se pudo calcular el resultado')
      trackSignUp('test_tiroides')
      trackThyroidFunnel('thyroid_result_view', {
        profile: data.result.profile,
        intent: data.result.intent,
        medical_review: data.result.requiresMedicalReview,
      })
      setResult(data.result)
      setPhase('result')
    } catch {
      setError('Hubo un problema al guardar tus respuestas. Inténtalo de nuevo.')
    } finally {
      setSending(false)
    }
  }

  if (phase === 'result' && result) {
    return (
      <div className="surface-card-accent rounded-2xl p-fluid-md animate-[fadeUp_500ms_ease-out_both]">
        <p className="text-fluid-xs font-semibold uppercase tracking-widest text-subtle">Tu resultado personalizado</p>
        <h2 className="headline text-fluid-2xl text-white mt-1">{result.emoji} {result.title}</h2>
        <p className="text-fluid-base text-muted leading-relaxed mt-4">{result.summary}</p>

        <div className="mt-5 space-y-3">
          <p className="text-fluid-xs font-bold uppercase tracking-wider text-accent">Tus prioridades</p>
          {result.priorities.map((priority) => (
            <div key={priority} className="flex items-start gap-2.5 text-fluid-sm text-white/85">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>{priority}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-accent/25 bg-accent/5 p-4">
          <p className="text-fluid-xs font-bold uppercase tracking-wider text-accent mb-1">Tu siguiente paso</p>
          <p className="text-fluid-sm text-white/85 leading-relaxed">{result.nextStep}</p>
        </div>

        <a
          href={result.cta.href}
          onClick={() => trackThyroidFunnel('thyroid_result_cta_click', { profile: result.profile, intent: result.intent })}
          className="btn-brand w-full mt-5 text-fluid-base py-4"
        >
          {result.cta.label}<ArrowRight className="w-4 h-4" />
        </a>
        <p className="text-fluid-xs text-subtle text-center mt-3">{result.cta.description}</p>
        <p className="text-fluid-xs text-subtle text-center mt-4 leading-relaxed">
          Te hemos enviado este resultado y la guía al email. El test es orientativo: no diagnostica ni interpreta analíticas.
        </p>
      </div>
    )
  }

  if (phase === 'email') {
    const preview = buildTestResult(answers)
    return (
      <div className="surface-card-accent rounded-2xl p-fluid-md">
        <button type="button" onClick={back} className="inline-flex items-center gap-1.5 text-fluid-xs text-subtle hover:text-white mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Atrás
        </button>
        <p className="text-fluid-xs font-semibold uppercase tracking-widest text-accent">Perfil preparado</p>
        <h2 className="headline text-fluid-2xl text-white mt-1">{preview.emoji} {preview.title}</h2>
        <p className="text-fluid-sm text-muted mt-2 mb-5">
          Déjanos tu email para guardar tus respuestas y ver tus tres prioridades y el siguiente paso recomendado.
        </p>
        <form onSubmit={submit} className="space-y-3">
          {error && <div className="rounded-xl p-3 text-fluid-sm text-danger bg-danger/10 border border-danger/30">⚠ {error}</div>}
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Tu nombre (opcional)" className={inputClass} />
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required placeholder="tu@email.com" className={inputClass} />
          <button type="submit" disabled={sending} className="btn-brand w-full text-fluid-base py-4 disabled:opacity-60">
            {sending ? <><Loader2 className="w-5 h-5 animate-spin" /> Guardando…</> : <>Ver mis prioridades <ArrowRight className="w-4 h-4" /></>}
          </button>
          <p className="text-fluid-xs text-subtle text-center inline-flex items-center justify-center gap-1.5 w-full">
            <ShieldCheck className="w-3.5 h-3.5" /> Sin spam. Podrás darte de baja cuando quieras.
          </p>
        </form>
      </div>
    )
  }

  if (phase === 'intro') {
    return (
      <div className="surface-card-accent rounded-2xl p-fluid-md text-center">
        <h2 className="headline text-fluid-2xl text-white">¿Qué necesitas <span className="text-gradient-brand">priorizar</span> ahora?</h2>
        <p className="text-fluid-sm text-muted mt-3 mb-6 max-w-sm mx-auto">
          Tus respuestas cambiarán el recorrido. En aproximadamente un minuto tendrás prioridades adaptadas a tu objetivo.
        </p>
        <button type="button" onClick={start} className="btn-brand w-full text-fluid-base py-4">
          Empezar mi test <ArrowRight className="w-4 h-4" />
        </button>
        {onWantGuide && (
          <button type="button" onClick={onWantGuide} className="mt-4 text-fluid-xs text-subtle hover:text-white underline underline-offset-2">
            ¿Solo quieres la guía? Descárgala aquí
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="surface-card-accent rounded-2xl p-fluid-md">
      <div className="flex items-center gap-3 mb-5">
        <button type="button" onClick={back} disabled={history.length === 0} className="text-subtle hover:text-white disabled:opacity-30 transition" aria-label="Volver a la pregunta anterior">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full bg-accent transition-all duration-300" style={{ width: `${(step / total) * 100}%` }} />
        </div>
        <span className="text-fluid-xs text-subtle tabular-nums shrink-0">{step}/{total}</span>
      </div>

      {step > 2 && <p className="text-fluid-xs font-semibold uppercase tracking-wider text-accent mb-2">Recorrido adaptado a ti</p>}
      <h2 className="headline text-fluid-xl text-white leading-tight">{question.question}</h2>
      {question.hint && <p className="text-fluid-xs text-subtle mt-2">{question.hint}</p>}
      <div className="mt-5 space-y-2.5">
        {question.options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => pick(option.value)}
            className={`w-full text-left px-4 py-3.5 rounded-xl border text-fluid-sm transition-all ${answers[currentId] === option.value ? 'border-accent bg-accent-muted text-white' : 'border-border-subtle bg-brand-night text-white/85 hover:border-accent/50 hover:bg-white/5'}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
