import Link from 'next/link'
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, ClipboardCheck, Dumbbell, Eye, History, PlayCircle, Sparkles } from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { THYROID_PROGRAM_WEEKS } from '@/lib/metodo-tiroides'

const currentWeek = 4
const quickActions = [
  { icon: Dumbbell, title: 'Abrir mi plan', copy: 'Ejercicios, alternativas y progresión.' },
  { icon: ClipboardCheck, title: 'Completar check-in', copy: 'Contexto y recuperación semanal.' },
  { icon: CalendarDays, title: 'Ver el recorrido', copy: 'Semanas, revisiones y siguiente hito.' },
]

export default function MetodoBaseTiroidesPreviewPage() {
  const week = THYROID_PROGRAM_WEEKS[currentWeek - 1]
  return <div className="flex min-h-screen bg-[#100d24] text-white">
    <AdminSidebar />
    <main className="min-w-0 flex-1 px-5 pb-24 pt-6 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#FCEE21]/20 bg-[#FCEE21]/[.07] px-4 py-3">
          <span className="flex items-center gap-2 text-xs font-bold text-[#FCEE21]"><Eye size={15}/> Vista demo administrativa</span>
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-xs text-white/65 hover:text-white"><ArrowLeft size={14}/> Volver al dashboard</Link>
        </div>
        <div className="space-y-12 rounded-[2rem] border border-white/10 bg-[#16122b] p-4 shadow-2xl sm:p-8">
          <header className="overflow-hidden rounded-[2rem] border border-[#FCEE21]/20 bg-[linear-gradient(135deg,rgba(252,238,33,.12),transparent_48%),#21182f] p-7 sm:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#FCEE21]"><Sparkles size={15}/> Tu espacio premium</p><h1 className="headline mt-5 text-[clamp(2.5rem,7vw,5.5rem)] leading-[.95]">Método BASE<br/><em className="text-[#FCEE21]">Tiroides.</em></h1><p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60">Tu plan, la decisión de esta semana y el historial de ajustes en un solo lugar.</p></div>
              <div className="rounded-2xl border border-white/10 bg-black/15 px-6 py-5 lg:min-w-56"><small className="text-xs uppercase tracking-wider text-white/40">Estado de demostración</small><strong className="mt-2 block text-xl">Semana {currentWeek} de 12</strong><span className="mt-1 block text-sm text-[#FCEE21]">{week.title}</span></div>
            </div>
          </header>

          <section><p className="text-xs font-bold uppercase tracking-[.14em] text-[#FCEE21]">Empieza aquí</p><h2 className="headline mt-2 text-3xl">Lo que necesita el cliente ahora.</h2><div className="mt-5 grid gap-3 md:grid-cols-3">{quickActions.map(({ icon: Icon, title, copy }) => <article key={title} className="rounded-2xl border border-white/10 bg-white/[.035] p-6"><Icon className="text-[#FCEE21]"/><h3 className="mt-8 text-lg font-bold">{title}</h3><p className="mt-2 text-sm text-white/50">{copy}</p><span className="mt-6 flex items-center gap-2 text-sm font-bold">Vista de ejemplo <ArrowRight size={15}/></span></article>)}</div></section>

          <section className="grid gap-6 rounded-3xl border border-white/10 bg-[#17132f] p-7 md:grid-cols-[auto_1fr]"><span className="headline text-6xl text-[#FCEE21]">04</span><div><p className="text-xs font-bold uppercase tracking-[.14em] text-white/40">Decisión de esta semana</p><h2 className="headline mt-3 text-3xl">{week.title}</h2><p className="mt-3 text-white/60">{week.outcome}</p></div></section>

          <section><p className="text-xs font-bold uppercase tracking-[.14em] text-[#FCEE21]">Calendario del programa</p><h2 className="headline mt-2 text-3xl">Doce semanas, doce decisiones.</h2><ol className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">{THYROID_PROGRAM_WEEKS.map(item => <li key={item.week} className={`p-5 ${item.week === currentWeek ? 'bg-[#FCEE21]/10' : 'bg-[#17132f]'}`}><div className="flex justify-between"><span className={`text-xs font-bold uppercase ${item.week === currentWeek ? 'text-[#FCEE21]' : 'text-white/35'}`}>Semana {item.week}</span>{item.week < currentWeek && <CheckCircle2 size={15} className="text-emerald-400"/>}</div><h3 className="mt-4 font-bold">{item.title}</h3><p className="mt-2 text-xs leading-relaxed text-white/45">{item.outcome}</p></li>)}</ol></section>

          <section className="grid gap-5 lg:grid-cols-2"><article className="rounded-2xl border border-white/10 bg-white/[.03] p-6"><div className="flex items-center gap-3"><PlayCircle className="text-[#FCEE21]"/><h2 className="headline text-2xl">Directos y grabaciones</h2></div><p className="mt-8 rounded-xl border border-dashed border-white/15 p-6 text-center text-sm text-white/45">Preparado para añadir cada grabación.</p></article><article className="rounded-2xl border border-white/10 bg-white/[.03] p-6"><div className="flex items-center gap-3"><History className="text-[#FCEE21]"/><h2 className="headline text-2xl">Decisiones y ajustes</h2></div><div className="mt-6 border-l border-white/15 pl-4"><p className="text-sm text-white/75">Volumen reducido en la segunda sesión para mantener adherencia y recuperación.</p><small className="mt-1 block text-xs text-white/35">Semana 4 · Ejemplo</small></div></article></section>
        </div>
      </div>
    </main>
  </div>
}
