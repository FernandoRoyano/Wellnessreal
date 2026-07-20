'use client'

import { useActionState } from 'react'
import { solicitarPlazaAction, type SolicitudResult } from './actions'
import { CheckCircle2, Loader2 } from 'lucide-react'

const inputClass =
  'w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-brand-deep)] px-4 py-2.5 text-white placeholder:text-white/30 focus:border-[var(--color-accent)] focus:outline-none'

export function SolicitudForm({ yaSolicitada }: { yaSolicitada: boolean }) {
  const [state, action, pending] = useActionState<SolicitudResult | null, FormData>(
    solicitarPlazaAction,
    null
  )

  if (yaSolicitada || state?.ok) {
    return (
      <div className="surface-card rounded-2xl p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-[var(--color-accent)]" />
        <h3 className="headline mb-2 text-xl text-white">Solicitud recibida</h3>
        <p className="text-white/60">
          Te escribo yo personalmente para contarte si encajas en el grupo y resolver tus dudas.
          Si no te llega nada en un par de días, escríbeme a info@wellnessreal.es.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="surface-card space-y-4 rounded-2xl p-6">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-white/80">
          ¿Qué te gustaría conseguir en estos 3 meses?
        </label>
        <textarea
          name="objetivo"
          required
          rows={3}
          placeholder="Cuéntame tu caso con tus palabras…"
          className={`${inputClass} resize-y`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-white/80">
            ¿Cuántos días puedes entrenar?
          </label>
          <select name="dias_semana" defaultValue="" className={inputClass}>
            <option value="">Elige…</option>
            <option value="2">2 días</option>
            <option value="3">3 días</option>
            <option value="4">4 días</option>
            <option value="5+">5 o más</option>
            <option value="no lo sé">Aún no lo sé</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-white/80">
            ¿Puedes asistir al directo semanal?
          </label>
          <select name="disponibilidad_directo" defaultValue="" className={inputClass}>
            <option value="">Elige…</option>
            <option value="sí, casi siempre">Sí, casi siempre</option>
            <option value="algunas semanas">Algunas semanas</option>
            <option value="no, lo vería en diferido">No, lo vería grabado</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-white/80">
          ¿Lesiones o algo que deba saber? (opcional)
        </label>
        <input
          name="lesiones"
          placeholder="Rodilla, hombro, embarazo reciente…"
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-white/80">
          Teléfono (opcional, para cerrarlo por WhatsApp)
        </label>
        <input name="telefono" type="tel" placeholder="6XX XXX XXX" className={inputClass} />
      </div>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button type="submit" disabled={pending} className="btn-brand w-full disabled:opacity-60">
        {pending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Enviando…
          </>
        ) : (
          'Solicitar mi plaza'
        )}
      </button>
      <p className="text-center text-xs text-white/40">
        Solicitar no es pagar. Hablamos antes y decides después.
      </p>
    </form>
  )
}
