import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowRight, Check, Lock } from 'lucide-react'
import { getLessons, getSessionMember, getSpaces } from '@/lib/db/comunidad'
import { getCompletedLessonIds } from '@/lib/community-progress'
import { COMMUNITY_LEARNING_ROUTES, getLearningRoute, getLearningRouteProgress } from '@/lib/community-learning-routes'

export const metadata: Metadata = { title: 'Rutas de aprendizaje · Comunidad Tiroides', robots: { index: false, follow: false } }

export default async function LearningRoutesPage({ searchParams }: { searchParams: Promise<{ ruta?: string | string[] }> }) {
  const query = await searchParams
  const route = getLearningRoute(query.ruta)
  const member = await getSessionMember()
  if (!member) redirect(`/comunidad/entrar?next=${encodeURIComponent(`/comunidad/rutas${route ? `?ruta=${route.id}` : ''}`)}`)
  if (query.ruta && !route) notFound()
  const spaces = (await getSpaces(member)).filter(space => space.type === 'content' && space.access_tier === 'free')
  const [groups, completedIds] = await Promise.all([
    Promise.all(spaces.map(space => getLessons(space.id, member))), getCompletedLessonIds(member.id),
  ])
  const lessons = spaces.flatMap((space, index) => groups[index].map(lesson => ({ ...lesson, space })))
  const progress = route ? getLearningRouteProgress(route, lessons, completedIds) : null
  const choices = <nav aria-label="Elegir ruta de aprendizaje" className="grid gap-3 sm:grid-cols-3">
    {COMMUNITY_LEARNING_ROUTES.map(item => {
      const state = getLearningRouteProgress(item, lessons, completedIds)
      return <Link key={item.id} href={`/comunidad/rutas?ruta=${item.id}`} aria-current={route?.id === item.id ? 'page' : undefined} className={`min-w-0 rounded-xl border p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${route?.id === item.id ? 'border-accent text-accent' : 'border-border-subtle text-white hover:border-border-strong'}`}>
        <span className="flex items-center justify-between gap-2 font-semibold">{item.title}<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></span>
        {!route && <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>}
        <p className="mt-2 text-sm text-muted">{state.completedCount} de {state.steps.length} lecturas completadas</p>
      </Link>
    })}
  </nav>

  return <main className="mx-auto max-w-4xl space-y-8 py-4">
    <header className="space-y-4">
      <p className="community-eyebrow">Aprender con un orden</p>
      <h1 className="headline text-fluid-4xl text-white">{route ? route.title : 'Elige por dónde seguir'}</h1>
      <p className="max-w-2xl leading-relaxed text-muted">{route ? route.description : 'Tres rutas gratuitas con lecturas que ya forman parte de la comunidad. Elige lo que te resulte útil ahora; puedes cambiar cuando quieras.'}</p>
      <p className="text-sm leading-relaxed text-muted">Son recorridos de aprendizaje general. Las lecturas completadas se comparten entre rutas y se guardan en tu cuenta; no equivalen a ejercicios realizados ni a una valoración individual.</p>
    </header>

    {route ? <details key={route.id}><summary className="min-h-11 cursor-pointer py-3 font-semibold text-accent">Cambiar ruta</summary><div className="mt-3">{choices}</div></details> : choices}

    {route && progress && <>
      <section aria-labelledby="route-steps-heading" className="border-y border-border-subtle py-7">
        <h2 id="route-steps-heading" className="headline text-fluid-2xl text-white">{progress.complete ? 'Has completado las lecturas de esta ruta' : 'Tus siguientes lecturas'}</h2>
        <p className="mt-3 text-sm text-muted">{progress.complete ? 'Puedes repasarlas, aplicar una idea o elegir otra ruta. Tu avance se conserva.' : 'Algunas lecturas se abren progresivamente desde tu registro. Mientras esperas, puedes usar el recurso de esta ruta.'}</p>
        {progress.next?.lesson && !progress.next.lesson.locked && <Link href={`/comunidad/${progress.next.space}/${progress.next.slug}?ruta=${route.id}`} className="btn-brand mt-5 min-h-11">Continuar esta ruta <ArrowRight className="h-4 w-4" /></Link>}
        <ol className="mt-6 divide-y divide-border-subtle">
          {progress.steps.map((step, index) => <li key={`${step.space}/${step.slug}`} className="py-5">
            <p className="mb-2 text-sm text-muted">Lectura {index + 1} {step.completed && <span className="ml-2 inline-flex items-center gap-1 text-accent"><Check className="h-4 w-4" aria-hidden="true" /> Completada</span>}</p>
            {!step.lesson ? <p className="text-muted">Esta lectura no está disponible ahora.</p> : step.lesson.locked ? <div className="space-y-2 text-muted"><p className="font-semibold text-white">{step.lesson.title}</p><p className="flex items-center gap-2 text-sm"><Lock className="h-4 w-4" aria-hidden="true" />{step.lesson.daysUntilUnlock > 0 ? `Disponible en ${step.lesson.daysUntilUnlock} ${step.lesson.daysUntilUnlock === 1 ? 'día' : 'días'}` : 'Lectura bloqueada para tu acceso actual'}</p></div> : <Link href={`/comunidad/${step.space}/${step.slug}?ruta=${route.id}`} className="inline-flex min-h-11 items-center gap-2 font-semibold text-accent underline underline-offset-4">{step.lesson.title}<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></Link>}
          </li>)}
        </ol>
      </section>
      <section aria-labelledby="route-action-heading" className="space-y-4">
        <h2 id="route-action-heading" className="headline text-fluid-2xl text-white">Una acción posible</h2>
        <p className="max-w-2xl leading-relaxed text-muted">{route.action}</p>
        <a href={`/community/resources/${route.file}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-accent underline underline-offset-4">Abrir {route.resource.toLocaleLowerCase('es')} (PDF)<ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
        <p><Link href="/comunidad/mi-semana" className="inline-flex min-h-11 items-center text-accent underline underline-offset-4">Revisar Mi semana</Link></p>
        <p><Link href="/comunidad/ejercicios" className="inline-flex min-h-11 items-center text-accent underline underline-offset-4">Consultar la biblioteca de ejercicios</Link></p>
        <p><Link href="/comunidad/ejercicios/sesiones" className="inline-flex min-h-11 items-center text-accent underline underline-offset-4">Ver cómo combinar ejercicios en una sesión</Link></p>
      </section>
    </>}
  </main>
}
