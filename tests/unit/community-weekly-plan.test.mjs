import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import test from 'node:test'
import ts from 'typescript'

const compiled = { exports: {} }
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/community-weekly-plan.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { module: compiled, exports: compiled.exports })
const { getCommunityWeeklyPlan, COMMUNITY_QUESTIONS } = compiled.exports

test('the next week becomes the current proposal and repeats after four weeks', () => {
  const initial = getCommunityWeeklyPlan(new Date('2026-11-11T12:00:00Z'))
  assert.match(initial[0].period, /9 de noviembre.*15 de noviembre/)
  assert.equal(initial[1].lesson, getCommunityWeeklyPlan(new Date('2026-11-16T12:00:00Z'))[0].lesson)
  assert.equal(initial[0].lesson, getCommunityWeeklyPlan(new Date('2026-12-07T12:00:00Z'))[0].lesson)
})

test('the week changes at Madrid midnight, including summer time and earlier cycles', () => {
  for (const [before, after] of [
    ['2026-11-15T22:59:59Z', '2026-11-15T23:00:00Z'],
    ['2026-07-12T21:59:59Z', '2026-07-12T22:00:00Z'],
  ]) {
    const previous = getCommunityWeeklyPlan(new Date(before))
    const following = getCommunityWeeklyPlan(new Date(after))
    assert.equal(previous[1].lesson, following[0].lesson)
    assert.notEqual(previous[0].period, following[0].period)
    assert.ok(COMMUNITY_QUESTIONS.some(question => question.id === following[0].question))
  }
})
