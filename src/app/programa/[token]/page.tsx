import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ProgramaDocumento from '@/components/programa/ProgramaDocumento'
import CheckinProgreso from '@/components/programa/CheckinProgreso'
import type { Programa } from '@/lib/programa-schema'
import { Download } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tu plan · WellnessReal',
  description: 'Tu plan personalizado del Método BASE.',
  robots: { index: false, follow: false },
}

export const runtime = 'nodejs'

export default async function ProgramaPublicoPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const { data: perfil } = await supabase
    .from('cliente_perfil')
    .select('id, nombre, email, plan_tier, acceso_manual, pagado_en')
    .eq('token', token)
    .maybeSingle()

  if (!perfil) notFound()

  const tieneAcceso = perfil.acceso_manual === true

  // Plan vigente (revisado o no) — para el teaser de pago y el check-in.
  const { data: vigenteRow } = await supabase
    .from('programas_generados')
    .select('programa, creado_en, revisado')
    .eq('cliente_id', perfil.id)
    .eq('vigente', true)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle()

  // Elegibilidad del check-in de progreso: plan vigente revisado con ≥4 semanas.
  // Ancla = lo más reciente entre el alta (pagado_en) y la fecha del plan vigente,
  // para que un recién suscrito no pueda progresar el día 1.
  const anclaMs = Math.max(
    vigenteRow?.creado_en ? new Date(vigenteRow.creado_en).getTime() : 0,
    perfil.pagado_en ? new Date(perfil.pagado_en).getTime() : 0,
  )
  // Es una página dinámica: el cálculo debe usar el momento real de cada petición.
  // eslint-disable-next-line react-hooks/purity
  const diasDesde = anclaMs ? (Date.now() - anclaMs) / (1000 * 60 * 60 * 24) : 0
  const { data: thyroidPayment } = await supabase
    .from('asesoria_solicitudes')
    .select('id')
    .ilike('email', perfil.email)
    .eq('estado', 'pagada')
    .limit(1)
    .maybeSingle()
  const cycleWeeks = thyroidPayment ? 3 : 4
  const cycleDays = cycleWeeks * 7
  const enRevision = vigenteRow?.revisado === false
  const puedeActualizar = !!vigenteRow && vigenteRow.revisado === true && diasDesde >= cycleDays
  const disponibleEnDias = Math.max(0, Math.ceil(cycleDays - diasDesde))

  // Último plan APROBADO (revisado) — lo que ve el cliente una vez pagado/entregado.
  const { data: aprobadoRow } = await supabase
    .from('programas_generados')
    .select('programa')
    .eq('cliente_id', perfil.id)
    .eq('revisado', true)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!tieneAcceso) return <Shell><EnPreparacion nombre={perfil.nombre} /></Shell>

  // --- Ha pagado pero el plan revisado aún no está listo (tier 'revisado') ---
  if (!aprobadoRow) {
    return (
      <Shell>
        <EnPreparacion nombre={perfil.nombre} pagado />
      </Shell>
    )
  }

  // --- Pagado y entregado: plan completo ---
  return (
    <Shell>
      <div className="mx-auto flex max-w-[760px] justify-end px-5 pt-5">
        <a href={`/api/programa/${token}/pdf`} className="inline-flex items-center gap-2 rounded-lg bg-[#FCEE21] px-4 py-2.5 text-sm font-bold text-[#16122B] transition hover:brightness-105">
          <Download size={17} /> Descargar plan en PDF
        </a>
      </div>
      <ProgramaDocumento programa={aprobadoRow.programa as Programa} nombre={perfil.nombre} />
      <CheckinProgreso
        token={token}
        tier={perfil.plan_tier}
        puedeActualizar={puedeActualizar}
        enRevision={enRevision}
        disponibleEnDias={disponibleEnDias}
        cycleWeeks={cycleWeeks}
      />
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: '#16122B', minHeight: '100vh' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '22px 20px',
          borderBottom: '1px solid rgba(255,255,255,.08)',
        }}
      >
        <Image
          src="/images/logos/WR_AUX_normal_bg.png"
          alt="WellnessReal"
          width={140}
          height={32}
          style={{ height: 30, width: 'auto' }}
          priority
        />
      </header>
      {children}
    </div>
  )
}

function EnPreparacion({ nombre, pagado = false }: { nombre: string; pagado?: boolean }) {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '48px 24px',
        fontFamily: "'DM Sans', sans-serif",
        color: '#FBFAF6',
      }}
    >
      <div style={{ maxWidth: 480 }}>
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            background: 'rgba(252,238,33,.12)',
            border: '1px solid rgba(252,238,33,.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 26px',
            fontSize: 32,
          }}
        >
          ⏳
        </div>
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(1.6rem,5vw,2.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: 16,
          }}
        >
          {nombre.split(' ')[0]}, tu plan está <span style={{ color: '#FCEE21' }}>en preparación</span>
        </h1>
        <p style={{ color: '#958D99', fontSize: '1.05rem', lineHeight: 1.7 }}>
          {pagado
            ? 'Gracias por tu pago. Fernando está revisando tu plan personalmente antes de dártelo. Te avisamos en cuanto esté listo, normalmente en 24-48h.'
            : 'Fernando lo está revisando personalmente antes de dártelo. Te avisamos en cuanto esté listo, normalmente en 24-48h. Gracias por tu paciencia.'}
        </p>
      </div>
    </div>
  )
}
