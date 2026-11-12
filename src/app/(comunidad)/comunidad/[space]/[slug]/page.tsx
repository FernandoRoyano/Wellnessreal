import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { ArrowLeft, ArrowRight, Clock, Lock } from 'lucide-react'
import { LessonReader, type RelatedArticle } from '@/components/comunidad/LessonReader'
import { LessonCompletionButton } from '@/components/comunidad/LessonCompletionButton'
import { LessonEngagement } from '@/components/comunidad/CommunityEngagement'
import { LessonFavorite, LessonFeedback } from '@/components/comunidad/LessonTools'
import { getSessionMember, getSpace, getLessons, memberHasPremium } from '@/lib/db/comunidad'
import { ProgramInvitation } from '@/components/comunidad/ProgramInvitation'
import { getCompletedLessonIds } from '@/lib/community-progress'
import { getLearningRoute } from '@/lib/community-learning-routes'
import { getAllPosts } from '@/lib/db/posts'
import { getFavoriteLessonIds, getLessonFeedback } from '@/lib/community-tools'

export const metadata: Metadata = {
  title: 'Comunidad Tiroides · WellnessReal',
  robots: { index: false, follow: false },
}

export default async function LessonPage({
  params,
  searchParams,
}: {
  params: Promise<{ space: string; slug: string }>
  searchParams: Promise<{ ruta?: string | string[] }>
}) {
  const { space: spaceSlug, slug } = await params
  const requestedRoute = getLearningRoute((await searchParams).ruta)
  const learningRoute = requestedRoute?.steps.some(step => step.space === spaceSlug && step.slug === slug) ? requestedRoute : undefined
  const member = await getSessionMember()
  if (!member) redirect(`/comunidad/entrar?next=${encodeURIComponent(`/comunidad/${spaceSlug}/${slug}${learningRoute ? `?ruta=${learningRoute.id}` : ''}`)}`)
  const space = await getSpace(spaceSlug, member)
  if (!space) notFound()

  const lessons = await getLessons(space.id, member)
  const renamedBlocks: Record<string, string> = {
    'bloque-1-semanas-1-4': 'bloque-1-semanas-1-3',
    'bloque-2-semanas-5-8': 'bloque-2-semanas-4-6',
    'bloque-3-semanas-9-12': 'bloque-3-semanas-7-9',
  }
  const idx = lessons.findIndex((lesson) => lesson.slug === slug)
  if (idx === -1 && spaceSlug === 'metodo-base-tiroides' && renamedBlocks[slug]
    && lessons.some(lesson => lesson.slug === renamedBlocks[slug])) {
    permanentRedirect(`/comunidad/${spaceSlug}/${renamedBlocks[slug]}`)
  }
  if (idx === -1) notFound()

  const lesson = lessons[idx]
  const prev = idx > 0 ? lessons[idx - 1] : null
  const next = idx < lessons.length - 1 ? lessons[idx + 1] : null
  const relatedArticles = lesson.locked
    ? []
    : await getLessonRelatedArticles(lesson.title, lesson.content)
  const completedLessonIds = member ? await getCompletedLessonIds(member.id) : new Set<string>()
  const resource = getLessonResource(lesson.slug, lesson.title)
  const showProgramInvitation = !lesson.locked && space.access_tier === 'free' && /entren|fuerza|cansancio|energ|hábitos|habitos/.test(`${lesson.slug} ${lesson.title}`.toLowerCase())
  const hasPremium = showProgramInvitation ? await memberHasPremium(member) : false
  const [favoriteIds, lessonFeedback] = member && !lesson.locked
    ? await Promise.all([getFavoriteLessonIds(member.id), getLessonFeedback(member.id, lesson.id)])
    : [new Set<string>(), null]

  return (
    <div className="lesson-shell">
      <article className="animate-[fadeUp_500ms_var(--ease-out)_both]">
      <Link
        href={`/comunidad/${spaceSlug}`}
        className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> {space.name}
      </Link>

      {lesson.locked ? (
        <>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            Lección {idx + 1} de {lessons.length}
          </p>
          <h1 className="headline text-3xl text-white sm:text-4xl">{lesson.title}</h1>
          <div className="surface-card mt-8 rounded-2xl p-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
              <Lock className="h-7 w-7 text-white/40" />
            </div>
            <p className="inline-flex items-center gap-2 font-medium text-amber-300">
              <Clock className="h-4 w-4" />
              {lesson.lockReason === 'drip'
                ? `Se desbloquea en ${lesson.daysUntilUnlock} ${lesson.daysUntilUnlock === 1 ? 'día' : 'días'}`
                : lesson.lockReason === 'approval' ? 'Disponible cuando tu plan esté aprobado' : 'Contenido premium'}
            </p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-white/50">
              Vamos paso a paso: el contenido se libera poco a poco para que lo asimiles sin agobios.
            </p>
          </div>
        </>
      ) : (
        <LessonReader
          content={lesson.content}
          title={lesson.title}
          lessonNumber={idx + 1}
          lessonCount={lessons.length}
          memberLabel={member?.display_name || member?.email || 'Miembro'}
          coverUrl={lesson.cover_url}
          relatedArticles={relatedArticles}
        />
      )}

      {!lesson.locked && member && (
        <>
          <LessonFavorite lessonId={lesson.id} initialFavorite={favoriteIds.has(lesson.id)} />
          <LessonCompletionButton
            lessonId={lesson.id}
            isCompleted={completedLessonIds.has(lesson.id)}
          />
          <LessonEngagement resource={resource} />
          {space.access_tier === 'free' && <section className="my-7 border-y border-border-subtle py-6" aria-labelledby="lesson-continue-heading">
            <h2 id="lesson-continue-heading" className="headline text-fluid-xl">Tu siguiente paso, a tu ritmo</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{learningRoute ? 'Vuelve a tu ruta para ver qué has completado y cuál es el siguiente paso. Puedes repasar esta lectura cuando quieras.' : spaceSlug === 'empieza-aqui' && slug === 'lee-esto-primero'
              ? 'Después de la bienvenida, lee «Por qué empezar con fuerza». No necesitas completar toda la biblioteca en una visita.'
              : 'Elige una idea de esta lección y una acción que encaje en tu situación. Puede ser preparar una pregunta o reservar tiempo; no tiene que ser entrenar hoy.'}</p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {learningRoute && <Link href={`/comunidad/rutas?ruta=${learningRoute.id}`} className="inline-flex min-h-11 items-center text-accent underline underline-offset-4">Continuar ruta: {learningRoute.title}</Link>}
              {!learningRoute && spaceSlug === 'empieza-aqui' && slug === 'lee-esto-primero' && <Link href="/comunidad/entrena-organizate/por-que-empezar-con-fuerza" className="inline-flex min-h-11 items-center text-accent underline underline-offset-4">Leer mi primera lección de fuerza</Link>}
              <Link href="/comunidad/mi-semana" className="inline-flex min-h-11 items-center text-accent underline underline-offset-4">Volver a Mi semana</Link>
              {spaceSlug === 'entrena-organizate' && <Link href="/comunidad/ejercicios" className="inline-flex min-h-11 items-center text-accent underline underline-offset-4">Consultar ejercicios y variantes</Link>}
            </div>
            <p className="mt-3 text-sm text-muted">Marca la lección como completada para guardar tu lectura en tu cuenta y continuar desde otro dispositivo. Eso no significa que hayas realizado el ejercicio ni que debas progresar.</p>
          </section>}
          <LessonFeedback lessonId={lesson.id} initialFeedback={lessonFeedback} />
          {showProgramInvitation && <ProgramInvitation hasPremium={hasPremium} />}
        </>
      )}

      {!learningRoute && (prev || next) && (
        <nav className="mt-14 grid min-w-0 gap-3 border-t border-[var(--color-border)] pt-6 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/comunidad/${spaceSlug}/${prev.slug}`}
              className="hover-lift surface-card flex min-w-0 items-center gap-3 rounded-xl p-4"
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
              className="hover-lift surface-card flex min-w-0 items-center justify-end gap-3 rounded-xl p-4 text-right"
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
    </div>
  )
}

function getLessonResource(slug: string, title: string) {
  const value = `${slug} ${title}`.toLocaleLowerCase('es')
  if (/fuerza|entren|músculo|musculo/.test(value)) return {
    title: 'Primera rutina de fuerza',
    description: 'Una sesión imprimible para empezar con una estructura clara.',
    href: '/community/resources/primera-rutina-fuerza-tiroides.pdf',
  }
  if (/energ|cansancio|fatiga|hashimoto/.test(value)) return {
    title: 'Semáforo de energía',
    description: 'Decide si hoy conviene avanzar, adaptar o recuperar.',
    href: '/community/resources/semaforo-energia-tiroides.pdf',
  }
  if (/comida|proteína|proteina|palma|peso|metabolismo/.test(value)) return {
    title: 'Registro semanal',
    description: 'Observa hábitos, energía y recuperación sin juzgar un solo día.',
    href: '/community/resources/registro-semanal-tiroides.pdf',
  }
  return {
    title: 'Planificador semanal',
    description: 'Convierte lo aprendido en una acción con día y hora.',
    href: '/community/resources/planificador-semanal-tiroides.pdf',
  }
}

async function getLessonRelatedArticles(title: string, content: string): Promise<RelatedArticle[]> {
  try {
    const posts = await getAllPosts()
    const lessonText = `${title} ${content.replace(/<[^>]*>/g, ' ')}`.toLocaleLowerCase('es')
    const topicTerms = [
      'hipotiroidismo', 'tiroides', 'ejercicio', 'entrenar', 'fuerza', 'cardio', 'cansancio',
      'fatiga', 'gluten', 'proteína', 'suplementos', 'hábitos', 'dormir', 'peso', 'adelgazar',
    ]

    return posts
      .map((post, originalIndex) => {
        const postText = `${post.title} ${post.excerpt} ${post.slug}`.toLocaleLowerCase('es')
        const score = topicTerms.reduce(
          (total, term) => total + (lessonText.includes(term) && postText.includes(term) ? 3 : 0),
          /tiroides|hipotiroidismo/.test(postText) ? 1 : 0,
        )
        return { post, score, originalIndex }
      })
      .sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex)
      .slice(0, 3)
      .map(({ post }) => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        imageUrl: post.main_image_url,
        category: post.category?.title ?? null,
        readTime: post.read_time,
      }))
  } catch (error) {
    console.error('[Comunidad:getLessonRelatedArticles] No se pudieron cargar los artículos', error)
    return []
  }
}
