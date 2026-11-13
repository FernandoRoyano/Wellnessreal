import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { COMMUNITY_WORKOUTS } from '@/lib/community-workouts'
import { getNextPlannedWorkout } from '@/lib/community-workout-week'
import type { WorkoutDay } from '@/lib/community-workout-plans'

export function NextPlannedWorkout({ days, today, available }: { days: WorkoutDay[]; today: string; available: boolean }) {
  const next = available ? getNextPlannedWorkout(days, today) : null
  const workout = COMMUNITY_WORKOUTS.find(item => item.id === next?.workout_id)
  const hasPastDays = days.some(day => day.workout_id && day.workout_date < today)
  const date = next ? new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${next.workout_date}T12:00:00Z`)) : null
  const heading = !available ? 'Tu planificación, a mano' : next ? next.workout_date === today ? 'Tu sesión prevista para hoy' : 'Tu próxima sesión reservada' : hasPastDays ? 'Revisa tu planificación' : 'Reserva tu próxima sesión'

  return <section aria-labelledby="next-workout-heading" className="my-8 space-y-4 border-l-2 border-accent pl-5">
    <p className="community-eyebrow">De aprender a practicar</p>
    <h2 id="next-workout-heading" className="headline text-fluid-2xl text-white">{heading}</h2>
    {next && workout ? <>
      <p className="text-sm text-accent"><time dateTime={next.workout_date}>{date}</time></p>
      <p className="text-xl font-semibold text-white">{workout.title}</p>
      <p className="max-w-2xl text-sm leading-relaxed text-muted">Es el ejemplo que elegiste en Mi semana. Puedes revisar la técnica o cambiar de día según cómo llegues; reservarlo no marca el entrenamiento como realizado.</p>
      <a href={`/comunidad/ejercicios/sesiones#${workout.id}`} className="inline-flex min-h-11 items-center gap-2 font-semibold text-accent underline underline-offset-4">Abrir mi sesión reservada <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
    </> : <p className="max-w-2xl text-sm leading-relaxed text-muted">{!available ? 'No podemos mostrar tus días ahora. Puedes consultar Mi semana y los ejemplos de sesión.' : hasPastDays ? 'Los días que reservaste esta semana ya han pasado. Puedes ajustar los que quedan; no damos por hecho que hayas entrenado.' : 'Elige un día para el ejemplo de casa o gimnasio. Tu elección se guarda en tu cuenta y aparecerá aquí cuando vuelvas.'}</p>}
    <p><Link href="/comunidad/mi-semana#sesiones" className="inline-flex min-h-11 items-center text-sm text-accent underline underline-offset-4">{next ? 'Ajustar mis días en Mi semana' : 'Organizar mis días en Mi semana'}</Link></p>
  </section>
}
