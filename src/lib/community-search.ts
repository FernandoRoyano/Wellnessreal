const SYNONYMS = [
  ['fatiga', 'cansancio', 'cansada', 'cansado', 'agotamiento', 'energia'],
  ['alimentacion', 'nutricion', 'comida', 'comidas'],
  ['descanso', 'dormir', 'sueno', 'recuperacion'],
  ['fuerza', 'pesas', 'musculo', 'muscular'],
  ['organizar', 'organizacion', 'planificar', 'planificacion'],
] as const

export function normalizeCommunitySearch(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim()
}

export function matchesCommunitySearch(query: string, text: string): boolean {
  const normalizedText = normalizeCommunitySearch(text)
  const stopWords = new Set(['de', 'del', 'la', 'las', 'el', 'los', 'con', 'y', 'para'])
  const terms = normalizeCommunitySearch(query).split(/\s+/).filter(term => term && !stopWords.has(term))
  return terms.every(term => {
    const alternatives = SYNONYMS.find(group => group.some(word => word === term)) ?? [term]
    return alternatives.some(word => normalizedText.includes(word))
  })
}
