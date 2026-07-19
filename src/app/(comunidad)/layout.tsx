import { redirect } from 'next/navigation'
import { getSessionMember, getSpaces, touchMember } from '@/lib/db/comunidad'
import { Sidebar } from '@/components/comunidad/Sidebar'

// La comunidad depende de la sesión y de config leída en runtime: nunca estática.
export const dynamic = 'force-dynamic'

export default async function ComunidadLayout({ children }: { children: React.ReactNode }) {
  const member = await getSessionMember()

  // Sin sesión: sin shell (las páginas /comunidad/entrar y perfil ya redirigen).
  if (!member) {
    return <div className="min-h-screen bg-[var(--color-brand-deep)]">{children}</div>
  }

  // Marca actividad para "en línea" (activo < 5 min).
  await touchMember(member.id)

  const spaces = await getSpaces()

  return (
    <div className="min-h-screen bg-[var(--color-brand-deep)]">
      <Sidebar spaces={spaces} member={member} />
      <div className="lg:pl-64">
        <div className="mx-auto min-h-screen max-w-3xl px-5 py-8 sm:px-8 sm:py-12">{children}</div>
      </div>
    </div>
  )
}
