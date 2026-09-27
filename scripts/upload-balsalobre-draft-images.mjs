#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { extname, resolve } from 'node:path'
import { config as loadEnv } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'

loadEnv({ path: resolve(process.cwd(), '.env.local'), quiet: true })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('[Blog:uploadBalsalobreImages] Faltan credenciales de Supabase')
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const posts = [
  ['entrenar-al-fallo-fatiga', ['escala-rir-fallo.svg', 'estimulo-fatiga-fallo.svg']],
  ['volumen-entrenamiento-hipertrofia', ['volumen-semanal.svg']],
  ['rir-rpe-autoregular-entrenamiento', ['triangulo-autoregulacion.svg']],
  ['entrenamiento-basado-velocidad-vbt', ['perfil-carga-velocidad.svg']],
  ['movil-medir-salto-velocidad-barra', ['validar-app-medicion.svg']],
  ['cardio-fuerza-interferencia-hipertrofia', ['concurrente-musculo-fibra.svg']],
  ['fuerza-economia-carrera', ['economia-carrera.svg']],
  ['foam-roller-vibracion-recuperacion', ['recuperacion-variables.svg']],
  ['ciencia-entrenamiento-carlos-balsalobre', ['mapa-balsalobre.svg']],
  ['sesion-fuerza-completa-ejemplo', ['estructura-sesion-fuerza.svg', 'bloques-sesion-fuerza.svg']],
  ['sesion-fuerza-corredores-ejemplo', ['semana-fuerza-corredor.svg', 'bloques-fuerza-corredor.svg']],
]

function contentType(fileName) {
  return extname(fileName) === '.svg' ? 'image/svg+xml' : 'image/jpeg'
}

async function upload(localPath, storagePath) {
  const isSvg = extname(localPath) === '.svg'
  const body = isSvg
    ? await sharp(resolve(localPath)).resize({ width: 1800 }).png({ compressionLevel: 9 }).toBuffer()
    : readFileSync(resolve(localPath))
  const { error } = await supabase.storage.from('media').upload(
    storagePath,
    body,
    { cacheControl: '31536000', contentType: isSvg ? 'image/png' : contentType(localPath), upsert: true },
  )
  if (error) throw new Error(`[Blog:uploadImage] ${storagePath}: ${error.message}`)
  return supabase.storage.from('media').getPublicUrl(storagePath).data.publicUrl
}

for (const [slug, illustrations] of posts) {
  const coverName = `${slug}.jpg`
  const coverUrl = await upload(`public/blog/${coverName}`, `blog/${coverName}`)

  const { data: post, error: lookupError } = await supabase
    .from('posts')
    .select('id,content,published')
    .eq('slug', slug)
    .single()
  if (lookupError) throw new Error(`[Blog:getDraft] ${slug}: ${lookupError.message}`)
  const status = post.published ? 'publicado' : 'borrador'

  let content = post.content
  for (const fileName of illustrations) {
    const storageName = fileName.replace(/\.svg$/, '.png')
    const imageUrl = await upload(
      `public/blog/illustrations/${fileName}`,
      `blog/illustrations/${storageName}`,
    )
    content = content.replaceAll(`/blog/illustrations/${fileName}`, imageUrl)
  }

  const { error: updateError } = await supabase
    .from('posts')
    .update({ main_image_url: coverUrl, content })
    .eq('id', post.id)
  if (updateError) throw new Error(`[Blog:updateDraftImages] ${slug}: ${updateError.message}`)

  console.log(`[Blog:updateDraftImages] ${slug} (${status}): portada + ${illustrations.length} ilustración(es)`)
}

console.log(`[Blog:updateDraftImages] ${posts.length} posts actualizados sin cambiar su estado`)
