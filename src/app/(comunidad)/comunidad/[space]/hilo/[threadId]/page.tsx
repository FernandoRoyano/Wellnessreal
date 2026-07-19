import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getSessionMember, getSpace, getThread } from '@/lib/db/comunidad'
import { Avatar } from '@/components/comunidad/Avatar'
import { LikeButton } from '@/components/comunidad/LikeButton'
import { Comentarios } from '@/components/comunidad/Comentarios'
import { timeAgo } from '@/lib/comunidad-format'
import { deleteThreadAction, pinThreadAction } from '@/app/(comunidad)/comunidad/foro-actions'
import { ArrowLeft, Pin, Trash2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Comunidad Tiroides · WellnessReal',
  robots: { index: false, follow: false },
}

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ space: string; threadId: string }>
}) {
  const { space: spaceSlug, threadId } = await params
  const member = await getSessionMember()
  if (!member) redirect('/comunidad/entrar')

  const space = await getSpace(spaceSlug)
  if (!space) notFound()

  const thread = await getThread(threadId, member)
  if (!thread) notFound()

  const canModerate = member.role === 'mod' || member.role === 'admin'
  const canDelete = thread.author_id === member.id || canModerate

  const delAction = deleteThreadAction.bind(null, spaceSlug, threadId)
  const pinAction = pinThreadAction.bind(null, spaceSlug, threadId, !thread.pinned)

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href={`/comunidad/${spaceSlug}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> {space.name}
      </Link>

      <div className="surface-card rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <Avatar name={thread.author?.display_name ?? 'Miembro'} url={thread.author?.avatar_url} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {thread.pinned && <Pin className="h-4 w-4 text-[var(--color-accent)]" />}
              <h1 className="headline text-2xl text-white">{thread.title}</h1>
            </div>
            <p className="mt-0.5 text-xs text-white/40">
              {thread.author?.display_name ?? 'Miembro'} · {timeAgo(thread.creado_en)}
            </p>
          </div>
        </div>

        {thread.body && (
          <p className="mt-4 whitespace-pre-wrap text-white/80">{thread.body}</p>
        )}

        <div className="mt-4 flex items-center gap-4 border-t border-[var(--color-border)] pt-4">
          <LikeButton
            spaceSlug={spaceSlug}
            threadId={threadId}
            targetType="thread"
            targetId={threadId}
            count={thread.like_count}
            liked={thread.liked_by_me}
          />
          {canModerate && (
            <form action={pinAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white"
              >
                <Pin className="h-4 w-4" /> {thread.pinned ? 'Desfijar' : 'Fijar'}
              </button>
            </form>
          )}
          {canDelete && (
            <form action={delAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" /> Eliminar
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Comentarios
          comments={thread.comments}
          ctx={{
            spaceSlug,
            threadId,
            currentMemberId: member.id,
            canModerate,
          }}
        />
      </div>
    </main>
  )
}
