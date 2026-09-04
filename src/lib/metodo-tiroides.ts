import { CalendarCheck, ClipboardCheck, Dumbbell, MessageCircle, Users, Video } from 'lucide-react'

export const THYROID_PROGRAM = {
  name: 'Método BASE Tiroides',
  duration: '12 semanas',
  price: 249,
  groupSize: '8–12 personas',
} as const

export const THYROID_PROGRAM_INCLUDES = [
  { icon: ClipboardCheck, title: 'Evaluación inicial', description: 'Punto de partida, horarios, experiencia, material y limitaciones.' },
  { icon: Dumbbell, title: 'Plan de fuerza adaptado', description: 'Dos o tres días, con alternativas según tu energía y tu semana real.' },
  { icon: CalendarCheck, title: 'Organización sencilla', description: 'Comidas por raciones, descanso y movimiento sin dietas clínicas.' },
  { icon: Video, title: 'Directo semanal', description: '45 minutos para aprender, preguntar y resolver lo que te está frenando.' },
  { icon: MessageCircle, title: 'Revisión cada 3 semanas', description: 'Ajustamos el plan con datos, no por intuición ni por culpa.' },
  { icon: Users, title: 'Grupo privado', description: 'Acompañamiento con personas que están trabajando sobre el mismo contexto.' },
] as const

export const THYROID_PROGRAM_PHASES = [
  {
    weeks: 'Semanas 1–3',
    title: 'Construir la base',
    description: 'Ordenamos tu semana, aprendemos a medir el esfuerzo y dejamos preparada una versión mínima para los días difíciles.',
  },
  {
    weeks: 'Semanas 4–6',
    title: 'Progresar sin agotarte',
    description: 'Subimos carga, repeticiones o control cuando toca y ajustamos comida, movimiento y recuperación a tu respuesta real.',
  },
  {
    weeks: 'Semanas 7–9',
    title: 'Desatascar el proceso',
    description: 'Revisamos adherencia, fuerza, medidas y energía para cambiar la pieza que limita el avance, no todo el plan.',
  },
  {
    weeks: 'Semanas 10–12',
    title: 'Salir con autonomía',
    description: 'Consolidamos lo que funciona y te llevas criterios claros para continuar sin depender siempre de una plantilla.',
  },
] as const
