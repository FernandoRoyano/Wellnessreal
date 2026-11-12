import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import test from 'node:test'
import ts from 'typescript'

const compiled = { exports: {} }
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/community-learning-routes.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { module: compiled, exports: compiled.exports })
const { getLearningRoute, getLearningRouteProgress, COMMUNITY_LEARNING_ROUTES } = compiled.exports
const route = getLearningRoute('empezar')
const lessons = route.steps.map((step, index) => ({ id: `lesson-${index}`, slug: step.slug, title: step.slug, access_tier: 'free', locked: false, daysUntilUnlock: 0, space: { slug: step.space } }))

test('only the three known route identifiers are accepted', () => {
  assert.equal(COMMUNITY_LEARNING_ROUTES.length, 3)
  for (const value of [undefined, null, ['empezar'], '__proto__', '/other', 'invalid']) assert.equal(getLearningRoute(value), undefined)
})

test('the next step follows route order and uses shared account completions', () => {
  const state = getLearningRouteProgress(route, lessons, new Set(['lesson-0', 'unrelated']))
  assert.equal(state.completedCount, 1)
  assert.equal(state.next.lesson.id, 'lesson-1')
  const full = getLearningRouteProgress(route, lessons, new Set(lessons.map(lesson => lesson.id)))
  assert.equal(full.complete, true)
  assert.equal(full.next, null)
})

test('a locked step cannot be counted as completed or silently skipped', () => {
  const state = getLearningRouteProgress(route, lessons.map((lesson, index) => index === 1 ? { ...lesson, locked: true, daysUntilUnlock: 4 } : lesson), new Set(['lesson-0', 'lesson-1']))
  assert.equal(state.completedCount, 1)
  assert.equal(state.next.lesson.locked, true)
  assert.equal(state.next.lesson.daysUntilUnlock, 4)
})

test('missing or premium lessons never complete a route and slugs are scoped by space', () => {
  for (const replacement of [{ access_tier: 'premium' }, { space: { slug: 'another-space' } }]) {
    const state = getLearningRouteProgress(route, lessons.map((lesson, index) => index === 1 ? { ...lesson, ...replacement } : lesson), new Set(lessons.map(lesson => lesson.id)))
    assert.equal(state.complete, false)
    assert.equal(state.next.lesson, undefined)
  }
  assert.equal(getLearningRouteProgress(route, [], new Set()).completedCount, 0)
})
