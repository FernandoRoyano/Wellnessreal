'use client'

import { useState } from 'react'
import { Avatar } from './Avatar'
import { LikeButton } from './LikeButton'
import { timeAgo } from '@/lib/comunidad-format'
import { createCommentAction, deleteCommentAction } from '@/app/(comunidad)/comunidad/foro-actions'
import { Reply, Trash2 } from 'lucide-react'
import type { CommentNode } from '@/lib/db/comunidad'

interface Ctx {
  spaceSlug: string
  threadId: string
  currentMemberId: string | null
  canModerate: boolean
}

function CommentItem({ node, ctx, depth }: { node: CommentNode; ctx: Ctx; depth: number }) {
  const [replying, setReplying] = useState(false)
  const canDelete = ctx.currentMemberId === node.author_id || ctx.canModerate
  const replyAction = createCommentAction.bind(null, ctx.spaceSlug, ctx.threadId)
  const delAction = deleteCommentAction.bind(null, ctx.spaceSlug, ctx.threadId, node.id)

  return (
    <div className={depth > 0 ? 'ml-6 border-l border-[var(--color-border)] pl-4' : ''}>
      <div className="flex gap-3 py-3">
        <Avatar name={node.author?.display_name ?? 'Miembro'} url={node.author?.avatar_url} size={32} />
        <div className="min-w-0 flex-1">
          <p className="text-sm">
            <span className="font-semibold text-white">
              {node.author?.display_name ?? 'Miembro'}
            </span>
            <span className="ml-2 text-white/40">{timeAgo(node.creado_en)}</span>
          </p>
          <p className="mt-1 whitespace-pre-wrap text-white/80">{node.body}</p>
          <div className="mt-2 flex items-center gap-4">
            <LikeButton
              spaceSlug={ctx.spaceSlug}
              threadId={ctx.threadId}
              targetType="comment"
              targetId={node.id}
              count={node.like_count}
              liked={node.liked_by_me}
            />
            {depth === 0 && (
              <button
                onClick={() => setReplying((v) => !v)}
                className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white"
              >
                <Reply className="h-4 w-4" /> Responder
              </button>
            )}
            {canDelete && (
              <form action={delAction}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>

          {replying && (
            <form
              action={async (fd) => {
                await replyAction(fd)
                setReplying(false)
              }}
              className="mt-3"
            >
              <input type="hidden" name="parentId" value={node.id} />
              <textarea
                name="body"
                required
                rows={2}
                placeholder="Escribe tu respuesta…"
                className="w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-brand-deep)] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[var(--color-accent)] focus:outline-none"
              />
              <div className="mt-2 flex gap-2">
                <button type="submit" className="btn-brand px-4 py-1.5 text-sm">
                  Responder
                </button>
                <button
                  type="button"
                  onClick={() => setReplying(false)}
                  className="text-sm text-white/50 hover:text-white"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {node.replies.map((r) => (
            <CommentItem key={r.id} node={r} ctx={ctx} depth={depth + 1} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function Comentarios({
  comments,
  ctx,
}: {
  comments: CommentNode[]
  ctx: Ctx
}) {
  const newAction = createCommentAction.bind(null, ctx.spaceSlug, ctx.threadId)

  return (
    <div>
      {/* Nuevo comentario raíz */}
      <form action={newAction} className="mb-6 flex gap-3">
        <div className="flex-1">
          <textarea
            name="body"
            required
            rows={3}
            placeholder="Escribe un comentario…"
            className="w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-brand-deep)] px-4 py-2.5 text-white placeholder:text-white/30 focus:border-[var(--color-accent)] focus:outline-none"
          />
          <button type="submit" className="btn-brand mt-2 px-5 py-2 text-sm">
            Comentar
          </button>
        </div>
      </form>

      {comments.length === 0 ? (
        <p className="py-6 text-center text-white/40">
          Todavía no hay comentarios. Sé la primera en escribir.
        </p>
      ) : (
        <div className="divide-y divide-[var(--color-border)]">
          {comments.map((c) => (
            <CommentItem key={c.id} node={c} ctx={ctx} depth={0} />
          ))}
        </div>
      )}
    </div>
  )
}
