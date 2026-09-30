import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Dumbbell,
  History,
  PlayCircle,
  Sparkles,
} from 'lucide-react'
import { getSessionMember, memberHasPremium } from '@/lib/db/comunidad'
import { supabase } from '@/lib/supabase'
import { THYROID_PROGRAM, THYROID_PROGRAM_WEEKS } from '@/lib/metodo-tiroides'

export const metadata: Metadata = {
  title: 'Método BASE Tiroides · Tu programa',
  robots: { index: false, follow: false },
}

interface ClientProfile {
  id: string
  token: string
  semana_actual: number | null
  estado_programa: string | null
}

interface ClientEvent {
  id: string
  creado_en: string
  semana: number | null
  tipo: string
  contenido: Record<string, unknown>
}

function programWeek(now = new Date()): number {
  const start = new Date(`${THYROID_PROGRAM.startDate}T00:00:00+01:00`)
  if (now < start) return 0
  const elapsed = Math.floor((now.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1
  return Math.min(12, Math.max(1, elapsed))
}

function weekDates(week: number): string {
  const start = new Date(`${THYROID_PROGRAM.startDate}T12:00:00+01:00`)
  start.setDate(start.getDate() + (week - 1) * 7)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  const format = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' })
  return `${format.format(start)} – ${format.format(end)}`
}

function eventSummary(event: ClientEvent): string {
  const summary = event.contenido.resumen_cambios ?? event.contenido.mensaje
  if (typeof summary === 'string' && summary.trim()) return summary
  if (event.tipo === 'check_in') return 'Check-in registrado para revisar el contexto de la semana.'
  if (event.tipo === 'ajuste') return 'Nueva versión del plan preparada a partir de la revisión.'
  return 'Actualización registrada en tu proceso.'
}

export default async function MetodoBaseTiroidesMemberPage() {
  const member = await getSessionMember()
  if (!member) redirect('/comunidad/entrar?next=/comunidad/metodo-base-tiroides')
  if (!(await memberHasPremium(member))) redirect('/metodo-tiroides')

  let profile: ClientProfile | null = null
  if (member.cliente_id) {
    const { data } = await supabase
      .from('cliente_perfil')
      .select('id, token, semana_actual, estado_programa')
      .eq('id', member.cliente_id)
      .maybeSingle()
    profile = data as ClientProfile | null
  }
  if (!profile) {
    const { data } = await supabase
      .from('cliente_perfil')
      .select('id, token, semana_actual, estado_programa')
      .ilike('email', member.email)
      .maybeSingle()
    profile = data as ClientProfile | null
  }

  const [programResult, eventsResult] = profile
    ? await Promise.all([
        supabase
          .from('programas_generados')
          .select('id, version, revisado, creado_en')
          .eq('cliente_id', profile.id)
          .eq('vigente', true)
          .order('version', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('eventos_cliente')
          .select('id, creado_en, semana, tipo, contenido')
          .eq('cliente_id', profile.id)
          .order('creado_en', { ascending: false })
          .limit(5),
      ])
    : [{ data: null }, { data: [] }]

  const reportedWeek = profile?.semana_actual ?? programWeek()
  const currentWeek = Math.min(12, Math.max(0, reportedWeek))
  const week = currentWeek > 0 ? THYROID_PROGRAM_WEEKS[currentWeek - 1] : null
  const programReady = Boolean(programResult.data?.revisado && profile?.token)
  const events = (eventsResult.data ?? []) as ClientEvent[]

  return (
    <main className="space-y-12 pb-16 text-white animate-[fadeUp_500ms_var(--ease-out)_both]">
      <header className="overflow-hidden rounded-[2rem] border border-[#FCEE21]/20 bg-[linear-gradient(135deg,rgba(252,238,33,.12),transparent_48%),#21182f] p-7 sm:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#FCEE21]"><Sparkles size={15} /> Tu espacio premium</p>
            <h1 className="headline mt-5 text-[clamp(2.5rem,7vw,5.5rem)] leading-[.95]">Método BASE<br /><em className="text-[#FCEE21]">Tiroides.</em></h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60">Tu plan, la decisión de esta semana y el historial de ajustes en un solo lugar.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/15 px-6 py-5 lg:min-w-56">
            <small className="text-xs uppercase tracking-wider text-white/40">Estado actual</small>
            <strong className="mt-2 block text-xl text-white">{currentWeek === 0 ? 'Preparación' : `Semana ${currentWeek} de 12`}</strong>
            <span className="mt-1 block text-sm text-[#FCEE21]">{week?.title ?? `Comienza el ${THYROID_PROGRAM.startDateLabel}`}</span>
          </div>
        </div>
      </header>

      <section aria-labelledby="ahora" className="space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.14em] text-[#FCEE21]">Empieza aquí</p>
          <h2 id="ahora" className="headline mt-2 text-3xl">Lo que necesitas ahora.</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {programReady ? (
            <Link href={`/programa/${profile?.token}`} className="group rounded-2xl border border-[#FCEE21]/25 bg-[#FCEE21]/[.07] p-6 transition hover:-translate-y-1 hover:bg-[#FCEE21]/[.1]">
              <Dumbbell className="text-[#FCEE21]" />
              <h3 className="mt-8 text-lg font-bold">Abrir mi plan</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">Consulta ejercicios, alternativas, progresión y alimentación.</p>
              <span className="mt-6 flex items-center gap-2 text-sm font-bold text-[#FCEE21]">Ver plan <ArrowRight size={15} className="transition group-hover:translate-x-1" /></span>
            </Link>
          ) : (
            <article className="rounded-2xl border border-white/10 bg-white/[.035] p-6">
              <Dumbbell className="text-white/45" />
              <h3 className="mt-8 text-lg font-bold">Plan en preparación</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">Aparecerá aquí cuando Fernando termine de revisarlo y aprobarlo.</p>
            </article>
          )}
          <Link href="/comunidad/mi-semana#checkin" className="group rounded-2xl border border-white/10 bg-white/[.035] p-6 transition hover:-translate-y-1 hover:border-white/20">
            <ClipboardCheck className="text-[#FCEE21]" />
            <h3 className="mt-8 text-lg font-bold">Completar check-in</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/50">Registra contexto, recuperación y lo que realmente pudiste hacer.</p>
            <span className="mt-6 flex items-center gap-2 text-sm font-bold text-white">Ir al check-in <ArrowRight size={15} className="transition group-hover:translate-x-1" /></span>
          </Link>
          <a href="#calendario" className="group rounded-2xl border border-white/10 bg-white/[.035] p-6 transition hover:-translate-y-1 hover:border-white/20">
            <CalendarDays className="text-[#FCEE21]" />
            <h3 className="mt-8 text-lg font-bold">Ver el recorrido</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/50">Ubica la semana actual, las revisiones y el siguiente hito.</p>
            <span className="mt-6 flex items-center gap-2 text-sm font-bold text-white">Abrir calendario <ArrowRight size={15} className="transition group-hover:translate-x-1" /></span>
          </a>
        </div>
      </section>

      {week && (
        <section className="grid gap-6 rounded-3xl border border-white/10 bg-[#17132f] p-7 md:grid-cols-[auto_1fr] md:p-9">
          <span className="headline text-6xl text-[#FCEE21]">{String(week.week).padStart(2, '0')}</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-white/40">Decisión de esta semana · {weekDates(week.week)}</p>
            <h2 className="headline mt-3 text-3xl">{week.title}</h2>
            <p className="mt-3 text-base leading-relaxed text-white/60">{week.outcome}</p>
          </div>
        </section>
      )}

      <section id="calendario" aria-labelledby="recorrido" className="space-y-6 scroll-mt-24">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.14em] text-[#FCEE21]">Calendario del programa</p>
          <h2 id="recorrido" className="headline mt-2 text-3xl">Doce semanas, doce decisiones.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/50">El enlace y horario del directo aparecerán en este espacio cuando queden confirmados. Las revisiones individuales se acuerdan contigo.</p>
        </div>
        <ol className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {THYROID_PROGRAM_WEEKS.map((item) => {
            const isCurrent = item.week === currentWeek
            const isPast = currentWeek > 0 && item.week < currentWeek
            return (
              <li key={item.week} className={`p-5 ${isCurrent ? 'bg-[#FCEE21]/10' : 'bg-[#17132f]'}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isCurrent ? 'text-[#FCEE21]' : 'text-white/35'}`}>Semana {item.week}</span>
                  {isPast && <CheckCircle2 size={15} className="text-emerald-400" />}
                </div>
                <h3 className="mt-4 font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/45">{weekDates(item.week)}</p>
              </li>
            )
          })}
        </ol>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <Link href="/comunidad/metodo-base-tiroides/directos" className="group rounded-2xl border border-white/10 bg-white/[.03] p-6 transition hover:-translate-y-1 hover:border-[#FCEE21]/30">
          <div className="flex items-center gap-3"><PlayCircle className="text-[#FCEE21]" /><h2 className="headline text-2xl">Directos y grabaciones</h2></div>
          <div className="mt-8 rounded-xl border border-dashed border-white/15 p-6 text-center">
            <p className="font-semibold text-white">La biblioteca está preparada</p>
            <p className="mt-2 text-sm leading-relaxed text-white/45">Las grabaciones se clasifican por fecha y temática y solo están disponibles para participantes.</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#FCEE21]">Abrir biblioteca <ArrowRight size={15} /></span>
          </div>
        </Link>
        <article className="rounded-2xl border border-white/10 bg-white/[.03] p-6">
          <div className="flex items-center gap-3"><History className="text-[#FCEE21]" /><h2 className="headline text-2xl">Decisiones y ajustes</h2></div>
          {events.length ? (
            <ol className="mt-6 space-y-4">
              {events.map((event) => (
                <li key={event.id} className="border-l border-white/15 pl-4">
                  <p className="text-sm leading-relaxed text-white/75">{eventSummary(event)}</p>
                  <small className="mt-1 block text-xs text-white/35">{event.semana ? `Semana ${event.semana} · ` : ''}{new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(new Date(event.creado_en))}</small>
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-8 rounded-xl border border-dashed border-white/15 p-6 text-center">
              <p className="font-semibold text-white">Todavía no hay ajustes</p>
              <p className="mt-2 text-sm leading-relaxed text-white/45">Aquí aparecerán las decisiones que tomemos a partir de tus revisiones.</p>
            </div>
          )}
        </article>
      </section>
    </main>
  )
}
