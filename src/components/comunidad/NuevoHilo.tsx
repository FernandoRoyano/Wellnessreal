'use client'

import { useState, useRef } from 'react'
import { createThreadAction } from '@/app/(comunidad)/comunidad/foro-actions'
import { PenLine, X } from 'lucide-react'

export function NuevoHilo({ spaceSlug }: { spaceSlug: string }) {
  const [open, setOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const action = createThreadAction.bind(null, spaceSlug)

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-brand w-full">
        <PenLine className="h-4 w-4" /> Abrir un tema
      </button>
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
      <input
        name="title"
        required
        placeholder="Título de tu tema"
        className="mb-3 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-brand-deep)] px-4 py-2.5 text-white placeholder:text-white/30 focus:border-[var(--color-accent)] focus:outline-none"
      />
      <textarea
        name="body"
        rows={4}
        placeholder="Cuenta tu experiencia o pregunta… (opcional)"
        className="mb-3 w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-brand-deep)] px-4 py-2.5 text-white placeholder:text-white/30 focus:border-[var(--color-accent)] focus:outline-none"
      />
      <button type="submit" className="btn-brand w-full">
        Publicar tema
      </button>
    </form>
  )
}
