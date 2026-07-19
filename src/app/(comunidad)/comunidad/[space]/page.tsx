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
import { ArrowLeft, Lock, Clock, PlayCircle, MessageCircle, Heart, Pin } from 'lucide-react'

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
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/comunidad"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Comunidad
      </Link>

      <h1 className="headline text-3xl text-white">{space.name}</h1>
      {space.description && <p className="mt-2 text-white/60">{space.description}</p>}

      {space.type === 'forum' ? (
        <ForumView spaceId={space.id} spaceSlug={space.slug} member={member} />
      ) : (
        <LessonList spaceId={space.id} spaceSlug={space.slug} member={member} />
      )}
    </main>
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
    <div className="mt-8">
      <div className="mb-6">
        <NuevoHilo spaceSlug={spaceSlug} />
      </div>

      {threads.length === 0 ? (
        <p className="mt-10 text-center text-white/40">
          Aún no hay temas. Abre el primero y rompe el hielo.
        </p>
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
                  {t.pinned && <Pin className="h-3.5 w-3.5 text-[var(--color-accent)]" />}
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
    return <p className="mt-10 text-center text-white/40">Aún no hay lecciones en este espacio.</p>
  }

  return (
    <div className="mt-8 space-y-3">
      {lessons.map((l) =>
        l.locked ? (
          <div
            key={l.id}
            className="surface-card flex items-center gap-4 rounded-2xl p-5 opacity-70"
          >
            <div className="rounded-xl bg-white/5 p-2.5">
              <Lock className="h-5 w-5 text-white/40" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white/70">{l.title}</p>
              <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-amber-300/80">
                <Clock className="h-3 w-3" />
                {l.lockReason === 'drip'
                  ? `Disponible en ${l.daysUntilUnlock} ${l.daysUntilUnlock === 1 ? 'día' : 'días'}`
                  : 'Contenido premium'}
              </p>
            </div>
          </div>
        ) : (
          <Link
            key={l.id}
            href={`/comunidad/${spaceSlug}/${l.slug}`}
            className="hover-lift surface-card group flex items-center gap-4 rounded-2xl p-5"
          >
            <div className="rounded-xl bg-white/5 p-2.5">
              <PlayCircle className="h-5 w-5 text-[var(--color-accent)]" />
            </div>
            <p className="font-medium text-white group-hover:text-[var(--color-accent)]">
              {l.title}
            </p>
          </Link>
        )
      )}
    </div>
  )
}

