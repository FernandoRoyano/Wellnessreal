import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSessionMember, getSpaces } from '@/lib/db/comunidad'
import { BookOpen, MessagesSquare, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Comunidad Tiroides · WellnessReal',
  robots: { index: false, follow: false },
}

export default async function ComunidadHome() {
  const member = await getSessionMember()
  if (!member) redirect('/comunidad/entrar')

  const spaces = await getSpaces()

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="headline text-3xl text-white sm:text-4xl">
        Hola, {member.display_name} 👋
      </h1>
      <p className="mt-3 max-w-2xl text-white/60">
        Bienvenida a la comunidad de tiroides. Aquí aprendes a tu ritmo y compartes con gente que
        entiende por lo que pasas.
      </p>

      {spaces.length === 0 ? (
        <div className="surface-card mt-10 rounded-3xl p-10 text-center">
          <p className="text-white/70">Estamos preparando el contenido. Vuelve muy pronto.</p>
        </div>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {spaces.map((s) => (
            <Link
              key={s.id}
              href={`/comunidad/${s.slug}`}
              className="hover-lift surface-card group flex items-center gap-4 rounded-2xl p-6"
            >
              <div className="rounded-xl bg-white/5 p-3">
                {s.type === 'forum' ? (
                  <MessagesSquare className="h-6 w-6 text-[var(--color-accent)]" />
                ) : (
                  <BookOpen className="h-6 w-6 text-[var(--color-accent)]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-white">{s.name}</h2>
                {s.description && (
                  <p className="mt-0.5 line-clamp-2 text-sm text-white/50">{s.description}</p>
                )}
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-white/30 transition group-hover:text-[var(--color-accent)]" />
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
