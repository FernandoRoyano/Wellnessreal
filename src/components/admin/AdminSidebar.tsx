'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { BookOpen, ClipboardList, FileText, LayoutDashboard, Link2, LogOut, Mail, Menu, MessageCircle, Plus, Sparkles, Users, Workflow, type LucideIcon } from 'lucide-react'

interface NavItem { href: string; label: string; icon: LucideIcon }

const sections: { label: string; items: NavItem[] }[] = [
  { label: 'Principal', items: [
    { href: '/admin/dashboard', label: 'Inicio', icon: LayoutDashboard },
    { href: '/admin/leads', label: 'Leads', icon: Users },
    { href: '/admin/fichas-360', label: 'Fichas 360', icon: ClipboardList },
    { href: '/admin/proposals', label: 'Propuestas', icon: FileText },
  ] },
  { label: 'Producto', items: [
    { href: '/admin/comunidad', label: 'Comunidad', icon: MessageCircle },
    { href: '/admin/funnel-tiroides', label: 'Funnel tiroides', icon: Workflow },
    { href: '/admin/programas', label: 'Programas IA', icon: Sparkles },
  ] },
  { label: 'Contenido', items: [
    { href: '/admin/blog', label: 'Blog', icon: BookOpen },
    { href: '/admin/guiones', label: 'Guiones', icon: FileText },
    { href: '/admin/email', label: 'Email', icon: Mail },
    { href: '/admin/enlaces', label: 'Enlaces', icon: Link2 },
  ] },
]

const mobileItems: NavItem[] = [
  { href: '/admin/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads', icon: Users },
  { href: '/admin/comunidad', label: 'Comunidad', icon: MessageCircle },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const active = (href: string) => href === '/admin/dashboard' ? pathname === href : pathname.startsWith(href)
  const logout = async () => { await fetch('/api/admin/auth', { method: 'DELETE' }); router.push('/admin') }

  return <>
    <aside className="sticky top-0 hidden h-screen w-[228px] shrink-0 flex-col border-r border-white/[.08] bg-[#0d0a1d] px-4 py-6 lg:flex">
      <Link href="/admin/dashboard" className="mb-9 flex items-center gap-3 px-2">
        <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-white p-0.5 shadow-[0_0_0_1px_rgba(252,238,33,.22)]">
          <Image src="/icon.png" alt="" width={40} height={40} className="h-full w-full" />
        </span>
        <span><strong className="block font-display text-sm text-white">WellnessReal</strong><small className="text-[10px] text-[#817a94]">Centro de control</small></span>
      </Link>
      <nav className="flex-1 overflow-y-auto" aria-label="Administración">
        {sections.map(section => <div className="mb-6" key={section.label}>
          <p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[.16em] text-[#696277]">{section.label}</p>
          <div className="grid gap-0.5">{section.items.map(item => { const Icon = item.icon; const selected = active(item.href); return <Link key={item.href} href={item.href} aria-current={selected ? 'page' : undefined} className={`flex min-h-10 items-center gap-3 rounded-lg px-3 text-xs font-medium transition-colors ${selected ? 'bg-white/[.07] text-[#FCEE21]' : 'text-[#9f98b0] hover:bg-white/[.035] hover:text-white'}`}><Icon size={16}/>{item.label}</Link> })}</div>
        </div>)}
      </nav>
      <Link href="/admin/proposals/new" className="mb-2 flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#FCEE21] px-3 text-xs font-bold text-[#100D24]"><Plus size={15}/> Crear propuesta</Link>
      <button type="button" onClick={logout} className="flex min-h-10 items-center gap-3 rounded-lg px-3 text-xs text-[#746d84] transition-colors hover:bg-red-400/5 hover:text-red-300"><LogOut size={16}/> Cerrar sesión</button>
    </aside>

    <nav className="fixed inset-x-3 bottom-3 z-[200] grid h-16 grid-cols-4 rounded-2xl border border-white/10 bg-[#17132F]/95 p-1.5 shadow-2xl backdrop-blur-xl lg:hidden" aria-label="Navegación móvil">
      {mobileItems.map(item => { const Icon = item.icon; const selected = active(item.href); return <Link key={item.href} href={item.href} aria-current={selected ? 'page' : undefined} className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl text-[9px] font-semibold ${selected ? 'bg-white/[.06] text-[#FCEE21]' : 'text-[#9f98b0]'}`}><Icon size={18}/><span className="max-w-full truncate">{item.label}</span></Link> })}
      <details className="group relative">
        <summary className="flex h-full cursor-pointer list-none flex-col items-center justify-center gap-1 rounded-xl text-[9px] font-semibold text-[#9f98b0]"><Menu size={18}/><span>Más</span></summary>
        <div className="absolute bottom-[4.25rem] right-0 w-56 rounded-2xl border border-white/10 bg-[#17132F] p-2 shadow-2xl">
          {sections.flatMap(section => section.items).filter(item => !mobileItems.some(mobile => mobile.href === item.href)).map(item => { const Icon = item.icon; return <Link key={item.href} href={item.href} className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-xs text-[#b7b0c7] hover:bg-white/[.05] hover:text-white"><Icon size={16}/>{item.label}</Link> })}
          <button type="button" onClick={logout} className="flex min-h-11 w-full items-center gap-3 border-t border-white/[.07] px-3 text-xs text-red-300"><LogOut size={16}/> Cerrar sesión</button>
        </div>
      </details>
    </nav>
  </>
}
