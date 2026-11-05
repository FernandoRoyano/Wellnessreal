import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as zod from 'zod'

function application() {
  const writes = []
  const dependencies = {
    zod,
    '@/lib/db/comunidad': { createAsesoriaSolicitud: async input => writes.push(['application', input]) },
    '@/lib/db/leads': { upsertLead: async input => { writes.push(['lead', input]); return { id: 'test-lead' } } },
    '@/lib/thyroid-application-lead': { recordThyroidApplicationLead: async input => writes.push(['lead', input]) },
    '@/lib/db/thyroid-funnel': { recordThyroidFunnelEvent: async () => {}, attachAnonymousEventsToLead: async () => {} },
    'next/headers': { headers: async () => new Headers() },
    '@/lib/rateLimit': { rateLimit: () => ({ success: true }) },
    '@/lib/metodo-tiroides': { getThyroidLaunchPhase: () => 'applications' },
  }
  const compiled = { exports: {} }
  const source = ts.transpileModule(fs.readFileSync('src/app/(public)/metodo-tiroides/actions.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  vm.runInNewContext(source, { module: compiled, exports: compiled.exports, console, require: name => dependencies[name] })
  return { writes, submit: phone => {
    const data = new FormData()
    for (const [key, value] of Object.entries({ name: 'Ana', email: 'ana@example.com', goal: 'Quiero empezar a entrenar fuerza con una rutina sostenible.', days: '2', ...(phone === undefined ? {} : { phone }) })) data.set(key, value)
    return compiled.exports.applyToThyroidProgram({ success: false }, data)
  } }
}

test('la solicitud sin teléfono o con teléfono inválido no se guarda', async () => {
  for (const phone of [undefined, '', '   ', '12345', 'abcdefghijk', '+1234567890123456']) {
    const api = application()
    const result = await api.submit(phone)
    assert.equal(result.success, false)
    assert.ok(result.fieldErrors.phone.length)
    assert.equal(api.writes.length, 0)
  }
})

test('el teléfono se guarda en la solicitud y el contacto del panel', async () => {
  const api = application()
  assert.equal((await api.submit('+34 600 000 000')).success, true)
  assert.equal(api.writes[0][1].telefono, '+34 600 000 000')
  assert.equal(api.writes[1][1].phone, '+34 600 000 000')
})
