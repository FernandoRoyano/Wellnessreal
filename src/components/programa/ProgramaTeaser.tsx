import type { Programa } from '@/lib/programa-schema'
import './programa-documento.css'
import './programa-teaser.css'

// ============================================================
//  Teaser del plan: muestra GRATIS la bienvenida + punto de
//  partida + el Día 1 de entreno. Bloquea el resto (nutrición,
//  resto de días, seguimiento) y cierra con CTA a WhatsApp.
//  Es la salida del cuestionario: genera el deseo de tenerlo entero.
// ============================================================

const WHATSAPP = '34633261963'

export default function ProgramaTeaser({
  programa,
  nombre,
}: {
  programa: Programa
  nombre: string
}) {
  const primerNombre = (nombre || '').split(' ')[0] || 'crack'
  const mensaje_bienvenida = programa?.mensaje_bienvenida ?? ''
  const punto_partida = programa?.punto_partida
  const entrenamiento = programa?.entrenamiento
  const dias = entrenamiento?.dias ?? []
  const dia1 = dias[0]
  const diasRestantes = Math.max(0, dias.length - 1)

  const mensaje = encodeURIComponent(
    `Hola Fernando, soy ${nombre}. Acabo de hacer el cuestionario y quiero mi plan completo y empezar a entrenar contigo.`,
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
              Esto es un primer borrador, generado al instante con el método de Fernando. Él lo
              perfecciona contigo antes de que empieces.
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

          {/* Bloqueo + CTA */}
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
                Tu plan completo está listo. Lo desbloqueas hablando conmigo: lo reviso, lo afinamos
                a tu vida y lo ajustamos juntos cada semana.
              </p>
              <ul className="wrt-lock-list">
                {diasRestantes > 0 && <li>Los {diasRestantes} día{diasRestantes > 1 ? 's' : ''} de entreno restantes, completos</li>}
                <li>Tu nutrición por raciones, sin pesar nada</li>
                <li>Tu sistema de seguimiento y progresión</li>
                <li>Los ajustes semanales conmigo según cómo respondas</li>
              </ul>
              <a className="wrt-cta" href={ctaUrl} target="_blank" rel="noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.477-.91zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                Hablar con Fernando por WhatsApp
              </a>
              <p className="wrt-cta-sub">Sin compromiso. Te respondo yo en persona.</p>
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
