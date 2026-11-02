export function formatPostDate(value: string): string {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Madrid',
  }).format(new Date(value))
}
