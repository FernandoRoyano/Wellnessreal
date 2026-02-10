export const metadata = {
  title: 'Admin | WellnessReal',
  description: 'Panel de administración',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
