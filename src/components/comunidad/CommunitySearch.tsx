'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen, Search, X } from 'lucide-react'
import { matchesCommunitySearch, normalizeCommunitySearch } from '@/lib/community-search'

export interface SearchableLesson {
  id: string
  title: string
  slug: string
  spaceName: string
  spaceSlug: string
  locked: boolean
  lockReason?: 'drip' | 'tier' | 'approval' | null
  daysUntilUnlock?: number
}

export function CommunitySearch({ lessons }: { lessons: SearchableLesson[] }) {
  const [query, setQuery] = useState('')
  const normalizedQuery = normalizeCommunitySearch(query)
  const results = useMemo(() => normalizedQuery
    ? lessons.filter((lesson) => matchesCommunitySearch(normalizedQuery, `${lesson.title} ${lesson.spaceName}`))
    : lessons,
  [lessons, normalizedQuery])

  return <div className="community-search">
    <label htmlFor="community-search-input">Buscar por tema o lección</label>
    <div className="community-search-input">
      <Search size={20} aria-hidden="true" />
      <input id="community-search-input" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ej. cansancio, fuerza, analítica…" autoComplete="off" />
      {query && <button type="button" onClick={() => setQuery('')} aria-label="Borrar búsqueda"><X size={17} /></button>}
    </div>
    <p className="community-search-count" aria-live="polite">{results.length} {results.length === 1 ? 'resultado' : 'resultados'}</p>
    {results.length > 0 ? <div className="community-search-results">{results.map((lesson) => lesson.locked ? <article key={lesson.id}><BookOpen size={19} /><div><small>{lesson.spaceName}</small><strong>{lesson.title}</strong><span>{lesson.lockReason === 'drip' && lesson.daysUntilUnlock ? `Disponible en ${lesson.daysUntilUnlock} ${lesson.daysUntilUnlock === 1 ? 'día' : 'días'}` : lesson.lockReason === 'approval' ? 'Disponible cuando tu plan esté aprobado' : lesson.lockReason === 'tier' ? 'Requiere acceso al programa' : 'Disponible más adelante'}</span></div></article> : <Link key={lesson.id} href={`/comunidad/${lesson.spaceSlug}/${lesson.slug}`}><BookOpen size={19} /><div><small>{lesson.spaceName}</small><strong>{lesson.title}</strong></div><ArrowRight size={17} /></Link>)}</div> : <div className="community-search-empty"><Search size={25} /><strong>No encuentro ese tema</strong><p>Prueba con una palabra más general o pregunta directamente en el foro.</p><Link href="/comunidad/preguntas-apoyo">Ir a preguntas y apoyo</Link></div>}
  </div>
}
