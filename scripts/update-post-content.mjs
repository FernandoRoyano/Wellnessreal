#!/usr/bin/env node
/**
 * Actualiza el CONTENIDO (HTML) de un post existente a partir de su Markdown,
 * sin tocar published / published_at / imagen ni el resto de campos.
 *
 * Útil para reactivar enlaces internos o corregir el cuerpo de un post ya
 * importado, sin tener que borrarlo y reimportarlo.
 *
 * Uso:  node scripts/update-post-content.mjs <ruta-al-archivo.md>
 *
 * El slug se lee del frontmatter. Lee credenciales de .env.local.
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { config as loadEnv } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { marked } from 'marked'

loadEnv({ path: resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local')
  process.exit(1)
}

const filePath = process.argv[2]
if (!filePath) {
  console.error('❌ Uso: node scripts/update-post-content.mjs <archivo.md>')
  process.exit(1)
}

const absPath = resolve(filePath)
if (!existsSync(absPath)) {
  console.error(`❌ No se encuentra el archivo: ${absPath}`)
  process.exit(1)
}

// --- Parsear frontmatter + body ---
const raw = readFileSync(absPath, 'utf-8')
const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
if (!fmMatch) {
  console.error('❌ El archivo no tiene frontmatter válido.')
  process.exit(1)
}

const body = fmMatch[2]
let slug
for (const line of fmMatch[1].split('\n')) {
  const m = line.match(/^slug:\s*(.*)$/)
  if (m) {
    slug = m[1].trim().replace(/^["']|["']$/g, '')
    break
  }
}

if (!slug) {
  console.error('❌ No se encontró "slug" en el frontmatter.')
  process.exit(1)
}

// Mismo tratamiento que el importador: elimina el <h1> inicial duplicado
const content = marked
  .parse(body, { breaks: true, gfm: true })
  .replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, '')

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const { data: post } = await supabase
  .from('posts')
  .select('id, title, published')
  .eq('slug', slug)
  .maybeSingle()

if (!post) {
  console.error(`❌ No existe ningún post con slug "${slug}".`)
  process.exit(1)
}

const { error } = await supabase.from('posts').update({ content }).eq('id', post.id)
if (error) {
  console.error('❌ Error actualizando el contenido:', error.message)
  process.exit(1)
}

console.log(`✅ Contenido actualizado: ${post.title}`)
console.log(`   Slug:   ${slug}`)
console.log(`   Estado: ${post.published ? 'PUBLICADO (cambio visible ya)' : 'borrador'}`)
