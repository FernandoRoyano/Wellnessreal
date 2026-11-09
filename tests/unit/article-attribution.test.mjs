import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

function load(file, dependencies = {}, globals = {}) {
  const compiled = { exports: {} }
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  vm.runInNewContext(source, { module: compiled, exports: compiled.exports, URL, URLSearchParams, console, ...globals, require: name => dependencies[name] ?? {} })
  return compiled.exports
}
const article = load('src/lib/article-attribution.ts')

test('propaga el artículo sin perder plan ni ancla; ignora URLs externas y valores inválidos', () => {
  assert.equal(article.withArticleSource('/valoracion?plan=personal_12_semanas#formulario', 'rutina-casa'), '/valoracion?plan=personal_12_semanas&articulo=rutina-casa#formulario')
  for (const destination of ['https://example.com', '//example.com/valoracion', '/privacidad']) assert.equal(article.withArticleSource(destination, 'rutina-casa'), destination)
  assert.equal(article.withArticleSource('/valoracion', '<script>'), '/valoracion')
  assert.equal(article.withArticleSource('/valoracion', ['rutina-casa']), '/valoracion')
  assert.equal(article.withArticleSource('/valoracion', 'a'.repeat(121)), '/valoracion')
  const html = '<p><a href="/valoracion?plan=personal&amp;other=yes#form">Ir</a><a href="/blog/otra">Leer</a></p>'
  const result = article.attributeArticleLinks(html, 'rutina-casa')
  assert.ok(result.includes('plan=personal&amp;other=yes&amp;articulo=rutina-casa#form'))
  assert.ok(result.includes('href="/blog/otra"'))
})

test('la atribución conserva primera visita y origen comercial separado; sin consentimiento no guarda', () => {
  let consent = false
  let cookie = ''
  const location = { pathname: '/blog/rutina-casa', search: '', hostname: 'wellnessreal.es' }
  const document = { referrer: '', get cookie() { return cookie }, set cookie(value) { cookie = value.split(';')[0] } }
  const tracking = load('src/lib/tracking.ts', { '@/lib/article-attribution': article, '@/lib/cookie-consent': { hasTrackingConsent: () => consent } }, { window: { location }, document })
  tracking.captureAttribution()
  assert.equal(cookie, '')
  assert.equal(Object.keys(tracking.getAttributionForSubmit()).length, 0)
  consent = true
  tracking.captureAttribution()
  assert.equal(tracking.getStoredAttribution().landing_page, '/blog/rutina-casa')
  location.pathname = '/valoracion'
  location.search = '?articulo=rutina-casa&utm_source=otra'
  tracking.captureAttribution()
  const submitted = tracking.getAttributionForSubmit()
  assert.equal(submitted.landing_page, '/blog/rutina-casa')
  assert.equal(submitted.utm_source, undefined)
  assert.equal(submitted.source_article, 'rutina-casa')
  assert.equal(submitted.submission_page, '/valoracion')
})

test('el guardado de leads conserva el contexto validado y el tipo de solicitud', async () => {
  let saved
  const capture = load('src/lib/leadCapture.ts', { '@/lib/article-attribution': article, '@/lib/db/leads': { upsertLead: async input => { saved = input; return { id: 'test' } } } })
  await capture.captureLead({ request: { headers: new Headers() }, email: 'test@example.com', source: 'valoracion', form_data: { interestedPlan: 'personal_12_semanas' }, attribution: { source_article: 'rutina-casa', submission_page: '/valoracion', landing_page: '/blog/rutina-casa' } })
  assert.equal(saved.source, 'valoracion')
  assert.equal(saved.landing_page, '/blog/rutina-casa')
  assert.equal(saved.form_data.source_article, 'rutina-casa')
  assert.equal(saved.form_data.interestedPlan, 'personal_12_semanas')
  await capture.captureLead({ request: { headers: new Headers() }, email: 'test@example.com', source: 'guia', attribution: { source_article: '../invalid', submission_page: 'https://example.com' } })
  assert.equal(saved.form_data, null)
})

test('Método BASE conserva utm_content y origen en CRM sin respuestas de salud', async () => {
  let saved
  const recorder = load('src/lib/thyroid-application-lead.ts', { '@/lib/article-attribution': article, '@/lib/db/leads': { upsertLead: async input => { saved = input; return { id: 'test' } } }, '@/lib/db/thyroid-funnel': { attachAnonymousEventsToLead: async () => {}, recordThyroidFunnelEvent: async () => {} } })
  await recorder.recordThyroidApplicationLead({ name: 'Prueba', email: 'test@example.com', origin: 'public', attribution: { utm_content: 'entry', source_article: 'rutina-casa', submission_page: '/metodo-tiroides' } })
  assert.equal(saved.utm_content, 'entry')
  assert.equal(saved.form_data.source_article, 'rutina-casa')
  assert.equal(saved.form_data.submission_page, '/metodo-tiroides')
  assert.equal(Object.keys(saved.form_data).sort().join(','), 'funnel,origin,source_article,submission_page')
})

test('la descarga cuenta un clic de recurso con consentimiento, nunca un lead', () => {
  let consent = false
  const calls = []
  const analytics = load('src/lib/analytics.ts', { '@/lib/cookie-consent': { hasTrackingConsent: () => consent } }, { window: { gtag: (...args) => calls.push(args) } })
  analytics.trackResourceDownload('weekly_training_log')
  assert.equal(calls.length, 0)
  consent = true
  analytics.trackResourceDownload('weekly_training_log')
  assert.equal(calls.length, 1)
  assert.equal(calls[0][1], 'resource_download_click')
  assert.equal(Object.keys(calls[0][2]).join(','), 'resource_id')
  assert.equal(calls.some(args => ['generate_lead', 'sign_up'].includes(args[1])), false)
})
