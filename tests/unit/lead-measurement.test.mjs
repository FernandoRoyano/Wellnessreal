import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

function load(file, dependencies = {}) {
  const module = { exports: {} }
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  vm.runInNewContext(source, { module, exports: module.exports, console, Date, URL, Map, Set, require: name => {
    if (!(name in dependencies)) throw new Error(`Missing test dependency ${name}`)
    return dependencies[name]
  } })
  return module.exports
}

const measurement = load('src/lib/lead-measurement.ts')
const now = '2026-11-03T12:00:00.000Z'

test('no convierte etiquetas antiguas, pruebas o descargas en ventas', () => {
  const rows = [
    { status: 'cliente', tags: ['via:guia'] },
    { status: 'cliente', tags: ['crm:tipo:prueba', 'crm:fase:pagado'] },
    { tags: ['crm:tipo:suscriptor'] },
    { tags: ['crm:tipo:oportunidad', 'crm:fase:contactado'] },
    { tags: ['crm:tipo:oportunidad', 'crm:fase:pagado'], utm_source: 'instagram' },
  ]
  const stats = measurement.buildCommercialSummary(rows)
  assert.equal(stats.paid, 1)
  assert.equal(stats.opportunities, 2)
  assert.equal(stats.conversations, 0)
  assert.equal(stats.tests, 1)
  assert.equal(stats.subscribers, 1)
  assert.equal(stats.unreviewed, 1)
  assert.equal(stats.legacyCustomers, 1)
  assert.equal(stats.byChannel.find(row => row.channel === 'Sin atribución').paid, 0)
})

test('distingue origen desconocido, referencia y campaña sin llamarlos orgánico', () => {
  assert.equal(measurement.getAcquisitionChannel({ tags: [] }), 'Sin atribución')
  assert.equal(measurement.getAcquisitionChannel({ tags: [], referrer: 'https://www.google.com/search?q=fitness' }), 'Referencia: www.google.com')
  assert.equal(measurement.getAcquisitionChannel({ tags: [], referrer: 'https://wellnessreal.es/blog' }), 'Sin atribución')
  assert.equal(measurement.getAcquisitionChannel({ tags: [], utm_source: 'instagram', utm_medium: 'paid_social' }), 'instagram / paid_social')
})

test('las nuevas solicitudes se separan de descargas y respetan las pruebas', () => {
  assert.equal(measurement.getLeadKind({ tags: measurement.captureCommercialKind([], 'valoracion') }), 'oportunidad')
  assert.equal(measurement.getLeadKind({ tags: measurement.captureCommercialKind([], 'guia') }), 'suscriptor')
  assert.equal(measurement.getLeadKind({ tags: measurement.captureCommercialKind([], 'tiroides') }), 'sin_revisar')
  assert.equal(measurement.getLeadKind({ tags: measurement.captureCommercialKind(['crm:tipo:prueba'], 'valoracion') }), 'prueba')
  assert.equal(measurement.getLeadKind({ tags: measurement.captureCommercialKind(['crm:tipo:suscriptor'], 'valoracion') }), 'oportunidad')
})

test('conserva atribución y conversaciones previas sin inventar fases saltadas', () => {
  let tags = measurement.updateCommercialTags(['via:guia', 'form:valoracion'], 'oportunidad', 'conversacion', now)
  tags = measurement.updateCommercialTags(tags, 'oportunidad', 'pagado', now)
  const summary = measurement.buildCommercialSummary([{ tags }])
  assert.equal(summary.conversations, 1)
  assert.equal(summary.proposals, 0)
  assert.equal(summary.paid, 1)
  assert.ok(tags.includes('via:guia'))
  tags = measurement.updateCommercialTags(tags, 'prueba', 'sin_revisar', now)
  assert.equal(measurement.buildCommercialSummary([{ tags }]).paid, 0)
})
