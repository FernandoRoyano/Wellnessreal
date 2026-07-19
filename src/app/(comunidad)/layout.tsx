import Link from 'next/link'
import { getSessionMember } from '@/lib/db/comunidad'
import { signOut } from './comunidad/actions'
import { LogOut } from 'lucide-react'

export default async function ComunidadLayout({ children }: { children: React.ReactNode }) {
  const member = await getSessionMember()

  return (
    <div className="min-h-screen bg-[var(--color-brand-deep)]">
      {member && (
        <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-brand-deep)]/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/comunidad" className="headline text-lg text-white">
              Comunidad Tiroides
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/comunidad/perfil"
                className="hidden text-sm text-white/60 transition hover:text-white sm:inline"
              >
                {member.display_name}
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-sm text-white/70 transition hover:text-white"
                >
                  <LogOut className="h-4 w-4" /> Salir
                </button>
              </form>
            </div>
          </div>
        </header>
      )}
      {children}
    </div>
  )
}
