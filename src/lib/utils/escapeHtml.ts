// Escapa valores de usuario antes de interpolarlos en el HTML de los emails,
// para evitar inyección de markup/enlaces de phishing en los correos.
const MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export function escapeHtml(value: unknown): string {
  if (value == null) return ''
  return String(value).replace(/[&<>"']/g, (c) => MAP[c])
}

// Sanea una línea de asunto de email: sin saltos de línea (evita header injection).
export function sanitizeHeader(value: unknown): string {
  if (value == null) return ''
  return String(value).replace(/[\r\n]+/g, ' ').trim()
}
