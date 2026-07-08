'use client'

import { useState } from 'react'
import type { Programa } from '@/lib/programa-schema'
import { PLAN_OPCIONES, PERMANENCIA_MESES, type PlanTier } from '@/lib/precios-plan'
import { trackConversion } from '@/lib/tracking'
import './programa-documento.css'
import './programa-teaser.css'

// ============================================================
//  Teaser del plan: muestra GRATIS la bienvenida + punto de
//  partida + el Día 1 de entreno. Bloquea el resto y ofrece las
//  dos opciones de pago (plan automático / plan revisado).
//  Es la salida del cuestionario: genera el deseo y cobra en el
//  pico de motivación.
// ============================================================

const WHATSAPP = '34633261963'

export default function ProgramaTeaser({
  programa,
  nombre,
  clienteId,
}: {
  programa: Programa
  nombre: string
  clienteId?: string
}) {
  const primerNombre = (nombre || '').split(' ')[0] || 'crack'
  const mensaje_bienvenida = programa?.mensaje_bienvenida ?? ''
  const punto_partida = programa?.punto_partida
  const entrenamiento = programa?.entrenamiento
  const dias = entrenamiento?.dias ?? []
  const dia1 = dias[0]
  const diasRestantes = Math.max(0, dias.length - 1)

  const [cargando, setCargando] = useState<PlanTier | null>(null)
  const [error, setError] = useState('')

  const comprar = async (tier: PlanTier) => {
    if (!clienteId) return
    setError('')
    setCargando(tier)
    trackConversion('begin_checkout', { value: PLAN_OPCIONES[tier].precio, currency: 'EUR', plan: tier })
    try {
      const res = await fetch('/api/stripe/checkout-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente_id: clienteId, tier }),
      })
      const data = await res.json()
      if (!res.ok || !data.sessionUrl) throw new Error(data.error || 'No se pudo iniciar el pago.')
      window.location.href = data.sessionUrl
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo iniciar el pago.')
      setCargando(null)
    }
  }

  const mensaje = encodeURIComponent(
    `Hola Fernando, soy ${nombre}. Acabo de hacer el cuestionario y tengo una duda sobre mi plan.`,
  )
  const ctaUrl = `https://wa.me/${WHATSAPP}?text=${mensaje}`

  return (
    <div className="wrt">
      <div className="wrp">
        <div className="wrp-inner">
          <header className="wrp-hero">
            <span className="wrp-preview-badge">✨ Vista previa de tu plan</span>
            <h1>
              {primerNombre}, este es <span className="hl">tu punto de partida</span>
            </h1>
            <p className="wrp-welcome">{mensaje_bienvenida}</p>
            <p className="wrp-preview-note">
              Esto es un primer borrador, generado al instante con el método de Fernando. Desbloquéalo
              entero abajo.
            </p>
          </header>

          {/* 1 · Punto de partida (gratis) */}
          <section className="wrp-section">
            <div className="wrp-section-head">
              <span className="wrp-section-num">1</span>
              <h2>Tu punto de partida</h2>
            </div>
            <div className="wrp-facts">
              <Fact k="Objetivo principal" v={punto_partida?.objetivo_principal || '—'} />
              <Fact k="Objetivos secundarios" v={punto_partida?.objetivos_secundarios?.join(', ') || '—'} />
              <Fact k="Dónde entrenas" v={punto_partida?.donde_entrena || '—'} />
              <Fact k="Días y tiempo" v={punto_partida?.dias_tiempo || '—'} />
            </div>
          </section>

          {/* 2 · Entrenamiento — solo el Día 1 (gratis) */}
          <section className="wrp-section">
            <div className="wrp-section-head">
              <span className="wrp-section-num">2</span>
              <h2>Tu entrenamiento</h2>
            </div>
            {entrenamiento?.introduccion && <p className="wrp-lead">{entrenamiento.introduccion}</p>}

            {dia1 && (
              <div className="wrp-card wrp-day">
                <div className="wrp-day-head">
                  <span className="tag">Día 1</span>
                  <h3>{dia1.nombre}</h3>
                </div>
                {(dia1.ejercicios ?? []).map((ej, j) => (
                  <div className="wrp-ex" key={j}>
                    <div className="wrp-ex-top">
                      <span className="wrp-ex-name">{ej.nombre}</span>
                      <span className="wrp-ex-sr">{ej.series_reps}</span>
                    </div>
                    <div className="wrp-ex-meta">
                      <span className="pill">RIR <b>{ej.rir}</b></span>
                      {ej.alternativa && <span className="pill">Alternativa: <b>{ej.alternativa}</b></span>}
                    </div>
                    {ej.nota && <p className="wrp-ex-nota">{ej.nota}</p>}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Bloqueo + opciones de pago */}
          <div className="wrt-lock">
            <div className="wrt-lock-fade" />
            <div className="wrt-lock-card">
              <div className="wrt-lock-ico">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3>
                Y esto es <span className="hl">solo el principio</span>
              </h3>
              <p className="sub">
                Tu plan completo está listo. Elige cómo lo quieres y lo desbloqueas ahora mismo.
              </p>

              {error && <p style={{ color: '#fca5a5', fontSize: '.9rem', marginBottom: 14 }}>{error}</p>}

              {clienteId ? (
                <div className="wrt-plans">
                  {(['auto', 'revisado'] as PlanTier[]).map((tier) => {
                    const o = PLAN_OPCIONES[tier]
                    return (
                      <div key={tier} className={'wrt-plan' + (o.destacado ? ' destacado' : '')}>
                        {o.destacado && <span className="wrt-plan-badge">Recomendado</span>}
                        <h4>{o.nombre}</h4>
                        <div className="wrt-plan-precio">{o.precio}€<span>al mes</span></div>
                        <p className="wrt-plan-gancho">{o.gancho}</p>
                        <ul>
                          {o.ventajas.map((v, i) => (
                            <li key={i}>{v}</li>
                          ))}
                        </ul>
                        <button
                          type="button"
                          className={'wrt-plan-btn' + (o.destacado ? ' primary' : '')}
                          onClick={() => comprar(tier)}
                          disabled={cargando !== null}
                        >
                          {cargando === tier ? 'Redirigiendo…' : `Suscribirme · ${o.precio}€/mes`}
                        </button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <ul className="wrt-lock-list">
                  {diasRestantes > 0 && <li>Los {diasRestantes} día{diasRestantes > 1 ? 's' : ''} de entreno restantes</li>}
                  <li>Tu nutrición por raciones, sin pesar nada</li>
                  <li>Tu sistema de seguimiento y progresión</li>
                </ul>
              )}

              {clienteId && (
                <p className="wrt-cta-sub" style={{ marginTop: 14, fontSize: '.82rem', opacity: 0.85 }}>
                  Suscripción mensual. Permanencia mínima de {PERMANENCIA_MESES} meses; después la cancelas cuando
                  quieras desde tu página. Se renueva sola cada mes hasta que canceles.
                </p>
              )}

              <p className="wrt-cta-sub" style={{ marginTop: 12 }}>
                Pago seguro con Stripe (tarjeta, Apple Pay y Google Pay).{' '}
                <a href={ctaUrl} target="_blank" rel="noreferrer" style={{ color: '#FCEE21', textDecoration: 'underline' }}>
                  ¿Dudas? Habla con Fernando
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="wrp-fact">
      <div className="k">{k}</div>
      <div className="v">{v}</div>
    </div>
  )
}
