import CookieBanner from '@/components/common/CookieBanner'
import GSAPProvider from '@/components/animations/GSAPProvider'

export default function FunnelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <GSAPProvider>
      <main className="min-h-screen">{children}</main>
      <CookieBanner />
    </GSAPProvider>
  )
}
