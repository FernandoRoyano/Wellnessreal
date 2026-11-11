'use client'

import { useState, useRef, useId } from 'react'
import { createThreadAction } from '@/app/(comunidad)/comunidad/foro-actions'
import { PenLine, X } from 'lucide-react'
import { COMMUNITY_QUESTIONS } from '@/lib/community-weekly-plan'

export function NuevoHilo({ spaceSlug, initialQuestion }: { spaceSlug: string; initialQuestion?: string }) {
  const initial = spaceSlug === 'preguntas-apoyo' ? COMMUNITY_QUESTIONS.find(item => item.id === initialQuestion) : undefined
  const [open, setOpen] = useState(Boolean(initial))
  const [question, setQuestion] = useState(initial)
  const titleId = useId()
  const bodyId = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const action = createThreadAction.bind(null, spaceSlug)

  if (!open) {
    return (
      <div>
      {spaceSlug === 'preguntas-apoyo' && <div className="mb-5 space-y-3">
        <h2 className="text-lg font-semibold text-white">Una pregunta sencilla para empezar</h2>
        <p className="text-sm text-muted">Puedes preparar una respuesta con estas ideas. El borrador es editable y solo se publica cuando pulses «Publicar tema».</p>
        <div className="flex flex-col items-start gap-2">{COMMUNITY_QUESTIONS.map(item => <button key={item.id} type="button" onClick={() => { setQuestion(item); setOpen(true) }} className="min-h-11 text-left text-sm text-accent underline underline-offset-4">{item.title}</button>)}</div>
      </div>}
      <button onClick={() => { setQuestion(undefined); setOpen(true) }} className="btn-brand w-full">
        <PenLine className="h-4 w-4" /> Abrir un tema
      </button>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      action={action}
      className="surface-card rounded-2xl p-5"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-white">Nuevo tema</h3>
        <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar">
          <X className="h-4 w-4 text-white/40 hover:text-white" />
        </button>
      </div>
      {question && <p className="mb-4 text-sm text-muted">{question.hint} Este borrador no es una publicación automática.</p>}
      <label htmlFor={titleId} className="mb-2 block text-sm text-white">Título del tema</label>
      <input
        id={titleId}
        name="title"
        defaultValue={question?.title ?? ''}
        required
        placeholder="Título de tu tema"
        className="mb-3 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-brand-deep)] px-4 py-2.5 text-white placeholder:text-white/30 focus:border-[var(--color-accent)] focus:outline-none"
      />
      <label htmlFor={bodyId} className="mb-2 block text-sm text-white">Tu idea o pregunta (opcional)</label>
      <textarea
        id={bodyId}
        name="body"
        rows={4}
        placeholder="Comparte una idea o una dificultad de organización, sin datos clínicos privados."
        className="mb-3 w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-brand-deep)] px-4 py-2.5 text-white placeholder:text-white/30 focus:border-[var(--color-accent)] focus:outline-none"
      />
      <p className="mb-4 text-sm text-muted">Participar es opcional. No publiques analíticas, medicación, documentos ni datos personales de otras personas.</p>
      <button type="submit" className="btn-brand w-full">
        Publicar tema
      </button>
    </form>
  )
}
