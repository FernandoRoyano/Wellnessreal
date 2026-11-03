import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import * as zod from 'zod'

function load(file, dependencies = {}) {
  const module = { exports: {} }
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  vm.runInNewContext(source, { module, exports: module.exports, console: { error() {} }, Date, URL, Map, Set, require: name => dependencies[name] })
  return module.exports
}

const measurement = load('src/lib/lead-measurement.ts')
const base = { id: 'test-contact', tags: ['via:guia', 'form:valoracion'], status: 'cliente', updated_at: '2026-11-03T10:00:00Z', contacted_at: null, converted_at: '2026-09-01T10:00:00Z' }

function route({ authenticated = true, current = base, conflict = false } = {}) {
  const writes = []
  const api = load('src/app/api/admin/leads/[id]/route.ts', {
    'next/server': { NextResponse: Response },
    zod,
    '@/lib/auth': { isAdminAuthenticated: async () => authenticated },
    '@/lib/lead-measurement': measurement,
    '@/lib/db/leads': {
      getLead: async () => current,
      updateLead: async (id, updates, expected) => {
        if (conflict) throw { code: 'PGRST116' }
        writes.push({ id, updates, expected })
        return { ...current, ...updates }
      },
    },
  })
  return { writes, patch: payload => api.PATCH(new Request('http://localhost/api/admin/leads/test-contact', { method: 'PATCH', body: JSON.stringify(payload) }), { params: Promise.resolve({ id: 'test-contact' }) }) }
}

test('rechaza acceso anónimo y un pago sin confirmación explícita', async () => {
  const anonymous = route({ authenticated: false })
  assert.equal((await anonymous.patch({ notes: 'test' })).status, 401)
  assert.equal(anonymous.writes.length, 0)
  const api = route()
  assert.equal((await api.patch({ commercialKind: 'oportunidad', commercialStage: 'pagado' })).status, 400)
  assert.equal(api.writes.length, 0)
})

test('guardar una nota no convierte un antiguo cliente en pago verificado', async () => {
  const api = route()
  assert.equal((await api.patch({ notes: 'Revisar histórico' })).status, 200)
  assert.equal(api.writes[0].updates.tags, undefined)
  assert.equal(api.writes[0].updates.converted_at, undefined)
})

test('el pago confirmado conserva atribución, fecha histórica y fecha de confirmación', async () => {
  const api = route()
  const response = await api.patch({ commercialKind: 'oportunidad', commercialStage: 'pagado', confirmPayment: true, expectedUpdatedAt: base.updated_at })
  assert.equal(response.status, 200)
  const write = api.writes[0]
  assert.equal(write.expected, base.updated_at)
  assert.equal(write.updates.status, 'cliente')
  assert.ok(write.updates.tags.includes('via:guia'))
  assert.ok(write.updates.tags.includes('crm:fase:pagado'))
  assert.equal(write.updates.converted_at, base.converted_at)
  assert.ok(write.updates.tags.some(tag => tag.startsWith('crm:pago:')))
})

test('pruebas y descargas no pueden tener fase pagada ni editar etiquetas reservadas', async () => {
  const api = route()
  assert.equal((await api.patch({ commercialKind: 'prueba', commercialStage: 'pagado', confirmPayment: true })).status, 400)
  assert.equal((await api.patch({ tags: ['crm:fase:pagado'] })).status, 400)
  assert.equal(api.writes.length, 0)
})

test('una actualización concurrente conserva el formulario y devuelve conflicto', async () => {
  const api = route({ conflict: true })
  assert.equal((await api.patch({ commercialKind: 'oportunidad', commercialStage: 'contactado' })).status, 409)
})
