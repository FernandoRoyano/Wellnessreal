import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSessionMember } from '@/lib/db/comunidad'
import { EntrarForm } from './EntrarForm'

export const metadata: Metadata = {
  title: 'Entrar · Comunidad Tiroides · WellnessReal',
  description: 'Accede a la comunidad de tiroides de WellnessReal con tu email.',
  robots: { index: false, follow: false },
}

export default async function EntrarPage() {
  const member = await getSessionMember()
  if (member) redirect('/comunidad')

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-8 text-center">
        <h1 className="headline text-4xl text-white">Comunidad Tiroides</h1>
        <p className="mt-3 text-white/60">
          Aprende, pregunta y acompáñate de gente que entiende lo que es vivir con hipotiroidismo.
        </p>
      </div>
      <EntrarForm />
    </main>
  )
}
