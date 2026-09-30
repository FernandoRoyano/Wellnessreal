import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, ArrowRight, CalendarDays, PlayCircle, Video } from 'lucide-react'
import { getLessons, getSessionMember, getSpace, memberHasPremium } from '@/lib/db/comunidad'

export const metadata = { title: 'Directos y grabaciones · Método BASE Tiroides', robots: { index: false, follow: false } }

function sessionDate(slug: string): Date | null {
  const match = slug.match(/^directo-(\d{4}-\d{2}-\d{2})-/)
  return match ? new Date(`${match[1]}T12:00:00`) : null
}

export default async function ThyroidLiveSessionsPage() {
  const member = await getSessionMember()
  if (!member) redirect('/comunidad/entrar?next=/comunidad/metodo-base-tiroides/directos')
  if (!(await memberHasPremium(member))) redirect('/metodo-tiroides')
  const space = await getSpace('metodo-base-tiroides', member)
  if (!space) redirect('/comunidad')
  const lessons = await getLessons(space.id, member)
  const sessions = lessons.filter((lesson) => lesson.slug.startsWith('directo-') && !lesson.locked).sort((a, b) => (sessionDate(b.slug)?.getTime() ?? 0) - (sessionDate(a.slug)?.getTime() ?? 0))

  return <main className="pb-16 text-white"><Link href="/comunidad/metodo-base-tiroides" className="inline-flex items-center gap-2 text-sm text-white/45 hover:text-white"><ArrowLeft size={15} /> Volver al programa</Link>
    <header className="mt-7 max-w-3xl"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#FCEE21]"><Video size={15} /> Solo participantes</p><h1 className="headline mt-4 text-[clamp(2.5rem,7vw,5rem)] leading-[.95]">Directos y<br /><em className="text-[#FCEE21]">grabaciones.</em></h1><p className="mt-5 text-base leading-relaxed text-white/55">Las clases del programa, ordenadas por fecha y temática. Vuelve cuando necesites repasar una decisión concreta.</p></header>
    {sessions.length === 0 ? <section className="mt-10 rounded-2xl border border-dashed border-white/15 bg-white/[.025] p-10 text-center"><PlayCircle className="mx-auto text-white/25" size={34} /><h2 className="mt-4 font-bold">La biblioteca está preparada</h2><p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/45">La primera grabación aparecerá aquí después del directo. No publicaremos contenido de relleno.</p></section> : <ol className="mt-10 grid gap-4 md:grid-cols-2">{sessions.map((session) => { const date = sessionDate(session.slug); const [title, topic] = session.title.split(' · '); return <li key={session.id}><Link href={`/comunidad/metodo-base-tiroides/${session.slug}`} className="group flex h-full min-h-56 flex-col justify-between rounded-2xl border border-white/10 bg-[#17132f] p-6 transition hover:-translate-y-1 hover:border-[#FCEE21]/30"><div className="flex items-start justify-between"><PlayCircle className="text-[#FCEE21]" /><span className="rounded-full bg-white/[.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white/45">{topic ?? 'Directo'}</span></div><div><p className="flex items-center gap-2 text-xs text-white/35"><CalendarDays size={13} /> {date ? new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(date) : 'Fecha pendiente'}</p><h2 className="mt-3 text-lg font-bold">{title}</h2><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#FCEE21]">Ver clase <ArrowRight size={15} /></span></div></Link></li> })}</ol>}
  </main>
}
