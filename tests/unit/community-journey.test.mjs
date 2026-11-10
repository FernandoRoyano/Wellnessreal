import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import test from 'node:test'
import ts from 'typescript'

const compiled = { exports: {} }
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/community-journey.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { module: compiled, exports: compiled.exports })
const { getCommunityJourney } = compiled.exports
const spaces = [{ id: 'intro', slug: 'empieza-aqui' }, { id: 'force', slug: 'entrena-organizate' }]
const lesson = (id, slug = id, extra = {}) => ({ id, slug, locked: false, lockReason: null, daysUntilUnlock: 0, ...extra })
const welcome = lesson('welcome', 'lee-esto-primero')
const force = lesson('force', 'por-que-empezar-con-fuerza')

test('welcome leads to a distinct practical lesson before the rest of the introduction', () => {
  const groups = [[welcome, lesson('about')], [force]]
  assert.equal(getCommunityJourney(spaces, groups, new Set()).next.id, 'welcome')
  assert.equal(getCommunityJourney(spaces, groups, new Set(['welcome'])).next.id, 'force')
})

test('completed available lessons do not restart and future unlocks remain visible', () => {
  const locked = lesson('future', 'future', { locked: true, lockReason: 'drip', daysUntilUnlock: 3 })
  const result = getCommunityJourney(spaces, [[welcome], [force, locked]], new Set(['welcome', 'force']))
  assert.equal(result.next, null)
  assert.equal(result.allAvailableCompleted, true)
  assert.equal(result.progress, 100)
  assert.equal(result.nextUnlockDays, 3)
})

test('locked lessons never become a first practical lesson or continuation', () => {
  const result = getCommunityJourney(spaces, [[welcome], [{ ...force, locked: true, lockReason: 'tier' }]], new Set(['welcome']))
  assert.equal(result.firstPractical, null)
  assert.equal(result.next, null)
  assert.equal(result.nextUnlockDays, null)
})

test('unrelated or old completion cookies do not change visible progress', () => {
  const result = getCommunityJourney(spaces, [[welcome], [force]], new Set(['deleted', 'another-account-lesson']))
  assert.equal(result.completedCount, 0)
  assert.equal(result.progress, 0)
})

test('empty and missing lesson groups do not announce completion', () => {
  const result = getCommunityJourney(spaces, [], new Set())
  assert.equal(result.next, null)
  assert.equal(result.allAvailableCompleted, false)
  assert.equal(result.progress, 0)
})
