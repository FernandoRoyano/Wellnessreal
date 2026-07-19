import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSessionMember, getSpace, getLesson } from '@/lib/db/comunidad'
import { ArrowLeft, Lock, Clock } from 'lucide-react'

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

  const lesson = await getLesson(space.id, slug, member)
  if (!lesson) notFound()

  return (
    <article className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href={`/comunidad/${spaceSlug}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> {space.name}
      </Link>

      {lesson.cover_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={lesson.cover_url}
          alt=""
          className="mb-8 max-h-80 w-full rounded-2xl object-cover"
        />
      )}

      <h1 className="headline text-3xl text-white sm:text-4xl">{lesson.title}</h1>

      {lesson.locked ? (
        <div className="surface-card mt-8 rounded-2xl p-10 text-center">
          <Lock className="mx-auto mb-4 h-10 w-10 text-white/40" />
          <p className="inline-flex items-center gap-2 text-amber-300">
            <Clock className="h-4 w-4" />
            {lesson.lockReason === 'drip'
              ? `Esta lección se desbloquea en ${lesson.daysUntilUnlock} ${
                  lesson.daysUntilUnlock === 1 ? 'día' : 'días'
                }`
              : 'Contenido premium'}
          </p>
          <p className="mt-2 text-sm text-white/50">
            Vamos paso a paso: el contenido se libera poco a poco para que lo asimiles sin agobios.
          </p>
        </div>
      ) : (
        <div
          className="tiptap mt-8 text-white/80"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />
      )}
    </article>
  )
}
