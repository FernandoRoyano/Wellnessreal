import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: '.env.local', quiet: true })
const base = new URL(process.argv.find(value => value.startsWith('--base-url='))?.slice(11) ?? 'https://wellnessreal.es')
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const { data: posts, error } = await supabase.from('posts').select('slug,main_image_url,main_image_alt').eq('published', true)
if (error) throw new Error('[ContentCheck:list] No se pudo consultar el contenido publicado')
let failures = 0
const images = new Set()
for (const post of posts) {
  if (!post.main_image_url || !post.main_image_alt?.trim()) {
    console.error(`[ContentCheck:image] /blog/${post.slug}: falta imagen o texto alternativo`)
    failures++
  }
  if (post.main_image_url) images.add(post.main_image_url)
  if (post.main_image_url?.startsWith('/') && !existsSync(resolve('public', post.main_image_url.slice(1)))) {
    console.error(`[ContentCheck:asset] No existe en el commit: ${post.main_image_url}`)
    failures++
  }
}
const checks = [
  ...posts.map(post => ({ url: new URL(`/blog/${post.slug}`, base), method: 'GET', type: 'text/html' })),
  ...[...images].map(image => ({ url: new URL(image, base), method: 'HEAD', type: 'image/' })),
]
let cursor = 0
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < checks.length) {
    const check = checks[cursor++]
    try {
      const response = await fetch(check.url, { method: check.method, redirect: 'follow', signal: AbortSignal.timeout(30000) })
      if (!response.ok || !response.headers.get('content-type')?.includes(check.type)) {
        console.error(`[ContentCheck:http] ${check.url}: ${response.status}, ${response.headers.get('content-type')}`)
        failures++
      }
      await response.body?.cancel()
    } catch {
      console.error(`[ContentCheck:http] No se pudo verificar ${check.url}`)
      failures++
    }
  }
}))
console.log(`[ContentCheck:result] ${posts.length} artículos, ${images.size} imágenes, ${failures} incidencias`)
process.exitCode = failures ? 1 : 0
