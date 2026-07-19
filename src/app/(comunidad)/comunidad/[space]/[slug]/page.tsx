import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSessionMember, getSpace, getLessons } from '@/lib/db/comunidad'
import { ArrowLeft, ArrowRight, Lock, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Comunidad Tiroides · WellnessReal',
  robots: { index: false, follow: false },
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ space: string; slug: string }>
}) {
  const { space: spaceSlug, slug } = await params
  const member = await getSessionMember()
  const space = await getSpace(spaceSlug)
  if (!space) notFound()

  const lessons = await getLessons(space.id, member)
  const idx = lessons.findIndex((l) => l.slug === slug)
  if (idx === -1) notFound()

  const lesson = lessons[idx]
  const prev = idx > 0 ? lessons[idx - 1] : null
  const next = idx < lessons.length - 1 ? lessons[idx + 1] : null

  return (
    <article className="animate-[fadeUp_500ms_var(--ease-out)_both]">
      <Link
        href={`/comunidad/${spaceSlug}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> {space.name}
      </Link>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
        Lección {idx + 1} de {lessons.length}
      </p>
      <h1 className="headline text-3xl text-white sm:text-4xl">{lesson.title}</h1>

      {lesson.locked ? (
        <div className="surface-card mt-8 rounded-2xl p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
            <Lock className="h-7 w-7 text-white/40" />
          </div>
          <p className="inline-flex items-center gap-2 font-medium text-amber-300">
            <Clock className="h-4 w-4" />
            {lesson.lockReason === 'drip'
              ? `Se desbloquea en ${lesson.daysUntilUnlock} ${
                  lesson.daysUntilUnlock === 1 ? 'día' : 'días'
                }`
              : 'Contenido premium'}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-white/50">
            Vamos paso a paso: el contenido se libera poco a poco para que lo asimiles sin agobios.
          </p>
        </div>
      ) : (
        <>
          {lesson.cover_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={lesson.cover_url}
              alt=""
              className="mt-8 max-h-96 w-full rounded-2xl object-cover"
            />
          )}
          <div
            className="tiptap lesson-prose mt-8 text-white/80"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        </>
      )}

      {/* Navegación anterior / siguiente */}
      {(prev || next) && (
        <nav className="mt-12 grid gap-3 border-t border-[var(--color-border)] pt-6 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/comunidad/${spaceSlug}/${prev.slug}`}
              className="hover-lift surface-card flex items-center gap-3 rounded-xl p-4"
            >
              <ArrowLeft className="h-5 w-5 shrink-0 text-white/40" />
              <span className="min-w-0">
                <span className="block text-xs text-white/40">Anterior</span>
                <span className="block truncate text-sm font-medium text-white">{prev.title}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/comunidad/${spaceSlug}/${next.slug}`}
              className="hover-lift surface-card flex items-center justify-end gap-3 rounded-xl p-4 text-right"
            >
              <span className="min-w-0">
                <span className="block text-xs text-white/40">Siguiente</span>
                <span className="block truncate text-sm font-medium text-white">{next.title}</span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-[var(--color-accent)]" />
            </Link>
          )}
        </nav>
      )}
    </article>
  )
}
