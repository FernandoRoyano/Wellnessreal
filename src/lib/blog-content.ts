const VOID_ELEMENTS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'])

/** Mantiene listas, tablas, imágenes y pies dentro de su sección original. */
export function splitBlogSections(html: string): string[] {
  const boundaries: number[] = [0]
  const stack: string[] = []
  const tags = /<!--[\s\S]*?-->|<\/?[a-zA-Z][^>"']*(?:(?:"[^"]*"|'[^']*')[^>"']*)*>/g
  let rawElement: string | undefined

  for (const match of html.matchAll(tags)) {
    const token = match[0]
    if (token.startsWith('<!--')) continue
    const name = /^<\/?([a-zA-Z][\w:-]*)/.exec(token)?.[1].toLowerCase()
    if (!name) continue
    const closing = token.startsWith('</')

    if (rawElement && !(closing && name === rawElement)) continue
    if (closing) {
      const index = stack.lastIndexOf(name)
      if (index >= 0) stack.length = index
      if (name === rawElement) rawElement = undefined
      continue
    }

    if (name === 'h2' && stack.length === 0 && match.index > 0) {
      boundaries.push(match.index)
    }
    if (!VOID_ELEMENTS.has(name) && !/\/\s*>$/.test(token)) {
      stack.push(name)
      if (name === 'script' || name === 'style') rawElement = name
    }
  }

  return boundaries.map((start, index) => html.slice(start, boundaries[index + 1] ?? html.length))
}
