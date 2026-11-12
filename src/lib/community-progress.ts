import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'

const COOKIE_NAME = 'wr_lesson_progress'

export interface LessonProgress {
  member_id: string
  lesson_id: string
  completed_at: string
}

/** Marcas sin propietario: solo se usan tras confirmar su importación. */
export async function getLegacyLessonIds(): Promise<Set<string>> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(COOKIE_NAME)?.value
  if (!raw) return new Set()

  try {
    const ids: unknown = JSON.parse(raw)
    if (!Array.isArray(ids)) return new Set()
    return new Set(ids.filter((id): id is string => typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)).slice(0, 100))
  } catch {
    return new Set()
  }
}

export async function getCompletedLessonIds(memberId: string): Promise<Set<string>> {
  const { data, error } = await supabase.from('lesson_progress').select('lesson_id').eq('member_id', memberId).limit(1000).returns<Pick<LessonProgress, 'lesson_id'>[]>()
  if (error) throw new Error(`[comunidad:getCompletedLessonIds] ${error.message}`)
  return new Set((data ?? []).map(row => row.lesson_id))
}

export async function saveCompletedLessons(memberId: string, lessonIds: string[]): Promise<void> {
  if (!lessonIds.length) return
  const { error } = await supabase.from('lesson_progress').upsert(
    [...new Set(lessonIds)].map(lessonId => ({ member_id: memberId, lesson_id: lessonId })),
    { onConflict: 'member_id,lesson_id', ignoreDuplicates: true },
  )
  if (error) throw new Error(`[comunidad:saveCompletedLessons] ${error.message}`)
}

export async function setLessonCompletion(memberId: string, lessonId: string, completed: boolean): Promise<void> {
  if (completed) return saveCompletedLessons(memberId, [lessonId])
  const { error } = await supabase.from('lesson_progress').delete().eq('member_id', memberId).eq('lesson_id', lessonId)
  if (error) throw new Error(`[comunidad:setLessonCompletion] ${error.message}`)
}

export async function removeImportedLegacyIds(lessonIds: string[]): Promise<void> {
  const remaining = await getLegacyLessonIds()
  for (const id of lessonIds) remaining.delete(id)

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, JSON.stringify([...remaining]), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: remaining.size ? 60 * 60 * 24 * 365 : 0,
    path: '/comunidad',
  })
}
