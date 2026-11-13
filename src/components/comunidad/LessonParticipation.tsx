import Link from 'next/link'
import { getLessonParticipationQuestion } from '@/lib/community-weekly-plan'

export function LessonParticipation({ space, slug }: { space: string; slug: string }) {
  const question = getLessonParticipationQuestion(space, slug)
  if (!question) return null
  return <section className="my-7 space-y-3 border-l-2 border-accent pl-5" aria-labelledby="lesson-participation-heading">
    <p className="community-eyebrow">Si te apetece compartir</p>
    <h2 id="lesson-participation-heading" className="headline text-fluid-xl text-white">{question.title}</h2>
    <p className="max-w-2xl text-sm leading-relaxed text-muted">{question.hint} Una frase es suficiente. También puedes seguir aprendiendo sin participar.</p>
    <Link href={`/comunidad/preguntas-apoyo?pregunta=${question.id}`} className="inline-flex min-h-11 items-center font-semibold text-accent underline underline-offset-4">Preparar mi respuesta en el foro</Link>
    <p className="text-xs leading-relaxed text-muted">Abre un borrador editable. Solo se publica si pulsas «Publicar tema». Evita analíticas, medicación y datos personales de otras personas.</p>
  </section>
}
