import { cookies } from 'next/headers'

const COOKIE_NAME = 'wr_lesson_progress'

export async function getCompletedLessonIds(): Promise<Set<string>> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(COOKIE_NAME)?.value
  if (!raw) return new Set()

  try {
    const ids: unknown = JSON.parse(raw)
    if (!Array.isArray(ids)) return new Set()
    return new Set(ids.filter((id): id is string => typeof id === 'string' && /^[0-9a-f-]{36}$/i.test(id)))
  } catch {
    return new Set()
  }
}

export async function setLessonCompletion(lessonId: string, completed: boolean): Promise<void> {
  const completedIds = await getCompletedLessonIds()
  if (completed) completedIds.add(lessonId)
  else completedIds.delete(lessonId)

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, JSON.stringify([...completedIds]), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 365,
    path: '/comunidad',
  })
}
