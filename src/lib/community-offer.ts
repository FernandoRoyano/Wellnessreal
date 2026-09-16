import { Activity, BookOpen, CalendarCheck, Dumbbell, HeartPulse, MessageCircle, NotebookPen, Salad, Users } from 'lucide-react'

export const FREE_COMMUNITY = {
  label: 'Comunidad gratuita',
  objective: 'Entender lo esencial, dejar de ir a ciegas y poner en marcha una primera semana sostenible.',
  promise: 'Criterio y herramientas para empezar por tu cuenta.',
  includes: ['20 lecciones educativas y prácticas', '4 recursos descargables', 'Foro para preguntar y compartir', 'Recorrido progresivo, sin saturarte'],
  limits: 'Contenido general: no incluye valoración individual, prescripción, ajustes personales ni seguimiento.',
}

export const PREMIUM_PROGRAM = {
  label: 'Método BASE Tiroides',
  objective: 'Convertir los principios en un plan de 12 semanas adaptado a tu situación y revisarlo contigo.',
  promise: 'Precisión, seguimiento y decisiones individuales.',
  includes: ['Valoración previa y admisión personal', 'Plan de entrenamiento y nutrición adaptado', 'Calendario de 12 semanas', 'Revisiones y ajustes periódicos', 'Directos y espacio privado del grupo'],
  limits: 'Programa de entrenamiento y hábitos. No sustituye el diagnóstico, la medicación ni el seguimiento sanitario.',
}

export const FREE_TOPICS = [
  { icon: BookOpen, title: 'Comprender', description: 'Tiroides, analítica, Hashimoto, metabolismo y falsas creencias.' },
  { icon: Dumbbell, title: 'Empezar a entrenar', description: 'Fuerza, rutina inicial, progresión y adaptación en días de cansancio.' },
  { icon: Salad, title: 'Organizar hábitos', description: 'Alimentación práctica, descanso y una semana posible.' },
  { icon: MessageCircle, title: 'No hacerlo sola', description: 'Preguntas, experiencias y apoyo dentro de unos límites claros.' },
] as const

export const PREMIUM_TOPICS = [
  { icon: HeartPulse, title: 'Valoración y punto de partida', description: 'Contexto, capacidad, preferencias, material y limitaciones reales.' },
  { icon: CalendarCheck, title: 'Plan y calendario propios', description: 'Qué hacer, cuándo hacerlo y cómo encajarlo en tu semana.' },
  { icon: Activity, title: 'Progresión y adaptación', description: 'Ajustes según respuesta, energía, técnica y semanas difíciles.' },
  { icon: NotebookPen, title: 'Revisión con datos útiles', description: 'Entrenamiento, recuperación y adherencia vistos con contexto.' },
  { icon: Users, title: 'Acompañamiento', description: 'Directos, espacio privado y decisiones compartidas durante 12 semanas.' },
] as const
