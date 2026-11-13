import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, BookOpen, Check, Download, FileText, MessageCircle, Route } from 'lucide-react'
import { Avatar } from '@/components/comunidad/Avatar'
import { CommunityShare } from '@/components/comunidad/CommunityEngagement'
import { timeAgo } from '@/lib/comunidad-format'
import {
  getLessons,
  getOnlineMembers,
  getRecentThreads,
  getSessionMember,
  getSpacesOverview,
  memberHasPremium,
} from '@/lib/db/comunidad'
import { getCompletedLessonIds, getLegacyLessonIds } from '@/lib/community-progress'
import { LegacyProgressImport } from '@/components/comunidad/LegacyProgressImport'
import { getCommunityJourney } from '@/lib/community-journey'
import { CommunityImage } from '@/components/comunidad/CommunityImage'
import { ProgramInvitation } from '@/components/comunidad/ProgramInvitation'
import { CommunityWeeklyPlan } from '@/components/comunidad/CommunityWeeklyPlan'
import { NextPlannedWorkout } from '@/components/comunidad/NextPlannedWorkout'
import { getWorkoutDays } from '@/lib/community-workout-plans'
import { getWorkoutWeek } from '@/lib/community-workout-week'
import FooterNewsletterForm from '@/components/common/FooterNewsletterForm'

export const metadata: Metadata = {
  title: 'Comunidad Tiroides · WellnessReal',
  robots: { index: false, follow: false },
}

const resources = [
  { title: 'Planificador semanal', description: 'Convierte dos entrenamientos en citas reales.', href: '/community/resources/planificador-semanal-tiroides.pdf' },
  { title: 'Semáforo de energía', description: 'Adapta el día sin culpa ni improvisación.', href: '/community/resources/semaforo-energia-tiroides.pdf' },
  { title: 'Registro semanal', description: 'Observa energía, fuerza y recuperación con contexto.', href: '/community/resources/registro-semanal-tiroides.pdf' },
  { title: 'Primera rutina de fuerza', description: 'Una sesión clara, imprimible y fácil de repetir.', href: '/community/resources/primera-rutina-fuerza-tiroides.pdf' },
]

export default async function ComunidadHome() {
  const member = await getSessionMember()
  if (!member) redirect('/comunidad/entrar')

  const week = getWorkoutWeek()
  const [spaces, recent, online, completedIds, hasPremium, legacyIds, workoutPlan] = await Promise.all([
    getSpacesOverview(member),
    getRecentThreads(member, 4),
    getOnlineMembers(),
    getCompletedLessonIds(member.id),
    memberHasPremium(member),
    getLegacyLessonIds(),
    getWorkoutDays(member.id, week.dates),
  ])
  const contentSpaces = spaces.filter((space) => space.type === 'content')
  const lessonGroups = await Promise.all(contentSpaces.map((space) => getLessons(space.id, member)))
  const journey = getCommunityJourney(contentSpaces, lessonGroups, completedIds)
  const { available: unlockedLessons, completedCount, progress, next: nextLesson } = journey
  const nextSpace = nextLesson?.space

  return (
    <div className="community-home animate-[fadeUp_500ms_var(--ease-out)_both]">
      <header className="community-journey">
        <div className="community-journey-copy">
          <p className="community-eyebrow"><Route className="h-4 w-4" /> Tu recorrido</p>
          <h1 className="headline">Hola, {member.display_name.split(' ')[0]}.<br />Una cosa cada vez.</h1>
          <p>No necesitas hacerlo perfecto. Empieza con una acción posible, entiende cómo aplicarla y repítela.</p>
          {nextLesson && nextSpace && (
            <Link href={`/comunidad/${nextSpace.slug}/${nextLesson.slug}`} className="community-primary-action">
              {completedCount === 0 ? journey.welcome?.id === nextLesson.id ? 'Empezar por la bienvenida' : 'Abrir mi primera lección' : 'Continuar mi aprendizaje'} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          {!nextLesson && <Link href="/comunidad/mi-semana" className="community-primary-action">Organizar mi semana <ArrowRight className="h-4 w-4" /></Link>}
          <Link href="/comunidad/recorrido" className="community-journey-link">
            Ver qué incluye la comunidad y el Método BASE <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link href="/comunidad/rutas" className="community-journey-link">Elegir mi ruta de aprendizaje <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="community-score" style={{ '--journey-progress': `${progress * 3.6}deg` } as CSSProperties}>
          <div><strong>{progress}%</strong><span>completado</span></div>
          <p>{completedCount} de {unlockedLessons.length} lecciones disponibles</p>
          <p>Avance guardado en tu cuenta.</p>
        </div>
      </header>

      <NextPlannedWorkout days={workoutPlan.days} today={week.today} available={workoutPlan.available} />

      <LegacyProgressImport lessons={unlockedLessons.filter(lesson => legacyIds.has(lesson.id) && !completedIds.has(lesson.id)).map(lesson => ({ id: lesson.id, title: lesson.title }))} />

      {hasPremium && <ProgramInvitation hasPremium />}
      {completedCount === 0 && <section className="my-8 border-y border-border-subtle py-7" aria-labelledby="start-heading">
        <h2 id="start-heading" className="headline text-fluid-2xl">Empieza aquí: una primera visita útil</h2>
        <p className="mt-3 max-w-2xl text-muted">Empieza por estas tres acciones. Las lecciones escritas están listas para leer; algunas se abren progresivamente desde tu registro y muestran cuándo estarán disponibles.</p>
        <ol className="mt-5 space-y-4 text-fluid-base leading-relaxed">
          {journey.welcome && <li><Link href={`/comunidad/${journey.welcome.space.slug}/${journey.welcome.slug}`} className="text-accent underline underline-offset-4">1. Lee la bienvenida</Link><p className="mt-1 text-muted">Conoce el recorrido y la diferencia entre orientación general y acompañamiento.</p></li>}
          {journey.firstPractical && <li><Link href={`/comunidad/${journey.firstPractical.space.slug}/${journey.firstPractical.slug}`} className="text-accent underline underline-offset-4">2. Lee «Por qué empezar con fuerza»</Link><p className="mt-1 text-muted">Comprende la idea antes de elegir una acción. Leer no te obliga a entrenar hoy ni a completar una rutina.</p></li>}
          <li><a href="/community/resources/planificador-semanal-tiroides.pdf" target="_blank" rel="noreferrer" className="text-accent underline underline-offset-4">3. Abre el planificador y reserva un momento posible</a><p className="mt-1 text-muted">Puede ser para leer, preparar material o moverte si tu situación lo permite. Añade una alternativa; no es una prescripción de ejercicio.</p></li>
        </ol>
        <p className="mt-5 text-muted">Para volver: abre <Link href="/comunidad/mi-semana" className="text-accent underline underline-offset-4">Mi semana</Link>, revisa qué pudiste aplicar y elige tu siguiente paso. Las dudas generales van en <Link href="/comunidad/preguntas-apoyo" className="text-accent underline underline-offset-4">Preguntas y apoyo</Link>, sin datos clínicos privados.</p>
      </section>}

      {journey.allAvailableCompleted && <section className="my-8 border-y border-border-subtle py-7" aria-labelledby="caught-up-heading">
        <h2 id="caught-up-heading" className="headline text-fluid-2xl">Estás al día con tus lecciones disponibles</h2>
        <p className="mt-3 text-muted">{journey.nextUnlockDays ? `La próxima se abre en ${journey.nextUnlockDays} ${journey.nextUnlockDays === 1 ? 'día' : 'días'}. Mientras tanto, repasa una idea o utiliza un recurso.` : 'Puedes repasar una idea, utilizar un recurso o compartir una duda general. No hace falta empezar otra vez para mantener el recorrido.'}</p>
        <Link href="/comunidad/mi-semana" className="mt-4 inline-flex min-h-11 items-center text-accent underline underline-offset-4">Revisar mi semana</Link>
      </section>}

      {nextLesson && nextSpace && (
        <section className="community-next">
          <SectionTitle number="01" eyebrow="Tu siguiente paso" title="Hoy solo necesitas esto" />
          <Link href={`/comunidad/${nextSpace.slug}/${nextLesson.slug}`} className="community-feature-card">
            {nextLesson.cover_url && <CommunityImage src={nextLesson.cover_url} alt="" loading="eager" sizes="(min-width: 1024px) 520px, 100vw" />}
            <div>
              <p>{nextSpace.name} · {Math.max(1, Math.ceil(nextLesson.content.replace(/<[^>]*>/g, ' ').split(/\s+/).length / 210))} min</p>
              <h3>{nextLesson.title}</h3>
              <span>Empezar la lección <ArrowRight className="h-4 w-4" /></span>
            </div>
          </Link>
        </section>
      )}

      <CommunityWeeklyPlan lessons={contentSpaces.flatMap((space, index) => lessonGroups[index].map(lesson => ({ ...lesson, space })))} />

      <section className="community-map">
        <SectionTitle number="02" eyebrow="Mapa de aprendizaje" title="Un sistema, no una colección de consejos" />
        <div className="community-map-grid">
          {contentSpaces.map((space, index) => {
            const available = lessonGroups[index].filter((lesson) => !lesson.locked)
            const done = available.filter((lesson) => completedIds.has(lesson.id)).length
            const percentage = available.length ? Math.round((done / available.length) * 100) : 0
            const cover = space.slug === 'aprende-tiroides' ? '/community/tiroides-eje-hpt.svg'
              : space.slug === 'metodo-base-tiroides' ? '/community/editorial/seguimiento-cuaderno.webp'
                : lessonGroups[index][0]?.cover_url
            return (
              <Link href={`/comunidad/${space.slug}`} key={space.id} className="community-map-card">
                {cover && <CommunityImage src={cover} alt="" className="community-map-image" sizes="(min-width: 1024px) 520px, 90vw" />}
                <div className="community-map-index"><span>0{index + 1}</span><BookOpen className="h-5 w-5" /></div>
                <h3>{space.name}</h3><p>{space.description}</p>
                <div className="community-map-progress"><span style={{ width: `${percentage}%` }} /></div>
                <small>{done}/{available.length} completadas</small>
              </Link>
            )
          })}
        </div>
      </section>

      <section id="recursos" className="community-library scroll-mt-24">
        <SectionTitle number="03" eyebrow="Biblioteca práctica" title="Herramientas que puedes usar hoy" />
        <div className="community-resource-grid">
          {resources.map((resource) => (
            <a key={resource.href} href={resource.href} target="_blank" rel="noreferrer" className="community-resource-card">
              <FileText className="h-6 w-6" /><div><h3>{resource.title}</h3><p>{resource.description}</p></div><Download className="h-4 w-4" />
            </a>
          ))}
        </div>
      </section>

      {!hasPremium && <ProgramInvitation hasPremium={false} />}
      {!hasPremium && <section className="my-8 border-t border-border-subtle pt-7 text-center" aria-labelledby="community-email-heading">
        <h2 id="community-email-heading" className="headline text-fluid-2xl">Si quieres seguir también por email</h2>
        <p className="mx-auto my-4 max-w-xl text-muted">Puedes solicitar ideas prácticas y conocer los servicios de Fernando. Esta elección es independiente del acceso gratuito y puedes darte de baja cuando quieras.</p>
        <FooterNewsletterForm source="community" initialEmail={member.email} />
      </section>}

      <section className="community-bottom-grid">
        <div>
          <SectionTitle number="04" eyebrow="La parte humana" title="La comunidad sigue contigo" />
          <Link href="/comunidad/preguntas-apoyo" className="community-forum-cta"><MessageCircle className="h-6 w-6" /><div><h3>Pregunta, comparte, vuelve</h3><p>No hace falta llegar con la pregunta perfecta.</p></div><ArrowRight className="h-4 w-4" /></Link>
          {recent.map((thread) => <Link key={thread.id} href={`/comunidad/${thread.space_slug}/hilo/${thread.id}`} className="community-thread"><Avatar name={thread.author?.display_name ?? 'Miembro'} url={thread.author?.avatar_url} size={34} /><div><p>{thread.title}</p><span>{thread.author?.display_name ?? 'Miembro'} · {timeAgo(thread.creado_en)}</span></div></Link>)}
        </div>
        <aside className="community-presence">
          <p><span /> Ahora en la comunidad</p>
          <div>{online.slice(0, 7).map((person) => <Avatar key={person.id} name={person.display_name} url={person.avatar_url} size={36} />)}</div>
          <strong>{online.length > 0 ? `${online.length} ${online.length === 1 ? 'persona conectada' : 'personas conectadas'}` : 'La conversación te espera'}</strong>
          <span><Check className="h-4 w-4" /> Sin ruido. Sin juicios. Sin promesas mágicas.</span>
        </aside>
      </section>

      <section className="community-invite" aria-labelledby="community-invite-title">
        <div className="community-section-title"><span>05</span><div><p>Hazla crecer con criterio</p><h2 id="community-invite-title">Una recomendación personal vale más que otro anuncio</h2></div></div>
        <CommunityShare />
      </section>
    </div>
  )
}

function SectionTitle({ number, eyebrow, title }: { number: string; eyebrow: string; title: string }) {
  return <div className="community-section-title"><span>{number}</span><div><p>{eyebrow}</p><h2>{title}</h2></div></div>
}
