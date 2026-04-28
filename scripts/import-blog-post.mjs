#!/usr/bin/env node
/**
 * Importador de posts de blog desde Markdown a Supabase.
 *
 * Uso:  node scripts/import-blog-post.mjs <ruta-al-archivo.md> [--publish]
 *
 * Sin --publish el post se inserta como borrador (published: false).
 * Lee SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY desde .env.local.
 *
 * Frontmatter soportado:
 *   título / title           → title (obligatorio)
 *   slug                     → slug (obligatorio; si falta se genera del título)
 *   categoría / categoria    → resuelve/crea categoría por nombre
 *   fecha / published_at     → published_at (ISO o YYYY-MM-DD)
 *   tiempo_lectura           → read_time
 *   meta_descripción / excerpt → excerpt
 *   imagen_destacada         → main_image_url
 *   imagen_alt               → main_image_alt
 *   autor / author           → author (default: Fernando Royano)
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { config as loadEnv } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { marked } from 'marked'

// --- Cargar .env.local ---
loadEnv({ path: resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local')
  process.exit(1)
}

// --- Args ---
const args = process.argv.slice(2)
const filePath = args.find((a) => !a.startsWith('--'))
const shouldPublish = args.includes('--publish')

if (!filePath) {
  console.error('❌ Uso: node scripts/import-blog-post.mjs <archivo.md> [--publish]')
  process.exit(1)
}

const absPath = resolve(filePath)
if (!existsSync(absPath)) {
  console.error(`❌ No se encuentra el archivo: ${absPath}`)
  process.exit(1)
}

// --- Leer y parsear frontmatter ---
const raw = readFileSync(absPath, 'utf-8')
const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)

let frontmatter = {}
let body = raw

if (fmMatch) {
  body = fmMatch[2]
  for (const line of fmMatch[1].split('\n')) {
    const m = line.match(/^([^:]+):\s*(.*)$/)
    if (!m) continue
    const key = m[1].trim()
    let value = m[2].trim()
    // Quitar comillas si las hay
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    frontmatter[key] = value
  }
}

// --- Helpers de mapeo ---
function pick(obj, ...keys) {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== '') return obj[k]
  }
  return undefined
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const title = pick(frontmatter, 'título', 'titulo', 'title')
if (!title) {
  console.error('❌ Falta el título en el frontmatter (título / title)')
  process.exit(1)
}

const slug = pick(frontmatter, 'slug') || slugify(title)
const excerpt = pick(frontmatter, 'meta_descripción', 'meta_descripcion', 'excerpt', 'descripción', 'descripcion') || ''
const author = pick(frontmatter, 'autor', 'author') || 'Fernando Royano'
const main_image_url = pick(frontmatter, 'imagen_destacada', 'main_image_url') || null
const main_image_alt = pick(frontmatter, 'imagen_alt', 'main_image_alt') || null
const read_time = pick(frontmatter, 'tiempo_lectura', 'read_time') || null
const fecha = pick(frontmatter, 'fecha', 'published_at')
const published_at = fecha ? new Date(fecha).toISOString() : new Date().toISOString()
const categoryName = pick(frontmatter, 'categoría', 'categoria', 'category')

// --- Convertir Markdown a HTML ---
const content = marked.parse(body, { breaks: true, gfm: true })

// --- Supabase client ---
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

// --- Resolver categoría ---
let category_id = null
if (categoryName) {
  const { data: existing } = await supabase
    .from('categories')
    .select('id, title')
    .ilike('title', categoryName)
    .maybeSingle()

  if (existing) {
    category_id = existing.id
    console.log(`📂 Categoría existente: ${existing.title} (${existing.id})`)
  } else {
    const catSlug = slugify(categoryName)
    const { data: created, error: catErr } = await supabase
      .from('categories')
      .insert({ title: categoryName, slug: catSlug })
      .select('id')
      .single()
    if (catErr) {
      console.error('❌ Error creando categoría:', catErr.message)
      process.exit(1)
    }
    category_id = created.id
    console.log(`📂 Categoría creada: ${categoryName} (${category_id})`)
  }
}

// --- Comprobar slug duplicado ---
const { data: dup } = await supabase
  .from('posts')
  .select('id')
  .eq('slug', slug)
  .maybeSingle()

if (dup) {
  console.error(`❌ Ya existe un post con slug "${slug}". Cámbialo en el frontmatter o borra el existente.`)
  process.exit(1)
}

// --- Insertar post ---
const { data: post, error: insertErr } = await supabase
  .from('posts')
  .insert({
    title,
    slug,
    excerpt,
    author,
    main_image_url,
    main_image_alt,
    category_id,
    published_at,
    read_time,
    content,
    published: shouldPublish,
  })
  .select('*')
  .single()

if (insertErr) {
  console.error('❌ Error insertando post:', insertErr.message)
  process.exit(1)
}

console.log('')
console.log('✅ Post importado correctamente')
console.log(`   Título:    ${post.title}`)
console.log(`   Slug:      ${post.slug}`)
console.log(`   Estado:    ${post.published ? 'PUBLICADO' : 'borrador'}`)
console.log(`   ID:        ${post.id}`)
console.log('')
console.log(`   Edita en:  /admin/blog/${post.id}`)
if (post.published) {
  console.log(`   Visible:   /blog/${post.slug}`)
}
