import type { Programa } from '@/lib/programa-schema'
import './programa-documento.css'

// ============================================================
//  Render del "documento de marca": el plan tal y como lo ve
//  el cliente. Se usa en la pantalla de revisión de Fernando
//  y (en una fase posterior) en la página pública /programa/[token].
// ============================================================

export default function ProgramaDocumento({
  programa,
  nombre,
}: {
  programa: Programa
  nombre?: string
}) {
  const mensaje_bienvenida = programa?.mensaje_bienvenida ?? ''
  const punto_partida = programa?.punto_partida ?? ({} as Programa['punto_partida'])
  const entrenamiento = programa?.entrenamiento ?? ({} as Programa['entrenamiento'])
  const nutricion = programa?.nutricion ?? ({} as Programa['nutricion'])
  const seguimiento = programa?.seguimiento ?? ({} as Programa['seguimiento'])
  const dias = entrenamiento?.dias ?? []

  return (
    <div className="wrp">
      <div className="wrp-inner">
        <header className="wrp-hero">
          <span className="wrp-eyebrow"><span className="dot" />Tu plan · Método BASE</span>
          <h1>
            {nombre ? <>{nombre}, este es <span className="hl">tu punto de partida</span></> : <>Tu <span className="hl">plan personalizado</span></>}
          </h1>
          <p className="wrp-welcome">{mensaje_bienvenida}</p>
        </header>

        {/* 1 · Punto de partida */}
        <Section num={1} title="Tu punto de partida">
          <div className="wrp-facts">
            <Fact k="Objetivo principal" v={punto_partida.objetivo_principal || '—'} />
            <Fact k="Objetivos secundarios" v={punto_partida.objetivos_secundarios?.join(', ') || '—'} />
            <Fact k="Dónde entrenas" v={punto_partida.donde_entrena || '—'} />
            <Fact k="Días y tiempo" v={punto_partida.dias_tiempo || '—'} />
          </div>
          <div className="wrp-card" style={{ marginTop: 14 }}>
            <div className="wrp-fact" style={{ background: 'transparent', border: 'none', padding: 0 }}>
              <div className="k">A tener en cuenta</div>
              <div className="v">{punto_partida.consideraciones}</div>
            </div>
          </div>
        </Section>

        {/* 2 · Entrenamiento */}
        <Section num={2} title="Tu entrenamiento">
          <p className="wrp-lead">{entrenamiento.introduccion}</p>

          <div className="wrp-highlights">
            <Highlight k="Regla del esfuerzo (RIR)" v={entrenamiento.regla_rir} />
            <Highlight k="Cómo progresar" v={entrenamiento.progresion} />
          </div>

          {entrenamiento.calentamiento?.length > 0 && (
            <div className="wrp-card">
              <h4 style={{ fontSize: '0.95rem', marginBottom: 12, color: '#FCEE21' }}>Calentamiento</h4>
              <ul className="wrp-list">
                {entrenamiento.calentamiento.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}

          {dias.map((dia, i) => (
            <div className="wrp-card wrp-day" key={i}>
              <div className="wrp-day-head">
                <span className="tag">Día {i + 1}</span>
                <h3>{dia.nombre}</h3>
              </div>
              {(dia.ejercicios ?? []).map((ej, j) => (
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
          ))}

          {entrenamiento.vuelta_calma?.length > 0 && (
            <div className="wrp-card">
              <h4 style={{ fontSize: '0.95rem', marginBottom: 12, color: '#FCEE21' }}>Vuelta a la calma</h4>
              <ul className="wrp-list">
                {entrenamiento.vuelta_calma.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}
        </Section>

        {/* 3 · Nutrición */}
        <Section num={3} title="Tu nutrición">
          <p className="wrp-lead">{nutricion.introduccion}</p>

          {nutricion.reglas?.length > 0 && (
            <div className="wrp-card">
              <h4 style={{ fontSize: '0.95rem', marginBottom: 12, color: '#FCEE21' }}>Las reglas que importan</h4>
              <ul className="wrp-list">
                {nutricion.reglas.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}

          {nutricion.dia_tipo?.length > 0 && (
            <div className="wrp-card">
              <h4 style={{ fontSize: '0.95rem', marginBottom: 12, color: '#FCEE21' }}>Un día tipo</h4>
              {nutricion.dia_tipo.map((m, i) => (
                <div className="wrp-meal" key={i}>{m}</div>
              ))}
            </div>
          )}

          {nutricion.notas && <p className="wrp-lead" style={{ marginTop: 4 }}>{nutricion.notas}</p>}
        </Section>

        {/* 4 · Seguimiento */}
        <Section num={4} title="Cómo medimos el progreso">
          <p className="wrp-lead">{seguimiento.introduccion}</p>
          {seguimiento.que_registrar?.length > 0 && (
            <div className="wrp-card">
              <ul className="wrp-list">
                {seguimiento.que_registrar.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
            </div>
          )}
        </Section>

        <p className="wrp-foot">
          <strong>WellnessReal</strong> · Método BASE · Plan inicial. Lo ajustamos juntos cada semana según cómo respondas.
        </p>
      </div>
    </div>
  )
}

function Section({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <section className="wrp-section">
      <div className="wrp-section-head">
        <span className="wrp-section-num">{num}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
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

function Highlight({ k, v }: { k: string; v: string }) {
  return (
    <div className="wrp-highlight">
      <div className="k">{k}</div>
      <div className="v">{v}</div>
    </div>
  )
}
