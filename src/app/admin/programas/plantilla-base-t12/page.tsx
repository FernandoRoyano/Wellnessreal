'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, LockKeyhole, RefreshCw, SlidersHorizontal } from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ProgramaDocumento from '@/components/programa/ProgramaDocumento'
import { getThyroidBaseProgram, THYROID_TEMPLATE_VERSION } from '@/lib/metodo-tiroides-template'

const phases = [
  { weeks: '1–3', name: 'Aprender y repetir', detail: 'Técnica, RIR 3, cargas conservadoras y regularidad.' },
  { weeks: '4–6', name: 'Progresar con criterio', detail: 'Más repeticiones o carga, una variable cada vez.' },
  { weeks: '7–9', name: 'Consolidar', detail: 'Actividad cotidiana, semana mínima y tercera revisión.' },
  { weeks: '10–12', name: 'Ganar autonomía', detail: 'Elegir cargas, alternativas y preparar el siguiente bloque.' },
]

const adaptations = ['Objetivo principal y secundarios', 'Número de días y duración disponible', 'Material y lugar de entrenamiento', 'Experiencia y preferencias', 'Limitaciones o ejercicios incompatibles', 'Alergias, digestiones y número de comidas']

export default function MasterTemplatePage() {
  const [dayCount, setDayCount] = useState(3)
  const program = useMemo(() => getThyroidBaseProgram(dayCount), [dayCount])

  return (
    <div className="flex min-h-screen bg-[#0E0B1E]">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-auto">
        <header className="border-b border-[#662D91]/50 bg-[#16122B] px-5 py-6 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <Link href="/admin/programas" className="mb-4 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"><ArrowLeft size={16} /> Volver a Programas IA</Link>
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#FCEE21]/10 px-3 py-1 text-xs font-bold text-[#FCEE21]">{THYROID_TEMPLATE_VERSION}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300"><Check size={13} /> Activa</span>
                </div>
                <h1 className="text-3xl font-bold text-white sm:text-4xl">Plantilla maestra BASE‑T12</h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">Este es el punto de partida que adapta el sistema cuando una clienta completa el cuestionario. Aquí puedes verlo antes de que exista ningún programa individual.</p>
              </div>
              <div className="rounded-xl border border-[#662D91]/50 bg-[#0E0B1E] p-2" aria-label="Número de días de entrenamiento">
                <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">Vista de la plantilla</p>
                <div className="flex gap-2">
                  {[2, 3, 4].map((days) => <button key={days} onClick={() => setDayCount(days)} className="rounded-lg px-4 py-2 text-sm font-bold transition" style={{ backgroundColor: dayCount === days ? '#FCEE21' : '#1a1535', color: dayCount === days ? '#16122B' : '#d1d5db' }} aria-pressed={dayCount === days}>{days} días</button>)}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 overflow-hidden rounded-2xl border border-[#662D91]/50"><ProgramaDocumento programa={program} nombre={`Ejemplo · ${dayCount} días`} /></div>
          <aside className="space-y-5">
            <section className="rounded-2xl border border-[#662D91]/40 bg-[#1a1535] p-5">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-white"><RefreshCw size={16} className="text-[#FCEE21]" /> Progresión de 12 semanas</h2>
              <div className="space-y-4">{phases.map((phase) => <div key={phase.weeks} className="border-l-2 border-[#FCEE21]/40 pl-3"><p className="text-[10px] font-bold uppercase tracking-wider text-[#FCEE21]">Semanas {phase.weeks}</p><p className="mt-1 text-sm font-semibold text-white">{phase.name}</p><p className="mt-1 text-xs leading-relaxed text-gray-400">{phase.detail}</p></div>)}</div>
            </section>
            <section className="rounded-2xl border border-[#662D91]/40 bg-[#1a1535] p-5">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-white"><SlidersHorizontal size={16} className="text-[#FCEE21]" /> Qué se personaliza</h2>
              <ul className="space-y-2.5">{adaptations.map((item) => <li key={item} className="flex gap-2 text-xs leading-relaxed text-gray-300"><Check size={14} className="mt-0.5 shrink-0 text-emerald-400" />{item}</li>)}</ul>
            </section>
            <section className="rounded-2xl border border-blue-400/20 bg-blue-400/5 p-5">
              <h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-blue-200"><LockKeyhole size={16} /> Flujo de entrega</h2>
              <p className="text-xs leading-relaxed text-gray-400">El sistema adapta esta base, crea un programa pendiente y espera tu aprobación. Hasta que pulses <strong className="text-white">Aprobar plan</strong>, el cliente no lo ve.</p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}
