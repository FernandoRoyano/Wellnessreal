/** Iniciales para el avatar por defecto (máx. 2 letras). */
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

/** Tiempo relativo en español, compacto (hace 3 h, hace 2 d…). */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'ahora'
  if (min < 60) return `hace ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `hace ${h} h`
  const d = Math.floor(h / 24)
  if (d < 30) return `hace ${d} d`
  const mo = Math.floor(d / 30)
  if (mo < 12) return `hace ${mo} mes${mo === 1 ? '' : 'es'}`
  return `hace ${Math.floor(mo / 12)} año${mo < 24 ? '' : 's'}`
}
