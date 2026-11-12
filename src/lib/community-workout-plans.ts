import { supabase } from '@/lib/supabase'
import type { WorkoutChoice } from '@/lib/community-workout-week'

export interface WorkoutDay {
  workout_date: string
  workout_id: Exclude<WorkoutChoice, ''> | null
}

export async function getWorkoutDays(memberId: string, dates: string[]): Promise<{ available: boolean; days: WorkoutDay[] }> {
  const { data, error } = await supabase.from('community_workout_days').select('workout_date,workout_id').eq('member_id', memberId).in('workout_date', dates).returns<WorkoutDay[]>()
  if (error) {
    console.error('[comunidad:getWorkoutDays]', error.message)
    return { available: false, days: [] }
  }
  return { available: true, days: data ?? [] }
}

export async function saveWorkoutDays(memberId: string, dates: string[], choices: WorkoutChoice[]): Promise<void> {
  const rows = dates.map((date, index) => ({ member_id: memberId, workout_date: date, workout_id: choices[index] || null, updated_at: new Date().toISOString() }))
  const { error } = await supabase.from('community_workout_days').upsert(rows, { onConflict: 'member_id,workout_date' })
  if (error) throw new Error(`[comunidad:saveWorkoutDays] ${error.message}`)
}
