'use client'

import { useState } from 'react'
import { ArrowRight, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react'
import {
  TEST_QUESTIONS,
  NIVELES,
  calcularNivel,
  type TestAnswers,
  type NivelId,
} from '@/lib/test-tiroides'
import { trackSignUp } from '@/lib/analytics'

type Phase = 'intro' | 'questions' | 'email' | 'result'

const inputClass =
  'w-full px-4 py-3.5 rounded-xl bg-brand-night text-white border border-border-subtle text-fluid-base ' +
  'placeholder:text-dim focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-all'

export default function TestTiroides({ onWantGuide }: { onWantGuide?: () => void }) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<TestAnswers>({})
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [nivel, setNivel] = useState<NivelId | null>(null)

  const total = TEST_QUESTIONS.length
  const q = TEST_QUESTIONS[step]

  const pick = (value: string) => {
    const next = { ...answers, [q.id]: value }
    setAnswers(next)
    if (step < total - 1) {
      setStep(step + 1)
    } else {
      setPhase('email')
    }
  }

  const back = () => {
    if (phase === 'email') {
      setPhase('questions')
      setStep(total - 1)
    } else if (step > 0) {
      setStep(step - 1)
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Introduce un email válido.')
      return
    }
    setSending(true)
    setError('')
    try {
      const { getAttributionForSubmit } = await import('@/lib/tracking')
      const res = await fetch('/api/test-tiroides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, answers, _attribution: getAttributionForSubmit() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error')
      trackSignUp('test_tiroides')
      setNivel((data.nivel as NivelId) ?? calcularNivel(answers))
      setPhase('result')
    } catch {
      setError('Hubo un problema. Inténtalo de nuevo.')
    } finally {
      setSending(false)
    }
  }

  // ── Resultado ──
  if (phase === 'result' && nivel) {
    const n = NIVELES[nivel]
    return (
      <div className="surface-card-accent rounded-2xl p-fluid-md animate-[fadeUp_500ms_ease-out_both]">
        <p className="text-fluid-xs font-semibold uppercase tracking-widest text-subtle">Tu resultado</p>
        <h2 className="headline text-fluid-2xl text-white mt-1">
          {n.emoji} {n.titulo}
        </h2>
        <p className="text-fluid-base text-muted leading-relaxed mt-4">{n.resumen}</p>

        <div
          className="mt-5 rounded-xl p-4"
          style={{ backgroundColor: 'rgba(252,238,33,0.06)', border: '1px solid rgba(252,238,33,0.25)' }}
        >
          <p className="text-fluid-xs font-bold uppercase tracking-wider text-accent mb-1">Tu siguiente paso</p>
          <p className="text-fluid-sm text-white/85 leading-relaxed">{n.siguientePaso}</p>
        </div>

        <a href="/comunidad/entrar" className="btn-brand w-full mt-5 text-fluid-base py-4">
          Entrar en la comunidad gratis
          <ArrowRight className="w-4 h-4" />
        </a>
        <p className="text-fluid-xs text-subtle text-center mt-3">
          Te he mandado el resultado y tu guía completa al email. 💛
        </p>
        <p className="text-fluid-xs text-subtle text-center mt-4 leading-relaxed">
          Este test es orientativo, no es un diagnóstico. Tu tiroides la lleva tu endocrino.
        </p>
      </div>
    )
  }

  // ── Email ──
  if (phase === 'email') {
    return (
      <div className="surface-card-accent rounded-2xl p-fluid-md">
        <button onClick={back} className="inline-flex items-center gap-1.5 text-fluid-xs text-subtle hover:text-white mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Atrás
        </button>
        <h2 className="headline text-fluid-2xl text-white">Tu resultado está listo</h2>
        <p className="text-fluid-sm text-muted mt-2 mb-5">
          ¿A qué email te lo mando? Verás tu nivel y tu siguiente paso al instante (y de regalo, la guía completa).
        </p>
        <form onSubmit={submit} className="space-y-3">
          {error && (
            <div className="rounded-xl p-3 text-fluid-sm text-danger bg-danger/10 border border-danger/30">⚠ {error}</div>
          )}
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" className={inputClass} />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="tu@email.com"
            className={inputClass}
          />
          <button type="submit" disabled={sending} className="btn-brand w-full text-fluid-base py-4 disabled:opacity-60">
            {sending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Calculando…
              </>
            ) : (
              <>
                Ver mi resultado <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          <p className="text-fluid-xs text-subtle text-center inline-flex items-center justify-center gap-1.5 w-full">
            <ShieldCheck className="w-3.5 h-3.5" /> Sin spam. Solo tu resultado y contenido útil.
          </p>
        </form>
      </div>
    )
  }

  // ── Intro ──
  if (phase === 'intro') {
    return (
      <div className="surface-card-accent rounded-2xl p-fluid-md text-center">
        <h2 className="headline text-fluid-2xl text-white">
          ¿Cuánto te está <span className="text-gradient-brand">frenando</span> tu tiroides?
        </h2>
        <p className="text-fluid-sm text-muted mt-3 mb-6 max-w-sm mx-auto">
          8 preguntas, menos de 1 minuto. Sin registro para empezar. Al final sabrás en qué punto estás y
          cuál es tu mejor siguiente paso.
        </p>
        <button onClick={() => setPhase('questions')} className="btn-brand w-full text-fluid-base py-4">
          Empezar el test <ArrowRight className="w-4 h-4" />
        </button>
        {onWantGuide && (
          <button
            onClick={onWantGuide}
            className="mt-4 text-fluid-xs text-subtle hover:text-white underline underline-offset-2"
          >
            ¿Solo quieres la guía? Descárgala aquí
          </button>
        )}
      </div>
    )
  }

  // ── Preguntas ──
  return (
    <div className="surface-card-accent rounded-2xl p-fluid-md">
      {/* Progreso */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={back}
          disabled={step === 0}
          className="text-subtle hover:text-white disabled:opacity-30 transition"
          aria-label="Atrás"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300"
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>
        <span className="text-fluid-xs text-subtle tabular-nums shrink-0">
          {step + 1}/{total}
        </span>
      </div>

      <h2 className="headline text-fluid-xl text-white leading-tight">{q.question}</h2>
      {q.hint && <p className="text-fluid-xs text-subtle mt-2">{q.hint}</p>}

      <div className="mt-5 space-y-2.5">
        {q.options.map((opt) => {
          const selected = answers[q.id] === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => pick(opt.value)}
              className={`w-full text-left px-4 py-3.5 rounded-xl border text-fluid-sm transition-all ${
                selected
                  ? 'border-accent bg-accent-muted text-white'
                  : 'border-border-subtle bg-brand-night text-white/85 hover:border-accent/50 hover:bg-white/5'
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
