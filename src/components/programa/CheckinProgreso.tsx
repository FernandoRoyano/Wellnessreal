'use client'

import { useState } from 'react'

// Check-in de progreso (cada 4 semanas): el cliente cuenta cómo le fue y el
// sistema progresa su plan (auto = al instante, revisado = lo aprueba Fernando).
export default function CheckinProgreso({
  token,
  tier,
  puedeActualizar,
  enRevision,
  disponibleEnDias,
}: {
  token: string
  tier: string | null
  puedeActualizar: boolean
  enRevision: boolean
  disponibleEnDias: number
}) {
  const [abierto, setAbierto] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState<'ok' | 'pendiente' | null>(null)
  const [error, setError] = useState('')

  const [cumplimiento, setCumplimiento] = useState('')
  const [cargas, setCargas] = useState('')
  const [energia, setEnergia] = useState('')
  const [molestia, setMolestia] = useState('')
  const [cambios, setCambios] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [nota, setNota] = useState('')

  const enviar = async () => {
    if (!cumplimiento || !cargas || !energia) {
      setError('Responde al menos las tres primeras preguntas.')
      return
    }
    setError('')
    setEnviando(true)
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          respuestas: { cumplimiento, cargas, energia, molestia, cambios_contexto: cambios, objetivo_cambio: objetivo, nota },
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'No se pudo actualizar tu plan.')
        setEnviando(false)
        return
      }
      setResultado(data.entregado ? 'ok' : 'pendiente')
      if (data.entregado) setTimeout(() => window.location.reload(), 2500)
    } catch {
      setError('No se pudo actualizar tu plan.')
    } finally {
      setEnviando(false)
    }
  }

  // Estado: en revisión (ya hay un ajuste pendiente)
  if (enRevision) {
    return (
      <Wrap>
        <h3 style={h3}>Tu progresión está en camino 🛠️</h3>
        <p style={p}>Fernando está revisando tu plan actualizado. Te avisamos en cuanto esté listo.</p>
      </Wrap>
    )
  }

  // Resultado tras enviar
  if (resultado) {
    return (
      <Wrap>
        <h3 style={h3}>{resultado === 'ok' ? '¡Plan actualizado! 🎉' : '¡Recibido! 🛠️'}</h3>
        <p style={p}>
          {resultado === 'ok'
            ? 'Tu nueva progresión ya está lista. Recargamos para que la veas…'
            : 'Fernando revisará tu progreso y ajustará tu plan a mano. Te avisamos en cuanto esté.'}
        </p>
      </Wrap>
    )
  }

  // Aún no toca
  if (!puedeActualizar) {
    return (
      <Wrap>
        <h3 style={h3}>Tu progresión llega pronto</h3>
        <p style={p}>
          Tu plan actual está en marcha. Podrás actualizarlo en <strong>{disponibleEnDias} día{disponibleEnDias === 1 ? '' : 's'}</strong>. Dale caña mientras
          tanto 💪
        </p>
      </Wrap>
    )
  }

  // Toca: botón + formulario
  return (
    <Wrap>
      <h3 style={h3}>Toca progresar tu plan 🚀</h3>
      <p style={p}>
        Han pasado 4 semanas. Cuéntanos cómo te ha ido y{' '}
        {tier === 'auto' ? 'te generamos tu nueva versión al instante' : 'Fernando ajustará tu plan a mano'}.
      </p>

      {!abierto ? (
        <button onClick={() => setAbierto(true)} style={btnPrimary}>Actualizar mi plan</button>
      ) : (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Pregunta label="1 · ¿Has cumplido los entrenamientos?">
            <Ops v={cumplimiento} set={setCumplimiento} ops={[['todos', 'Todos'], ['mayoria', 'La mayoría'], ['medias', 'A medias'], ['casi_ninguno', 'Casi ninguno']]} />
          </Pregunta>
          <Pregunta label="2 · ¿Cómo se te quedaron las cargas/esfuerzo?">
            <Ops v={cargas} set={setCargas} ops={[['cortas', 'Cortas, podía más'], ['justas', 'Justas'], ['demasiado', 'Demasiado']]} />
          </Pregunta>
          <Pregunta label="3 · ¿Energía y descanso este mes?">
            <Ops v={energia} set={setEnergia} ops={[['bien', 'Bien'], ['regular', 'Regular'], ['mal', 'Mal']]} />
          </Pregunta>
          <Pregunta label="4 · ¿Alguna molestia o dolor nuevo? (si no, déjalo vacío)">
            <input value={molestia} onChange={(e) => setMolestia(e.target.value)} placeholder="Ej: molestia en el hombro derecho al empujar" style={input} />
          </Pregunta>
          <Pregunta label="5 · ¿Ha cambiado algo? (días, material, horario)">
            <input value={cambios} onChange={(e) => setCambios(e.target.value)} placeholder="Ej: ahora entreno 4 días y tengo mancuernas nuevas" style={input} />
          </Pregunta>
          <Pregunta label="6 · ¿Sigues con el mismo objetivo? (si no, dinos cuál)">
            <input value={objetivo} onChange={(e) => setObjetivo(e.target.value)} placeholder="Ej: quiero centrarme más en fuerza" style={input} />
          </Pregunta>
          <Pregunta label="7 · Algo para Fernando (opcional)">
            <input value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Lo que quieras contarle" style={input} />
          </Pregunta>

          {error && <p style={{ color: '#fca5a5', fontSize: '.9rem', margin: 0 }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={enviar} disabled={enviando} style={btnPrimary}>
              {enviando ? 'Progresando tu plan…' : 'Enviar y actualizar'}
            </button>
            <button onClick={() => setAbierto(false)} disabled={enviando} style={btnGhost}>Cancelar</button>
          </div>
          {enviando && tier !== 'auto' && <p style={{ ...p, marginTop: 0 }}>Esto tarda unos segundos…</p>}
        </div>
      )}
    </Wrap>
  )
}

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 760, margin: '28px auto', padding: '22px 24px', borderRadius: 14, background: 'rgba(252,238,33,.06)', border: '1px solid rgba(252,238,33,.25)', fontFamily: "'DM Sans', sans-serif", color: '#FBFAF6' }}>
      {children}
    </div>
  )
}
function Pregunta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: '.92rem', fontWeight: 600, marginBottom: 8 }}>{label}</p>
      {children}
    </div>
  )
}
function Ops({ v, set, ops }: { v: string; set: (s: string) => void; ops: [string, string][] }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {ops.map(([val, txt]) => (
        <button key={val} onClick={() => set(val)} style={{ padding: '8px 14px', borderRadius: 9, fontSize: '.86rem', cursor: 'pointer', border: v === val ? '1px solid #FCEE21' : '1px solid rgba(255,255,255,.18)', background: v === val ? 'rgba(252,238,33,.15)' : 'transparent', color: v === val ? '#FCEE21' : '#cfc9d4', fontWeight: 600 }}>
          {txt}
        </button>
      ))}
    </div>
  )
}

const h3: React.CSSProperties = { fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }
const p: React.CSSProperties = { color: '#958D99', fontSize: '.95rem', lineHeight: 1.6, marginTop: 0 }
const input: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 9, background: '#16122B', border: '1px solid rgba(255,255,255,.15)', color: '#FBFAF6', fontSize: '.9rem', fontFamily: 'inherit' }
const btnPrimary: React.CSSProperties = { padding: '11px 18px', borderRadius: 10, fontSize: '.92rem', fontWeight: 700, cursor: 'pointer', border: 'none', background: '#FCEE21', color: '#16122B' }
const btnGhost: React.CSSProperties = { padding: '11px 18px', borderRadius: 10, fontSize: '.92rem', fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(255,255,255,.2)', background: 'transparent', color: '#958D99' }
