'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { COMMUNITY_WORKOUTS } from '@/lib/community-workouts'
import { WORKOUT_DAYS, type getWorkoutWeek, type WorkoutChoice } from '@/lib/community-workout-week'
import type { WorkoutDay } from '@/lib/community-workout-plans'
import { saveWorkoutPlanAction } from '@/app/(comunidad)/comunidad/mi-semana/workout-actions'

export function WeeklyWorkoutPlan({ week, days, available }: { week: ReturnType<typeof getWorkoutWeek>; days: WorkoutDay[]; available: boolean }) {
  const initial = week.dates.map(date => days.find(day => day.workout_date === date)?.workout_id ?? '')
  const [choices, setChoices] = useState<WorkoutChoice[]>(initial)
  const [state, action, pending] = useActionState(saveWorkoutPlanAction, null)
  const saved = state?.ok && state.choices ? state.choices : initial
  const changed = choices.some((choice, index) => choice !== saved[index])
  const planned = saved.flatMap((choice, index) => choice ? [{ choice, index }] : [])

  return <section id="sesiones" aria-labelledby="weekly-workouts-heading" className="my-9 scroll-mt-24 space-y-5 border-y border-border-subtle py-7">
    <header className="space-y-3"><p className="community-eyebrow">Tu práctica · semana del {week.label}</p><h2 id="weekly-workouts-heading" className="headline text-fluid-2xl text-white">Tus sesiones de esta semana</h2><p className="max-w-2xl text-sm leading-relaxed text-muted">Puedes reservar un día para el ejemplo de casa o de gimnasio. Es una elección tuya para organizarte; no asigna un programa individual ni marca el entrenamiento como realizado.</p></header>
    {available ? <>
      {planned.length ? <ul className="divide-y divide-border-subtle">{planned.map(({ choice, index }) => <li key={week.dates[index]} className="py-3"><a href={`/comunidad/ejercicios/sesiones#${choice}`} className="inline-flex min-h-11 flex-wrap items-center gap-x-3 gap-y-1 text-accent underline underline-offset-4"><span className="font-semibold">{WORKOUT_DAYS[index]}</span><span>{COMMUNITY_WORKOUTS.find(workout => workout.id === choice)?.title}</span><span className="text-sm">Abrir sesión →</span></a></li>)}</ul> : <p className="text-sm text-muted">Todavía no has reservado ninguna sesión esta semana. Puedes empezar eligiendo un día.</p>}
      <details><summary className="min-h-11 cursor-pointer py-3 font-semibold text-accent">Elegir o cambiar días</summary>
        <form action={action} onReset={event => event.preventDefault()} aria-label="Planificar sesiones semanales" className="mt-3 space-y-5">
          <input type="hidden" name="week_start" value={week.start} />
          <div className="grid gap-4 sm:grid-cols-2">{WORKOUT_DAYS.map((day, index) => <label key={day} className="space-y-2"><span className="block text-sm font-semibold text-white">{day} <span className="font-normal text-muted">{week.dates[index].slice(8, 10)}/{week.dates[index].slice(5, 7)}</span></span><select name="workouts" value={choices[index]} disabled={pending} onChange={event => setChoices(current => current.map((choice, position) => position === index ? event.target.value as WorkoutChoice : choice))} className="min-h-11 w-full rounded-lg border border-border-subtle bg-brand-deep p-3 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"><option value="">Sin sesión prevista</option>{COMMUNITY_WORKOUTS.map(workout => <option key={workout.id} value={workout.id}>{workout.title}</option>)}</select></label>)}</div>
          <p className="text-sm leading-relaxed text-muted">Guarda para conservar la elección en tu cuenta y verla desde otro dispositivo. Para quitar una sesión, elige «Sin sesión prevista» y vuelve a guardar.</p>
          <p className="text-sm leading-relaxed text-muted">Deja margen de recuperación entre sesiones. Los ejemplos proponen dos días separados; reservar más días no implica que necesites hacer más.</p>
          <p role="status" className="text-sm text-muted">{pending ? 'Guardando…' : state && !state.ok ? state.message : changed ? 'Tienes cambios sin guardar.' : state?.message}</p>
          <button type="submit" disabled={pending || !changed} className="btn-brand min-h-11 disabled:cursor-not-allowed disabled:opacity-50">{pending ? 'Guardando…' : 'Guardar días y sesiones'}</button>
        </form>
      </details>
    </> : <p role="status" className="text-sm leading-relaxed text-muted">El calendario no está disponible en este momento. Puedes consultar las sesiones y organizar tus días con el planificador PDF.</p>}
    <div className="flex flex-wrap gap-x-6 gap-y-2"><Link href="/comunidad/ejercicios/sesiones" className="inline-flex min-h-11 items-center text-accent underline underline-offset-4">Comparar las dos sesiones</Link><a href="/community/resources/planificador-semanal-tiroides.pdf" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-accent underline underline-offset-4">Abrir planificador PDF</a></div>
  </section>
}
