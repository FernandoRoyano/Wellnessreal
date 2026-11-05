/* eslint-disable @typescript-eslint/no-require-imports -- Preload de Node para bloquear SMTP en pruebas locales. */
if (process.env.NEXT_PUBLIC_SUPABASE_URL !== 'http://127.0.0.1:54329') throw new Error('El transporte de prueba requiere servicios locales')
for (const transport of [require('node:net'), require('node:tls')]) {
  const connect = transport.connect
  transport.connect = function (...args) {
    const options = typeof args[0] === 'object' ? args[0] : { port: args[0] }
    if ([25, 465, 587].includes(Number(options.port)) || /smtp\./i.test(options.host ?? '')) throw new Error('Fixture: SMTP externo deshabilitado')
    return connect.apply(this, args)
  }
}
