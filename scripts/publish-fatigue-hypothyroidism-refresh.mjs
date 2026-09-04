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
  throw new Error('[Blog:publishFatigueHypothyroidism] Faltan credenciales de Supabase')
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const assets = [
  {
    localPath: 'public/blog/cansancio-hipotiroidismo-guia.jpg',
    storagePath: 'blog/cansancio-hipotiroidismo-guia.jpg',
  },
  {
    localPath: 'public/blog/cansancio-hipotiroidismo-mapa.png',
    storagePath: 'blog/cansancio-hipotiroidismo-mapa.png',
  },
  {
    localPath: 'public/blog/cansancio-hipotiroidismo-semaforo.png',
    storagePath: 'blog/cansancio-hipotiroidismo-semaforo.png',
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

const markdown = readFileSync(resolve('content/blog/cansancio-e-hipotiroidismo.md'), 'utf8')
const frontmatter = markdown.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/)
if (!frontmatter) throw new Error('[Blog:parseMarkdown] Frontmatter no válido')

let content = marked.parse(frontmatter[1], { breaks: true, gfm: true })
for (const [localUrl, publicUrl] of publicUrls) {
  content = content.replaceAll(localUrl, publicUrl)
}

const { data: updatedPost, error: updateError } = await supabase
  .from('posts')
  .update({
    title: 'Cansancio e hipotiroidismo: qué revisar y qué puedes hacer',
    excerpt: 'Si sigues agotada, no lo reduzcas todo a falta de voluntad. Qué revisar con tu médico y cómo ajustar sueño, comida y movimiento sin obligarte a funcionar como si nada pasara.',
    main_image_url: publicUrls.get('/blog/cansancio-hipotiroidismo-guia.jpg'),
    main_image_alt: 'Mujer adulta preparándose para moverse en casa mientras se ata una zapatilla',
    read_time: '11 min de lectura',
    content,
  })
  .eq('slug', 'cansancio-e-hipotiroidismo')
  .select('id')
  .single()

if (updateError) throw new Error(`[Blog:updatePost] ${updateError.message}`)
if (!updatedPost) throw new Error('[Blog:updatePost] No se encontró el artículo')

console.log('Artículo sobre cansancio y recursos visuales actualizados correctamente.')
