import { CalendarCheck, ClipboardCheck, Dumbbell, MessageCircle, Users, Video } from 'lucide-react'

export type ThyroidLaunchPhase = 'priority' | 'applications' | 'closed'

export const THYROID_PROGRAM = {
  name: 'Método BASE Tiroides',
  duration: '12 semanas',
  price: 349,
  installmentPrice: 185,
  installmentCount: 2,
  minimumParticipants: 8,
  capacity: 10,
  groupSize: '8–10 personas',
} as const

export function getThyroidLaunchPhase(): ThyroidLaunchPhase {
  return 'applications'
}

export const THYROID_PROGRAM_INCLUDES = [
  { icon: ClipboardCheck, title: 'Evaluación inicial', description: 'Punto de partida, horarios, experiencia, material y limitaciones.' },
  { icon: Dumbbell, title: 'Plan de fuerza adaptado', description: 'Dos o tres días, con alternativas según tu energía y tu semana real.' },
  { icon: CalendarCheck, title: 'Organización sencilla', description: 'Comidas por raciones, descanso y movimiento sin dietas clínicas.' },
  { icon: Video, title: 'Clases y directos privados', description: 'Contenido por bloques para avanzar a tu ritmo y sesiones en directo cuando estén programadas.' },
  { icon: MessageCircle, title: 'Seguimiento y dos revisiones', description: 'Check-in semanal y dos encuentros individuales para decidir qué mantener y qué ajustar.' },
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

export const THYROID_WEEKLY_RHYTHM = [
  {
    step: '01',
    title: 'Sabes qué toca',
    description: 'Empiezas la semana con tu plan, sus alternativas y una versión mínima preparada para los días difíciles.',
  },
  {
    step: '02',
    title: 'Entrenas y registras',
    description: 'Realizas dos o tres sesiones y anotas lo necesario: carga, repeticiones, esfuerzo, energía y molestias.',
  },
  {
    step: '03',
    title: 'Haces un check-in breve',
    description: 'Compartes qué pudiste cumplir, cómo has recuperado y qué obstáculo merece atención esa semana.',
  },
  {
    step: '04',
    title: 'Revisamos y decides',
    description: 'En el check-in y las revisiones convertimos esos datos en una decisión: mantener, reducir o progresar.',
  },
] as const

export const THYROID_PROGRAM_WEEKS = [
  { week: 1, title: 'Punto de partida', outcome: 'Colocar dos sesiones reales en el calendario.' },
  { week: 2, title: 'Técnica y esfuerzo', outcome: 'Obtener las primeras cargas de referencia.' },
  { week: 3, title: 'Semana difícil', outcome: 'Dejar preparada tu sesión mínima.' },
  { week: 4, title: 'Primera revisión', outcome: 'Aprobar el segundo bloque y su progresión.' },
  { week: 5, title: 'Comidas que se repiten', outcome: 'Definir dos comidas base aplicables.' },
  { week: 6, title: 'Recuperación con contexto', outcome: 'Elegir una mejora concreta de recuperación.' },
  { week: 7, title: 'Volver sin empezar de cero', outcome: 'Crear tu protocolo personal para retomar.' },
  { week: 8, title: 'Carga bien distribuida', outcome: 'Equilibrar volumen, intensidad y disponibilidad.' },
  { week: 9, title: 'Segunda revisión', outcome: 'Detectar el límite principal y aprobar el último bloque.' },
  { week: 10, title: 'Decidir con criterio', outcome: 'Definir cuándo mantener, reducir o progresar.' },
  { week: 11, title: 'Semanas fuera de rutina', outcome: 'Preparar un plan de contingencia realista.' },
  { week: 12, title: 'Autonomía', outcome: 'Salir con un plan de continuidad de cuatro semanas.' },
] as const
