'use client'

import { useActionState } from 'react'
import { importLegacyProgressAction, type CommunityToolResult } from '@/app/(comunidad)/comunidad/actions'

export function LegacyProgressImport({ lessons }: { lessons: { id: string; title: string }[] }) {
  const [state, action, pending] = useActionState<CommunityToolResult | null, FormData>(importLegacyProgressAction, null)
  if (!lessons.length) return null
  return <aside className="my-6 rounded-2xl border border-border-subtle p-5" aria-label="Marcas antiguas de este navegador">
    <h2 className="font-semibold text-white">¿Quieres conservar tus marcas anteriores?</h2>
    <p className="mt-3 text-sm leading-relaxed text-muted">Este navegador conserva marcas sin una cuenta asociada. Si son tuyas, puedes añadirlas a tu cuenta para continuar desde otros dispositivos. Si compartes el navegador, comprueba antes las lecciones.</p>
    <details className="mt-3 text-sm text-muted"><summary className="min-h-11 cursor-pointer py-3 text-accent">Ver {lessons.length} {lessons.length === 1 ? 'lección disponible' : 'lecciones disponibles'}</summary><ul className="list-disc space-y-2 pl-5">{lessons.map(lesson => <li key={lesson.id}>{lesson.title}</li>)}</ul></details>
    <form action={action} className="mt-3"><button type="submit" disabled={pending} className="btn-brand min-h-11">{pending ? 'Añadiendo…' : 'Son mías: añadir a mi cuenta'}</button>{state && <p className="mt-3 text-sm text-muted" role={state.ok ? 'status' : 'alert'}>{state.message}</p>}</form>
  </aside>
}
