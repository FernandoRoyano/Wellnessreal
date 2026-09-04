#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { config as loadEnv } from 'dotenv'
import { marked } from 'marked'
import { createClient } from '@supabase/supabase-js'

loadEnv({ path: resolve(process.cwd(), '.env.local'), quiet: true })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('[Blog:publishWeightPlateauHypothyroidism] Faltan credenciales de Supabase')
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const cover = {
  localPath: 'public/blog/por-que-no-adelgazo-hipotiroidismo.jpg',
  storagePath: 'blog/por-que-no-adelgazo-hipotiroidismo.jpg',
}

const { error: uploadError } = await supabase.storage
  .from('media')
  .upload(cover.storagePath, readFileSync(resolve(cover.localPath)), {
    cacheControl: '3600',
    contentType: 'image/jpeg',
    upsert: true,
  })

if (uploadError) throw new Error(`[Blog:uploadCover] ${uploadError.message}`)

const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(cover.storagePath)
const markdown = readFileSync(resolve('content/blog/por-que-no-adelgazo-con-hipotiroidismo.md'), 'utf8')
const frontmatter = markdown.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/)
if (!frontmatter) throw new Error('[Blog:parseMarkdown] Frontmatter no válido')

const content = marked.parse(frontmatter[1], { breaks: true, gfm: true })

const { data: updatedPost, error: updateError } = await supabase
  .from('posts')
  .update({
    title: '¿Por qué no adelgazo con hipotiroidismo aunque lo hago todo bien?',
    excerpt: 'Si comes mejor, entrenas y el peso no cambia, no necesitas castigarte más. Revisa estas siete piezas para distinguir un estancamiento real del ruido de la báscula.',
    main_image_url: publicUrlData.publicUrl,
    main_image_alt: 'Mujer adulta revisando su cuaderno de entrenamiento después de una sesión de fuerza en casa',
    read_time: '12 min de lectura',
    content,
  })
  .eq('slug', 'por-que-no-adelgazo-con-hipotiroidismo')
  .select('id')
  .single()

if (updateError) throw new Error(`[Blog:updatePost] ${updateError.message}`)
if (!updatedPost) throw new Error('[Blog:updatePost] No se encontró el artículo')

console.log('Artículo sobre estancamiento con hipotiroidismo actualizado correctamente.')
