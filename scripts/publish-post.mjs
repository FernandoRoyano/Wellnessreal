#!/usr/bin/env node
/**
 * Publica un post de blog (published: true) por su slug.
 *
 * Uso:  node scripts/publish-post.mjs <slug> [--keep-date]
 *
 * Por defecto pone published_at = ahora (un post que se publica hoy no debería
 * tener fecha futura). Con --keep-date conserva la fecha original.
 * Lee NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY desde .env.local.
 */

import { resolve } from 'node:path'
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
const slug = args.find((a) => !a.startsWith('--'))
const keepDate = args.includes('--keep-date')

if (!slug) {
  console.error('❌ Uso: node scripts/publish-post.mjs <slug> [--keep-date]')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const { data: post } = await supabase
  .from('posts')
  .select('id, title, published, published_at')
  .eq('slug', slug)
  .maybeSingle()

if (!post) {
  console.error(`❌ No existe ningún post con slug "${slug}".`)
  process.exit(1)
}

const updates = { published: true }
if (!keepDate) updates.published_at = new Date().toISOString()

const { error } = await supabase.from('posts').update(updates).eq('id', post.id)
if (error) {
  console.error('❌ Error publicando el post:', error.message)
  process.exit(1)
}

console.log(`✅ Publicado: ${post.title}`)
console.log(`   Slug:    ${slug}`)
console.log(`   Fecha:   ${keepDate ? post.published_at : updates.published_at}`)
console.log(`   Visible: https://wellnessreal.es/blog/${slug}`)
