'use client'

import { useTransition, useState } from 'react'
import { Heart } from 'lucide-react'
import { toggleLikeAction } from '@/app/(comunidad)/comunidad/foro-actions'

export function LikeButton({
  spaceSlug,
  threadId,
  targetType,
  targetId,
  count,
  liked,
}: {
  spaceSlug: string
  threadId: string
  targetType: 'thread' | 'comment'
  targetId: string
  count: number
  liked: boolean
}) {
  const [pending, startTransition] = useTransition()
  // Estado optimista para respuesta inmediata.
  const [optimistic, setOptimistic] = useState({ count, liked })

  const onClick = () => {
    setOptimistic((o) => ({ count: o.count + (o.liked ? -1 : 1), liked: !o.liked }))
    startTransition(() => {
      toggleLikeAction(spaceSlug, threadId, targetType, targetId)
    })
  }

  return (
    <button
      onClick={onClick}
      disabled={pending}
      className="inline-flex items-center gap-1.5 text-sm text-white/50 transition hover:text-white disabled:opacity-60"
      aria-pressed={optimistic.liked}
    >
      <Heart
        className="h-4 w-4"
        fill={optimistic.liked ? 'var(--color-accent)' : 'none'}
        stroke={optimistic.liked ? 'var(--color-accent)' : 'currentColor'}
      />
      {optimistic.count > 0 && <span>{optimistic.count}</span>}
    </button>
  )
}
