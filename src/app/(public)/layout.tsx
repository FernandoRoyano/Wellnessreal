import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import CookieBanner from '@/components/common/CookieBanner'
import LeadMagnetPopup from '@/components/common/LeadMagnetPopup'
import GSAPProvider from '@/components/animations/GSAPProvider'
import ScrollProgressBar from '@/components/animations/ScrollProgressBar'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <GSAPProvider>
      <ScrollProgressBar />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CookieBanner />
      <LeadMagnetPopup />
    </GSAPProvider>
  )
}
