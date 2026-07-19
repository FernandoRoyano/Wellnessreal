import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSessionMember } from '@/lib/db/comunidad'
import { supabaseConfigStatus } from '@/lib/supabase-env'
import { EntrarForm } from './EntrarForm'

export const metadata: Metadata = {
  title: 'Entrar · Comunidad Tiroides · WellnessReal',
  description: 'Accede a la comunidad de tiroides de WellnessReal con tu email.',
  robots: { index: false, follow: false },
}

export default async function EntrarPage() {
  const member = await getSessionMember()
  if (member) redirect('/comunidad')

  const cfg = supabaseConfigStatus()

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-8 text-center">
        <h1 className="headline text-4xl text-white">Comunidad Tiroides</h1>
        <p className="mt-3 text-white/60">
          Aprende, pregunta y acompáñate de gente que entiende lo que es vivir con hipotiroidismo.
        </p>
      </div>
      {cfg.ok ? (
        <EntrarForm />
      ) : (
        <div className="surface-card rounded-3xl p-8 text-center">
          <h2 className="headline mb-2 text-xl text-white">Configuración pendiente</h2>
          <p className="text-sm text-white/70">
            Falta configurar en el servidor:
          </p>
          <ul className="mt-3 space-y-1 text-sm text-amber-300">
            {cfg.missing.map((m) => (
              <li key={m}>
                <code>{m}</code>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-white/40">
            Añádela en Vercel (o como variable de runtime) y vuelve a desplegar.
          </p>
        </div>
      )}
    </main>
  )
}
