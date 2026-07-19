'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  getSessionMember,
  getSpace,
  createThread,
  createComment,
  toggleLike,
  deleteThread,
  deleteComment,
  setThreadPinned,
} from '@/lib/db/comunidad'

export async function createThreadAction(spaceSlug: string, formData: FormData) {
  const member = await getSessionMember()
  if (!member) redirect('/comunidad/entrar')

  const title = String(formData.get('title') ?? '').trim()
  const body = String(formData.get('body') ?? '').trim()
  if (!title) return

  const space = await getSpace(spaceSlug)
  if (!space || space.type !== 'forum') return

  const { id } = await createThread({ spaceId: space.id, authorId: member.id, title, body })
  revalidatePath(`/comunidad/${spaceSlug}`)
  redirect(`/comunidad/${spaceSlug}/hilo/${id}`)
}

export async function createCommentAction(
  spaceSlug: string,
  threadId: string,
  formData: FormData
) {
  const member = await getSessionMember()
  if (!member) redirect('/comunidad/entrar')

  const body = String(formData.get('body') ?? '').trim()
  const parentId = (formData.get('parentId') as string) || null
  if (!body) return

  await createComment({ threadId, authorId: member.id, body, parentId })
  revalidatePath(`/comunidad/${spaceSlug}/hilo/${threadId}`)
}

export async function toggleLikeAction(
  spaceSlug: string,
  threadId: string,
  targetType: 'thread' | 'comment',
  targetId: string
) {
  const member = await getSessionMember()
  if (!member) redirect('/comunidad/entrar')

  await toggleLike(member.id, targetType, targetId)
  revalidatePath(`/comunidad/${spaceSlug}/hilo/${threadId}`)
}

export async function deleteThreadAction(spaceSlug: string, threadId: string) {
  const member = await getSessionMember()
  if (!member) redirect('/comunidad/entrar')

  await deleteThread(threadId, member)
  revalidatePath(`/comunidad/${spaceSlug}`)
  redirect(`/comunidad/${spaceSlug}`)
}

export async function deleteCommentAction(
  spaceSlug: string,
  threadId: string,
  commentId: string
) {
  const member = await getSessionMember()
  if (!member) redirect('/comunidad/entrar')

  await deleteComment(commentId, member)
  revalidatePath(`/comunidad/${spaceSlug}/hilo/${threadId}`)
}

export async function pinThreadAction(
  spaceSlug: string,
  threadId: string,
  pinned: boolean
) {
  const member = await getSessionMember()
  if (!member) redirect('/comunidad/entrar')

  await setThreadPinned(threadId, pinned, member)
  revalidatePath(`/comunidad/${spaceSlug}`)
  revalidatePath(`/comunidad/${spaceSlug}/hilo/${threadId}`)
}
