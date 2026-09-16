import { supabase } from '@/lib/supabase'

export interface CommunityCheckin {
  id: string
  member_id: string
  week_start: string
  energy: number
  sleep: number
  confidence: number
  training_sessions: number
  note: string | null
  creado_en: string
  actualizado_en: string
}

export function currentWeekStart(date = new Date()): string {
  const utc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  const day = utc.getUTCDay() || 7
  utc.setUTCDate(utc.getUTCDate() - day + 1)
  return utc.toISOString().slice(0, 10)
}

export async function getLatestCheckin(memberId: string): Promise<CommunityCheckin | null> {
  const { data, error } = await supabase.from('community_checkins').select('*').eq('member_id', memberId).order('week_start', { ascending: false }).limit(1).maybeSingle()
  if (error) {
    console.error('[comunidad:getLatestCheckin]', error.message)
    return null
  }
  return data as CommunityCheckin | null
}

export async function saveWeeklyCheckin(input: Omit<CommunityCheckin, 'id' | 'creado_en' | 'actualizado_en'>): Promise<void> {
  const { error } = await supabase.from('community_checkins').upsert({ ...input, actualizado_en: new Date().toISOString() }, { onConflict: 'member_id,week_start' })
  if (error) throw new Error(`[comunidad:saveWeeklyCheckin] ${error.message}`)
}

export async function getFavoriteLessonIds(memberId: string): Promise<Set<string>> {
  const { data, error } = await supabase.from('lesson_favorites').select('lesson_id').eq('member_id', memberId)
  if (error) {
    console.error('[comunidad:getFavoriteLessonIds]', error.message)
    return new Set()
  }
  return new Set((data ?? []).map((row) => row.lesson_id as string))
}

export async function setLessonFavorite(memberId: string, lessonId: string, favorite: boolean): Promise<void> {
  const query = favorite
    ? supabase.from('lesson_favorites').upsert({ member_id: memberId, lesson_id: lessonId })
    : supabase.from('lesson_favorites').delete().eq('member_id', memberId).eq('lesson_id', lessonId)
  const { error } = await query
  if (error) throw new Error(`[comunidad:setLessonFavorite] ${error.message}`)
}

export async function getLessonFeedback(memberId: string, lessonId: string): Promise<boolean | null> {
  const { data, error } = await supabase.from('lesson_feedback').select('helpful').eq('member_id', memberId).eq('lesson_id', lessonId).maybeSingle()
  if (error) {
    console.error('[comunidad:getLessonFeedback]', error.message)
    return null
  }
  return typeof data?.helpful === 'boolean' ? data.helpful : null
}

export async function setLessonFeedback(memberId: string, lessonId: string, helpful: boolean): Promise<void> {
  const { error } = await supabase.from('lesson_feedback').upsert({ member_id: memberId, lesson_id: lessonId, helpful, actualizado_en: new Date().toISOString() }, { onConflict: 'member_id,lesson_id' })
  if (error) throw new Error(`[comunidad:setLessonFeedback] ${error.message}`)
}
