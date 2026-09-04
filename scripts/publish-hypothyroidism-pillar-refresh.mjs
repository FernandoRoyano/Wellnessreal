#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { extname, resolve } from 'node:path'
import { config as loadEnv } from 'dotenv'
import { marked } from 'marked'
import { createClient } from '@supabase/supabase-js'

loadEnv({ path: resolve(process.cwd(), '.env.local'), quiet: true })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('[Blog:publishHypothyroidismPillar] Faltan credenciales de Supabase')
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const assets = [
  {
    localPath: 'public/blog/adelgazar-hipotiroidismo-guia.jpg',
    storagePath: 'blog/adelgazar-hipotiroidismo-guia.jpg',
  },
  {
    localPath: 'public/blog/hipotiroidismo-peso-contexto.png',
    storagePath: 'blog/hipotiroidismo-peso-contexto.png',
  },
  {
    localPath: 'public/blog/hipotiroidismo-cuatro-palancas.png',
    storagePath: 'blog/hipotiroidismo-cuatro-palancas.png',
  },
]

function contentType(path) {
  const extension = extname(path).toLowerCase()
  if (extension === '.png') return 'image/png'
  if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg'
  throw new Error(`[Blog:contentType] Extensión no soportada: ${extension}`)
}

const publicUrls = new Map()

for (const asset of assets) {
  const { error } = await supabase.storage
    .from('media')
    .upload(asset.storagePath, readFileSync(resolve(asset.localPath)), {
      cacheControl: '3600',
      contentType: contentType(asset.localPath),
      upsert: true,
    })

  if (error) throw new Error(`[Blog:uploadAsset] ${asset.storagePath}: ${error.message}`)

  const { data } = supabase.storage.from('media').getPublicUrl(asset.storagePath)
  publicUrls.set(`/${asset.storagePath}`, data.publicUrl)
}

const markdown = readFileSync(resolve('content/blog/adelgazar-con-hipotiroidismo.md'), 'utf8')
const frontmatter = markdown.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/)
if (!frontmatter) throw new Error('[Blog:parseMarkdown] Frontmatter no válido')

let content = marked.parse(frontmatter[1], { breaks: true, gfm: true })
for (const [localUrl, publicUrl] of publicUrls) {
  content = content.replaceAll(localUrl, publicUrl)
}

const { data: updatedPost, error: updateError } = await supabase
  .from('posts')
  .update({
    title: 'Adelgazar con hipotiroidismo: la guía honesta',
    excerpt: 'Qué parte del peso puede explicar la tiroides, qué cambia cuando el tratamiento está ajustado y cómo organizar comida, fuerza, movimiento y descanso sin dietas extremas.',
    main_image_url: publicUrls.get('/blog/adelgazar-hipotiroidismo-guia.jpg'),
    main_image_alt: 'Mujer adulta realizando una sentadilla con mancuerna en un espacio de entrenamiento doméstico',
    read_time: '12 min de lectura',
    content,
  })
  .eq('slug', 'adelgazar-con-hipotiroidismo')
  .select('id')
  .single()

if (updateError) throw new Error(`[Blog:updatePost] ${updateError.message}`)
if (!updatedPost) throw new Error('[Blog:updatePost] No se encontró el artículo')

console.log('Artículo pilar y recursos visuales actualizados correctamente.')
