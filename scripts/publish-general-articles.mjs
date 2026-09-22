#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { config as loadEnv } from 'dotenv'
import { marked } from 'marked'
import { createClient } from '@supabase/supabase-js'

loadEnv({ path: resolve(process.cwd(), '.env.local'), quiet: true })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!supabaseUrl || !serviceRoleKey) throw new Error('[Blog:publishGeneral] Faltan credenciales de Supabase')

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const slugs = [
  'entrenar-despues-de-los-40',
  'cuanta-proteina-necesitas-de-verdad',
  'cardio-eficiente-poco-tiempo',
  'perder-grasa-sin-contar-calorias',
  'rutina-30-minutos-en-casa',
  'bascula-te-miente-medir-progreso-real',
  'agujetas-mito-acido-lactico',
  'dolor-entrenando-cuando-es-problema',
  'suelo-pelvico-lo-que-no-te-cuentan',
]

function parseMarkdown(slug) {
  const raw = readFileSync(resolve(`content/blog/${slug}.md`), 'utf8')
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) throw new Error(`[Blog:parseMarkdown] Frontmatter no válido: ${slug}`)

  const meta = Object.fromEntries(match[1].split(/\r?\n/).flatMap((line) => {
    const item = line.match(/^([^:]+):\s*(.*)$/)
    if (!item) return []
    return [[item[1].trim(), item[2].trim().replace(/^['"]|['"]$/g, '')]]
  }))

  const content = marked
    .parse(match[2], { breaks: true, gfm: true })
    .replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, '')

  return { meta, content }
}

function slugify(value) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const { data: existingCategories, error: categoriesError } = await supabase.from('categories').select('id,title')
if (categoriesError) throw new Error(`[Blog:getCategories] ${categoriesError.message}`)
const categories = new Map(existingCategories.map((category) => [category.title.toLocaleLowerCase('es'), category.id]))

for (const slug of slugs) {
  const { meta, content } = parseMarkdown(slug)
  const categoryName = meta['categoría'] || meta.categoria
  let categoryId = categories.get(categoryName.toLocaleLowerCase('es'))

  if (!categoryId) {
    const { data, error } = await supabase.from('categories').insert({ title: categoryName, slug: slugify(categoryName) }).select('id').single()
    if (error) throw new Error(`[Blog:createCategory] ${categoryName}: ${error.message}`)
    categoryId = data.id
    categories.set(categoryName.toLocaleLowerCase('es'), categoryId)
  }

  const imageName = `${slug}.jpg`
  const storagePath = `blog/${imageName}`
  const { error: uploadError } = await supabase.storage.from('media').upload(
    storagePath,
    readFileSync(resolve(`public/blog/${imageName}`)),
    { cacheControl: '31536000', contentType: 'image/jpeg', upsert: true },
  )
  if (uploadError) throw new Error(`[Blog:uploadImage] ${slug}: ${uploadError.message}`)
  const { data: image } = supabase.storage.from('media').getPublicUrl(storagePath)

  const post = {
    title: meta['título'] || meta.titulo,
    slug,
    excerpt: meta['meta_descripción'] || meta.meta_descripcion,
    author: meta.autor || 'Fernando Royano',
    main_image_url: image.publicUrl,
    main_image_alt: meta.imagen_alt,
    category_id: categoryId,
    published_at: new Date(meta.fecha).toISOString(),
    read_time: meta.tiempo_lectura,
    content,
    published: true,
  }

  const { data: existing, error: lookupError } = await supabase.from('posts').select('id').eq('slug', slug).maybeSingle()
  if (lookupError) throw new Error(`[Blog:lookupPost] ${slug}: ${lookupError.message}`)

  const query = existing
    ? supabase.from('posts').update(post).eq('id', existing.id)
    : supabase.from('posts').insert(post)
  const { data: saved, error: saveError } = await query.select('id,slug,published').single()
  if (saveError) throw new Error(`[Blog:savePost] ${slug}: ${saveError.message}`)
  console.log(`[Blog:publishGeneral] ${existing ? 'actualizado' : 'creado'} ${saved.slug} (${saved.id})`)
}

console.log(`[Blog:publishGeneral] ${slugs.length} artículos publicados correctamente`)
