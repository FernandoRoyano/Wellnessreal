/* eslint-disable @typescript-eslint/no-require-imports -- Fixture CommonJS para HTTP local. */
// Servicio local de pruebas: no conecta con Supabase, correo ni pagos reales.
const http = require('node:http')
const { randomUUID } = require('node:crypto')
const port = Number(process.env.COMMUNITY_FIXTURE_PORT || 54329)
const freeId = '11111111-1111-4111-8111-111111111111'
const paidId = '22222222-2222-4222-8222-222222222222'
const date = '2026-01-01T00:00:00Z'
const tables = {
  member_profiles: ['free', 'paid', 'blocked'].map((kind, i) => ({ id: `${i + 3}0000000-0000-4000-8000-000000000000`, email: `${kind}@example.com`, display_name: 'Ana Prueba', status: kind === 'blocked' ? 'blocked' : 'approved', role: 'member', creado_en: date, cliente_id: kind === 'paid' ? paidId : null })),
  spaces: [
    { id: freeId, slug: 'empieza-aqui', name: 'Empieza aquí', description: 'Bienvenida y primeros pasos', type: 'content', access_tier: 'free', published: true, sort_order: 0 },
    { id: '11111111-2222-4111-8111-111111111111', slug: 'entrena-organizate', name: 'Entrena y organízate', description: 'Fuerza y hábitos', type: 'content', access_tier: 'free', published: true, sort_order: 1 },
    { id: paidId, slug: 'metodo-base-tiroides', name: 'Método BASE Tiroides', description: 'Tu programa privado', type: 'content', access_tier: 'premium', published: true, sort_order: 2 },
    { id: '11111111-3333-4111-8111-111111111111', slug: 'preguntas-apoyo', name: 'Preguntas y apoyo', type: 'forum', access_tier: 'free', published: true, sort_order: 3 },
  ],
  lessons: [
    { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', space_id: freeId, slug: 'lee-esto-primero', title: 'Lee esto antes que nada', content: '<h2>Tu primera visita</h2><p>Lee una lección y reserva dos momentos posibles en tu planificador.</p>', access_tier: 'free', published: true, drip_days: 0, sort_order: 0 },
    { id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', space_id: '11111111-2222-4111-8111-111111111111', slug: 'por-que-empezar-con-fuerza', title: 'Por qué empezar con fuerza', content: '<h2>Fuerza y contexto</h2><p>Una primera acción para tu semana.</p>', access_tier: 'free', published: true, drip_days: 0, sort_order: 0 },
    { id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', space_id: paidId, slug: 'privada', title: 'Lección privada de prueba', content: '<p>Contenido premium reservado.</p>', access_tier: 'premium', published: true, drip_days: 0, sort_order: 0 },
  ],
  cliente_perfil: [{ id: paidId, email: 'paid@example.com', acceso_manual: true, pagado_en: date, estado_programa: 'activo' }],
  leads: [], thyroid_funnel_events: [], asesoria_solicitudes: [], proposals: [], posts: [], threads: [], comments: [], thread_likes: [], lesson_favorites: [], lesson_feedback: [], programas_generados: [], eventos_cliente: [], community_checkins: [],
}
const writes = []
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${port}`)
  const reply = (code, value) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(value)) }
  let raw = ''
  for await (const chunk of req) raw += chunk
  const body = raw ? JSON.parse(raw) : null
  if (url.pathname === '/__writes') return reply(200, writes)
  if (url.pathname === '/auth/v1/otp') return body.email === 'limit@example.com' ? reply(429, { message: 'For security purposes, you can only request this after 60 seconds.', code: 'over_email_send_rate_limit' }) : reply(200, {})
  if (url.pathname === '/auth/v1/user') {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString())
      return reply(200, { id: payload.sub, email: payload.email, aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: {}, created_at: date })
    } catch { return reply(401, { message: 'Invalid fixture session' }) }
  }
  if (!url.pathname.startsWith('/rest/v1/')) return reply(404, {})
  const table = url.pathname.split('/').at(-1)
  if (!tables[table]) return reply(400, { message: `Unknown fixture table: ${table}` })
  let rows = tables[table].filter(row => [...url.searchParams].every(([key, value]) => {
    if (['select', 'order', 'limit', 'offset'].includes(key)) return true
    if (value.startsWith('eq.')) return String(row[key]) === value.slice(3)
    if (value.startsWith('ilike.')) return String(row[key]).toLowerCase() === value.slice(6).replace(/\\([_%\\])/g, '$1').toLowerCase()
    if (value.startsWith('in.(')) return value.slice(4, -1).split(',').map(v => v.replaceAll('"', '')).includes(String(row[key]))
    if (value === 'is.null') return row[key] == null
    if (value.startsWith('gte.')) return String(row[key] ?? '') >= value.slice(4)
    return true
  }))
  if (req.method === 'POST') {
    const newRows = (Array.isArray(body) ? body : [body]).map(row => ({ id: randomUUID(), creado_en: date, ...row }))
    tables[table].push(...newRows); rows = newRows
    writes.push({ table, method: req.method, rows: newRows })
  } else if (req.method === 'PATCH') {
    rows.forEach(row => Object.assign(row, body))
    writes.push({ table, method: req.method, count: rows.length })
  } else if (!['GET', 'HEAD'].includes(req.method)) return reply(405, {})
  const sort = url.searchParams.get('order')?.split('.')[0]
  if (sort) rows.sort((a, b) => String(a[sort] ?? '').localeCompare(String(b[sort] ?? '')))
  if (url.searchParams.has('limit')) rows = rows.slice(0, Number(url.searchParams.get('limit')))
  const single = req.headers.accept?.includes('application/vnd.pgrst.object+json')
  return reply(req.method === 'POST' ? 201 : 200, single ? rows[0] ?? null : rows)
})
server.listen(port, '127.0.0.1', () => console.log(`Community fixture: http://127.0.0.1:${port}`))
