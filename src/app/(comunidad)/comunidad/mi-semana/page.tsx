import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, Bookmark, CalendarDays, CheckCircle2, Dumbbell, Gauge } from 'lucide-react'
import { WeeklyCheckinForm } from '@/components/comunidad/WeeklyCheckinForm'
import { getCompletedLessonIds } from '@/lib/community-progress'
import { getFavoriteLessonIds, getLatestCheckin } from '@/lib/community-tools'
import { getLessons, getSessionMember, getSpaces } from '@/lib/db/comunidad'

export const metadata: Metadata = { title: 'Mi semana · Comunidad Tiroides · WellnessReal', robots: { index: false, follow: false } }

export default async function MiSemanaPage() {
  const member = await getSessionMember()
  if (!member) redirect('/comunidad/entrar?next=/comunidad/mi-semana')

  const spaces = (await getSpaces(member)).filter((space) => space.type === 'content')
  const [groups, completedIds, favoriteIds, latest] = await Promise.all([
    Promise.all(spaces.map((space) => getLessons(space.id, member))),
    getCompletedLessonIds(), getFavoriteLessonIds(member.id), getLatestCheckin(member.id),
  ])
  const available = spaces.flatMap((space, index) => groups[index].filter((lesson) => !lesson.locked).map((lesson) => ({ ...lesson, space })))
  const next = available.find((lesson) => !completedIds.has(lesson.id)) ?? available[0]
  const favorites = available.filter((lesson) => favoriteIds.has(lesson.id))
  const hasPremium = spaces.some((space) => space.access_tier !== 'free')

  return <main className="my-week-page">
    <header><p><CalendarDays size={15} /> Mi semana</p><h1 className="headline">Decide con contexto.<br />Haz solo lo que toca.</h1><span>Un check-in de menos de dos minutos para ordenar la semana sin convertirla en otro examen.</span></header>
    <section className="my-week-priorities" aria-labelledby="priorities-title"><div className="community-section-title"><span>01</span><div><p>Prioridades</p><h2 id="priorities-title">Tres cosas son suficientes</h2></div></div><div className="my-week-priority-grid">
      {next && <Link href={`/comunidad/${next.space.slug}/${next.slug}`}><span><CheckCircle2 /></span><small>Aprender</small><strong>{next.title}</strong><p>Tu siguiente lección disponible.</p><ArrowRight /></Link>}
      <a href="/community/resources/primera-rutina-fuerza-tiroides.pdf" target="_blank" rel="noreferrer"><span><Dumbbell /></span><small>Aplicar</small><strong>Reserva tus sesiones</strong><p>Abre la rutina y pon día y hora.</p><ArrowRight /></a>
      <a href="#checkin"><span><Gauge /></span><small>Observar</small><strong>Revisa cómo llegas</strong><p>Adapta la semana antes de improvisar.</p><ArrowRight /></a>
    </div></section>
    <section id="checkin" className="my-week-checkin"><div><p>02 · Check-in semanal</p><h2 className="headline">No buscamos una nota.<br />Buscamos una decisión mejor.</h2><span>{hasPremium ? 'En el Método BASE, este contexto ayuda a preparar las revisiones y los ajustes.' : 'En la comunidad gratuita, te ayuda a detectar patrones sin sacar conclusiones clínicas.'}</span>{latest && <small>Último registro: semana del {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long' }).format(new Date(`${latest.week_start}T12:00:00Z`))}</small>}</div><WeeklyCheckinForm latest={latest} /></section>
    <section className="my-week-saved"><div className="community-section-title"><span>03</span><div><p>Tu biblioteca personal</p><h2>Guardado para volver sin buscar</h2></div></div>{favorites.length ? <div>{favorites.map((lesson) => <Link key={lesson.id} href={`/comunidad/${lesson.space.slug}/${lesson.slug}`}><Bookmark size={17} fill="currentColor" /><span><small>{lesson.space.name}</small><strong>{lesson.title}</strong></span><ArrowRight size={16} /></Link>)}</div> : <p>Aún no has guardado ninguna lección. Utiliza «Guardar» cuando encuentres algo a lo que quieras volver.</p>}</section>
  </main>
}
