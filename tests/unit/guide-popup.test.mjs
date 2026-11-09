import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

const storage = new Map()
const compiled = { exports: {} }
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/guide-popup.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
  module: compiled, exports: compiled.exports, localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
})
const popup = compiled.exports

test('ofrece tiroides en sus páginas y fitness en contenido general, respetando categoría explícita', () => {
  for (const path of ['/hipotiroidismo', '/hashimoto/entrenamiento', '/blog/levotiroxina-y-ejercicio', '/blog/menopausia-y-tiroides']) assert.equal(popup.getPopupResource(path), 'tiroides')
  for (const path of ['/', '/blog/rutina-30-minutos-en-casa', '/servicios/entrenamiento-online']) assert.equal(popup.getPopupResource(path), 'guia')
  assert.equal(popup.getPopupResource('/blog/una-guia', 'tiroides'), 'tiroides')
})

test('no aparece en solicitudes, formularios de guía, comunidad, confirmaciones ni páginas privadas', () => {
  for (const path of ['/valoracion', '/metodo-tiroides', '/metodo-tiroides/confirmado', '/recurso-gratis', '/tiroides', '/gracias-tiroides', '/gracias-recurso', '/gracias-valoracion', '/admin/leads', '/comunidad/entrar', '/programa/token', '/privacidad']) assert.equal(popup.getPopupResource(path, 'tiroides'), undefined)
})

test('limita a una vez por sesión y tres días, y no repite la guía ya solicitada', () => {
  const now = 1000000000
  assert.equal(popup.popupAllowed('guia', [], false, 0, now), true)
  assert.equal(popup.popupAllowed('guia', [], true, 0, now), false)
  assert.equal(popup.popupAllowed('guia', [], false, now-1000, now), false)
  assert.equal(popup.popupAllowed('guia', [], false, now-popup.POPUP_COOLDOWN_MS, now), true)
  assert.equal(popup.popupAllowed('tiroides', ['tiroides'], false, 0, now), false)
  assert.equal(popup.popupAllowed('tiroides', ['guia'], false, 0, now), true)
})

test('recuerda cada recurso y reconoce la marca antigua de solicitud fitness', () => {
  storage.clear()
  storage.set('wr_lead_submitted', '1')
  assert.equal(popup.requestedGuides().join(','), 'guia')
  popup.rememberGuideRequest('tiroides')
  popup.rememberGuideRequest('tiroides')
  assert.equal(popup.requestedGuides().sort().join(','), 'guia,tiroides')
  storage.set(popup.GUIDE_REQUEST_KEY, 'invalid-json')
  assert.equal(popup.requestedGuides().length, 0)
})
