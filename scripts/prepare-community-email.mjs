import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import dotenv from 'dotenv'
import ts from 'typescript'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
dotenv.config({ path: path.join(root, '.env.local'), quiet: true })
const output = path.join(root, 'output/email-ecosystem-20261105')
const names = { group: 'WR Comunidad · Suscripción voluntaria', automation: 'WR Comunidad · Recorrido 14 días · Borrador 2026-11' }
const sender = { from: 'info@wellnessreal.es', from_name: 'Fernando · WellnessReal', reply_to: 'info@wellnessreal.es' }
const base = 'https://connect.mailerlite.com/api'
const hash = value => createHash('sha256').update(value).digest('hex')

function loadSource(file, deps = {}) {
  const source = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  const mod = { exports: {} }
  vm.runInNewContext(source, { module: mod, exports: mod.exports, URL, require: name => {
    if (!(name in deps)) throw new Error(`[EmailPrepare:source] Dependencia inesperada: ${name}`)
    return deps[name]
  } }, { filename: file })
  return mod.exports
}
const escape = loadSource('src/lib/utils/escapeHtml.ts')
const { COMMUNITY_EMAIL_DRAFTS: drafts, renderCommunityEmail } = loadSource('src/lib/community-email-drafts.ts', { '@/lib/utils/escapeHtml': escape })
fs.mkdirSync(output, { recursive: true })
const emails = drafts.map(draft => {
  const html = renderCommunityEmail(draft.vars, draft.preheader)
  const file = `community-day-${draft.day}.html`
  // MailerLite añade el asunto como título al importar; la vista local hace lo mismo.
  fs.writeFileSync(path.join(output, file), html.replace('<head>', `<head><title>${escape.escapeHtml(draft.subject)}</title>`))
  fs.writeFileSync(path.join(output, `community-day-${draft.day}.txt`), `${draft.subject}\n${draft.preheader}\n\n${draft.vars.body}\n\n${draft.vars.ctaText}: ${draft.vars.ctaUrl}\n\n${draft.vars.footerText}\nBaja: {$unsubscribe}\nContacto: info@wellnessreal.es\n`)
  return { day: draft.day, subject: draft.subject, preheader: draft.preheader, file, contentHash: hash(html), html }
})
fs.writeFileSync(path.join(output, 'content-manifest.json'), JSON.stringify(emails.map(({ html, ...item }) => item), null, 2))
fs.writeFileSync(path.join(output, 'index.html'), `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Correos de comunidad · WellnessReal</title><style>body{margin:0;background:#16122b;color:white;font:18px/1.6 Arial,sans-serif}main{max-width:760px;margin:auto;padding:40px 24px}h1{line-height:1.2}a{color:#fcee21}li{margin:18px 0}small{color:#d5d0df}</style><main><p>WELLNESSREAL · VISTA PREVIA LOCAL</p><h1>De la comunidad al acompañamiento</h1><p>Cuatro correos para leer y revisar. Los días se cuentan desde que la persona solicita recibir comunicaciones. El acceso gratuito funciona sin esta suscripción y sin vídeos.</p><ol>${emails.map(email => `<li><a href="${email.file}">Día ${email.day}: ${escape.escapeHtml(email.subject)}</a><br><small>${escape.escapeHtml(email.preheader)}</small> · <a href="community-day-${email.day}.txt">Texto</a></li>`).join('')}</ol><p>Estado: borradores sin programar. Falta confirmar el pie postal, montar los pasos de la automatización y hacer una prueba real de recepción y baja.</p></main></html>`)

async function request(endpoint, method = 'GET', body) {
  const languageOnly = method === 'PUT' && /^\/campaigns\/\d+$/.test(endpoint) && Object.keys(body ?? {}).every(key => ['language_id', 'name'].includes(key))
  if (method !== 'GET' && !languageOnly && !(method === 'POST' && ['/groups', '/automations', '/campaigns'].includes(endpoint))) throw new Error('[EmailPrepare:scope] Solo se pueden preparar grupos, borradores y su idioma')
  if (!process.env.MAILERLITE_API_KEY) throw new Error('[EmailPrepare:config] Falta configurar MailerLite')
  const response = await fetch(`${base}${endpoint}`, { method, headers: { Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`, Accept: 'application/json', 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(20000),
  })
  const data = await response.json()
  if (!response.ok) {
    const error = new Error(`[EmailPrepare:provider] ${method} ${endpoint}: HTTP ${response.status}`)
    error.status = response.status
    error.details = data.errors ?? {}
    throw error
  }
  return data
}

async function list(endpoint) {
  const rows = []
  let page = 1
  for (;;) {
    const data = await request(`${endpoint}${endpoint.includes('?') ? '&' : '?'}limit=100&page=${page}`)
    rows.push(...data.data)
    if (!data.links?.next) return rows
    if (++page > 20) throw new Error('[EmailPrepare:scope] Listado superior al alcance previsto')
  }
}
function unique(rows, name) {
  const matches = rows.filter(row => row.name === name)
  if (matches.length > 1) throw new Error('[EmailPrepare:scope] Hay nombres duplicados; se requiere revisión')
  return matches[0]
}

if (!process.argv.includes('--prepare-provider')) {
  console.log('[EmailPrepare:preview] Cuatro correos exportados en HTML y texto; sin escrituras en MailerLite')
} else {
  if (process.env.COMMUNITY_EMAIL_SEQUENCE_ENABLED === 'true') throw new Error('[EmailPrepare:scope] La preparación requiere la secuencia desactivada')
  const [groups, automations, campaigns] = await Promise.all([list('/groups'), list('/automations'), list('/campaigns?filter[status]=draft')])
  const language = (await request('/campaigns/languages')).data.find(item => item.shortcode === 'es')
  if (!language || !Number.isSafeInteger(Number(language.id))) throw new Error('[EmailPrepare:language] No se pudo resolver el idioma español')
  let group = unique(groups, names.group)
  if (!group) group = (await request('/groups', 'POST', { name: names.group })).data
  if (Number(group.active_count ?? 0) !== 0 || Number(group.unconfirmed_count ?? 0) !== 0) throw new Error('[EmailPrepare:scope] El grupo de preparación debe estar vacío')
  let automation = unique(automations, names.automation)
  if (!automation) automation = (await request('/automations', 'POST', { name: names.automation })).data
  if (automation.enabled !== false) throw new Error('[EmailPrepare:scope] La automatización debe permanecer inactiva')

  const receiptPath = path.join(output, 'provider-drafts.json')
  const previous = fs.existsSync(receiptPath) ? JSON.parse(fs.readFileSync(receiptPath, 'utf8')) : null
  const saved = []
  for (const email of emails) {
    const name = `WR Comunidad · Día ${email.day} · Borrador 2026-11`
    let campaign = unique(campaigns, name)
    let htmlAccepted = previous?.campaigns.find(item => item.id === campaign?.id)?.htmlAccepted ?? false
    if (campaign) {
      const prior = previous?.campaigns.find(item => item.id === campaign.id)
      if (!prior || prior.contentHash !== email.contentHash) throw new Error('[EmailPrepare:scope] Existe un borrador distinto; no se sobrescribe')
    } else {
      const body = { name, type: 'regular', language_id: Number(language.id), groups: [group.id], emails: [{ ...sender, subject: email.subject, content: email.html }] }
      try {
        campaign = (await request('/campaigns', 'POST', body)).data
        htmlAccepted = true
      } catch (error) {
        if (error.status !== 422 || !Object.keys(error.details).some(key => key.includes('content'))) throw error
        delete body.emails[0].content
        campaign = (await request('/campaigns', 'POST', body)).data
      }
    }
    let full = (await request(`/campaigns/${campaign.id}`)).data
    if (full.status !== 'draft' || full.scheduled_for || full.is_currently_sending_out || !JSON.stringify(full.filter).includes(group.id)) throw new Error('[EmailPrepare:verify] El correo no es un borrador limitado al grupo preparado')
    if (Number(full.language_id) !== Number(language.id)) full = (await request(`/campaigns/${campaign.id}`, 'PUT', { name: full.name, language_id: Number(language.id) })).data
    if (Number(full.language_id) !== Number(language.id) || full.status !== 'draft') throw new Error('[EmailPrepare:language] El borrador no conserva el idioma o el estado previstos')
    saved.push({ id: full.id, name: full.name, day: email.day, status: full.status, htmlAccepted, contentHash: email.contentHash })
    fs.writeFileSync(receiptPath, JSON.stringify({ group: { id: group.id, name: group.name }, automation: { id: automation.id, name: automation.name, enabled: false, stepsConfigured: false }, sender, language: { id: language.id, code: 'es' }, campaigns: saved }, null, 2))
  }
  const finalGroup = (await request(`/groups/${group.id}`)).data
  const finalAutomation = (await request(`/automations/${automation.id}`)).data
  if (Number(finalGroup.active_count ?? 0) !== 0 || finalAutomation.enabled !== false) throw new Error('[EmailPrepare:verify] El grupo o la automatización han cambiado durante la preparación')
  fs.writeFileSync(path.join(output, 'prepared-config.env'), `MAILERLITE_COMUNIDAD_GROUP_ID=${group.id}\nCOMMUNITY_EMAIL_SEQUENCE_ENABLED=false\n`)
  console.log(JSON.stringify({ group: group.name, activeMembers: 0, automation: automation.name, enabled: false, campaigns: saved.map(({ name, status, htmlAccepted }) => ({ name, status, htmlAccepted })), stepsConfigured: false }))
}
