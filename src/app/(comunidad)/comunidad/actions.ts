'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { EmailOtpType } from '@supabase/supabase-js'
import { z } from 'zod'
import { createServerSupabase } from '@/lib/supabase-ssr'
import { supabaseConfigStatus } from '@/lib/supabase-env'
import {
  getSessionMember,
  updateMemberProfile,
  ensureMemberProfile,
  memberCanAccessLesson,
  getSpaces,
  getLessons,
} from '@/lib/db/comunidad'
import { getCompletedLessonIds, getLegacyLessonIds, removeImportedLegacyIds, saveCompletedLessons, setLessonCompletion } from '@/lib/community-progress'
import { parseCommunityTracking } from '@/lib/community-tracking'
import { recordThyroidFunnelEvent } from '@/lib/db/thyroid-funnel'
import { safeInternalPath } from '@/lib/safe-redirect'
import { currentWeekStart, saveWeeklyCheckin, setLessonFavorite, setLessonFeedback } from '@/lib/community-tools'

export interface CommunityToolResult {
  ok: boolean
  message: string
}

const CheckinSchema = z.object({
  energy: z.coerce.number().int().min(1).max(5),
  sleep: z.coerce.number().int().min(1).max(5),
  confidence: z.coerce.number().int().min(1).max(5),
  training_sessions: z.coerce.number().int().min(0).max(7),
  note: z.string().trim().max(600).optional(),
})

const LessonToolSchema = z.object({
  lesson_id: z.string().uuid(),
  value: z.enum(['true', 'false']),
})

export interface MagicLinkResult {
  ok: boolean
  error?: string
  email?: string
}

/**
 * Envía un magic link al email para entrar en la comunidad.
 * El enlace apunta a /comunidad/confirmar (no a una API que canjea el
 * código en el GET automático) para que un escáner de seguridad de email
 * que previsita el enlace no consuma el código de un solo uso antes de
 * que el usuario haga clic de verdad.
 */
export async function requestMagicLink(
  _prev: MagicLinkResult | null,
  formData: FormData
): Promise<MagicLinkResult> {
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase()

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Introduce un email válido.' }
  }

  const cfg = supabaseConfigStatus()
  if (!cfg.ok) {
    console.error('[comunidad:magicLink] Config Supabase ausente:', cfg.missing.join(', '))
    return { ok: false, error: 'La comunidad no está configurada todavía. Avísanos.' }
  }

  try {
    const headerList = await headers()
    const origin =
      process.env.NEXT_PUBLIC_BASE_URL ??
      `${headerList.get('x-forwarded-proto') ?? 'https'}://${headerList.get('host')}`

    const supabase = await createServerSupabase()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/comunidad/confirmar?next=${encodeURIComponent(safeInternalPath(String(formData.get('next') ?? ''), '/comunidad'))}`,
        shouldCreateUser: true,
      },
    })

    if (error) {
      console.error('[comunidad:magicLink]', error.message)
      const cooldown = error.message.match(/after (\d+) seconds?/i)
      const esRate = /rate limit|too many|429/i.test(error.message)
      return {
        ok: false,
        error: cooldown
          ? `Por seguridad, espera ${cooldown[1]} segundos antes de pedir otro enlace.`
          : esRate
            ? 'Hay demasiados intentos en este momento. Espera unos minutos y vuelve a pedir el enlace.'
            : 'No se pudo enviar el enlace. Inténtalo en unos minutos o escribe a info@wellnessreal.es.',
      }
    }

    const tracking = parseCommunityTracking(formData.get('_community_tracking'))
    if (tracking) await recordThyroidFunnelEvent({ eventName: 'community_access_requested', ...tracking })
      .catch(error => console.error('[comunidad:accessTracking]', error))
    return { ok: true, email }
  } catch (err) {
    console.error('[comunidad:magicLink:throw]', err)
    return { ok: false, error: 'Error al enviar el enlace. Inténtalo en un momento.' }
  }
}

export interface ConfirmResult {
  ok: boolean
  error?: string
}

/**
 * Canjea el code/token_hash del magic link por una sesión. Se dispara solo
 * con un clic explícito del usuario en /comunidad/confirmar (ver comentario
 * en requestMagicLink) — nunca en el GET que abre la página.
 */
export async function confirmMagicLink(
  _prev: ConfirmResult | null,
  formData: FormData
): Promise<ConfirmResult> {
  const code = String(formData.get('code') ?? '')
  const tokenHash = String(formData.get('token_hash') ?? '')
  const type = String(formData.get('type') ?? '') as EmailOtpType | ''
  const next = safeInternalPath(String(formData.get('next') ?? ''), '/comunidad')

  if (!code && !(tokenHash && type)) {
    return { ok: false, error: 'Enlace inválido o incompleto. Pide uno nuevo.' }
  }

  const supabase = await createServerSupabase()

  const tracking = parseCommunityTracking(formData.get('_community_tracking'))
  let userId: string | null = null
  let authError: string | null = null

  try {
    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      userId = data?.user?.id ?? null
      authError = error?.message ?? null
      if (data?.user) {
        await ensureMemberProfile(data.user, tracking).catch((err) =>
          console.error('[comunidad:confirmMagicLink:ensureMemberProfile]', err)
        )
      }
    } else {
      const { data, error } = await supabase.auth.verifyOtp({ type: type as EmailOtpType, token_hash: tokenHash })
      userId = data?.user?.id ?? null
      authError = error?.message ?? null
      if (data?.user) {
        await ensureMemberProfile(data.user, tracking).catch((err) =>
          console.error('[comunidad:confirmMagicLink:ensureMemberProfile]', err)
        )
      }
    }
  } catch (err) {
    console.error('[comunidad:confirmMagicLink:throw]', err)
    return { ok: false, error: 'No se pudo confirmar el acceso. Inténtalo de nuevo en un momento.' }
  }

  if (authError || !userId) {
    console.error('[comunidad:confirmMagicLink]', authError)
    return {
      ok: false,
      error: 'El enlace ha caducado o ya se ha usado. Pide uno nuevo para continuar.',
    }
  }

  revalidatePath('/comunidad')
  redirect(next)
}

/** Actualiza el perfil del miembro logueado. */
export async function updateProfileAction(formData: FormData) {
  const member = await getSessionMember()
  if (!member) redirect('/comunidad/entrar')

  const display_name = String(formData.get('display_name') ?? '').trim()
  const bio = String(formData.get('bio') ?? '').trim()
  const birth_date = String(formData.get('birth_date') ?? '').trim()
  const gender = String(formData.get('gender') ?? '').trim()
  const location = String(formData.get('location') ?? '').trim()
  if (!display_name) return

  try {
    await updateMemberProfile(member.id, {
      display_name,
      bio: bio || null,
      birth_date: birth_date || null,
      gender: gender || null,
      location: location || null,
    })
  } catch (err) {
    console.error('[comunidad:updateProfile]', err)
    const detalle = err instanceof Error ? err.message : String(err)
    // Causa típica: falta la migración que añade birth_date/gender/location.
    const faltaColumna = /column .* does not exist|schema cache/i.test(detalle)
    redirect(`/comunidad/perfil?error=${faltaColumna ? 'schema' : 'save'}`)
  }

  revalidatePath('/comunidad')
  revalidatePath('/comunidad/perfil')
  redirect('/comunidad')
}

/** Cierra la sesión del miembro y vuelve a la pantalla de entrada. */
export async function signOut() {
  const supabase = await createServerSupabase()
  await supabase.auth.signOut()
  redirect('/comunidad/entrar')
}

/** Marca o desmarca una lección como completada. */
export async function setLessonCompletionAction(_previous: CommunityToolResult | null, formData: FormData): Promise<CommunityToolResult> {
  const member = await getSessionMember()
  if (!member) return { ok: false, message: 'Tu sesión ha caducado. Vuelve a entrar.' }
  const parsed = z.object({ lesson_id: z.string().uuid(), completed: z.enum(['true', 'false']) }).safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, message: 'No se ha podido identificar la lección o el cambio.' }
  const lessonId = parsed.data.lesson_id
  const completed = parsed.data.completed === 'true'
  if (!(await memberCanAccessLesson(member, lessonId))) return { ok: false, message: 'No tienes acceso a esta lección.' }
  try {
    const previous = await getCompletedLessonIds(member.id)
    await setLessonCompletion(member.id, lessonId, completed)
    const tracking = parseCommunityTracking(formData.get('_community_tracking'))
    if (completed && previous.size === 0 && tracking) {
      await recordThyroidFunnelEvent({ eventName: 'community_first_lesson_completed', ...tracking,
        email: member.email, externalId: `community:first-lesson:${member.id}`,
      }).catch(error => console.error('[comunidad:completionTracking]', error))
    }
    revalidatePath('/comunidad', 'layout')
    return { ok: true, message: completed ? 'Avance guardado en tu cuenta.' : 'Lección marcada como pendiente en tu cuenta.' }
  } catch (error) {
    console.error('[comunidad:setLessonCompletionAction]', error)
    return { ok: false, message: 'No se ha podido guardar tu avance. Inténtalo de nuevo.' }
  }
}

export async function importLegacyProgressAction(): Promise<CommunityToolResult> {
  const member = await getSessionMember()
  if (!member) return { ok: false, message: 'Tu sesión ha caducado. Vuelve a entrar.' }
  try {
    const legacy = await getLegacyLessonIds()
    const spaces = (await getSpaces(member)).filter(space => space.type === 'content')
    const groups = await Promise.all(spaces.map(space => getLessons(space.id, member)))
    const ids = groups.flat().filter(lesson => !lesson.locked && legacy.has(lesson.id)).map(lesson => lesson.id)
    if (!ids.length) return { ok: false, message: 'No hay marcas antiguas de lecciones disponibles para añadir.' }
    await saveCompletedLessons(member.id, ids)
    await removeImportedLegacyIds(ids)
    revalidatePath('/comunidad', 'layout')
    return { ok: true, message: 'Las marcas se han añadido a tu cuenta.' }
  } catch (error) {
    console.error('[comunidad:importLegacyProgressAction]', error)
    return { ok: false, message: 'No se han podido añadir las marcas. Se conservan en este navegador para volver a intentarlo.' }
  }
}

export async function saveWeeklyCheckinAction(_previous: CommunityToolResult | null, formData: FormData): Promise<CommunityToolResult> {
  const member = await getSessionMember()
  if (!member) return { ok: false, message: 'Tu sesión ha caducado. Vuelve a entrar.' }

  const parsed = CheckinSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, message: 'Revisa los valores antes de guardar.' }

  try {
    await saveWeeklyCheckin({ member_id: member.id, week_start: currentWeekStart(), ...parsed.data, note: parsed.data.note || null })
    revalidatePath('/comunidad/mi-semana')
    return { ok: true, message: 'Semana guardada. Ya tienes un punto de partida para decidir.' }
  } catch (error) {
    console.error('[comunidad:saveWeeklyCheckinAction]', error)
    return { ok: false, message: 'No se ha podido guardar. Inténtalo de nuevo en un momento.' }
  }
}

export async function setLessonFavoriteAction(_previous: CommunityToolResult | null, formData: FormData): Promise<CommunityToolResult> {
  const member = await getSessionMember()
  if (!member) return { ok: false, message: 'Tu sesión ha caducado.' }
  const parsed = LessonToolSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, message: 'No se ha podido identificar la lección.' }
  if (!(await memberCanAccessLesson(member, parsed.data.lesson_id))) return { ok: false, message: 'No tienes acceso a esta lección.' }
  try {
    await setLessonFavorite(member.id, parsed.data.lesson_id, parsed.data.value === 'true')
    revalidatePath('/comunidad', 'layout')
    return { ok: true, message: parsed.data.value === 'true' ? 'Guardada para volver después.' : 'Eliminada de tus guardados.' }
  } catch (error) {
    console.error('[comunidad:setLessonFavoriteAction]', error)
    return { ok: false, message: 'No se ha podido actualizar el guardado.' }
  }
}

export async function setLessonFeedbackAction(_previous: CommunityToolResult | null, formData: FormData): Promise<CommunityToolResult> {
  const member = await getSessionMember()
  if (!member) return { ok: false, message: 'Tu sesión ha caducado.' }
  const parsed = LessonToolSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { ok: false, message: 'No se ha podido identificar la lección.' }
  if (!(await memberCanAccessLesson(member, parsed.data.lesson_id))) return { ok: false, message: 'No tienes acceso a esta lección.' }
  try {
    await setLessonFeedback(member.id, parsed.data.lesson_id, parsed.data.value === 'true')
    revalidatePath('/comunidad/[space]/[slug]', 'page')
    return { ok: true, message: 'Gracias. Esta respuesta servirá para mejorar la lección.' }
  } catch (error) {
    console.error('[comunidad:setLessonFeedbackAction]', error)
    return { ok: false, message: 'No se ha podido guardar tu respuesta.' }
  }
}
