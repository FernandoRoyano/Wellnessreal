'use client'

import { useActionState, useOptimistic } from 'react'
import { useFormStatus } from 'react-dom'
import { Check, Circle } from 'lucide-react'
import { setLessonCompletionAction, type CommunityToolResult } from '@/app/(comunidad)/comunidad/actions'
import { getThyroidTrackingContext } from '@/lib/analytics'

export function LessonCompletionButton({
  lessonId,
  isCompleted,
}: {
  lessonId: string
  isCompleted: boolean
}) {
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(isCompleted)
  const [state, action] = useActionState<CommunityToolResult | null, FormData>(setLessonCompletionAction, null)

  return (
    <form
      action={async (formData) => {
        setOptimisticCompleted(!optimisticCompleted)
        formData.set('_community_tracking', JSON.stringify(getThyroidTrackingContext()))
        await action(formData)
      }}
      className="lesson-completion"
    >
      <input type="hidden" name="lesson_id" value={lessonId} />
      <input type="hidden" name="completed" value={String(!optimisticCompleted)} />
      <CompletionSubmit isCompleted={optimisticCompleted} />
      {state && <p className="mt-3 text-sm text-muted" role={state.ok ? 'status' : 'alert'}>{state.message}</p>}
    </form>
  )
}

function CompletionSubmit({ isCompleted }: { isCompleted: boolean }) {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending} aria-pressed={isCompleted}>
      <span className={isCompleted ? 'is-completed' : undefined}>
        {isCompleted ? <Check className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
      </span>
      <span>
        <strong>{isCompleted ? 'Lección completada' : 'Marcar como completada'}</strong>
        <small>{isCompleted ? 'Guardado en tu cuenta; puedes repasar cuando quieras' : 'Guarda tu avance para continuar desde otro dispositivo'}</small>
      </span>
    </button>
  )
}
