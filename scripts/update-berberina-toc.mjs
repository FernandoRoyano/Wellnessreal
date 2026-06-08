#!/usr/bin/env node
/**
 * Añade anchors a las secciones del post de berberina y refresca el HTML
 * en Supabase. El índice ya estaba en markdown con links #anchor — solo
 * faltaba poner las anclas correspondientes en cada heading.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { config as loadEnv } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { marked } from 'marked'

loadEnv({ path: resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
)

const SLUG = 'berberina-evidencia-cientifica'
const MD_PATH = resolve('content/blog/berberina.md')

// número de sección → anchor id usado en el índice
const ANCHORS = {
  1: 'que-es',
  2: 'como-funciona',
  3: 'usos',
  4: 'ozempic',
  5: 'metformina',
  6: 'si-no',
  7: 'riesgos',
  8: 'como-tomar',
  9: 'calidad',
  10: 'veredicto',
}

let md = readFileSync(MD_PATH, 'utf-8')

for (const [n, anchor] of Object.entries(ANCHORS)) {
  const headingRegex = new RegExp(`(^|\\n)(## ${n}\\.[^\\n]+)`, 'g')
  md = md.replace(headingRegex, (match, prefix, heading) => {
    if (md.includes(`<a id="${anchor}"></a>\n${heading}`)) return match
    return `${prefix}<a id="${anchor}"></a>\n${heading}`
  })
}

writeFileSync(MD_PATH, md)
console.log('💾 Markdown actualizado con anchors\n')

const fmMatch = md.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
const body = fmMatch ? fmMatch[2] : md
const content = marked.parse(body, { breaks: true, gfm: true })

const { data: post, error } = await supabase
  .from('posts')
  .update({ content })
  .eq('slug', SLUG)
  .select('id, title, published')
  .single()

if (error) { console.error('❌', error.message); process.exit(1) }

console.log('✅ Post actualizado en Supabase')
console.log(`   ${post.title}`)
console.log(`   Estado: ${post.published ? 'PUBLICADO' : 'borrador'}`)
console.log(`   Edita: /admin/blog/${post.id}`)
