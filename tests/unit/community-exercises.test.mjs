import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import test from 'node:test'
import ts from 'typescript'

function load(file) {
  const compiled = { exports: {} }
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, { module: compiled, exports: compiled.exports })
  return compiled.exports
}
const { COMMUNITY_EXERCISES, EXERCISE_EQUIPMENT, EXERCISE_ALTERNATIVES, getCommunityExercise, getExerciseSummaries } = load('src/lib/community-exercises.ts')
const { COMMUNITY_WORKOUTS } = load('src/lib/community-workouts.ts')
const { matchesCommunitySearch } = load('src/lib/community-search.ts')

test('each exercise has an existing web image, distinct URL and complete teaching fields', () => {
  assert.equal(COMMUNITY_EXERCISES.length, 9)
  assert.equal(new Set(COMMUNITY_EXERCISES.map(item => item.slug)).size, 9)
  for (const item of COMMUNITY_EXERCISES) {
    const image = fs.readFileSync(`public/community/exercises/${item.slug}-v1.webp`)
    assert.equal(image.subarray(8, 12).toString(), 'WEBP')
    assert(item.imageAlt && item.imageCaption && item.muscles.length)
    assert(item.steps.length && item.checks.length && item.variants.length)
    assert(new URL(item.source.url).hostname === 'www.acefitness.org')
    for (const variant of item.variants) for (const equipment of variant.equipment) assert(EXERCISE_EQUIPMENT.some(option => option.id === equipment))
  }
})

test('search understands accents, muscle groups and the user term fondos', () => {
  const summaries = getExerciseSummaries()
  for (const [query, slug] of [['TRÍCEPS', 'flexiones'], ['fondos', 'flexiones'], ['mancuernas', 'remos'], ['sentadilla con barra', 'sentadilla-barra']]) {
    assert(summaries.some(item => item.slug === slug && matchesCommunitySearch(query, item.searchText)))
  }
  assert(!summaries.some(item => matchesCommunitySearch('unmatched-example', item.searchText)))
})

test('equipment includes only materials associated with the listed variants', () => {
  const summaries = getExerciseSummaries()
  assert(summaries.find(item => item.slug === 'remos').equipment.includes('polea'))
  assert(!summaries.find(item => item.slug === 'sentadilla-barra').equipment.includes('sin-material'))
  assert.equal(getCommunityExercise('unknown'), undefined)
  assert.equal(getCommunityExercise('../private'), undefined)
})

test('military press searches find both options and materials distinguish their variants', () => {
  const found = getExerciseSummaries().filter(item => matchesCommunitySearch('press militar', item.searchText))
  assert.equal(found.length, 2)
  assert(found.find(item => item.slug === 'press-militar-barra').equipment.includes('barra'))
  assert(!found.find(item => item.slug === 'press-militar-barra').equipment.includes('mancuernas'))
  assert(found.find(item => item.slug === 'press-hombros-mancuernas').equipment.includes('mancuernas'))
})

test('every exercise offers alternatives that resolve to a real teaching card', () => {
  for (const exercise of COMMUNITY_EXERCISES) {
    const alternatives = EXERCISE_ALTERNATIVES[exercise.slug]
    assert(alternatives?.length, exercise.slug)
    for (const option of alternatives) {
      assert(getCommunityExercise(option.slug), option.slug)
      assert(option.label && option.reason)
    }
  }
})

test('both example sessions cover legs, hinge, horizontal push and pull with valid cards', () => {
  assert.equal(COMMUNITY_WORKOUTS.length, 2)
  for (const workout of COMMUNITY_WORKOUTS) {
    const required = workout.exercises.filter(exercise => !exercise.optional)
    assert.equal(required.length, 4)
    assert(required.some(exercise => ['sentadilla', 'sentadilla-barra', 'zancadas'].includes(exercise.slug)))
    for (const slug of ['peso-muerto', 'flexiones', 'remos']) assert(required.some(exercise => exercise.slug === slug))
    for (const exercise of workout.exercises) assert(getCommunityExercise(exercise.slug), exercise.slug)
  }
})
