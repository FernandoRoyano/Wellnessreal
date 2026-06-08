#!/usr/bin/env node
/**
 * Hace clicable el índice del post de celulitis:
 * - Añade <a id="seccion-N"></a> justo antes de cada `## N. ...`
 * - Reemplaza la lista del índice con links a esas anclas
 * - Re-renderiza el HTML y actualiza Supabase
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { config as loadEnv } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { marked } from 'marked'

loadEnv({ path: resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const SLUG = 'celulitis-guia-evidencia-cientifica'
const MD_PATH = resolve('content/blog/celulitis-guia-evidencia-cientifica.md')

// Mapeo número → texto visible del índice (lo que se muestra y enlaza)
const TOC = [
  [1, 'Qué es la celulitis (de verdad)'],
  [2, 'La historia que casi nadie te cuenta: cómo se "inventó"'],
  [3, 'Por qué te sale: las causas reales'],
  [4, 'El papel de las hormonas a fondo'],
  [5, 'Tratamientos: qué funciona y qué no'],
  [6, '¿Y los métodos alternativos? (MTC, Ayurveda, remedios caseros)'],
  [7, '¿Merece la pena gastarse el dinero?'],
  [8, 'El ejercicio: tu mejor herramienta'],
  [9, 'La alimentación que sí ayuda'],
  [10, 'Cómo "regular" tus hormonas (realista)'],
  [11, 'Tu plan de acción'],
]

let md = readFileSync(MD_PATH, 'utf-8')

// 1. Reemplazar el bloque del índice (entre "## Índice" y "---")
const newToc = ['## Índice', '', ...TOC.map(([n, label]) => `${n}. [${label}](#seccion-${n})`), ''].join('\n')
md = md.replace(/## Índice\n[\s\S]*?(?=\n---\n)/, newToc)

// 2. Añadir anclas antes de cada "## N. ..."
// Solo si no existe ya un <a id="..."></a> en la línea anterior
for (let n = 1; n <= 11; n++) {
  const headingRegex = new RegExp(`(^|\\n)(## ${n}\\.[^\\n]+)`, 'g')
  md = md.replace(headingRegex, (match, prefix, heading) => {
    // Si el bloque anterior ya tiene el anchor, no duplicar
    if (md.includes(`<a id="seccion-${n}"></a>\n${heading}`)) return match
    return `${prefix}<a id="seccion-${n}"></a>\n${heading}`
  })
}

writeFileSync(MD_PATH, md)
console.log('💾 Markdown actualizado con índice clicable\n')

// 3. Re-renderizar y actualizar Supabase
const fmMatch = md.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
const body = fmMatch ? fmMatch[2] : md
const content = marked.parse(body, { breaks: true, gfm: true })

const { data: post, error } = await supabase
  .from('posts')
  .update({ content })
  .eq('slug', SLUG)
  .select('id, title, published')
  .single()

if (error) {
  console.error('❌', error.message)
  process.exit(1)
}

console.log('✅ Post actualizado en Supabase')
console.log(`   ${post.title}`)
console.log(`   Estado: ${post.published ? 'PUBLICADO' : 'borrador'}`)
console.log(`   Edita: /admin/blog/${post.id}`)
