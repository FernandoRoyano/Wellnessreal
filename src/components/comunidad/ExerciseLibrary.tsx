'use client'

import { useId, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import { EXERCISE_EQUIPMENT, type getExerciseSummaries } from '@/lib/community-exercises'
import { matchesCommunitySearch } from '@/lib/community-search'

export function ExerciseLibrary({ exercises }: { exercises: ReturnType<typeof getExerciseSummaries> }) {
  const [query, setQuery] = useState('')
  const [equipment, setEquipment] = useState('')
  const searchId = useId()
  const equipmentId = useId()
  const filters = useRef<HTMLDetailsElement>(null)
  const visible = exercises.filter(exercise => matchesCommunitySearch(query, exercise.searchText) && (!equipment || exercise.equipment.some(item => item === equipment)))

  return <div className="space-y-6">
    <div className="space-y-4 border-y border-border-subtle py-5">
      <label htmlFor={searchId} className="block text-sm font-semibold text-white">Buscar ejercicio, músculo o variante</label>
      <div className="relative"><Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted" aria-hidden="true" /><input id={searchId} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Ej.: sentadilla, espalda, rodillas…" className="min-h-11 w-full rounded-lg border border-border-subtle bg-brand-deep py-3 pl-10 pr-3 text-white placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent" /></div>
      <details ref={filters}>
        <summary className="min-h-11 cursor-pointer py-3 font-semibold text-accent">Material: {EXERCISE_EQUIPMENT.find(item => item.id === equipment)?.label ?? 'Todos'}</summary>
        <label htmlFor={equipmentId} className="mt-2 block text-sm text-muted">Material de alguna de las variantes</label>
        <select id={equipmentId} value={equipment} onChange={event => {
          setEquipment(event.target.value)
          if (filters.current) { filters.current.open = false; filters.current.querySelector('summary')?.focus() }
        }} className="mt-2 min-h-11 w-full rounded-lg border border-border-subtle bg-brand-deep p-3 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
          <option value="">Todos</option>{EXERCISE_EQUIPMENT.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
        <p className="mt-3 text-sm text-muted">Una ficha puede reunir variantes con material distinto. Consulta lo que necesita cada una.</p>
      </details>
      <p role="status" className="text-sm text-muted">{visible.length} de {exercises.length} fichas</p>
    </div>

    {visible.length ? <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {visible.map((exercise, index) => <article key={exercise.slug} className="min-w-0 overflow-hidden rounded-xl border border-border-subtle">
        <Link href={`/comunidad/ejercicios/${exercise.slug}`} className="group block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2">
          <div className="relative aspect-[3/2] bg-white"><Image src={`/community/exercises/${exercise.slug}-v1.webp`} alt={exercise.imageAlt} fill loading={index < 3 ? 'eager' : 'lazy'} sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 340px" className="object-contain" /></div>
          <div className="space-y-3 p-5"><p className="text-xs font-semibold uppercase tracking-wide text-muted">{exercise.pattern}</p><h2 className="font-display text-xl font-bold text-white group-hover:text-accent">{exercise.name}</h2><p className="text-sm leading-relaxed text-muted">{exercise.summary}</p><span className="inline-flex min-h-11 items-center gap-2 font-semibold text-accent">Ver ejecución y variantes <ArrowRight className="h-4 w-4" aria-hidden="true" /></span></div>
        </Link>
      </article>)}
    </div> : <div className="space-y-4 py-8"><h2 className="font-semibold text-white">No hay fichas que coincidan</h2><p className="text-muted">Prueba con otro movimiento o elimina el filtro de material.</p><button type="button" onClick={() => { setQuery(''); setEquipment('') }} className="btn-brand min-h-11">Ver todos los ejercicios</button></div>}
  </div>
}
