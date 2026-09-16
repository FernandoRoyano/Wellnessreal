'use client'

import { useActionState, useOptimistic } from 'react'
import { Bookmark, ThumbsDown, ThumbsUp } from 'lucide-react'
import { setLessonFavoriteAction, setLessonFeedbackAction, type CommunityToolResult } from '@/app/(comunidad)/comunidad/actions'

export function LessonFavorite({ lessonId, initialFavorite }: { lessonId: string; initialFavorite: boolean }) {
  const [favorite, setOptimisticFavorite] = useOptimistic(initialFavorite)
  const [state, action, pending] = useActionState<CommunityToolResult | null, FormData>(setLessonFavoriteAction, null)
  return <form action={async (formData) => { setOptimisticFavorite(!favorite); await action(formData) }} className="lesson-favorite"><input type="hidden" name="lesson_id" value={lessonId} /><input type="hidden" name="value" value={String(!favorite)} /><button type="submit" disabled={pending} aria-pressed={favorite}><Bookmark size={17} fill={favorite ? 'currentColor' : 'none'} />{favorite ? 'Guardada' : 'Guardar'}</button>{state && !state.ok && <small role="alert">{state.message}</small>}</form>
}

export function LessonFeedback({ lessonId, initialFeedback }: { lessonId: string; initialFeedback: boolean | null }) {
  const [state, action, pending] = useActionState<CommunityToolResult | null, FormData>(setLessonFeedbackAction, null)
  return <form action={action} className="lesson-feedback"><input type="hidden" name="lesson_id" value={lessonId} /><div><p>¿Te ha resultado útil esta lección?</p><span>Tu respuesta ayuda a decidir qué debemos mejorar.</span></div><div><button name="value" value="true" type="submit" disabled={pending} aria-pressed={initialFeedback === true}><ThumbsUp size={16} /> Sí</button><button name="value" value="false" type="submit" disabled={pending} aria-pressed={initialFeedback === false}><ThumbsDown size={16} /> No del todo</button></div>{state && <small className={state.ok ? 'is-success' : 'is-error'} role="status">{state.message}</small>}</form>
}
