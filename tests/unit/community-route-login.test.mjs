import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import test from 'node:test'
import { NextRequest, NextResponse } from 'next/server.js'

const source = fs.readFileSync('src/proxy.ts', 'utf8')
const helper = source.match(/function redirectToCommunityLogin\(request: NextRequest\): NextResponse \{[\s\S]*?\n\}/)?.[0]
assert(helper)
const redirectToCommunityLogin = vm.runInNewContext(`(${helper.replace(': NextRequest', '').replace(': NextResponse', '')})`, { URL, NextResponse })

test('login retains the internal route and query without changing the destination host', () => {
  const request = new NextRequest('https://wellnessreal.es/comunidad/rutas?ruta=retomar')
  const response = redirectToCommunityLogin(request)
  const target = new URL(response.headers.get('location'))
  assert.equal(target.origin, 'https://wellnessreal.es')
  assert.equal(target.pathname, '/comunidad/entrar')
  assert.equal(target.searchParams.get('next'), '/comunidad/rutas?ruta=retomar')
})
