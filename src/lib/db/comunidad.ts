import { supabase } from '@/lib/supabase'
import { createServerSupabase } from '@/lib/supabase-ssr'
import { supabaseConfigStatus } from '@/lib/supabase-env'
import { sendEmail } from '@/lib/email'
import type { User } from '@supabase/supabase-js'

// ============================================================
//  Comunidad · capa de datos
//  Identidad: sesión de Supabase Auth (magic link) vía @supabase/ssr.
//  Datos: cliente service-role (salta RLS), autorizando por member.id.
// ============================================================

export interface MemberProfile {
  id: string
  creado_en: string
  email: string
  display_name: string
  avatar_url: string | null
  bio: string | null
  role: 'member' | 'mod' | 'admin'
  cliente_id: string | null
  last_seen_at: string | null
  birth_date: string | null
  gender: string | null
  location: string | null
  /** 'pending' (solicitó acceso) | 'approved' (puede entrar) | 'blocked' */
  status: 'pending' | 'approved' | 'blocked'
}

/** Solo los aprobados pueden ver contenido, foro y participar. */
export function isApproved(member: MemberProfile | null): boolean {
  return member?.status === 'approved'
}

export interface OnlineMember {
  id: string
  display_name: string
  avatar_url: string | null
}

const ONLINE_MINUTES = 5

/** Marca al miembro como activo ahora (para "en línea"). No bloquea si falla. */
export async function touchMember(memberId: string): Promise<void> {
  try {
    await supabase
      .from('member_profiles')
      .update({ last_seen_at: new Date().toISOString() })
      .eq('id', memberId)
  } catch {
    // silencioso: la última actividad no es crítica
  }
}

/** Miembros activos en los últimos ONLINE_MINUTES minutos. */
export async function getOnlineMembers(excludeId?: string): Promise<OnlineMember[]> {
  const since = new Date(Date.now() - ONLINE_MINUTES * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('member_profiles')
    .select('id, display_name, avatar_url')
    .eq('status', 'approved')
    .gte('last_seen_at', since)
    .order('last_seen_at', { ascending: false })
    .limit(50)
  if (error) {
    console.error('[comunidad:getOnlineMembers]', error.message)
    return []
  }
  const rows = (data ?? []) as OnlineMember[]
  return excludeId ? rows.filter((m) => m.id !== excludeId) : rows
}

/** Nombre por defecto a partir del email (parte antes de la @). */
function defaultDisplayName(email: string): string {
  const local = email.split('@')[0] ?? 'miembro'
  return local.replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Crea el perfil del miembro si no existe (primer login). Idempotente.
 * Se llama desde el callback del magic link.
 */
export async function ensureMemberProfile(user: User): Promise<MemberProfile> {
  const email = user.email ?? ''

  const { data: existing } = await supabase
    .from('member_profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (existing) return existing as MemberProfile

  const { data, error } = await supabase
    .from('member_profiles')
    .insert({
      id: user.id,
      email,
      display_name: defaultDisplayName(email),
    })
    .select('*')
    .single()

  if (error) throw new Error(`[comunidad:ensureMemberProfile] ${error.message}`)

  // Aviso de "solicitud recibida". Se espera (serverless congela las promesas
  // sueltas) pero nunca bloquea el alta si el email falla.
  try {
    await sendRequestReceivedEmail(email, (data as MemberProfile).display_name)
  } catch (err) {
    console.error('[comunidad:ensureMemberProfile] email de solicitud falló:', err)
  }

  return data as MemberProfile
}

const BASE_URL = () => process.env.NEXT_PUBLIC_BASE_URL ?? 'https://wellnessreal.es'

function emailShell(inner: string): string {
  return `<div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;color:#1a1a1a">${inner}<p style="color:#666;font-size:14px">Un abrazo,<br/>Fernando · WellnessReal</p></div>`
}

/** Al registrarse: la solicitud queda pendiente de aprobación. */
async function sendRequestReceivedEmail(email: string, name: string): Promise<void> {
  await sendEmail({
    to: email,
    subject: 'Hemos recibido tu solicitud · Comunidad Tiroides',
    html: emailShell(`
      <h1 style="font-size:22px">Hola ${name}, gracias por apuntarte</h1>
      <p>He recibido tu solicitud para entrar en la comunidad de tiroides. La reviso
      personalmente para mantenerla como un espacio seguro y de confianza.</p>
      <p>En cuanto la apruebe te aviso por email y ya podrás entrar. No suele tardar.</p>
    `),
  })
}

/** Al aprobar: ya puede entrar. */
async function sendApprovedEmail(email: string, name: string): Promise<void> {
  await sendEmail({
    to: email,
    subject: '¡Ya puedes entrar en la comunidad! 💛',
    html: emailShell(`
      <h1 style="font-size:22px">Hola ${name}, ya estás dentro</h1>
      <p>He aprobado tu acceso a la comunidad de tiroides. Aquí vas a encontrar contenido
      paso a paso y un foro para preguntar sin miedo, con gente que entiende por lo que pasas.</p>
      <p style="margin:28px 0">
        <a href="${BASE_URL()}/comunidad" style="background:#fcee21;color:#16122b;padding:12px 24px;border-radius:9999px;text-decoration:none;font-weight:700">
          Entrar en la comunidad
        </a>
      </p>
    `),
  })
}

/** Cambia el estado del miembro (admin). Avisa por email al aprobar. */
export async function setMemberStatus(
  memberId: string,
  status: 'pending' | 'approved' | 'blocked'
): Promise<void> {
  const { data: before } = await supabase
    .from('member_profiles')
    .select('status, email, display_name')
    .eq('id', memberId)
    .maybeSingle()

  const { error } = await supabase
    .from('member_profiles')
    .update({ status })
    .eq('id', memberId)
  if (error) throw new Error(`[comunidad:setMemberStatus] ${error.message}`)

  // Solo avisamos cuando pasa a aprobado por primera vez.
  // IMPORTANTE: hay que esperar el envío. En serverless (Vercel) la función se
  // congela al responder y una promesa suelta nunca llegaría a enviarse.
  if (status === 'approved' && before && before.status !== 'approved') {
    try {
      await sendApprovedEmail(before.email as string, before.display_name as string)
    } catch (err) {
      // No tumbamos la aprobación por un fallo de email, pero lo registramos.
      console.error('[comunidad:setMemberStatus] email de aprobación falló:', err)
    }
  }
}

/**
 * Devuelve el perfil del miembro logueado (o null si no hay sesión).
 * Verifica la sesión con getUser() (valida el token contra Supabase Auth).
 */
export async function getSessionMember(): Promise<MemberProfile | null> {
  // Sin config de Supabase Auth tratamos al visitante como no logueado en vez
  // de reventar la página (evita 500 si falta una env var).
  if (!supabaseConfigStatus().ok) {
    return null
  }

  let user: { id: string } | null = null
  try {
    const authClient = await createServerSupabase()
    const result = await authClient.auth.getUser()
    user = result.data.user
  } catch {
    return null
  }

  if (!user) return null

  // Si las tablas aún no existen (migraciones sin ejecutar) o la consulta falla,
  // degradamos a "sin sesión" en vez de reventar la página con un 500.
  try {
    const { data, error } = await supabase
      .from('member_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (error) {
      console.error('[comunidad:getSessionMember]', error.message)
      return null
    }
    return (data as MemberProfile) ?? null
  } catch (err) {
    console.error('[comunidad:getSessionMember]', err)
    return null
  }
}

/** Todos los miembros (para el admin: saber quiénes son). */
export async function getMembersAdmin(): Promise<MemberProfile[]> {
  const { data, error } = await supabase
    .from('member_profiles')
    .select('*')
    .order('creado_en', { ascending: false })
  if (error) throw new Error(`[comunidad:getMembersAdmin] ${error.message}`)
  return (data ?? []) as MemberProfile[]
}

/** Actualiza los datos editables del perfil del miembro. */
export async function updateMemberProfile(
  memberId: string,
  patch: {
    display_name?: string
    bio?: string | null
    avatar_url?: string | null
    birth_date?: string | null
    gender?: string | null
    location?: string | null
  }
): Promise<void> {
  const { error } = await supabase.from('member_profiles').update(patch).eq('id', memberId)
  if (error) throw new Error(`[comunidad:updateMemberProfile] ${error.message}`)
}

// ============================================================
//  Contenido: espacios y lecciones (con drip + tier)
// ============================================================

export interface Space {
  id: string
  creado_en: string
  slug: string
  name: string
  description: string | null
  icon: string | null
  type: 'content' | 'forum'
  sort_order: number
  access_tier: string
  published: boolean
}

export interface Lesson {
  id: string
  creado_en: string
  space_id: string
  slug: string
  title: string
  content: string
  cover_url: string | null
  sort_order: number
  drip_days: number
  access_tier: string
  published: boolean
}

/** Lección con el estado de bloqueo ya resuelto para un miembro concreto. */
export interface LessonWithLock extends Lesson {
  locked: boolean
  lockReason: 'drip' | 'tier' | null
  daysUntilUnlock: number
}

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Por ahora todos los miembros son tier 'free'. Cuando exista premium, aquí
 * se comprobará el tier real del miembro (Stripe / campo en member_profiles).
 */
function memberHasTier(_member: MemberProfile | null, tier: string): boolean {
  return tier === 'free'
}

/** Resuelve el bloqueo de una lección (drip + tier) para un miembro. */
function resolveLock(lesson: Lesson, member: MemberProfile | null): LessonWithLock {
  // Gate por nivel de acceso (premium en el futuro).
  if (!memberHasTier(member, lesson.access_tier)) {
    return { ...lesson, locked: true, lockReason: 'tier', daysUntilUnlock: 0 }
  }

  // Gate por drip: desbloqueo N días tras el registro del miembro.
  if (lesson.drip_days > 0 && member) {
    const unlockAt = new Date(member.creado_en).getTime() + lesson.drip_days * DAY_MS
    const now = Date.now()
    if (now < unlockAt) {
      const days = Math.ceil((unlockAt - now) / DAY_MS)
      return { ...lesson, locked: true, lockReason: 'drip', daysUntilUnlock: days }
    }
  }

  return { ...lesson, locked: false, lockReason: null, daysUntilUnlock: 0 }
}

export async function getSpaces(): Promise<Space[]> {
  const { data, error } = await supabase
    .from('spaces')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })

  if (error) throw new Error(`[comunidad:getSpaces] ${error.message}`)
  return (data ?? []) as Space[]
}

export interface SpaceOverview extends Space {
  itemCount: number
}

/** Espacios publicados + nº de elementos (lecciones si content, hilos si forum). */
export async function getSpacesOverview(): Promise<SpaceOverview[]> {
  const spaces = await getSpaces()
  if (spaces.length === 0) return []

  const [{ data: lessonsRows }, { data: threadsRows }] = await Promise.all([
    supabase.from('lessons').select('space_id').eq('published', true),
    supabase.from('threads').select('space_id'),
  ])

  const lessonBy = new Map<string, number>()
  for (const r of lessonsRows ?? [])
    lessonBy.set(r.space_id as string, (lessonBy.get(r.space_id as string) ?? 0) + 1)
  const threadBy = new Map<string, number>()
  for (const r of threadsRows ?? [])
    threadBy.set(r.space_id as string, (threadBy.get(r.space_id as string) ?? 0) + 1)

  return spaces.map((s) => ({
    ...s,
    itemCount: s.type === 'forum' ? (threadBy.get(s.id) ?? 0) : (lessonBy.get(s.id) ?? 0),
  }))
}

export async function getSpace(slug: string): Promise<Space | null> {
  const { data, error } = await supabase
    .from('spaces')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()

  if (error) throw new Error(`[comunidad:getSpace] ${error.message}`)
  return (data as Space) ?? null
}

/** Lecciones publicadas de un espacio, con el bloqueo resuelto para el miembro. */
export async function getLessons(
  spaceId: string,
  member: MemberProfile | null
): Promise<LessonWithLock[]> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('space_id', spaceId)
    .eq('published', true)
    .order('sort_order', { ascending: true })

  if (error) throw new Error(`[comunidad:getLessons] ${error.message}`)
  return (data ?? []).map((l) => resolveLock(l as Lesson, member))
}

/** Una lección por slug dentro de un espacio, con bloqueo resuelto. */
export async function getLesson(
  spaceId: string,
  slug: string,
  member: MemberProfile | null
): Promise<LessonWithLock | null> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('space_id', spaceId)
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()

  if (error) throw new Error(`[comunidad:getLesson] ${error.message}`)
  if (!data) return null
  return resolveLock(data as Lesson, member)
}

// ============================================================
//  Admin: CRUD de espacios y lecciones (sin bloqueo, todo visible)
// ============================================================

/** Convierte texto en un slug url-safe. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function getSpacesAdmin(): Promise<Space[]> {
  const { data, error } = await supabase
    .from('spaces')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw new Error(`[comunidad:getSpacesAdmin] ${error.message}`)
  return (data ?? []) as Space[]
}

export async function getSpaceByIdAdmin(id: string): Promise<Space | null> {
  const { data, error } = await supabase.from('spaces').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(`[comunidad:getSpaceByIdAdmin] ${error.message}`)
  return (data as Space) ?? null
}

export async function createSpace(input: Partial<Space>): Promise<Space> {
  const { data, error } = await supabase
    .from('spaces')
    .insert({
      slug: input.slug,
      name: input.name,
      description: input.description ?? null,
      icon: input.icon ?? null,
      type: input.type ?? 'content',
      sort_order: input.sort_order ?? 0,
      access_tier: input.access_tier ?? 'free',
      published: input.published ?? true,
    })
    .select('*')
    .single()
  if (error) throw new Error(`[comunidad:createSpace] ${error.message}`)
  return data as Space
}

export async function updateSpace(id: string, patch: Partial<Space>): Promise<Space> {
  const { data, error } = await supabase
    .from('spaces')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw new Error(`[comunidad:updateSpace] ${error.message}`)
  return data as Space
}

export async function deleteSpace(id: string): Promise<void> {
  const { error } = await supabase.from('spaces').delete().eq('id', id)
  if (error) throw new Error(`[comunidad:deleteSpace] ${error.message}`)
}

export async function getLessonsAdmin(spaceId: string): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('space_id', spaceId)
    .order('sort_order', { ascending: true })
  if (error) throw new Error(`[comunidad:getLessonsAdmin] ${error.message}`)
  return (data ?? []) as Lesson[]
}

export async function getLessonAdmin(id: string): Promise<Lesson | null> {
  const { data, error } = await supabase.from('lessons').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(`[comunidad:getLessonAdmin] ${error.message}`)
  return (data as Lesson) ?? null
}

export async function createLesson(input: Partial<Lesson>): Promise<Lesson> {
  const { data, error } = await supabase
    .from('lessons')
    .insert({
      space_id: input.space_id,
      slug: input.slug,
      title: input.title,
      content: input.content ?? '',
      cover_url: input.cover_url ?? null,
      sort_order: input.sort_order ?? 0,
      drip_days: input.drip_days ?? 0,
      access_tier: input.access_tier ?? 'free',
      published: input.published ?? true,
    })
    .select('*')
    .single()
  if (error) throw new Error(`[comunidad:createLesson] ${error.message}`)
  return data as Lesson
}

export async function updateLesson(id: string, patch: Partial<Lesson>): Promise<Lesson> {
  const { data, error } = await supabase
    .from('lessons')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw new Error(`[comunidad:updateLesson] ${error.message}`)
  return data as Lesson
}

export async function deleteLesson(id: string): Promise<void> {
  const { error } = await supabase.from('lessons').delete().eq('id', id)
  if (error) throw new Error(`[comunidad:deleteLesson] ${error.message}`)
}

// ============================================================
//  Foro: hilos, comentarios y likes
// ============================================================

interface AuthorRef {
  display_name: string
  avatar_url: string | null
}

export interface ThreadListItem {
  id: string
  creado_en: string
  actualizado_en: string
  title: string
  body: string
  pinned: boolean
  author: AuthorRef | null
  author_id: string
  comment_count: number
  like_count: number
  liked_by_me: boolean
}

export interface CommentNode {
  id: string
  creado_en: string
  body: string
  author: AuthorRef | null
  author_id: string
  parent_id: string | null
  like_count: number
  liked_by_me: boolean
  replies: CommentNode[]
}

export interface ThreadDetail {
  id: string
  creado_en: string
  title: string
  body: string
  pinned: boolean
  author: AuthorRef | null
  author_id: string
  like_count: number
  liked_by_me: boolean
  comments: CommentNode[]
}

const isMod = (m: MemberProfile | null) => m?.role === 'mod' || m?.role === 'admin'

/** Aplica los conteos de likes a un conjunto de objetos de un tipo dado. */
async function likeMeta(
  targetType: 'thread' | 'comment',
  ids: string[],
  memberId: string | null
): Promise<Map<string, { count: number; mine: boolean }>> {
  const meta = new Map<string, { count: number; mine: boolean }>()
  ids.forEach((id) => meta.set(id, { count: 0, mine: false }))
  if (ids.length === 0) return meta

  const { data, error } = await supabase
    .from('likes')
    .select('target_id, member_id')
    .eq('target_type', targetType)
    .in('target_id', ids)
  if (error) throw new Error(`[comunidad:likeMeta] ${error.message}`)

  for (const row of data ?? []) {
    const entry = meta.get(row.target_id as string)!
    entry.count += 1
    if (memberId && row.member_id === memberId) entry.mine = true
  }
  return meta
}

export async function getThreads(
  spaceId: string,
  member: MemberProfile | null
): Promise<ThreadListItem[]> {
  const { data, error } = await supabase
    .from('threads')
    .select('*, author:member_profiles(display_name, avatar_url)')
    .eq('space_id', spaceId)
    .order('pinned', { ascending: false })
    .order('actualizado_en', { ascending: false })
  if (error) throw new Error(`[comunidad:getThreads] ${error.message}`)

  const threads = (data ?? []) as unknown as ThreadListItem[]
  const ids = threads.map((t) => t.id)

  // Conteo de comentarios por hilo.
  const commentCount = new Map<string, number>()
  if (ids.length > 0) {
    const { data: crows } = await supabase.from('comments').select('thread_id').in('thread_id', ids)
    for (const row of crows ?? []) {
      commentCount.set(row.thread_id as string, (commentCount.get(row.thread_id as string) ?? 0) + 1)
    }
  }

  const likes = await likeMeta('thread', ids, member?.id ?? null)

  return threads.map((t) => ({
    ...t,
    comment_count: commentCount.get(t.id) ?? 0,
    like_count: likes.get(t.id)?.count ?? 0,
    liked_by_me: likes.get(t.id)?.mine ?? false,
  }))
}

export interface RecentThread {
  id: string
  title: string
  creado_en: string
  space_slug: string
  author: AuthorRef | null
}

/** Últimos hilos del foro (para la "actividad reciente" de la home). */
export async function getRecentThreads(limit = 5): Promise<RecentThread[]> {
  const { data, error } = await supabase
    .from('threads')
    .select('id, title, creado_en, author:member_profiles(display_name, avatar_url), space:spaces(slug)')
    .order('actualizado_en', { ascending: false })
    .limit(limit)
  if (error) throw new Error(`[comunidad:getRecentThreads] ${error.message}`)

  return (data ?? []).map((row) => {
    const r = row as unknown as {
      id: string
      title: string
      creado_en: string
      author: AuthorRef | null
      space: { slug: string } | null
    }
    return {
      id: r.id,
      title: r.title,
      creado_en: r.creado_en,
      author: r.author,
      space_slug: r.space?.slug ?? '',
    }
  })
}

export async function getThread(
  threadId: string,
  member: MemberProfile | null
): Promise<ThreadDetail | null> {
  const { data: thread, error } = await supabase
    .from('threads')
    .select('*, author:member_profiles(display_name, avatar_url)')
    .eq('id', threadId)
    .maybeSingle()
  if (error) throw new Error(`[comunidad:getThread] ${error.message}`)
  if (!thread) return null

  const { data: comments, error: cErr } = await supabase
    .from('comments')
    .select('*, author:member_profiles(display_name, avatar_url)')
    .eq('thread_id', threadId)
    .order('creado_en', { ascending: true })
  if (cErr) throw new Error(`[comunidad:getThread:comments] ${cErr.message}`)

  const rows = (comments ?? []) as unknown as CommentNode[]
  const commentLikes = await likeMeta(
    'comment',
    rows.map((c) => c.id),
    member?.id ?? null
  )
  const threadLikes = await likeMeta('thread', [threadId], member?.id ?? null)

  // Construir el árbol (1 nivel de anidación).
  const byId = new Map<string, CommentNode>()
  rows.forEach((c) => {
    byId.set(c.id, {
      ...c,
      like_count: commentLikes.get(c.id)?.count ?? 0,
      liked_by_me: commentLikes.get(c.id)?.mine ?? false,
      replies: [],
    })
  })
  const roots: CommentNode[] = []
  byId.forEach((c) => {
    if (c.parent_id && byId.has(c.parent_id)) {
      byId.get(c.parent_id)!.replies.push(c)
    } else {
      roots.push(c)
    }
  })

  const t = thread as unknown as ThreadDetail
  return {
    ...t,
    like_count: threadLikes.get(threadId)?.count ?? 0,
    liked_by_me: threadLikes.get(threadId)?.mine ?? false,
    comments: roots,
  }
}

export async function createThread(input: {
  spaceId: string
  authorId: string
  title: string
  body: string
}): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from('threads')
    .insert({
      space_id: input.spaceId,
      author_id: input.authorId,
      title: input.title,
      body: input.body,
    })
    .select('id')
    .single()
  if (error) throw new Error(`[comunidad:createThread] ${error.message}`)
  return data as { id: string }
}

export async function createComment(input: {
  threadId: string
  authorId: string
  body: string
  parentId?: string | null
}): Promise<void> {
  const { error } = await supabase.from('comments').insert({
    thread_id: input.threadId,
    author_id: input.authorId,
    body: input.body,
    parent_id: input.parentId ?? null,
  })
  if (error) throw new Error(`[comunidad:createComment] ${error.message}`)

  // Marca el hilo como actualizado (para reordenar por actividad).
  await supabase
    .from('threads')
    .update({ actualizado_en: new Date().toISOString() })
    .eq('id', input.threadId)
}

/** Da o quita like. Devuelve el estado final (liked). */
export async function toggleLike(
  memberId: string,
  targetType: 'thread' | 'comment',
  targetId: string
): Promise<boolean> {
  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('member_id', memberId)
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .maybeSingle()

  if (existing) {
    await supabase.from('likes').delete().eq('id', existing.id)
    return false
  }
  const { error } = await supabase
    .from('likes')
    .insert({ member_id: memberId, target_type: targetType, target_id: targetId })
  if (error) throw new Error(`[comunidad:toggleLike] ${error.message}`)
  return true
}

/** Borra un hilo si el miembro es el autor o un moderador. */
export async function deleteThread(threadId: string, member: MemberProfile): Promise<void> {
  const { data: thread } = await supabase
    .from('threads')
    .select('author_id')
    .eq('id', threadId)
    .maybeSingle()
  if (!thread) return
  if (thread.author_id !== member.id && !isMod(member)) {
    throw new Error('[comunidad:deleteThread] No autorizado')
  }
  const { error } = await supabase.from('threads').delete().eq('id', threadId)
  if (error) throw new Error(`[comunidad:deleteThread] ${error.message}`)
}

/** Borra un comentario si el miembro es el autor o un moderador. */
export async function deleteComment(commentId: string, member: MemberProfile): Promise<void> {
  const { data: comment } = await supabase
    .from('comments')
    .select('author_id')
    .eq('id', commentId)
    .maybeSingle()
  if (!comment) return
  if (comment.author_id !== member.id && !isMod(member)) {
    throw new Error('[comunidad:deleteComment] No autorizado')
  }
  const { error } = await supabase.from('comments').delete().eq('id', commentId)
  if (error) throw new Error(`[comunidad:deleteComment] ${error.message}`)
}

/** Marca un hilo como fijado/no fijado (solo moderadores). */
export async function setThreadPinned(
  threadId: string,
  pinned: boolean,
  member: MemberProfile
): Promise<void> {
  if (!isMod(member)) throw new Error('[comunidad:setThreadPinned] No autorizado')
  const { error } = await supabase.from('threads').update({ pinned }).eq('id', threadId)
  if (error) throw new Error(`[comunidad:setThreadPinned] ${error.message}`)
}
