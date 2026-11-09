const COMMERCIAL_PATHS = new Set(['/metodo-tiroides', '/servicios/entrenamiento-online', '/valoracion'])

export function sanitizeArticleSource(value: unknown): string | undefined {
  return typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 120 ? value : undefined
}

export function withArticleSource(destination: string, source: unknown): string {
  const article = sanitizeArticleSource(source)
  if (!article || !destination.startsWith('/') || destination.startsWith('//')) return destination
  const url = new URL(destination, 'https://wellnessreal.es')
  if (!COMMERCIAL_PATHS.has(url.pathname)) return destination
  url.searchParams.set('articulo', article)
  return `${url.pathname}${url.search}${url.hash}`
}

export function attributeArticleLinks(html: string, source: string): string {
  return html.replace(/href=(['"])(\/[^'"<>]*)\1/g, (original, quote: string, destination: string) => {
    const href = withArticleSource(destination.replaceAll('&amp;', '&'), source)
    return href === destination ? original : `href=${quote}${href.replaceAll('&', '&amp;')}${quote}`
  })
}
