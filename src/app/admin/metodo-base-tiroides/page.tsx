import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  CreditCard,
  Eye,
  FileCheck2,
  ListChecks,
  Sparkles,
  Users,
} from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { isAdminAuthenticated } from '@/lib/auth'
import { THYROID_PROGRAM } from '@/lib/metodo-tiroides'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

interface ApplicationRow {
  id: string
  nombre: string
  email: string
  estado: 'nueva' | 'contactada' | 'aceptada' | 'pagada' | 'descartada'
  creado_en: string
  notas: string | null
}

interface ProgramRow {
  id: string
  revisado: boolean
  cliente_id: string | null
}

async function getProgramOverview() {
  const [applicationsResult, programsResult] = await Promise.all([
    supabase
      .from('asesoria_solicitudes')
      .select('id, nombre, email, estado, creado_en, notas')
      .order('creado_en', { ascending: false })
      .limit(100),
    supabase
      .from('programas_generados')
      .select('id, revisado, cliente_id')
      .eq('vigente', true)
      .limit(100),
  ])

  if (applicationsResult.error) {
    throw new Error(`[MetodoBaseAdmin:applications] ${applicationsResult.error.message}`)
  }
  if (programsResult.error) {
    throw new Error(`[MetodoBaseAdmin:programs] ${programsResult.error.message}`)
  }

  const applications = (applicationsResult.data ?? []) as ApplicationRow[]
  const programs = (programsResult.data ?? []) as ProgramRow[]
  return { applications, programs }
}

export default async function MetodoBaseTiroidesAdminPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin')

  const { applications, programs } = await getProgramOverview()
  const paid = applications.filter((item) => item.estado === 'pagada')
  const accepted = applications.filter((item) => item.estado === 'aceptada')
  const pendingPrograms = programs.filter((item) => !item.revisado)
  const reviewedPrograms = programs.filter((item) => item.revisado)
  const firstInstallments = paid.filter((item) => item.notas?.includes('[payment:installments:1]'))
  const secondInstallments = paid.filter((item) => item.notas?.includes('[payment:installments:2]'))
  const oneTimePayments = paid.filter((item) => item.notas?.includes('[payment:one_time]'))
  const pendingSecondPayments = Math.max(0, firstInstallments.length - secondInstallments.length)
  const confirmedRevenue = oneTimePayments.length * THYROID_PROGRAM.price
    + firstInstallments.length * THYROID_PROGRAM.installmentPrice
    + secondInstallments.length * THYROID_PROGRAM.installmentPrice

  const workflow = [
    {
      title: 'Solicitudes y admisión',
      description: `${applications.length} solicitudes · ${accepted.length} aceptadas`,
      href: '/admin/comunidad/asesoria',
      icon: Users,
      status: accepted.length > 0 ? 'attention' : 'ready',
    },
    {
      title: 'Planes personalizados',
      description: `${pendingPrograms.length} por revisar · ${reviewedPrograms.length} aprobados`,
      href: '/admin/programas',
      icon: FileCheck2,
      status: pendingPrograms.length > 0 ? 'attention' : 'ready',
    },
    {
      title: 'Área premium',
      description: 'Calendario, plan, check-in e historial del cliente',
      href: '/admin/metodo-base-tiroides-preview',
      icon: Eye,
      status: 'ready',
    },
    {
      title: 'Funnel y conversión',
      description: 'Captación, clase, solicitud, venta e incorporación',
      href: '/admin/funnel-tiroides',
      icon: ListChecks,
      status: 'ready',
    },
  ] as const

  return (
    <div className="flex min-h-screen bg-[#100d24] text-white">
      <AdminSidebar />
      <main className="min-w-0 flex-1 px-5 pb-24 pt-7 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <header className="overflow-hidden rounded-[2rem] border border-[#FCEE21]/20 bg-[linear-gradient(135deg,rgba(252,238,33,.13),transparent_52%),#17132f] p-7 sm:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[#FCEE21]"><Sparkles size={15} /> Producto de pago</p>
                <h1 className="headline mt-4 text-[clamp(2.5rem,7vw,5.2rem)] leading-[.94]">Método BASE<br /><em className="text-[#FCEE21]">Tiroides.</em></h1>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60">Centro operativo de la primera edición: desde la solicitud hasta la entrega del plan y las doce semanas de seguimiento.</p>
              </div>
              <a href="/metodo-tiroides" target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#FCEE21] px-6 text-sm font-bold text-[#100d24] transition hover:brightness-105">
                Ver página de venta <ArrowUpRight size={16} />
              </a>
            </div>
          </header>

          <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Estado del programa">
            <Metric icon={<Users size={18} />} label="Solicitudes" value={applications.length} note={`${paid.length} pagos confirmados`} />
            <Metric icon={<CreditCard size={18} />} label="Facturación confirmada" value={`${confirmedRevenue} €`} note={`${pendingSecondPayments} segundos pagos pendientes`} />
            <Metric icon={<FileCheck2 size={18} />} label="Planes aprobados" value={reviewedPrograms.length} note={`${pendingPrograms.length} pendientes de revisar`} />
            <Metric icon={<CalendarDays size={18} />} label="Inicio" value="2 nov" note="12 semanas · 10 plazas máximo" />
          </section>

          <section className="mt-10">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#FCEE21]">Flujo completo</p><h2 className="headline mt-2 text-3xl">Gestiona el programa desde aquí.</h2></div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {workflow.map(({ title, description, href, icon: Icon, status }) => (
                <Link key={href} href={href} className="group flex min-h-40 flex-col justify-between rounded-2xl border border-white/10 bg-white/[.035] p-6 transition hover:-translate-y-1 hover:border-[#FCEE21]/30 hover:bg-[#FCEE21]/[.055]">
                  <div className="flex items-start justify-between gap-4"><Icon className="text-[#FCEE21]" /><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${status === 'attention' ? 'bg-amber-400/10 text-amber-300' : 'bg-emerald-400/10 text-emerald-300'}`}>{status === 'attention' ? <CircleAlert size={12} /> : <CheckCircle2 size={12} />}{status === 'attention' ? 'Requiere atención' : 'Operativo'}</span></div>
                  <div><h3 className="text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-white/50">{description}</p><span className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#FCEE21]">Abrir gestión <ArrowUpRight size={14} /></span></div>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-10 rounded-2xl border border-white/10 bg-[#17132f] p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#FCEE21]">Entrega</p><h2 className="headline mt-2 text-2xl">La experiencia de pago ya tiene una puerta visible.</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/50">Los clientes con pago confirmado o acceso manual ven Método BASE en su menú de comunidad. El plan aparece cuando está revisado y aprobado.</p></div>
              <Link href="/admin/programas" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-white/15 px-5 text-sm font-bold hover:border-[#FCEE21]/40 hover:text-[#FCEE21]">Revisar planes <ArrowUpRight size={15} /></Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

function Metric({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string | number; note: string }) {
  return <article className="rounded-2xl border border-white/10 bg-[#17132f] p-5"><div className="flex items-center gap-2 text-[#FCEE21]">{icon}<span className="text-[10px] font-bold uppercase tracking-[.12em] text-white/40">{label}</span></div><strong className="mt-5 block text-3xl">{value}</strong><small className="mt-1 block text-xs text-white/40">{note}</small></article>
}
