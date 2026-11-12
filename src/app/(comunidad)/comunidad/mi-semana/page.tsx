import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, Bookmark, CalendarDays, CheckCircle2, Dumbbell, Gauge, Sparkles } from 'lucide-react'
import { WeeklyCheckinForm } from '@/components/comunidad/WeeklyCheckinForm'
import { WeeklyWorkoutPlan } from '@/components/comunidad/WeeklyWorkoutPlan'
import { getWorkoutWeek } from '@/lib/community-workout-week'
import { getWorkoutDays } from '@/lib/community-workout-plans'
import { getCompletedLessonIds } from '@/lib/community-progress'
import { getCommunityJourney } from '@/lib/community-journey'
import { getFavoriteLessonIds, getLatestCheckin } from '@/lib/community-tools'
import { getLessons, getSessionMember, getSpaces } from '@/lib/db/comunidad'

export const metadata: Metadata = { title: 'Mi semana · Comunidad Tiroides · WellnessReal', robots: { index: false, follow: false } }

export default async function MiSemanaPage() {
  const member = await getSessionMember()
  if (!member) redirect('/comunidad/entrar?next=/comunidad/mi-semana')

  const spaces = (await getSpaces(member)).filter((space) => space.type === 'content')
  const week = getWorkoutWeek()
  const [groups, completedIds, favoriteIds, latest, workoutPlan] = await Promise.all([
    Promise.all(spaces.map((space) => getLessons(space.id, member))),
    getCompletedLessonIds(member.id), getFavoriteLessonIds(member.id), getLatestCheckin(member.id),
    getWorkoutDays(member.id, week.dates),
  ])
  const { available, next, allAvailableCompleted, nextUnlockDays } = getCommunityJourney(spaces, groups, completedIds)
  const favorites = available.filter((lesson) => favoriteIds.has(lesson.id))
  const hasPremium = spaces.some((space) => space.access_tier !== 'free')
  const today = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())

  return <main className="my-week-page animate-[fadeUp_500ms_var(--ease-out)_both]">
    <header className="my-week-hero">
      <div className="my-week-hero-copy">
        <p className="my-week-eyebrow"><CalendarDays size={15} /> {today}</p>
        <h1 className="headline">Tu semana,<br /><em>con criterio.</em></h1>
        <span>Primero observa cómo llegas. Después elige lo que sí cabe en tu semana.</span>
      </div>
      <a href="#checkin" className="my-week-start"><span><Sparkles size={17} /></span><small>Empieza aquí</small><strong>Haz tu check-in</strong><p>Menos de 2 minutos</p><ArrowRight size={18} /></a>
    </header>

    <section className="my-week-priorities" aria-labelledby="priorities-title">
      <div className="my-week-heading"><div><span>01</span><p>Tu plan sencillo</p></div><h2 id="priorities-title">Tres movimientos.<br />Nada más.</h2></div>
      <div className="my-week-priority-list">
        {next && <Link href={`/comunidad/${next.space.slug}/${next.slug}`}><span className="my-week-priority-number">1</span><span className="my-week-priority-icon"><CheckCircle2 /></span><span className="my-week-priority-copy"><small>Aprender</small><strong>{next.title}</strong><p>Continúa por tu siguiente lección disponible.</p></span><ArrowRight /></Link>}
        {!next && <Link href="/comunidad"><span className="my-week-priority-number">1</span><span className="my-week-priority-icon"><CheckCircle2 /></span><span className="my-week-priority-copy"><small>Aprender</small><strong>{allAvailableCompleted ? 'Estás al día' : 'Explora las lecciones disponibles'}</strong><p>{nextUnlockDays ? `Próxima apertura en ${nextUnlockDays} ${nextUnlockDays === 1 ? 'día' : 'días'}. Puedes repasar mientras tanto.` : 'Vuelve al mapa para elegir qué te interesa repasar.'}</p></span><ArrowRight /></Link>}
        <a href="#sesiones"><span className="my-week-priority-number">2</span><span className="my-week-priority-icon"><Dumbbell /></span><span className="my-week-priority-copy"><small>Aplicar</small><strong>Reserva un momento posible</strong><p>Elige un día y abre el ejemplo de sesión que hayas reservado.</p></span><ArrowRight /></a>
        <a href="#checkin"><span className="my-week-priority-number">3</span><span className="my-week-priority-icon"><Gauge /></span><span className="my-week-priority-copy"><small>Observar</small><strong>Revisa cómo llegas</strong><p>Adapta el plan antes de tener que improvisar.</p></span><ArrowRight /></a>
      </div>
    </section>

    <WeeklyWorkoutPlan key={week.start} week={week} days={workoutPlan.days} available={workoutPlan.available} />

    <section id="checkin" className="my-week-checkin">
      <div className="my-week-checkin-intro"><p>02 · Check-in semanal</p><h2 className="headline">No es una nota.<br />Es contexto.</h2><span>{hasPremium ? 'En el Método BASE, este registro ayuda a preparar las revisiones y ajustar el entrenamiento.' : 'Te ayuda a observar patrones y organizarte mejor, sin sacar conclusiones clínicas.'}</span>{latest && <small><CheckCircle2 size={14} /> Último registro: semana del {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long' }).format(new Date(`${latest.week_start}T12:00:00Z`))}</small>}</div>
      <div className="my-week-checkin-panel"><WeeklyCheckinForm latest={latest} /></div>
    </section>

    <section className="my-week-saved"><div className="my-week-heading"><div><span>03</span><p>Tu biblioteca</p></div><h2>Lo importante,<br />a mano.</h2></div>{favorites.length ? <div className="my-week-saved-list">{favorites.map((lesson) => <Link key={lesson.id} href={`/comunidad/${lesson.space.slug}/${lesson.slug}`}><Bookmark size={17} fill="currentColor" /><span><small>{lesson.space.name}</small><strong>{lesson.title}</strong></span><ArrowRight size={16} /></Link>)}</div> : <div className="my-week-saved-empty"><Bookmark size={20} /><div><strong>Todavía no has guardado nada</strong><p>Cuando una lección te resulte útil, pulsa «Guardar» y aparecerá aquí.</p></div></div>}</section>
  </main>
}
