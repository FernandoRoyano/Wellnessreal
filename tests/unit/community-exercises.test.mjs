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
const { COMMUNITY_EXERCISES, EXERCISE_EQUIPMENT, getCommunityExercise, getExerciseSummaries } = load('src/lib/community-exercises.ts')
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
