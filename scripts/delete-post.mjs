#!/usr/bin/env node
/**
 * Borra un post de blog de Supabase por su slug.
 *
 * Uso: node scripts/delete-post.mjs <slug>
 *
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

const slug = process.argv[2]
if (!slug) {
  console.error('❌ Uso: node scripts/delete-post.mjs <slug>')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const { data: post } = await supabase
  .from('posts')
  .select('id, title, published')
  .eq('slug', slug)
  .maybeSingle()

if (!post) {
  console.log(`ℹ️  No existe ningún post con slug "${slug}". Nada que borrar.`)
  process.exit(0)
}

const { error } = await supabase.from('posts').delete().eq('id', post.id)
if (error) {
  console.error('❌ Error borrando el post:', error.message)
  process.exit(1)
}

console.log(`🗑️  Borrado: ${post.title} (slug: ${slug}, estado: ${post.published ? 'PUBLICADO' : 'borrador'})`)
