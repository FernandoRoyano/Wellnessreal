import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, BookOpen, Check, Download, FileText, MessageCircle, Route } from 'lucide-react'
import { Avatar } from '@/components/comunidad/Avatar'
import { timeAgo } from '@/lib/comunidad-format'
import {
  getLessons,
  getOnlineMembers,
  getRecentThreads,
  getSessionMember,
  getSpacesOverview,
} from '@/lib/db/comunidad'
import { getCompletedLessonIds } from '@/lib/community-progress'

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

  const [spaces, recent, online, completedIds] = await Promise.all([
    getSpacesOverview(member),
    getRecentThreads(member, 4),
    getOnlineMembers(),
    getCompletedLessonIds(),
  ])
  const contentSpaces = spaces.filter((space) => space.type === 'content')
  const lessonGroups = await Promise.all(contentSpaces.map((space) => getLessons(space.id, member)))
  const unlockedLessons = lessonGroups.flat().filter((lesson) => !lesson.locked)
  const completedCount = unlockedLessons.filter((lesson) => completedIds.has(lesson.id)).length
  const nextLesson = unlockedLessons.find((lesson) => !completedIds.has(lesson.id)) ?? unlockedLessons[0]
  const nextSpace = nextLesson
    ? contentSpaces[lessonGroups.findIndex((lessons) => lessons.some((lesson) => lesson.id === nextLesson.id))]
    : null
  const progress = unlockedLessons.length ? Math.round((completedCount / unlockedLessons.length) * 100) : 0

  return (
    <div className="community-home animate-[fadeUp_500ms_var(--ease-out)_both]">
      <header className="community-journey">
        <div className="community-journey-copy">
          <p className="community-eyebrow"><Route className="h-4 w-4" /> Tu recorrido</p>
          <h1 className="headline">Hola, {member.display_name.split(' ')[0]}.<br />Una cosa cada vez.</h1>
          <p>No necesitas hacerlo perfecto. Necesitas entender qué te pasa, elegir una acción posible y repetirla.</p>
          {nextLesson && nextSpace && (
            <Link href={`/comunidad/${nextSpace.slug}/${nextLesson.slug}`} className="community-primary-action">
              Continuar por aquí <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
        <div className="community-score" style={{ '--journey-progress': `${progress * 3.6}deg` } as CSSProperties}>
          <div><strong>{progress}%</strong><span>completado</span></div>
          <p>{completedCount} de {unlockedLessons.length} lecciones disponibles</p>
        </div>
      </header>

      {nextLesson && nextSpace && (
        <section className="community-next">
          <SectionTitle number="01" eyebrow="Tu siguiente paso" title="Hoy solo necesitas esto" />
          <Link href={`/comunidad/${nextSpace.slug}/${nextLesson.slug}`} className="community-feature-card">
            {nextLesson.cover_url && <Image src={nextLesson.cover_url} alt="" width={900} height={520} />}
            <div>
              <p>{nextSpace.name} · {Math.max(1, Math.ceil(nextLesson.content.replace(/<[^>]*>/g, ' ').split(/\s+/).length / 210))} min</p>
              <h3>{nextLesson.title}</h3>
              <span>Empezar la lección <ArrowRight className="h-4 w-4" /></span>
            </div>
          </Link>
        </section>
      )}

      <section className="community-map">
        <SectionTitle number="02" eyebrow="Mapa de aprendizaje" title="Un sistema, no una colección de consejos" />
        <div className="community-map-grid">
          {contentSpaces.map((space, index) => {
            const available = lessonGroups[index].filter((lesson) => !lesson.locked)
            const done = available.filter((lesson) => completedIds.has(lesson.id)).length
            const percentage = available.length ? Math.round((done / available.length) * 100) : 0
            return (
              <Link href={`/comunidad/${space.slug}`} key={space.id} className="community-map-card">
                <div><span>0{index + 1}</span><BookOpen className="h-5 w-5" /></div>
                <h3>{space.name}</h3><p>{space.description}</p>
                <div className="community-map-progress"><span style={{ width: `${percentage}%` }} /></div>
                <small>{done}/{available.length} completadas</small>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="community-library">
        <SectionTitle number="03" eyebrow="Biblioteca práctica" title="Herramientas que puedes usar hoy" />
        <div className="community-resource-grid">
          {resources.map((resource) => (
            <a key={resource.href} href={resource.href} target="_blank" rel="noreferrer" className="community-resource-card">
              <FileText className="h-6 w-6" /><div><h3>{resource.title}</h3><p>{resource.description}</p></div><Download className="h-4 w-4" />
            </a>
          ))}
        </div>
      </section>

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
    </div>
  )
}

function SectionTitle({ number, eyebrow, title }: { number: string; eyebrow: string; title: string }) {
  return <div className="community-section-title"><span>{number}</span><div><p>{eyebrow}</p><h2>{title}</h2></div></div>
}
