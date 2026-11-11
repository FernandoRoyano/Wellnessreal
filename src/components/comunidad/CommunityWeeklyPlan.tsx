import Link from 'next/link'
import { COMMUNITY_QUESTIONS, getCommunityWeeklyPlan } from '@/lib/community-weekly-plan'

interface AvailableLesson {
  slug: string
  title: string
  locked: boolean
  daysUntilUnlock: number
  space: { slug: string }
}

export function CommunityWeeklyPlan({ lessons }: { lessons: AvailableLesson[] }) {
  return <section className="my-9 border-y border-border-subtle py-7" aria-labelledby="weekly-focus-title">
    <p className="community-eyebrow">Una razón para volver</p>
    <h2 id="weekly-focus-title" className="headline mt-3 text-fluid-2xl">Una lectura, una acción y una pregunta.</h2>
    <p className="mt-3 max-w-2xl text-muted">Una propuesta semanal con lecturas y recursos ya disponibles. El tema se alterna cada lunes en un ciclo de cuatro semanas; puedes seguirlo a tu ritmo.</p>
    <div className="mt-6 grid gap-7 md:grid-cols-2">
      {getCommunityWeeklyPlan().map(topic => {
        const lesson = lessons.find(item => item.slug === topic.lesson && item.space.slug === topic.space)
        const question = COMMUNITY_QUESTIONS.find(item => item.id === topic.question)!
        return <article key={topic.label} className="min-w-0 border-t border-border-subtle pt-5">
          <p className="text-sm font-semibold text-accent">{topic.label} · {topic.period}</p>
          <h3 className="mt-3 text-fluid-xl text-white">{topic.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">{topic.action}</p>
          {lesson && !lesson.locked ? <Link href={`/comunidad/${topic.space}/${topic.lesson}`} className="mt-3 inline-flex min-h-11 items-center text-sm text-accent underline underline-offset-4">Leer: {lesson.title}</Link> : <p className="mt-3 text-sm text-muted">{lesson?.daysUntilUnlock ? `La lectura se abre para ti en ${lesson.daysUntilUnlock} ${lesson.daysUntilUnlock === 1 ? 'día' : 'días'}. Mientras tanto, puedes usar el recurso.` : 'Consulta tu mapa de aprendizaje para ver las lecturas disponibles.'}</p>}
          <a href={`/community/resources/${topic.file}`} target="_blank" rel="noreferrer" className="mt-1 flex min-h-11 items-center text-sm text-accent underline underline-offset-4">Abrir {topic.resource.toLocaleLowerCase('es')} (PDF)</a>
          <p className="mt-3 text-sm text-white">{question.title}</p>
          <Link href={`/comunidad/preguntas-apoyo?pregunta=${question.id}`} className="mt-1 inline-flex min-h-11 items-center text-sm text-accent underline underline-offset-4">Preparar una respuesta en el foro</Link>
        </article>
      })}
    </div>
    <p className="mt-5 text-sm text-subtle">Participar es opcional. Comparte ideas de organización, sin analíticas, medicación ni datos de salud privados.</p>
  </section>
}
