export const COMMUNITY_LEARNING_ROUTES = [
  {
    id: 'empezar', title: 'Empiezo',
    description: 'Entender la fuerza y conocer un primer ejemplo antes de llevarlo a la práctica.',
    steps: [
      { space: 'empieza-aqui', slug: 'lee-esto-primero' },
      { space: 'entrena-organizate', slug: 'por-que-empezar-con-fuerza' },
      { space: 'entrena-organizate', slug: 'primera-rutina-fuerza' },
    ],
    action: 'Reserva un momento para leer o preparar material y deja prevista una alternativa. Leer una rutina no te obliga a realizarla hoy.',
    resource: 'Planificador semanal', file: 'planificador-semanal-tiroides.pdf',
  },
  {
    id: 'retomar', title: 'Retomo',
    description: 'Revisar el esfuerzo y los criterios de progresión después de un tiempo sin continuidad.',
    steps: [
      { space: 'empieza-aqui', slug: 'lee-esto-primero' },
      { space: 'entrena-organizate', slug: 'entrenar-cuando-estas-cansada' },
      { space: 'entrena-organizate', slug: 'progresar-sin-agotarte' },
    ],
    action: 'Anota qué has podido hacer y qué necesitas revisar antes de aumentar la exigencia. El registro organiza observaciones; no determina si un síntoma permite entrenar.',
    resource: 'Registro semanal', file: 'registro-semanal-tiroides.pdf',
  },
  {
    id: 'organizar', title: 'Quiero organizarme',
    description: 'Encontrar momentos posibles y preparar una alternativa para las semanas que se complican.',
    steps: [
      { space: 'empieza-aqui', slug: 'lee-esto-primero' },
      { space: 'entrena-organizate', slug: 'organizar-dos-dias' },
      { space: 'entrena-organizate', slug: 'que-hacer-mala-semana' },
    ],
    action: 'Elige dos momentos posibles en tu calendario y una alternativa. Puedes dedicarlos a aprender u organizarte; no son una prescripción de entrenamiento.',
    resource: 'Planificador semanal', file: 'planificador-semanal-tiroides.pdf',
  },
] as const

export type LearningRoute = typeof COMMUNITY_LEARNING_ROUTES[number]

export function getLearningRoute(value: unknown): LearningRoute | undefined {
  return typeof value === 'string' ? COMMUNITY_LEARNING_ROUTES.find(route => route.id === value) : undefined
}

interface LearningLesson {
  id: string
  slug: string
  title: string
  locked: boolean
  daysUntilUnlock: number
  access_tier: string
  space: { slug: string }
}

export function getLearningRouteProgress(route: LearningRoute, lessons: readonly LearningLesson[], completedIds: ReadonlySet<string>) {
  const steps = route.steps.map(step => {
    const lesson = lessons.find(item => item.access_tier === 'free' && item.space.slug === step.space && item.slug === step.slug)
    return { ...step, lesson, completed: Boolean(lesson && !lesson.locked && completedIds.has(lesson.id)) }
  })
  const completedCount = steps.filter(step => step.completed).length
  return { steps, completedCount, next: steps.find(step => !step.completed) ?? null, complete: completedCount === steps.length }
}
