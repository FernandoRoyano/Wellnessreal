interface JourneySpace {
  id: string
  slug: string
}

interface JourneyLesson {
  id: string
  slug: string
  locked: boolean
  lockReason: string | null
  daysUntilUnlock: number
}

export function getCommunityJourney<S extends JourneySpace, L extends JourneyLesson>(
  spaces: S[],
  groups: L[][],
  completedIds: ReadonlySet<string>,
) {
  const lessons = spaces.flatMap((space, index) =>
    (groups[index] ?? []).map(lesson => ({ ...lesson, space })),
  )
  const available = lessons.filter(lesson => !lesson.locked)
  const welcome = available.find(lesson => lesson.space.slug === 'empieza-aqui' && lesson.slug === 'lee-esto-primero')
  const firstPractical = available.find(lesson => lesson.space.slug === 'entrena-organizate' && lesson.slug === 'por-que-empezar-con-fuerza')
  const priority = [welcome, firstPractical].filter((lesson): lesson is NonNullable<typeof lesson> => Boolean(lesson))
  const ordered = [...priority, ...available.filter(lesson => !priority.some(item => item.id === lesson.id))]
  const next = ordered.find(lesson => !completedIds.has(lesson.id)) ?? null
  const completedCount = available.filter(lesson => completedIds.has(lesson.id)).length
  const unlockDays = lessons.filter(lesson => lesson.locked && lesson.lockReason === 'drip' && lesson.daysUntilUnlock > 0)
    .map(lesson => lesson.daysUntilUnlock)

  return {
    available,
    welcome: welcome ?? null,
    firstPractical: firstPractical ?? null,
    next,
    completedCount,
    progress: available.length ? Math.round(completedCount / available.length * 100) : 0,
    allAvailableCompleted: available.length > 0 && next === null,
    nextUnlockDays: unlockDays.length ? Math.min(...unlockDays) : null,
  }
}
