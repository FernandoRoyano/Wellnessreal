'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getSessionMember, isApproved } from '@/lib/db/comunidad'
import { getWorkoutWeek, type WorkoutChoice } from '@/lib/community-workout-week'
import { saveWorkoutDays } from '@/lib/community-workout-plans'

export interface WorkoutPlanResult {
  ok: boolean
  message: string
  choices?: WorkoutChoice[]
}

const ChoicesSchema = z.array(z.enum(['', 'mancuernas', 'gimnasio'])).length(7)

export async function saveWorkoutPlanAction(_previous: WorkoutPlanResult | null, formData: FormData): Promise<WorkoutPlanResult> {
  const member = await getSessionMember()
  if (!member || !isApproved(member)) return { ok: false, message: 'Necesitas entrar con una cuenta aprobada para guardar tu planificación.' }
  const week = getWorkoutWeek()
  if (formData.get('week_start') !== week.start) return { ok: false, message: 'La semana ha cambiado. Recarga la página antes de guardar.' }
  const parsed = ChoicesSchema.safeParse(formData.getAll('workouts'))
  if (!parsed.success) return { ok: false, message: 'Revisa la sesión elegida para cada uno de los siete días.' }
  try {
    await saveWorkoutDays(member.id, week.dates, parsed.data)
    revalidatePath('/comunidad/mi-semana')
    revalidatePath('/comunidad')
    return { ok: true, message: 'Planificación guardada en tu cuenta.', choices: parsed.data }
  } catch (error) {
    console.error('[comunidad:saveWorkoutPlanAction]', error)
    return { ok: false, message: 'No se ha podido guardar. Tus cambios siguen aquí; vuelve a intentarlo.' }
  }
}
