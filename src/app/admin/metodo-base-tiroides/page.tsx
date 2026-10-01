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
  ClipboardList,
  Mail,
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
  creado_en: string
}

interface ClientProfileRow {
  id: string
  email: string
  token: string
}

async function getProgramOverview() {
  const [applicationsResult, programsResult, profilesResult] = await Promise.all([
    supabase
      .from('asesoria_solicitudes')
      .select('id, nombre, email, estado, creado_en, notas')
      .order('creado_en', { ascending: false })
      .limit(100),
    supabase
      .from('programas_generados')
      .select('id, revisado, cliente_id, creado_en')
      .eq('vigente', true)
      .order('creado_en', { ascending: false })
      .limit(100),
    supabase
      .from('cliente_perfil')
      .select('id, email, token')
      .limit(100),
  ])

  if (applicationsResult.error) {
    throw new Error(`[MetodoBaseAdmin:applications] ${applicationsResult.error.message}`)
  }
  if (programsResult.error) {
    throw new Error(`[MetodoBaseAdmin:programs] ${programsResult.error.message}`)
  }
  if (profilesResult.error) {
    throw new Error(`[MetodoBaseAdmin:profiles] ${profilesResult.error.message}`)
  }

  const applications = (applicationsResult.data ?? []) as ApplicationRow[]
  const programs = (programsResult.data ?? []) as ProgramRow[]
  const profiles = (profilesResult.data ?? []) as ClientProfileRow[]
  return { applications, programs, profiles }
}

export default async function MetodoBaseTiroidesAdminPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin')

  const { applications, programs, profiles } = await getProgramOverview()
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
  const profileByEmail = new Map(profiles.map((profile) => [profile.email.toLowerCase(), profile]))
  const programByClient = new Map<string, ProgramRow>()
  for (const program of programs) {
    if (program.cliente_id && !programByClient.has(program.cliente_id)) {
      programByClient.set(program.cliente_id, program)
    }
  }

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
      title: 'Directos y grabaciones',
      description: 'Publicar clases por fecha y temática para participantes',
      href: '/admin/metodo-base-tiroides/directos',
      icon: CalendarDays,
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
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60">Centro operativo del programa: desde la solicitud hasta la entrega del plan y las doce semanas de seguimiento individual.</p>
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
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-[#FCEE21]">Protocolo de trabajo</p>
              <h2 className="headline mt-2 text-3xl">Un plan nuevo no parte de cero.</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/55">Cada petición sigue el mismo sistema. La plantilla BASE‑T12 fija estructura, seguridad y progresión; el cuestionario aporta el contexto individual; tú haces la revisión profesional antes de entregarlo.</p>
            </div>
            <ol className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3 xl:grid-cols-6">
              {[
                ['01', 'Admitir', 'Validas que el programa encaja.'],
                ['02', 'Confirmar pago', 'Activas el onboarding privado.'],
                ['03', 'Recoger contexto', 'La participante completa la evaluación.'],
                ['04', 'Adaptar BASE‑T12', 'Se genera un borrador desde el protocolo.'],
                ['05', 'Revisar', 'Corriges ejercicios, carga y límites.'],
                ['06', 'Activar', 'Apruebas el plan y aparece en su área.'],
              ].map(([number, title, copy]) => <li key={number} className="bg-[#100d24] p-5"><span className="text-xs font-bold text-[#FCEE21]">{number}</span><h3 className="mt-6 text-sm font-bold">{title}</h3><p className="mt-2 text-xs leading-relaxed text-white/40">{copy}</p></li>)}
            </ol>
            <Link href="/admin/programas/plantilla-base-t12" className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#FCEE21] hover:underline">Consultar el protocolo y la plantilla maestra <ArrowUpRight size={14} /></Link>
          </section>

          <section className="mt-10">
            <div className="mb-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#FCEE21]">Participantes</p><h2 className="headline mt-2 text-3xl">Siguiente acción, persona por persona.</h2></div>
            {applications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 bg-white/[.025] p-8 text-center">
                <ClipboardList className="mx-auto text-white/25" size={32} />
                <h3 className="mt-4 font-bold">Aún no hay solicitudes</h3>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-white/45">Cuando llegue una petición aparecerá aquí con su estado y la acción exacta: aceptar, cobrar, enviar evaluación, revisar o activar.</p>
                <Link href="/admin/comunidad/asesoria" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#FCEE21]">Abrir solicitudes <ArrowUpRight size={15} /></Link>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.filter((application) => application.estado !== 'descartada').map((application) => {
                  const profile = profileByEmail.get(application.email.toLowerCase())
                  const program = profile ? programByClient.get(profile.id) : undefined
                  const state = resolveParticipantState(application, profile, program)
                  const mailHref = `mailto:${application.email}?subject=${encodeURIComponent('Evaluación inicial · Método BASE Tiroides')}&body=${encodeURIComponent(`Hola ${application.nombre.split(' ')[0]},\n\nTu plaza está confirmada. El siguiente paso es completar la evaluación inicial con este mismo email:\n\nhttps://wellnessreal.es/cuestionario?origen=metodo-tiroides\n\nCuando la termines prepararé y revisaré personalmente tu primer bloque antes de activarlo.\n\nFernando`)}`
                  return <article key={application.id} className="grid gap-5 rounded-2xl border border-white/10 bg-white/[.03] p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                    <div><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold">{application.nombre}</h3><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${state.tone}`}>{state.label}</span></div><p className="mt-1 text-xs text-white/35">{application.email}</p><p className="mt-4 text-sm text-white/60"><strong className="text-white">Siguiente:</strong> {state.next}</p></div>
                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      {application.estado !== 'pagada' && <Link href="/admin/comunidad/asesoria" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-xs font-bold hover:border-[#FCEE21]/40">Gestionar solicitud <ArrowUpRight size={14} /></Link>}
                      {application.estado === 'pagada' && !profile && <a href={mailHref} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#FCEE21] px-4 text-xs font-bold text-[#100d24]"><Mail size={14} /> Enviar evaluación</a>}
                      {program && !program.revisado && <Link href={`/admin/programas/${program.id}`} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#FCEE21] px-4 text-xs font-bold text-[#100d24]">Revisar borrador <ArrowUpRight size={14} /></Link>}
                      {program?.revisado && profile && <Link href={`/programa/${profile.token}`} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-emerald-400/30 px-4 text-xs font-bold text-emerald-300">Ver plan activo <ArrowUpRight size={14} /></Link>}
                    </div>
                  </article>
                })}
              </div>
            )}
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

function resolveParticipantState(application: ApplicationRow, profile?: ClientProfileRow, program?: ProgramRow) {
  if (application.estado === 'nueva') return { label: 'Nueva solicitud', next: 'Revisar el caso y contactar.', tone: 'bg-amber-400/10 text-amber-300' }
  if (application.estado === 'contactada') return { label: 'En valoración', next: 'Aceptar o descartar después de la conversación.', tone: 'bg-blue-400/10 text-blue-300' }
  if (application.estado === 'aceptada') return { label: 'Aceptada', next: 'Generar y enviar el enlace de pago.', tone: 'bg-violet-400/10 text-violet-300' }
  if (!profile) return { label: 'Pago confirmado', next: 'Enviar la evaluación inicial. El email debe coincidir con el pago.', tone: 'bg-cyan-400/10 text-cyan-300' }
  if (!program) return { label: 'Evaluación recibida', next: 'Comprobar la generación del borrador BASE‑T12.', tone: 'bg-cyan-400/10 text-cyan-300' }
  if (!program.revisado) return { label: 'Borrador pendiente', next: 'Revisar y aprobar el plan antes de entregarlo.', tone: 'bg-amber-400/10 text-amber-300' }
  return { label: 'Plan activo', next: 'Seguir check-ins, decisiones y ajustes semanales.', tone: 'bg-emerald-400/10 text-emerald-300' }
}

function Metric({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string | number; note: string }) {
  return <article className="rounded-2xl border border-white/10 bg-[#17132f] p-5"><div className="flex items-center gap-2 text-[#FCEE21]">{icon}<span className="text-[10px] font-bold uppercase tracking-[.12em] text-white/40">{label}</span></div><strong className="mt-5 block text-3xl">{value}</strong><small className="mt-1 block text-xs text-white/40">{note}</small></article>
}
