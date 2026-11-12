export const WORKOUT_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] as const
export type WorkoutChoice = '' | 'mancuernas' | 'gimnasio'

export function getWorkoutWeek(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date)
  const part = (name: string) => Number(parts.find(item => item.type === name)?.value)
  const monday = new Date(Date.UTC(part('year'), part('month') - 1, part('day')))
  monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7))
  const dates = WORKOUT_DAYS.map((_, index) => {
    const day = new Date(monday)
    day.setUTCDate(day.getUTCDate() + index)
    return day.toISOString().slice(0, 10)
  })
  const label = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(monday)
  return { start: dates[0], dates, label }
}
