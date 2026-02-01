export const metadata = {
  title: 'Sanity Studio | WellnessReal',
  description: 'Panel de administración del blog',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
