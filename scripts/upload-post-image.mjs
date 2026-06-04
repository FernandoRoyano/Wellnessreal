#!/usr/bin/env node
/**
 * Sube una imagen al bucket `media` de Supabase y actualiza el campo
 * main_image_url del post indicado.
 *
 * Uso: node scripts/upload-post-image.mjs <ruta-imagen> <slug-post> [--alt "Texto alt"]
 *
 * Ejemplo:
 *   node scripts/upload-post-image.mjs ./descarga.png mujer-entrenar-fuerza-mitos --alt "Mujer haciendo sentadilla"
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve, basename, extname } from 'node:path'
import { config as loadEnv } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

loadEnv({ path: resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local')
  process.exit(1)
}

const args = process.argv.slice(2)
const imagePath = args.find((a) => !a.startsWith('--') && !args[args.indexOf(a) - 1]?.startsWith('--'))
const slug = args.filter((a) => !a.startsWith('--'))[1]
const altIndex = args.indexOf('--alt')
const altText = altIndex >= 0 ? args[altIndex + 1] : null

if (!imagePath || !slug) {
  console.error('❌ Uso: node scripts/upload-post-image.mjs <ruta-imagen> <slug-post> [--alt "texto"]')
  process.exit(1)
}

const absPath = resolve(imagePath)
if (!existsSync(absPath)) {
  console.error(`❌ No se encuentra la imagen: ${absPath}`)
  process.exit(1)
}

function sanitizeFileName(fileName) {
  const ext = extname(fileName).toLowerCase()
  const name = basename(fileName, extname(fileName))
  const cleanName = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'image'
  return `${cleanName}${ext}`
}

function getContentType(ext) {
  const map = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif' }
  return map[ext.toLowerCase()] || 'application/octet-stream'
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

async function ensureBucket() {
  const { data: buckets, error } = await supabase.storage.listBuckets()
  if (error) {
    console.error('❌ Error listando buckets:', error.message)
    process.exit(1)
  }
  const exists = buckets.some((b) => b.name === 'media')
  if (!exists) {
    console.log('⚠️  El bucket "media" no existe. Creándolo...')
    const { error: createErr } = await supabase.storage.createBucket('media', { public: true })
    if (createErr) {
      console.error('❌ Error creando bucket:', createErr.message)
      process.exit(1)
    }
    console.log('✅ Bucket "media" creado como público')
  }
}

await ensureBucket()

const buffer = readFileSync(absPath)
const ext = extname(absPath)
const safeName = sanitizeFileName(basename(absPath))
const storagePath = `blog/${Date.now()}-${safeName}`

console.log(`📤 Subiendo a: media/${storagePath}`)

const { error: upErr } = await supabase.storage
  .from('media')
  .upload(storagePath, buffer, {
    cacheControl: '3600',
    contentType: getContentType(ext),
    upsert: false,
  })

if (upErr) {
  console.error('❌ Error subiendo imagen:', upErr.message)
  process.exit(1)
}

const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(storagePath)
const publicUrl = publicUrlData.publicUrl
console.log(`✅ Imagen subida: ${publicUrl}`)

// Actualizar el post
const updates = { main_image_url: publicUrl }
if (altText) updates.main_image_alt = altText

const { data: post, error: postErr } = await supabase
  .from('posts')
  .update(updates)
  .eq('slug', slug)
  .select('id, title, slug, main_image_url, main_image_alt')
  .single()

if (postErr) {
  console.error('❌ Error actualizando post:', postErr.message)
  process.exit(1)
}

if (!post) {
  console.error(`❌ No se encontró post con slug "${slug}"`)
  process.exit(1)
}

console.log('')
console.log('✅ Post actualizado correctamente')
console.log(`   Título: ${post.title}`)
console.log(`   Slug:   ${post.slug}`)
console.log(`   Image:  ${post.main_image_url}`)
if (post.main_image_alt) console.log(`   Alt:    ${post.main_image_alt}`)
console.log(`   Edita:  /admin/blog/${post.id}`)
