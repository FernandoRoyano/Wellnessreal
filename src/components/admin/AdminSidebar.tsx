'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, PlusCircle, LogOut, Mail } from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/proposals/new', label: 'Nueva propuesta', icon: PlusCircle },
]

const emailSubItems = [
  { href: '/admin/email', label: 'Overview', exact: true },
  { href: '/admin/email/subscribers', label: 'Suscriptores' },
  { href: '/admin/email/groups', label: 'Grupos' },
  { href: '/admin/email/campaigns', label: 'Campañas' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const isEmailSection = pathname.startsWith('/admin/email')

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin')
  }

  return (
    <aside
      className="w-64 min-h-screen p-6 flex flex-col border-r"
      style={{ backgroundColor: '#0f0c20', borderRightColor: '#662D91' }}
    >
      <div className="mb-10">
        <h1 className="text-xl font-bold" style={{ color: '#FCEE21' }}>
          WR Admin
        </h1>
        <p className="text-xs text-gray-500 mt-1">Panel de gestión</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: isActive ? 'rgba(252, 238, 33, 0.1)' : 'transparent',
                color: isActive ? '#FCEE21' : '#9ca3af',
              }}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          )
        })}

        {/* Email Marketing section */}
        <Link
          href="/admin/email"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all"
          style={{
            backgroundColor: isEmailSection ? 'rgba(252, 238, 33, 0.1)' : 'transparent',
            color: isEmailSection ? '#FCEE21' : '#9ca3af',
          }}
        >
          <Mail size={20} />
          Email Marketing
        </Link>

        {/* Email sub-navigation */}
        {isEmailSection && (
          <div className="ml-4 pl-4 space-y-0.5" style={{ borderLeft: '1px solid rgba(102, 45, 145, 0.3)' }}>
            {emailSubItems.map((sub) => {
              const isSubActive = sub.exact
                ? pathname === sub.href
                : pathname.startsWith(sub.href)
              return (
                <Link
                  key={sub.href}
                  href={sub.href}
                  className="block px-3 py-2 rounded-md text-xs font-medium transition-all"
                  style={{
                    color: isSubActive ? '#FCEE21' : '#6b7280',
                    backgroundColor: isSubActive ? 'rgba(252, 238, 33, 0.05)' : 'transparent',
                  }}
                >
                  {sub.label}
                </Link>
              )
            })}
          </div>
        )}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-500 hover:text-red-400 transition-all mt-auto"
      >
        <LogOut size={20} />
        Cerrar sesión
      </button>
    </aside>
  )
}
