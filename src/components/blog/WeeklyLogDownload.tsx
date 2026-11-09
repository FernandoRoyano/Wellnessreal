'use client'

import { Download } from 'lucide-react'
import { trackResourceDownload } from '@/lib/analytics'

export default function WeeklyLogDownload() {
  return (
    <aside aria-labelledby="weekly-log-title" className="my-10 rounded-2xl border border-accent/30 bg-brand-dusk p-6 md:p-8">
      <p className="text-fluid-xs font-semibold uppercase tracking-widest text-accent">Para aplicar esta guía</p>
      <h2 id="weekly-log-title" className="headline mt-3 text-fluid-2xl text-white">Tu registro semanal de entrenamiento</h2>
      <p className="mt-3 leading-relaxed text-muted">Anota ejercicios, cargas, repeticiones y cómo recuperas. Dos páginas para rellenar con un lector de PDF o imprimir, sin registro ni email.</p>
      <a
        href="/recursos/registro-semanal-entrenamiento.pdf"
        download
        onClick={() => trackResourceDownload('weekly_training_log')}
        className="btn-brand mt-5 inline-flex min-h-11 max-w-full items-center justify-center gap-3 whitespace-normal px-5 py-3 text-center text-fluid-sm"
      >
        <Download className="h-5 w-5 shrink-0" aria-hidden="true" />
        Descargar registro semanal (PDF)
      </a>
      <p className="mt-3 text-fluid-xs text-subtle">El archivo se guarda en tu dispositivo; lo que escribas no se envía a WellnessReal.</p>
    </aside>
  )
}
