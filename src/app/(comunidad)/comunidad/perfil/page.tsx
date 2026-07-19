import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSessionMember } from '@/lib/db/comunidad'
import { updateProfileAction } from '../actions'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tu perfil · Comunidad Tiroides',
  robots: { index: false, follow: false },
}

export default async function PerfilPage() {
  const member = await getSessionMember()
  if (!member) redirect('/comunidad/entrar')

  return (
    <div className="mx-auto max-w-md">
      <Link
        href="/comunidad"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Comunidad
      </Link>

      <h1 className="headline mb-6 text-3xl text-white">Tu perfil</h1>

      <form action={updateProfileAction} className="surface-card space-y-4 rounded-2xl p-6">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-white/80">Nombre visible</label>
          <input
            name="display_name"
            required
            defaultValue={member.display_name}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-brand-deep)] px-4 py-2.5 text-white focus:border-[var(--color-accent)] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-white/80">Sobre ti (opcional)</label>
          <textarea
            name="bio"
            rows={3}
            defaultValue={member.bio ?? ''}
            placeholder="Cuéntanos algo de ti…"
            className="w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-brand-deep)] px-4 py-2.5 text-white placeholder:text-white/30 focus:border-[var(--color-accent)] focus:outline-none"
          />
        </div>
        <p className="text-xs text-white/40">Tu email de acceso es {member.email}.</p>
        <button type="submit" className="btn-brand w-full">
          Guardar cambios
        </button>
      </form>
    </div>
  )
}
