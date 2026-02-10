import Image from 'next/image'

export const metadata = {
  title: 'Tu propuesta | WellnessReal',
  robots: 'noindex, nofollow',
}

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <header className="py-6 text-center" style={{ backgroundColor: '#16122B', borderBottom: '1px solid rgba(102, 45, 145, 0.3)' }}>
        <div className="relative w-48 h-14 mx-auto">
          <Image
            src="/images/logos/WR_AUX_normal_bg.png"
            alt="WellnessReal"
            fill
            sizes="192px"
            className="object-contain"
          />
        </div>
      </header>
      <main style={{ backgroundColor: '#16122B' }}>{children}</main>
    </>
  )
}
