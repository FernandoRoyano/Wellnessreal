import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSessionMember, getSpacesOverview, getRecentThreads } from '@/lib/db/comunidad'
import { Avatar } from '@/components/comunidad/Avatar'
import { timeAgo } from '@/lib/comunidad-format'
import { BookOpen, MessagesSquare, ArrowRight, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Comunidad Tiroides · WellnessReal',
  robots: { index: false, follow: false },
}

export default async function ComunidadHome() {
  const member = await getSessionMember()
  if (!member) redirect('/comunidad/entrar')

  const [spaces, recent] = await Promise.all([getSpacesOverview(), getRecentThreads(5)])

  return (
    <div className="animate-[fadeUp_500ms_var(--ease-out)_both]">
      {/* Saludo */}
      <div className="flex items-center gap-4">
        <Avatar name={member.display_name} url={member.avatar_url} size={56} />
        <div>
          <h1 className="headline text-2xl text-white sm:text-3xl">
            Hola, {member.display_name.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-white/55">
            Aprende a tu ritmo y comparte con gente que entiende por lo que pasas.
          </p>
        </div>
      </div>

      {/* Espacios */}
      <section className="mt-10">
        <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/40">
          <Sparkles className="h-3.5 w-3.5 text-[var(--color-accent)]" /> Explora la comunidad
        </h2>

        {spaces.length === 0 ? (
          <div className="surface-card rounded-3xl p-10 text-center">
            <p className="text-white/70">Estamos preparando el contenido. Vuelve muy pronto.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {spaces.map((s) => (
              <Link
                key={s.id}
                href={`/comunidad/${s.slug}`}
                className="hover-lift surface-card group flex flex-col gap-3 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-[var(--color-accent-muted)] p-3">
                    {s.type === 'forum' ? (
                      <MessagesSquare className="h-6 w-6 text-[var(--color-accent)]" />
                    ) : (
                      <BookOpen className="h-6 w-6 text-[var(--color-accent)]" />
                    )}
                  </div>
                  <ArrowRight className="h-5 w-5 text-white/25 transition group-hover:translate-x-1 group-hover:text-[var(--color-accent)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-[var(--color-accent)]">
                    {s.name}
                  </h3>
                  {s.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-white/50">{s.description}</p>
                  )}
                </div>
                <p className="mt-auto text-xs text-white/35">
                  {s.itemCount} {s.type === 'forum' ? 'temas' : 'lecciones'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Actividad reciente */}
      {recent.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">
            Actividad reciente
          </h2>
          <div className="surface-card divide-y divide-[var(--color-border)] rounded-2xl">
            {recent.map((t) => (
              <Link
                key={t.id}
                href={`/comunidad/${t.space_slug}/hilo/${t.id}`}
                className="flex items-center gap-3 p-4 transition first:rounded-t-2xl last:rounded-b-2xl hover:bg-white/5"
              >
                <Avatar name={t.author?.display_name ?? 'Miembro'} url={t.author?.avatar_url} size={34} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{t.title}</p>
                  <p className="text-xs text-white/40">
                    {t.author?.display_name ?? 'Miembro'} · {timeAgo(t.creado_en)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
