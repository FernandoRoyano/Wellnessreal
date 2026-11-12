import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import test from 'node:test'
import ts from 'typescript'

function fixture() {
  const rows = []
  const cookie = { raw: undefined, writes: [] }
  let fail = false
  const client = { from(table) {
    assert.equal(table, 'lesson_progress')
    const filters = []
    const builder = {
      select() { return builder }, limit() { return builder },
      eq(key, value) { filters.push([key, value]); return builder },
      returns() { return Promise.resolve({ data: rows.filter(row => filters.every(([key, value]) => row[key] === value)), error: fail ? { message: 'read unavailable' } : null }) },
      delete() {
        builder.then = (resolve, reject) => Promise.resolve().then(() => {
          if (fail) return { error: { message: 'delete unavailable' } }
          for (let i = rows.length - 1; i >= 0; i--) if (filters.every(([key, value]) => rows[i][key] === value)) rows.splice(i, 1)
          return { error: null }
        }).then(resolve, reject)
        return builder
      },
      async upsert(values, options) {
        assert.equal(options.onConflict, 'member_id,lesson_id')
        assert.equal(options.ignoreDuplicates, true)
        if (fail) return { error: { message: 'write unavailable' } }
        for (const value of values) if (!rows.some(row => row.member_id === value.member_id && row.lesson_id === value.lesson_id)) rows.push({ ...value, completed_at: 'original-date' })
        return { error: null }
      },
    }
    return builder
  } }
  const compiled = { exports: {} }
  vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/community-progress.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, { module: compiled, exports: compiled.exports, process: { env: { NODE_ENV: 'test' } }, require(name) {
    if (name === '@/lib/supabase') return { supabase: client }
    if (name === 'next/headers') return { cookies: async () => ({ get: () => cookie.raw ? { value: cookie.raw } : undefined, set: (...args) => { cookie.writes.push(args); cookie.raw = args[1] } }) }
    throw new Error(`Unexpected dependency: ${name}`)
  } })
  return { api: compiled.exports, rows, cookie, fail: () => { fail = true } }
}
const lesson = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
const otherLesson = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'

test('completion belongs to an account; removal never affects another account', async () => {
  const { api, rows } = fixture()
  await api.setLessonCompletion('first', lesson, true)
  await api.setLessonCompletion('second', lesson, true)
  await api.setLessonCompletion('first', lesson, false)
  assert.equal((await api.getCompletedLessonIds('first')).size, 0)
  assert((await api.getCompletedLessonIds('second')).has(lesson))
  assert.equal(rows.length, 1)
})

test('duplicate imports preserve the original completion date and merge separate lessons', async () => {
  const { api, rows } = fixture()
  await api.saveCompletedLessons('member', [lesson, lesson])
  rows[0].completed_at = 'keep-this-date'
  await Promise.all([api.saveCompletedLessons('member', [lesson]), api.saveCompletedLessons('member', [otherLesson])])
  assert.equal(rows.length, 2)
  assert.equal(rows[0].completed_at, 'keep-this-date')
})

test('old browser marks are never silently counted as account progress', async () => {
  const { api, cookie } = fixture()
  cookie.raw = JSON.stringify([lesson, 'not-a-uuid', lesson, 17])
  assert.equal((await api.getLegacyLessonIds()).size, 1)
  assert.equal((await api.getCompletedLessonIds('member')).size, 0)
  assert.equal(cookie.writes.length, 0)
  cookie.raw = '{broken'
  assert.equal((await api.getLegacyLessonIds()).size, 0)
})

test('only imported old marks are removed using the original cookie path', async () => {
  const { api, cookie } = fixture()
  cookie.raw = JSON.stringify([lesson, otherLesson])
  await api.removeImportedLegacyIds([lesson])
  assert.deepEqual(JSON.parse(cookie.raw), [otherLesson])
  assert.equal(cookie.writes[0][2].path, '/comunidad')
  await api.removeImportedLegacyIds([otherLesson])
  assert.equal(cookie.writes[1][2].maxAge, 0)
})

test('database failures are explicit and leave the old browser marks intact', async () => {
  const { api, cookie, fail } = fixture()
  cookie.raw = JSON.stringify([lesson])
  fail()
  await assert.rejects(api.saveCompletedLessons('member', [lesson]), /write unavailable/)
  await assert.rejects(api.setLessonCompletion('member', lesson, false), /delete unavailable/)
  await assert.rejects(api.getCompletedLessonIds('member'), /read unavailable/)
  assert.equal(cookie.writes.length, 0)
})
