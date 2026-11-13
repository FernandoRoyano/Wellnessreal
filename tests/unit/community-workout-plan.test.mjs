import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import vm from 'node:vm'
import test from 'node:test'
import ts from 'typescript'

const require = createRequire(import.meta.url)
function load(file, mocks = {}) {
  const compiled = { exports: {} }
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
    module: compiled, exports: compiled.exports, console: { error() {} },
    require: name => Object.hasOwn(mocks, name) ? mocks[name] : require(name),
  })
  return compiled.exports
}

const { getWorkoutWeek, getNextPlannedWorkout } = load('src/lib/community-workout-week.ts')
test('week follows Madrid midnight and handles year and daylight-saving boundaries', () => {
  assert.equal(getWorkoutWeek(new Date('2026-11-15T22:59:00Z')).start, '2026-11-09')
  assert.equal(getWorkoutWeek(new Date('2026-11-15T23:00:00Z')).start, '2026-11-16')
  const year = getWorkoutWeek(new Date('2027-01-01T12:00:00Z'))
  assert.equal(year.start, '2026-12-28')
  assert.equal(year.dates[6], '2027-01-03')
  const dst = getWorkoutWeek(new Date('2026-03-29T22:30:00Z'))
  assert.equal(dst.start, '2026-03-30')
  assert.equal(new Set(dst.dates).size, 7)
  assert.equal(getWorkoutWeek(new Date('2026-11-15T23:00:00Z')).today, '2026-11-16')
})

test('next workout includes today, excludes past and unknown choices, and keeps input order intact', () => {
  const days = [
    { workout_date: '2026-11-15', workout_id: 'gimnasio' },
    { workout_date: '2026-11-13', workout_id: 'mancuernas' },
    { workout_date: '2026-11-12', workout_id: 'gimnasio' },
    { workout_date: '2026-11-13', workout_id: null },
    { workout_date: '2026-11-13', workout_id: 'unknown' },
  ]
  const original = JSON.stringify(days)
  assert.equal(getNextPlannedWorkout(days, '2026-11-13').workout_id, 'mancuernas')
  assert.equal(getNextPlannedWorkout(days, '2026-11-14').workout_date, '2026-11-15')
  assert.equal(getNextPlannedWorkout(days, '2026-11-16'), null)
  assert.equal(getNextPlannedWorkout([], '2026-11-13'), null)
  assert.equal(JSON.stringify(days), original)
})

let member = { id: 'member-a', status: 'approved' }
let writes = []
let fail = false
const week = getWorkoutWeek(new Date('2026-11-12T12:00:00Z'))
const { saveWorkoutPlanAction } = load('src/app/(comunidad)/comunidad/mi-semana/workout-actions.ts', {
  'next/cache': { revalidatePath() {} },
  '@/lib/db/comunidad': { getSessionMember: async () => member, isApproved: item => item.status === 'approved' },
  '@/lib/community-workout-week': { getWorkoutWeek: () => week },
  '@/lib/community-workout-plans': { saveWorkoutDays: async (...args) => { if (fail) throw new Error('unavailable'); writes.push(args) } },
})
function form(values = ['', 'mancuernas', '', 'gimnasio', '', '', ''], start = week.start) {
  const data = new FormData()
  data.set('week_start', start)
  data.set('member_id', 'attacker-selected-account')
  for (const value of values) data.append('workouts', value)
  return data
}

test('plan action rejects missing or unapproved identity without writing', async () => {
  writes = []
  for (const identity of [null, { id: 'blocked', status: 'blocked' }, { id: 'pending', status: 'pending' }]) {
    member = identity
    assert.equal((await saveWorkoutPlanAction(null, form())).ok, false)
  }
  assert.equal(writes.length, 0)
  member = { id: 'member-a', status: 'approved' }
})

test('plan action validates week, exactly seven choices and known session IDs', async () => {
  writes = []
  for (const data of [form([], week.start), form(Array(8).fill('')), form(['unknown', '', '', '', '', '', '']), form(undefined, '2026-11-02')]) {
    assert.equal((await saveWorkoutPlanAction(null, data)).ok, false)
  }
  assert.equal(writes.length, 0)
})

test('plan action uses the authenticated account and returns only confirmed saves', async () => {
  writes = []
  const data = form()
  const result = await saveWorkoutPlanAction(null, data)
  assert.equal(result.ok, true)
  assert.equal(writes[0][0], 'member-a')
  assert.deepEqual(Array.from(writes[0][1]), Array.from(week.dates))
  assert.deepEqual(Array.from(result.choices), data.getAll('workouts'))
  fail = true
  const failed = await saveWorkoutPlanAction(result, form(Array(7).fill('')))
  assert.equal(failed.ok, false)
  assert.equal(failed.choices, undefined)
  assert.equal(writes.length, 1)
  fail = false
})
