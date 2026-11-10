import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import test from 'node:test'
import ts from 'typescript'

function loadModule(file) {
  const compiled = { exports: {} }
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, { module: compiled, exports: compiled.exports })
  return compiled.exports
}
const { matchesCommunitySearch } = loadModule('src/lib/community-search.ts')
const { getCommunityRetention } = loadModule('src/lib/community-retention.ts')

test('search finds everyday synonyms, accents and reordered words', () => {
  assert(matchesCommunitySearch('fatiga', 'Cómo entrenar cuando estás cansada'))
  assert(matchesCommunitySearch('NUTRICIÓN', 'Alimentación práctica sin dietas extremas'))
  assert(matchesCommunitySearch('sueño', 'Descanso y recuperación'))
  assert(matchesCommunitySearch('pesas de fuerza', 'Por qué empezar con fuerza'))
  assert(!matchesCommunitySearch('nutrición fuerza', 'Por qué empezar con fuerza'))
  assert(!matchesCommunitySearch('rodilla', 'Cómo funciona la tiroides'))
  assert(matchesCommunitySearch('', 'Cualquier título'))
})

const id = '30000000-0000-4000-8000-000000000000'
const event = (event_name, date, member = id) => ({ event_name, created_at: `${date}T12:00:00Z`, external_id: event_name === 'community_signup_confirmed' ? `community:signup:${member}` : null, metadata: { member_id: member } })
const now = new Date('2026-11-20T12:00:00Z')
const since = '2026-10-21T12:00:00Z'
const start = '2026-11-10T00:00:00Z'

test('retention requires a later calendar day within 1–7 and a complete window', () => {
  const signup = event('community_signup_confirmed', '2026-11-11')
  const day0 = event('community_active_day', '2026-11-11')
  const day8 = event('community_active_day', '2026-11-19')
  assert.equal(getCommunityRetention([signup, day0, day8], since, now, start).returnRate, 0)
  assert.equal(getCommunityRetention([signup, day0, event('community_active_day', '2026-11-18')], since, now, start).returnRate, 100)
  assert.equal(getCommunityRetention([event('community_signup_confirmed', '2026-11-14')], since, now, start).returnRate, null)
})

test('distinct members, not event volume, determine resource and activity counts', () => {
  const rows = [event('community_active_day', '2026-11-15'), event('community_active_day', '2026-11-16'), event('community_resource_click', '2026-11-15'), event('community_resource_click', '2026-11-16')]
  const result = getCommunityRetention(rows, since, now, start)
  assert.equal(result.activeMembers, 1)
  assert.equal(result.resourceMembers, 1)
  assert.equal(result.eligibleMembers, 0)
  assert.equal(result.returnRate, null)
})

test('measurement excludes old cohorts and never invents a historical rate', () => {
  const rows = [event('community_signup_confirmed', '2026-11-01'), event('community_active_day', '2026-11-11')]
  assert.equal(getCommunityRetention(rows, since, now, start).eligibleMembers, 0)
  assert.equal(getCommunityRetention(rows, since, now).enabled, false)
  assert.equal(getCommunityRetention(rows, since, now).activeMembers, 0)
})
