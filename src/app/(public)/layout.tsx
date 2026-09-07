import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import CookieBanner from '@/components/common/CookieBanner'
import LeadMagnetPopup from '@/components/common/LeadMagnetPopup'
import ScrollProgressBar from '@/components/animations/ScrollProgressBar'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
      <ScrollProgressBar />
      <Header />
      <main id="main-content" className="min-h-screen" tabIndex={-1}>{children}</main>
      <Footer />
      <CookieBanner />
      <LeadMagnetPopup />
    </>
  )
}
