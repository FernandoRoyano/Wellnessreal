import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ProgramaDocumento from '@/components/programa/ProgramaDocumento'
import ProgramaTeaser from '@/components/programa/ProgramaTeaser'
import ConfirmandoPago from '@/components/programa/ConfirmandoPago'
import GestionSuscripcion from '@/components/programa/GestionSuscripcion'
import type { Programa } from '@/lib/programa-schema'

export const metadata: Metadata = {
  title: 'Tu plan · WellnessReal',
  description: 'Tu plan personalizado del Método BASE.',
  robots: { index: false, follow: false },
}

export const runtime = 'nodejs'

export default async function ProgramaPublicoPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>
  searchParams: Promise<{ pago?: string }>
}) {
  const { token } = await params
  const { pago } = await searchParams

  const { data: perfil } = await supabase
    .from('cliente_perfil')
    .select('id, nombre, plan_tier, estado_suscripcion, acceso_hasta, cancela_en')
    .eq('token', token)
    .maybeSingle()

  if (!perfil) notFound()

  // Acceso por ventana de suscripción: estado válido (incluye past_due = gracia)
  // y dentro del periodo ya pagado.
  const estadoOk = ['active', 'trialing', 'past_due'].includes(perfil.estado_suscripcion ?? '')
  const enVentana = perfil.acceso_hasta ? new Date(perfil.acceso_hasta) > new Date() : false
  const pagado = estadoOk && enVentana

  // Plan vigente (revisado o no) — para el teaser de pago.
  const { data: vigenteRow } = await supabase
    .from('programas_generados')
    .select('programa')
    .eq('cliente_id', perfil.id)
    .eq('vigente', true)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle()

  // Último plan APROBADO (revisado) — lo que ve el cliente una vez pagado/entregado.
  const { data: aprobadoRow } = await supabase
    .from('programas_generados')
    .select('programa')
    .eq('cliente_id', perfil.id)
    .eq('revisado', true)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle()

  // --- No ha pagado: muro de pago con el adelanto ---
  if (!pagado) {
    // Acaba de pagar pero el webhook aún no ha confirmado: pantalla de espera
    // en vez del muro (evita mostrar el paywall justo tras pagar).
    if (pago === 'ok') {
      return <Shell><ConfirmandoPago nombre={perfil.nombre} /></Shell>
    }
    if (!vigenteRow) {
      return <Shell><EnPreparacion nombre={perfil.nombre} /></Shell>
    }
    return (
      <>
        {pago === 'cancelado' && <Banner tipo="cancelado" />}
        <ProgramaTeaser
          programa={vigenteRow.programa as Programa}
          nombre={perfil.nombre}
          clienteId={perfil.id}
        />
      </>
    )
  }

  // --- Ha pagado pero el plan revisado aún no está listo (tier 'revisado') ---
  if (!aprobadoRow) {
    return (
      <Shell>
        {pago === 'ok' && <Banner tipo="ok" />}
        <EnPreparacion nombre={perfil.nombre} pagado />
        <GestionSuscripcion token={token} cancelaEn={perfil.cancela_en} />
      </Shell>
    )
  }

  // --- Pagado y entregado: plan completo ---
  return (
    <Shell>
      {pago === 'ok' && <Banner tipo="ok" />}
      <ProgramaDocumento programa={aprobadoRow.programa as Programa} nombre={perfil.nombre} />
      <GestionSuscripcion token={token} cancelaEn={perfil.cancela_en} />
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

function Banner({ tipo }: { tipo: 'ok' | 'cancelado' }) {
  const ok = tipo === 'ok'
  return (
    <div
      style={{
        maxWidth: 760,
        margin: '18px auto 0',
        padding: '14px 18px',
        borderRadius: 12,
        textAlign: 'center',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '.95rem',
        color: ok ? '#bbf7d0' : '#fed7aa',
        background: ok ? 'rgba(74,222,128,.12)' : 'rgba(251,146,60,.12)',
        border: `1px solid ${ok ? 'rgba(74,222,128,.4)' : 'rgba(251,146,60,.4)'}`,
      }}
    >
      {ok
        ? '¡Pago confirmado! Si aún no ves tu plan completo, recarga la página en unos segundos.'
        : 'Has cancelado el pago. Cuando quieras, puedes desbloquear tu plan desde las opciones de abajo.'}
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
