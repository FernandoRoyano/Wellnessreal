import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ProgramaDocumento from '@/components/programa/ProgramaDocumento'
import type { Programa } from '@/lib/programa-schema'

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
    .select('id, nombre')
    .eq('token', token)
    .maybeSingle()

  if (!perfil) notFound()

  // Siempre el último plan APROBADO (revisado). Si Fernando está preparando
  // un ajuste, el cliente sigue viendo su plan aprobado hasta que se apruebe.
  const { data: programaRow } = await supabase
    .from('programas_generados')
    .select('programa')
    .eq('cliente_id', perfil.id)
    .eq('revisado', true)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle()

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

      {programaRow ? (
        <ProgramaDocumento programa={programaRow.programa as Programa} nombre={perfil.nombre} />
      ) : (
        <EnPreparacion nombre={perfil.nombre} />
      )}
    </div>
  )
}

function EnPreparacion({ nombre }: { nombre: string }) {
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
          Fernando lo está revisando personalmente antes de dártelo. Te avisamos en cuanto esté
          listo, normalmente en 24-48h. Gracias por tu paciencia.
        </p>
      </div>
    </div>
  )
}
