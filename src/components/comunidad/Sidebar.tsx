'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar } from './Avatar'
import { signOut } from '@/app/(comunidad)/comunidad/actions'
import { Home, BookOpen, MessagesSquare, LogOut, Menu, X, ArrowLeft } from 'lucide-react'
import type { Space, MemberProfile } from '@/lib/db/comunidad'

export function Sidebar({ spaces, member }: { spaces: Space[]; member: MemberProfile }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const close = () => setOpen(false)

  return (
    <>
      {/* ── Barra superior móvil ── */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-brand-ink)]/95 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/comunidad" className="headline text-base text-white">
          Comunidad Tiroides
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          className="rounded-lg p-1.5 text-white/70 hover:text-white"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* ── Sidebar escritorio ── */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[var(--color-border)] bg-[var(--color-brand-ink)] lg:flex">
        <SidebarBody spaces={spaces} member={member} pathname={pathname} onNavigate={close} />
      </aside>

      {/* ── Drawer móvil ── */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-[var(--color-border)] bg-[var(--color-brand-ink)] shadow-2xl">
            <button
              onClick={close}
              aria-label="Cerrar menú"
              className="absolute right-3 top-3 rounded-lg p-1.5 text-white/50 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarBody spaces={spaces} member={member} pathname={pathname} onNavigate={close} />
          </aside>
        </div>
      )}
    </>
  )
}

function SidebarBody({
  spaces,
  member,
  pathname,
  onNavigate,
}: {
  spaces: Space[]
  member: MemberProfile
  pathname: string
  onNavigate: () => void
}) {
  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')

  return (
    <div className="flex h-full flex-col">
      {/* Marca */}
      <div className="border-b border-[var(--color-border)] px-5 py-5">
        <Link href="/comunidad" onClick={onNavigate} className="block">
          <p className="headline text-lg leading-tight text-white">Comunidad</p>
          <p className="text-xs font-medium text-[var(--color-accent)]">Tiroides · WellnessReal</p>
        </Link>
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <NavItem
          href="/comunidad"
          label="Inicio"
          icon={<Home className="h-[18px] w-[18px]" />}
          active={isActive('/comunidad', true)}
          onNavigate={onNavigate}
        />

        {spaces.length > 0 && (
          <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-white/35">
            Espacios
          </p>
        )}
        {spaces.map((s) => (
          <NavItem
            key={s.id}
            href={`/comunidad/${s.slug}`}
            label={s.name}
            icon={
              s.type === 'forum' ? (
                <MessagesSquare className="h-[18px] w-[18px]" />
              ) : (
                <BookOpen className="h-[18px] w-[18px]" />
              )
            }
            active={isActive(`/comunidad/${s.slug}`)}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {/* Perfil */}
      <div className="border-t border-[var(--color-border)] p-3">
        <Link
          href="/comunidad/perfil"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/5"
        >
          <Avatar name={member.display_name} url={member.avatar_url} size={36} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{member.display_name}</p>
            <p className="truncate text-xs text-white/40">Ver perfil</p>
          </div>
        </Link>
        <div className="mt-1 flex items-center justify-between px-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-white/50 transition hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Volver a la web
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-white/50 transition hover:text-red-400"
            >
              <LogOut className="h-3.5 w-3.5" /> Salir
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function NavItem({
  href,
  label,
  icon,
  active,
  onNavigate,
}: {
  href: string
  label: string
  icon: React.ReactNode
  active: boolean
  onNavigate: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        active
          ? 'bg-[var(--color-accent-muted)] text-[var(--color-accent)]'
          : 'text-white/65 hover:bg-white/5 hover:text-white'
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </Link>
  )
}
