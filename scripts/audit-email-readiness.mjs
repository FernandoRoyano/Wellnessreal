import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { resolveTxt, resolveCname } from 'node:dns/promises'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
dotenv.config({ path: path.join(root, '.env.local'), quiet: true })
const output = path.join(root, 'output/email-ecosystem-20261105')
fs.mkdirSync(output, { recursive: true })
const preparedPath = path.join(output, 'provider-drafts.json')
const prepared = fs.existsSync(preparedPath) ? JSON.parse(fs.readFileSync(preparedPath, 'utf8')) : null
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

async function getProvider(endpoint) {
  const response = await fetch(`https://connect.mailerlite.com/api${endpoint}`, { headers: { Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`, Accept: 'application/json' }, signal: AbortSignal.timeout(15000) })
  if (!response.ok) throw new Error(`[EmailReadiness:provider] GET ${endpoint}: HTTP ${response.status}`)
  return (await response.json()).data
}
async function consentCount(status) {
  let query = db.from('leads').select('id', { count: 'exact', head: true })
    .eq('form_data->marketing_consent->>accepted', 'true')
    .eq('form_data->marketing_consent->>version', 'community-email-2026-11-05')
  query = status === 'legacy' ? query.is('form_data->marketing_consent->>sync_status', null) : query.eq('form_data->marketing_consent->>sync_status', status)
  const { count, error } = await query
  if (error) throw new Error('[EmailReadiness:consent] No se pudieron contar las preferencias')
  return count ?? 0
}

const checks = await Promise.allSettled([
  resolveTxt('wellnessreal.es'), resolveCname('litesrv._domainkey.wellnessreal.es'), resolveTxt('_dmarc.wellnessreal.es'),
  ...['held', 'pending', 'suppressed', 'synced', 'legacy'].map(consentCount),
])
const value = index => checks[index].status === 'fulfilled' ? checks[index].value : null
const report = { checkedAt: new Date().toISOString(),
  configurationScope: 'Entorno local del checkout; la configuración de producción se verifica por separado',
  configured: { communityGroup: !!process.env.MAILERLITE_COMUNIDAD_GROUP_ID, sequenceEnabled: process.env.COMMUNITY_EMAIL_SEQUENCE_ENABLED === 'true', mailerlite: !!process.env.MAILERLITE_API_KEY },
  dns: { spfIncludesMailerLite: value(0)?.flat().some(text => text.includes('_spf.mlsend.com')) ?? null,
    mailerliteDkim: value(1)?.some(host => host === 'litesrv._domainkey.mlsend.com') ?? null, dmarc: value(2)?.flat().join(' ') ?? null },
  consentCounts: Object.fromEntries(['held', 'pending', 'suppressed', 'synced', 'legacy'].map((status, i) => [status, value(i + 3)])),
  provider: null, links: [],
}
if (prepared && process.env.MAILERLITE_API_KEY) {
  const [group, automation, ...campaigns] = await Promise.all([getProvider(`/groups/${prepared.group.id}`), getProvider(`/automations/${prepared.automation.id}`), ...prepared.campaigns.map(campaign => getProvider(`/campaigns/${campaign.id}`))])
  report.provider = { group: { id: group.id, name: group.name, activeCount: group.active_count },
    automation: { id: automation.id, name: automation.name, enabled: automation.enabled, stepCount: automation.steps?.length ?? 0, triggers: automation.triggers?.length ?? 0 },
    campaigns: campaigns.map(campaign => ({ id: campaign.id, name: campaign.name, status: campaign.status, languageId: campaign.language_id,
      scheduled: !!campaign.scheduled_for, contentReady: campaign.emails?.every(email => email.is_designed === true), missingData: campaign.missing_data ?? [] })),
  }
}
for (const route of ['/comunidad/entrar', '/hipotiroidismo/ejercicio', '/hashimoto/entrenamiento', '/metodo-tiroides']) {
  try {
    const response = await fetch(`https://wellnessreal.es${route}`, { signal: AbortSignal.timeout(15000) })
    report.links.push({ route, status: response.status })
    await response.body?.cancel()
  } catch { report.links.push({ route, status: 'unavailable' }) }
}
fs.writeFileSync(path.join(output, 'readiness.json'), JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))
