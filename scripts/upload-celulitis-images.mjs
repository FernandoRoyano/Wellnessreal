#!/usr/bin/env node
/**
 * Sube las 3 imágenes nuevas del post de celulitis a Supabase Storage,
 * las inserta en el markdown del post en los puntos correctos y actualiza
 * el contenido HTML del post en Supabase.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { resolve, extname, basename } from 'node:path'
import { config as loadEnv } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { marked } from 'marked'

loadEnv({ path: resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Faltan envs de Supabase en .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const SLUG = 'celulitis-guia-evidencia-cientifica'
const MD_PATH = resolve('content/blog/celulitis-guia-evidencia-cientifica.md')
const IMG_DIR = resolve('content/blog/images-celulitis')

// Cada entrada: archivo + alt + texto del párrafo anterior tras el que insertar la imagen
const IMAGES = [
  {
    file: 'celulitis-01-anatomia-piel-femenina.jpg.png',
    alt: 'Sección transversal de la piel femenina mostrando los lóbulos de grasa subcutánea separados por septos fibrosos verticales que generan el efecto piel de naranja en la superficie',
    insertAfterText: 'En los hombres, en cambio, esos septos se disponen en cruz, en diagonal, sujetando la grasa mucho mejor.',
    // Esta imagen entra antes de la infografía mujer-vs-hombre existente (que va justo después)
  },
  {
    file: 'celulitis-02-historia-vintage-vogue.jpg.png',
    alt: 'Revista vintage abierta sobre mármol con una modelo de espaldas vestida de negro, en alusión al artículo de Vogue 1968 que popularizó la celulitis como problema estético',
    insertAfterText: 'El artículo describe a una mujer joven aterrorizada por haber tardado demasiado en "diagnosticarse" la celulitis.',
  },
  {
    file: 'celulitis-03-teoria-endotoxemia-kruglikov.jpg.png',
    alt: 'Representación abstracta de células de grasa con destello amarillo simulando endotoxinas bacterianas, ilustrando la hipótesis de endotoxemia selectiva de Kruglikov y Scherer',
    insertAfterText: 'Lo resumo en cristiano: proponen que el motor profundo de la celulitis sería la acumulación selectiva, en la grasa de caderas y muslos, de **endotoxinas bacterianas** (LPS) procedentes de la microbiota.',
  },
]

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
  const map = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' }
  return map[ext.toLowerCase()] || 'application/octet-stream'
}

async function uploadImage(filePath) {
  const buffer = readFileSync(filePath)
  // Quitar doble extensión .jpg.png si la tiene → nos quedamos con .png real
  const ext = extname(filePath).toLowerCase()
  const safeName = sanitizeFileName(basename(filePath))
  const storagePath = `blog/${Date.now()}-${safeName}`

  const { error } = await supabase.storage
    .from('media')
    .upload(storagePath, buffer, {
      cacheControl: '3600',
      contentType: getContentType(ext),
      upsert: false,
    })
  if (error) {
    console.error(`❌ Error subiendo ${basename(filePath)}:`, error.message)
    process.exit(1)
  }

  const { data } = supabase.storage.from('media').getPublicUrl(storagePath)
  return data.publicUrl
}

// --- 1. Subir las 3 imágenes ---
console.log('📤 Subiendo imágenes a Supabase Storage...\n')

for (const img of IMAGES) {
  const filePath = resolve(IMG_DIR, img.file)
  if (!existsSync(filePath)) {
    console.error(`❌ No existe: ${filePath}`)
    process.exit(1)
  }
  img.url = await uploadImage(filePath)
  console.log(`✅ ${img.file}\n   → ${img.url}\n`)
}

// --- 2. Editar el markdown ---
console.log('📝 Insertando imágenes en el markdown...\n')

let md = readFileSync(MD_PATH, 'utf-8')

for (const img of IMAGES) {
  const anchor = img.insertAfterText
  const idx = md.indexOf(anchor)
  if (idx === -1) {
    console.error(`❌ No encuentro el texto ancla:\n   "${anchor.slice(0, 60)}..."`)
    process.exit(1)
  }
  const afterAnchor = idx + anchor.length
  // Buscar el final del párrafo (doble salto de línea)
  const paraEnd = md.indexOf('\n\n', afterAnchor)
  const insertAt = paraEnd === -1 ? afterAnchor : paraEnd

  const imageMd = `\n\n![${img.alt}](${img.url})`
  md = md.slice(0, insertAt) + imageMd + md.slice(insertAt)
  console.log(`✅ Imagen insertada tras: "${anchor.slice(0, 60)}..."`)
}

writeFileSync(MD_PATH, md)
console.log(`\n💾 Markdown actualizado: ${MD_PATH}\n`)

// --- 3. Re-renderizar HTML y actualizar Supabase ---
console.log('🔄 Actualizando contenido del post en Supabase...\n')

const fmMatch = md.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
const body = fmMatch ? fmMatch[2] : md
const content = marked.parse(body, { breaks: true, gfm: true })

const { data: post, error: updateErr } = await supabase
  .from('posts')
  .update({ content })
  .eq('slug', SLUG)
  .select('id, title, slug, published')
  .single()

if (updateErr) {
  console.error('❌ Error actualizando post:', updateErr.message)
  process.exit(1)
}

console.log('✅ Post actualizado')
console.log(`   ${post.title}`)
console.log(`   Estado: ${post.published ? 'PUBLICADO' : 'borrador'}`)
console.log(`   Edita: /admin/blog/${post.id}`)
if (post.published) console.log(`   Live:  /blog/${post.slug}`)
