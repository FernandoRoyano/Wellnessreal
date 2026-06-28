'use client'

import { useState } from 'react'
import { Plus, Trash2, Save, X, Loader2, GripVertical } from 'lucide-react'
import type { Programa, DiaEntrenamiento, Ejercicio } from '@/lib/programa-schema'

// ============================================================
//  Editor manual del programa generado por la IA.
//  Permite a Fernando retocar TODO el plan antes de aprobarlo,
//  sin pasar por la IA. Guarda vía PATCH { programa }.
// ============================================================

const inputBg = '#16122B'
const inputBorder = '1px solid #662D91'

export default function ProgramaEditor({
  initial,
  saving,
  onSave,
  onCancel,
}: {
  initial: Programa
  saving: boolean
  onSave: (programa: Programa) => void
  onCancel: () => void
}) {
  const [draft, setDraft] = useState<Programa>(() => clone(initial))

  // Actualiza el borrador de forma inmutable
  const edit = (mut: (d: Programa) => void) =>
    setDraft((d) => {
      const n = clone(d)
      mut(n)
      return n
    })

  return (
    <div className="p-5 sm:p-7" style={{ backgroundColor: '#0E0B1E' }}>
      {/* Barra de acciones del editor */}
      <div className="flex items-center gap-3 mb-6 sticky top-[60px] z-10 py-3" style={{ backgroundColor: '#0E0B1E' }}>
        <span className="text-xs font-bold uppercase tracking-wider text-yellow-300">Editando el plan</span>
        <div className="flex-1" />
        <button
          onClick={onCancel}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white disabled:opacity-50"
          style={{ border: inputBorder }}
        >
          <X size={15} /> Cancelar
        </button>
        <button
          onClick={() => onSave(draft)}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
          style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Guardar cambios
        </button>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Bienvenida */}
        <Block title="Mensaje de bienvenida">
          <Area value={draft.mensaje_bienvenida} onChange={(v) => edit((d) => { d.mensaje_bienvenida = v })} rows={4} />
        </Block>

        {/* Punto de partida */}
        <Block title="1 · Punto de partida">
          <Field label="Objetivo principal">
            <Input value={draft.punto_partida.objetivo_principal} onChange={(v) => edit((d) => { d.punto_partida.objetivo_principal = v })} />
          </Field>
          <Field label="Objetivos secundarios">
            <StringList items={draft.punto_partida.objetivos_secundarios} onChange={(items) => edit((d) => { d.punto_partida.objetivos_secundarios = items })} placeholder="Objetivo secundario" />
          </Field>
          <Field label="Dónde entrena">
            <Input value={draft.punto_partida.donde_entrena} onChange={(v) => edit((d) => { d.punto_partida.donde_entrena = v })} />
          </Field>
          <Field label="Días y tiempo">
            <Input value={draft.punto_partida.dias_tiempo} onChange={(v) => edit((d) => { d.punto_partida.dias_tiempo = v })} />
          </Field>
          <Field label="A tener en cuenta">
            <Area value={draft.punto_partida.consideraciones} onChange={(v) => edit((d) => { d.punto_partida.consideraciones = v })} rows={2} />
          </Field>
        </Block>

        {/* Entrenamiento */}
        <Block title="2 · Entrenamiento">
          <Field label="Introducción">
            <Area value={draft.entrenamiento.introduccion} onChange={(v) => edit((d) => { d.entrenamiento.introduccion = v })} rows={3} />
          </Field>
          <Field label="Regla del esfuerzo (RIR)">
            <Area value={draft.entrenamiento.regla_rir} onChange={(v) => edit((d) => { d.entrenamiento.regla_rir = v })} rows={2} />
          </Field>
          <Field label="Cómo progresar">
            <Area value={draft.entrenamiento.progresion} onChange={(v) => edit((d) => { d.entrenamiento.progresion = v })} rows={2} />
          </Field>
          <Field label="Calentamiento">
            <StringList items={draft.entrenamiento.calentamiento} onChange={(items) => edit((d) => { d.entrenamiento.calentamiento = items })} placeholder="Paso del calentamiento" />
          </Field>

          {/* Días */}
          <div className="space-y-4 mt-2">
            {draft.entrenamiento.dias.map((dia, di) => (
              <DiaEditor
                key={di}
                dia={dia}
                index={di}
                onChange={(nd) => edit((d) => { d.entrenamiento.dias[di] = nd })}
                onRemove={() => edit((d) => { d.entrenamiento.dias.splice(di, 1) })}
              />
            ))}
            <button
              onClick={() => edit((d) => { d.entrenamiento.dias.push(emptyDia()) })}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-yellow-300"
              style={{ border: inputBorder }}
            >
              <Plus size={15} /> Añadir día
            </button>
          </div>

          <Field label="Vuelta a la calma">
            <StringList items={draft.entrenamiento.vuelta_calma} onChange={(items) => edit((d) => { d.entrenamiento.vuelta_calma = items })} placeholder="Paso de la vuelta a la calma" />
          </Field>
        </Block>

        {/* Nutrición */}
        <Block title="3 · Nutrición">
          <Field label="Introducción">
            <Area value={draft.nutricion.introduccion} onChange={(v) => edit((d) => { d.nutricion.introduccion = v })} rows={3} />
          </Field>
          <Field label="Las reglas que importan">
            <StringList items={draft.nutricion.reglas} onChange={(items) => edit((d) => { d.nutricion.reglas = items })} placeholder="Regla de nutrición" />
          </Field>
          <Field label="Un día tipo">
            <StringList items={draft.nutricion.dia_tipo} onChange={(items) => edit((d) => { d.nutricion.dia_tipo = items })} placeholder="Comida del día tipo" />
          </Field>
          <Field label="Notas">
            <Area value={draft.nutricion.notas} onChange={(v) => edit((d) => { d.nutricion.notas = v })} rows={2} />
          </Field>
        </Block>

        {/* Seguimiento */}
        <Block title="4 · Seguimiento">
          <Field label="Introducción">
            <Area value={draft.seguimiento.introduccion} onChange={(v) => edit((d) => { d.seguimiento.introduccion = v })} rows={2} />
          </Field>
          <Field label="Qué registrar">
            <StringList items={draft.seguimiento.que_registrar} onChange={(items) => edit((d) => { d.seguimiento.que_registrar = items })} placeholder="Qué registrar" />
          </Field>
        </Block>
      </div>
    </div>
  )
}

// ------------------------------------------------------------
//  Editor de un día de entrenamiento
// ------------------------------------------------------------
function DiaEditor({
  dia,
  index,
  onChange,
  onRemove,
}: {
  dia: DiaEntrenamiento
  index: number
  onChange: (d: DiaEntrenamiento) => void
  onRemove: () => void
}) {
  const editEx = (ei: number, mut: (e: Ejercicio) => void) => {
    const next = clone(dia)
    mut(next.ejercicios[ei])
    onChange(next)
  }

  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102,45,145,0.4)' }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] uppercase tracking-wide px-2 py-1 rounded" style={{ backgroundColor: 'rgba(102,45,145,0.3)', color: '#a78bfa' }}>Día {index + 1}</span>
        <input
          value={dia.nombre}
          onChange={(e) => { const n = clone(dia); n.nombre = e.target.value; onChange(n) }}
          placeholder="Nombre del día"
          className="flex-1 px-3 py-2 rounded-lg text-white text-sm outline-none font-medium"
          style={{ backgroundColor: inputBg, border: inputBorder }}
        />
        <button onClick={onRemove} className="text-gray-500 hover:text-red-400 p-1.5" title="Eliminar día">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {dia.ejercicios.map((ej, ei) => (
          <div key={ei} className="rounded-lg p-3" style={{ backgroundColor: inputBg, border: '1px solid rgba(102,45,145,0.3)' }}>
            <div className="flex items-start gap-2">
              <GripVertical size={14} className="text-gray-600 mt-2.5 flex-none" />
              <div className="flex-1 space-y-2">
                <input
                  value={ej.nombre}
                  onChange={(e) => editEx(ei, (x) => { x.nombre = e.target.value })}
                  placeholder="Nombre del ejercicio"
                  className="w-full px-2.5 py-1.5 rounded text-white text-sm outline-none font-medium"
                  style={{ backgroundColor: '#0E0B1E', border: '1px solid rgba(102,45,145,0.3)' }}
                />
                <div className="grid grid-cols-3 gap-2">
                  <MiniInput value={ej.series_reps} onChange={(v) => editEx(ei, (x) => { x.series_reps = v })} placeholder="3 × 8-10" />
                  <MiniInput value={ej.rir} onChange={(v) => editEx(ei, (x) => { x.rir = v })} placeholder="RIR 2-3" />
                  <MiniInput value={ej.alternativa} onChange={(v) => editEx(ei, (x) => { x.alternativa = v })} placeholder="Alternativa" />
                </div>
                <MiniInput value={ej.nota ?? ''} onChange={(v) => editEx(ei, (x) => { x.nota = v })} placeholder="Nota (opcional)" />
              </div>
              <button
                onClick={() => { const n = clone(dia); n.ejercicios.splice(ei, 1); onChange(n) }}
                className="text-gray-500 hover:text-red-400 p-1 flex-none mt-1"
                title="Eliminar ejercicio"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={() => { const n = clone(dia); n.ejercicios.push(emptyEjercicio()); onChange(n) }}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-yellow-300 px-2.5 py-1.5 rounded-lg"
          style={{ border: '1px solid rgba(102,45,145,0.3)' }}
        >
          <Plus size={13} /> Añadir ejercicio
        </button>
      </div>
    </div>
  )
}

// ------------------------------------------------------------
//  Sub-componentes de formulario
// ------------------------------------------------------------
function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl p-5" style={{ backgroundColor: '#16122B', border: '1px solid rgba(102,45,145,0.3)' }}>
      <h2 className="text-sm font-bold uppercase tracking-wider text-yellow-300 mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
      style={{ backgroundColor: inputBg, border: inputBorder }}
    />
  )
}

function MiniInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-2.5 py-1.5 rounded text-white text-xs outline-none"
      style={{ backgroundColor: '#0E0B1E', border: '1px solid rgba(102,45,145,0.3)' }}
    />
  )
}

function Area({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none resize-y leading-relaxed"
      style={{ backgroundColor: inputBg, border: inputBorder }}
    />
  )
}

function StringList({ items, onChange, placeholder }: { items: string[]; onChange: (items: string[]) => void; placeholder?: string }) {
  const list = items ?? []
  return (
    <div className="space-y-2">
      {list.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={item}
            onChange={(e) => { const n = [...list]; n[i] = e.target.value; onChange(n) }}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 rounded-lg text-white text-sm outline-none"
            style={{ backgroundColor: inputBg, border: inputBorder }}
          />
          <button onClick={() => onChange(list.filter((_, j) => j !== i))} className="text-gray-500 hover:text-red-400 p-1.5 flex-none" title="Eliminar">
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...list, ''])}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-yellow-300 px-2.5 py-1.5 rounded-lg"
        style={{ border: '1px solid rgba(102,45,145,0.3)' }}
      >
        <Plus size={13} /> Añadir
      </button>
    </div>
  )
}

// ------------------------------------------------------------
//  Helpers
// ------------------------------------------------------------
function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v))
}

function emptyDia(): DiaEntrenamiento {
  return { nombre: 'Nuevo día', ejercicios: [emptyEjercicio()] }
}

function emptyEjercicio(): Ejercicio {
  return { nombre: '', series_reps: '', rir: '', alternativa: '', nota: '' }
}
