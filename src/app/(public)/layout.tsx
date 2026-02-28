import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import CookieBanner from '@/components/common/CookieBanner'
import LeadMagnetPopup from '@/components/common/LeadMagnetPopup'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CookieBanner />
      <LeadMagnetPopup />
    </>
  )
}
