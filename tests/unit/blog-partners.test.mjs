import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import { createRequire } from 'node:module'
import ts from 'typescript'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const require = createRequire(import.meta.url)
function load(file, dependencies = {}) {
  const compiled = { exports: {} }
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText
  vm.runInNewContext(source, { module: compiled, exports: compiled.exports, console, Date, require: name => {
    if (name in dependencies) return dependencies[name]
    if (['react/jsx-runtime', 'lucide-react'].includes(name)) return require(name)
    throw new Error(`Missing test dependency ${name}`)
  } })
  return compiled.exports
}

const partners = load('src/lib/blog-partners.ts')
const slug = 'caminar-salud-osea-osteofit'
const sourceUrl = partners.getBlogPartner(slug).articleUrl
const content = `<p>Lectura recomendada.</p><p><a href="${sourceUrl}">Artículo original</a></p><p>Contexto.</p><p><a href="https://metodoosteofit.com/el-metodo/">Consultar Osteofit</a></p><p>Fin.</p>`
const posts = [slug, 'entrenamiento-habitual'].map(slug => ({
  slug, title: 'Lectura', excerpt: 'Introducción', author: 'Fernando Royano', content,
  published_at: '2026-11-06T09:00:00Z', updated_at: '2026-11-06T09:00:00Z',
}))
const db = { getPostBySlug: async slug => posts.find(post => post.slug === slug), getAllPosts: async () => posts, getRelatedPosts: async () => [] }
const Link = ({ children, href }) => React.createElement('a', { href }, children)
const blogContent = load('src/components/blog/BlogContentWithCTAs.tsx', {
  'next/link': Link, '@/lib/analytics': { trackBlogCtaClick() {} }, '@/components/comunidad/CommunityLink': { CommunityLink: Link },
}).default
const page = load('src/app/(public)/blog/[slug]/page.tsx', {
  '@/lib/blog-partners': partners, '@/lib/db/posts': db,
  'next/link': Link, 'next/image': () => null, 'next/navigation': { notFound() { throw new Error('404') } },
  '@/components/common/Container': ({ children }) => React.createElement('div', null, children),
  '@/components/blog/BlogContentWithCTAs': blogContent,
  '@/components/blog/RelatedPosts': () => React.createElement('div', null, 'RELATED_POSTS'),
  '@/components/seo/JsonLd': { __esModule: true, default: () => null, articleSchema: () => ({}), breadcrumbSchema: () => ({}), isFernandoAuthor: () => true },
  '../markdown.css': {},
})

test('la colaboración excluye Google y otros buscadores sin impedir seguir los enlaces', async () => {
  const metadata = await page.generateMetadata({ params: Promise.resolve({ slug }) })
  assert.equal(metadata.robots.index, false)
  assert.equal(metadata.robots.follow, true)
  assert.equal(metadata.robots.googleBot.index, false)
  assert.equal(metadata.robots.googleBot.follow, true)
  assert.equal(metadata.alternates.canonical, `https://wellnessreal.es/blog/${slug}`)
  const ordinary = await page.generateMetadata({ params: Promise.resolve({ slug: posts[1].slug }) })
  assert.equal(ordinary.robots, undefined)
})

test('el sitemap omite la colaboración aunque esté publicada y conserva artículos normales', async () => {
  const sitemap = load('src/app/sitemap.ts', { '@/lib/db/posts': db, '@/lib/blog-partners': partners }).default
  const urls = (await sitemap()).map(row => row.url)
  assert.ok(!urls.includes(`https://wellnessreal.es/blog/${slug}`))
  assert.ok(urls.includes(`https://wellnessreal.es/blog/${posts[1].slug}`))
})

test('el artículo conserva los enlaces externos y suprime las promociones automáticas propias', async () => {
  const html = renderToStaticMarkup(await page.default({ params: Promise.resolve({ slug }) }))
  assert.ok(html.includes(`href="${sourceUrl}"`))
  assert.ok(html.includes('href="https://metodoosteofit.com/el-metodo/"'))
  assert.ok(!html.includes('href="/metodo-tiroides"'))
  assert.ok(!html.includes('id="sobre-el-autor"'))
  assert.ok(!html.includes('RELATED_POSTS'))
  const ordinary = renderToStaticMarkup(await page.default({ params: Promise.resolve({ slug: posts[1].slug }) }))
  assert.ok(ordinary.includes('id="sobre-el-autor"'))
  assert.ok(ordinary.includes('RELATED_POSTS'))
  assert.ok(ordinary.length > html.length)
})
