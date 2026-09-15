'use client'

import { useOptimistic } from 'react'
import { useFormStatus } from 'react-dom'
import { Check, Circle } from 'lucide-react'
import { setLessonCompletionAction } from '@/app/(comunidad)/comunidad/actions'

export function LessonCompletionButton({
  lessonId,
  isCompleted,
}: {
  lessonId: string
  isCompleted: boolean
}) {
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(isCompleted)

  return (
    <form
      action={async (formData) => {
        setOptimisticCompleted(!optimisticCompleted)
        await setLessonCompletionAction(formData)
      }}
      className="lesson-completion"
    >
      <input type="hidden" name="lesson_id" value={lessonId} />
      <input type="hidden" name="completed" value={String(!optimisticCompleted)} />
      <CompletionSubmit isCompleted={optimisticCompleted} />
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
        <small>{isCompleted ? 'Ya forma parte de tu recorrido' : 'Guarda tu avance para continuar después'}</small>
      </span>
    </button>
  )
}
