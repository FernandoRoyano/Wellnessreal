import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'

const source = fs.readFileSync('scripts/seo-thyroid-conversion-refresh.mjs', 'utf8')
const functionSource = source.match(/function editContent\(content, change\) \{[\s\S]*?\n\}/)?.[0]
assert.ok(functionSource)
const editContent = vm.runInNewContext(`(${functionSource})`)
const change = { slug: 'example', introduction: 'Nueva apertura.', heading: 'Acompañamiento', paragraphs: ['<a href="/metodo-tiroides">Programa</a>', 'Seguimiento individual.'] }

test('la revisión conserva el cuerpo y usa un encabezado independiente compatible con el renderizador', () => {
  const body = '<h2>Contenido clínico</h2>\n<p>Texto y referencias que deben conservarse.</p>\n'
  const result = editContent('<p>Apertura anterior.</p>\n' + body, change)
  assert.ok(result.startsWith('<p>Nueva apertura.</p>'))
  assert.ok(result.includes(body.trim()))
  assert.ok(result.includes('<h2 data-editorial="captacion-20261103">Acompañamiento</h2>'))
  assert.ok(!result.includes('<section'))
  assert.ok(!result.includes('</section>'))
})

test('rechaza contenido inesperado o una segunda aplicación del mismo bloque', () => {
  assert.throws(() => editContent('<h1>No es la apertura esperada</h1>', change))
  const once = editContent('<p>Apertura anterior.</p>', change)
  assert.throws(() => editContent(once, change))
})
