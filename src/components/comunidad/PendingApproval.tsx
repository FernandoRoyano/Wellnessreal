import { signOut } from '@/app/(comunidad)/comunidad/actions'
import { Clock, ShieldOff, LogOut } from 'lucide-react'
import type { MemberProfile } from '@/lib/db/comunidad'

/**
 * Pantalla para miembros que aún no tienen acceso aprobado (o están bloqueados).
 * Sustituye por completo al shell: no ven espacios, contenido ni foro.
 */
export function PendingApproval({ member }: { member: MemberProfile }) {
  const bloqueado = member.status === 'blocked'

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <div className="surface-card rounded-3xl p-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
          {bloqueado ? (
            <ShieldOff className="h-7 w-7 text-white/40" />
          ) : (
            <Clock className="h-7 w-7 text-[var(--color-accent)]" />
          )}
        </div>

        {bloqueado ? (
          <>
            <h1 className="headline mb-2 text-2xl text-white">Acceso no disponible</h1>
            <p className="text-white/60">
              Tu acceso a la comunidad no está activo. Si crees que es un error, escríbenos a{' '}
              <a href="mailto:info@wellnessreal.es" className="text-[var(--color-accent)]">
                info@wellnessreal.es
              </a>
              .
            </p>
          </>
        ) : (
          <>
            <h1 className="headline mb-2 text-2xl text-white">Solicitud en revisión</h1>
            <p className="text-white/60">
              Gracias por apuntarte, {member.display_name.split(' ')[0]}. Reviso personalmente
              cada solicitud para mantener la comunidad como un espacio seguro.
            </p>
            <p className="mt-3 text-sm text-white/45">
              Te aviso por email en cuanto apruebe tu acceso. No suele tardar.
            </p>
          </>
        )}

        <form action={signOut} className="mt-8">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-white/60 transition hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </button>
        </form>
      </div>
    </main>
  )
}
