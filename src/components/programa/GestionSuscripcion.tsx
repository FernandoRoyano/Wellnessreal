'use client'

import { useState } from 'react'

// Gestión de la suscripción desde la página del cliente: portal de Stripe
// (tarjeta/facturas) y cancelación (respeta la permanencia en el servidor).
export default function GestionSuscripcion({
  token,
  cancelaEn,
}: {
  token: string
  cancelaEn: string | null
}) {
  const [cargando, setCargando] = useState<'portal' | 'cancelar' | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const [programada, setProgramada] = useState<string | null>(cancelaEn)

  const fmt = (iso: string) => new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

  async function abrirPortal() {
    setCargando('portal')
    setAviso(null)
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else setAviso(data.error || 'No se pudo abrir el portal.')
    } catch {
      setAviso('No se pudo abrir el portal.')
    } finally {
      setCargando(null)
    }
  }

  async function cancelar() {
    if (!confirm('¿Seguro que quieres cancelar tu suscripción? Mantendrás el acceso hasta la fecha de fin.')) return
    setCargando('cancelar')
    setAviso(null)
    try {
      const res = await fetch('/api/stripe/cancelar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const data = await res.json()
      if (data.ok && data.cancela_en) {
        setProgramada(data.cancela_en)
        setAviso(
          data.dentro_permanencia
            ? `Cancelación programada. Por la permanencia mínima de 3 meses, seguirá activa hasta el ${fmt(data.cancela_en)}.`
            : `Cancelación programada. Tendrás acceso hasta el ${fmt(data.cancela_en)}.`
        )
      } else {
        setAviso(data.error || 'No se pudo cancelar.')
      }
    } catch {
      setAviso('No se pudo cancelar.')
    } finally {
      setCargando(null)
    }
  }

  return (
    <div
      style={{
        maxWidth: 760,
        margin: '28px auto 48px',
        padding: '20px 22px',
        borderRadius: 14,
        background: 'rgba(255,255,255,.04)',
        border: '1px solid rgba(255,255,255,.08)',
        fontFamily: "'DM Sans', sans-serif",
        color: '#FBFAF6',
      }}
    >
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 6 }}>Tu suscripción</h3>

      {programada ? (
        <p style={{ color: '#fed7aa', fontSize: '.92rem', lineHeight: 1.6, margin: 0 }}>
          Cancelación programada: tu plan seguirá activo hasta el <strong>{fmt(programada)}</strong>. Puedes seguir
          gestionando el pago mientras tanto.
        </p>
      ) : (
        <p style={{ color: '#958D99', fontSize: '.92rem', lineHeight: 1.6, marginTop: 0 }}>
          Cambia tu método de pago, consulta tus facturas o cancela cuando quieras (permanencia mínima de 3 meses).
        </p>
      )}

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
        <button
          onClick={abrirPortal}
          disabled={cargando !== null}
          style={btn(false)}
        >
          {cargando === 'portal' ? 'Abriendo…' : 'Gestionar pago y facturas'}
        </button>
        {!programada && (
          <button onClick={cancelar} disabled={cargando !== null} style={btn(true)}>
            {cargando === 'cancelar' ? 'Cancelando…' : 'Cancelar suscripción'}
          </button>
        )}
      </div>

      {aviso && <p style={{ color: '#bbf7d0', fontSize: '.88rem', marginTop: 12, marginBottom: 0 }}>{aviso}</p>}
    </div>
  )
}

function btn(secundario: boolean): React.CSSProperties {
  return {
    padding: '10px 16px',
    borderRadius: 10,
    fontSize: '.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: secundario ? '1px solid rgba(255,255,255,.2)' : 'none',
    background: secundario ? 'transparent' : '#FCEE21',
    color: secundario ? '#958D99' : '#16122B',
  }
}
