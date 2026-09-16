'use client'

import { useActionState } from 'react'
import { LoaderCircle, Save } from 'lucide-react'
import { saveWeeklyCheckinAction, type CommunityToolResult } from '@/app/(comunidad)/comunidad/actions'
import type { CommunityCheckin } from '@/lib/community-tools'

const SCALE = [1, 2, 3, 4, 5]

export function WeeklyCheckinForm({ latest }: { latest: CommunityCheckin | null }) {
  const [state, action, pending] = useActionState<CommunityToolResult | null, FormData>(saveWeeklyCheckinAction, null)
  return <form action={action} className="weekly-checkin-form">
    <ScaleField name="energy" label="Energía general" low="Muy baja" high="Muy buena" defaultValue={latest?.energy ?? 3} />
    <ScaleField name="sleep" label="Cómo has dormido" low="Muy mal" high="Muy bien" defaultValue={latest?.sleep ?? 3} />
    <ScaleField name="confidence" label="Confianza para cumplir tu semana" low="Muy poca" high="Muy alta" defaultValue={latest?.confidence ?? 3} />
    <label className="weekly-checkin-sessions"><span>Sesiones que puedes hacer de verdad</span><select name="training_sessions" defaultValue={latest?.training_sessions ?? 2}>{Array.from({ length: 8 }, (_, value) => <option key={value} value={value}>{value}</option>)}</select></label>
    <label className="weekly-checkin-note"><span>¿Qué condiciona esta semana? <small>Opcional</small></span><textarea name="note" maxLength={600} rows={4} defaultValue={latest?.note ?? ''} placeholder="Trabajo, sueño, molestias, viajes… Solo lo que ayude a decidir." /></label>
    {state && <p className={state.ok ? 'is-success' : 'is-error'} role="status">{state.message}</p>}
    <button type="submit" disabled={pending}>{pending ? <LoaderCircle className="animate-spin" size={18} /> : <Save size={18} />}{pending ? 'Guardando…' : 'Guardar mi semana'}</button>
  </form>
}

function ScaleField({ name, label, low, high, defaultValue }: { name: string; label: string; low: string; high: string; defaultValue: number }) {
  return <fieldset className="weekly-checkin-scale"><legend>{label}</legend><div>{SCALE.map((value) => <label key={value}><input type="radio" name={name} value={value} defaultChecked={value === defaultValue} required /><span>{value}</span></label>)}</div><p><span>{low}</span><span>{high}</span></p></fieldset>
}
