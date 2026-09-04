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
  throw new Error('[Blog:publishSupplementsRefresh] Faltan credenciales de Supabase')
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const assets = [
  {
    localPath: 'public/blog/suplementos-tiroides-evidencia.jpg',
    storagePath: 'blog/suplementos-tiroides-evidencia.jpg',
  },
  {
    localPath: 'public/blog/suplementos-tiroides-mapa.png',
    storagePath: 'blog/suplementos-tiroides-mapa.png',
  },
  {
    localPath: 'public/blog/suplementos-tiroides-yodo.png',
    storagePath: 'blog/suplementos-tiroides-yodo.png',
  },
]

function contentType(path) {
  const extension = extname(path).toLowerCase()
  if (extension === '.svg') return 'image/svg+xml'
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

const markdown = readFileSync(resolve('content/blog/suplementos-tiroides.md'), 'utf8')
const frontmatter = markdown.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/)
if (!frontmatter) throw new Error('[Blog:parseMarkdown] Frontmatter no válido')

let content = marked.parse(frontmatter[1], { breaks: true, gfm: true })
for (const [localUrl, publicUrl] of publicUrls) {
  content = content.replaceAll(localUrl, publicUrl)
}

const { error: updateError } = await supabase
  .from('posts')
  .update({
    title: 'Suplementos para la tiroides: qué sirve y qué es humo',
    excerpt: 'Yodo, selenio, vitamina D, hierro y aceleradores del metabolismo: qué sabemos, qué no y por qué una analítica vale más que comprar suplementos a ciegas.',
    main_image_url: publicUrls.get('/blog/suplementos-tiroides-evidencia.jpg'),
    main_image_alt: 'Botes de suplementos junto a un informe, portada de la guía sobre suplementos y tiroides',
    read_time: '9 min de lectura',
    content,
  })
  .eq('slug', 'suplementos-tiroides')

if (updateError) throw new Error(`[Blog:updatePost] ${updateError.message}`)

console.log('Artículo y recursos visuales actualizados correctamente.')
