import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ConfirmarForm } from './ConfirmarForm'

export const metadata: Metadata = {
  title: 'Confirmar acceso · Comunidad Tiroides · WellnessReal',
  robots: { index: false, follow: false },
}

export default async function ConfirmarPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; token_hash?: string; type?: string; next?: string }>
}) {
  const { code, token_hash, type, next } = await searchParams

  if (!code && !(token_hash && type)) {
    redirect('/comunidad/entrar?error=missing_code')
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-8 text-center">
        <h1 className="headline text-4xl text-white">Confirmar acceso</h1>
        <p className="mt-3 text-white/60">
          Por tu seguridad, confirma que quieres entrar en la Comunidad Tiroides desde este
          dispositivo.
        </p>
      </div>
      <ConfirmarForm code={code} tokenHash={token_hash} type={type} next={next} />
    </main>
  )
}
