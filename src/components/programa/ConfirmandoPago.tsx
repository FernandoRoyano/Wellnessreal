'use client'

import { useEffect } from 'react'

// Pantalla breve tras volver de Stripe: espera a que el webhook confirme el
// alta y recarga sola cada pocos segundos.
export default function ConfirmandoPago({ nombre }: { nombre: string }) {
  useEffect(() => {
    const t = setTimeout(() => window.location.reload(), 4000)
    return () => clearTimeout(t)
  }, [])

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
          ✅
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
          {nombre.split(' ')[0]}, estamos <span style={{ color: '#FCEE21' }}>confirmando tu pago</span>
        </h1>
        <p style={{ color: '#958D99', fontSize: '1.05rem', lineHeight: 1.7 }}>
          Un segundo… en cuanto tu suscripción quede activa verás tu plan. Esta página se actualiza sola.
        </p>
      </div>
    </div>
  )
}
