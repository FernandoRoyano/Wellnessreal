import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getSessionMember,
  getSpace,
  getLessons,
  getThreads,
  type MemberProfile,
} from '@/lib/db/comunidad'
import { Avatar } from '@/components/comunidad/Avatar'
import { NuevoHilo } from '@/components/comunidad/NuevoHilo'
import { timeAgo } from '@/lib/comunidad-format'
import { Lock, Clock, PlayCircle, MessageCircle, Heart, Pin, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Comunidad Tiroides · WellnessReal',
  robots: { index: false, follow: false },
}

export default async function SpacePage({ params }: { params: Promise<{ space: string }> }) {
  const { space: spaceSlug } = await params
  const member = await getSessionMember()
  const space = await getSpace(spaceSlug)
  if (!space) notFound()

  return (
    <div className="animate-[fadeUp_500ms_var(--ease-out)_both]">
      <header className="mb-8 flex items-start gap-4">
        <div className="rounded-2xl bg-[var(--color-accent-muted)] p-3.5">
          {space.type === 'forum' ? (
            <MessageCircle className="h-7 w-7 text-[var(--color-accent)]" />
          ) : (
            <BookOpen className="h-7 w-7 text-[var(--color-accent)]" />
          )}
        </div>
        <div>
          <h1 className="headline text-2xl text-white sm:text-3xl">{space.name}</h1>
          {space.description && <p className="mt-1 text-white/60">{space.description}</p>}
        </div>
      </header>

      {space.type === 'forum' ? (
        <ForumView spaceId={space.id} spaceSlug={space.slug} member={member} />
      ) : (
        <LessonList spaceId={space.id} spaceSlug={space.slug} member={member} />
      )}
    </div>
  )
}

async function LessonList({
  spaceId,
  spaceSlug,
  member,
}: {
  spaceId: string
  spaceSlug: string
  member: MemberProfile | null
}) {
  const lessons = await getLessons(spaceId, member)

  if (lessons.length === 0) {
    return (
      <div className="surface-card rounded-2xl p-10 text-center text-white/50">
        Aún no hay lecciones en este espacio.
      </div>
    )
  }

  return (
    <ol className="space-y-3">
      {lessons.map((l, i) =>
        l.locked ? (
          <li
            key={l.id}
            className="surface-card flex items-center gap-4 rounded-2xl p-4 opacity-70"
          >
            <NumberBadge n={i + 1} locked />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white/70">{l.title}</p>
              <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-amber-300/80">
                <Clock className="h-3 w-3" />
                {l.lockReason === 'drip'
                  ? `Disponible en ${l.daysUntilUnlock} ${l.daysUntilUnlock === 1 ? 'día' : 'días'}`
                  : 'Contenido premium'}
              </p>
            </div>
            <Lock className="h-4 w-4 shrink-0 text-white/30" />
          </li>
        ) : (
          <li key={l.id}>
            <Link
              href={`/comunidad/${spaceSlug}/${l.slug}`}
              className="hover-lift surface-card group flex items-center gap-4 rounded-2xl p-4"
            >
              <NumberBadge n={i + 1} />
              {l.cover_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={l.cover_url}
                  alt=""
                  className="hidden h-12 w-20 shrink-0 rounded-lg object-cover sm:block"
                />
              ) : null}
              <p className="min-w-0 flex-1 font-medium text-white group-hover:text-[var(--color-accent)]">
                {l.title}
              </p>
              <PlayCircle className="h-5 w-5 shrink-0 text-white/30 transition group-hover:text-[var(--color-accent)]" />
            </Link>
          </li>
        )
      )}
    </ol>
  )
}

function NumberBadge({ n, locked }: { n: number; locked?: boolean }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
        locked
          ? 'bg-white/5 text-white/40'
          : 'bg-[var(--color-accent-muted)] text-[var(--color-accent)]'
      }`}
    >
      {n}
    </span>
  )
}

async function ForumView({
  spaceId,
  spaceSlug,
  member,
}: {
  spaceId: string
  spaceSlug: string
  member: MemberProfile | null
}) {
  const threads = await getThreads(spaceId, member)

  return (
    <div>
      <div className="mb-6">
        <NuevoHilo spaceSlug={spaceSlug} />
      </div>

      {threads.length === 0 ? (
        <div className="surface-card rounded-2xl p-10 text-center text-white/50">
          Aún no hay temas. Abre el primero y rompe el hielo.
        </div>
      ) : (
        <div className="space-y-3">
          {threads.map((t) => (
            <Link
              key={t.id}
              href={`/comunidad/${spaceSlug}/hilo/${t.id}`}
              className="hover-lift surface-card group flex gap-4 rounded-2xl p-5"
            >
              <Avatar name={t.author?.display_name ?? 'Miembro'} url={t.author?.avatar_url} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {t.pinned && <Pin className="h-3.5 w-3.5 shrink-0 text-[var(--color-accent)]" />}
                  <h3 className="truncate font-semibold text-white group-hover:text-[var(--color-accent)]">
                    {t.title}
                  </h3>
                </div>
                <p className="mt-0.5 text-xs text-white/40">
                  {t.author?.display_name ?? 'Miembro'} · {timeAgo(t.creado_en)}
                </p>
                {t.body && <p className="mt-2 line-clamp-2 text-sm text-white/60">{t.body}</p>}
                <div className="mt-3 flex items-center gap-4 text-xs text-white/40">
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" /> {t.comment_count}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5" /> {t.like_count}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
