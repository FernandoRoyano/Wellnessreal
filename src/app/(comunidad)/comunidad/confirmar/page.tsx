import type { Metadata } from 'next'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { ConfirmarForm } from './ConfirmarForm'
import styles from '../entrar/entrar.module.css'

export const metadata: Metadata = {
  title: 'Confirmar acceso · Comunidad Tiroides · WellnessReal',
  robots: { index: false, follow: false },
}

export default async function ConfirmarPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; token_hash?: string; type?: string; next?: string }>
}) {
  const { code, token_hash, type, next } = await searchParams

  if (!code && !(token_hash && type)) {
    redirect('/comunidad/entrar?error=missing_code')
  }

  return (
    <main className={styles.confirmPage}>
      <div className={styles.confirmCard}>
        <Image className={styles.confirmLogo} src="/images/logos/WR_AUX_normal_bg.png" alt="WellnessReal" width={4167} height={507} priority />
        <h1>Ya casi estás dentro.</h1>
        <p>Confirma que quieres acceder a la Comunidad Tiroides desde este dispositivo.</p>
        <ConfirmarForm code={code} tokenHash={token_hash} type={type} next={next} />
      </div>
    </main>
  )
}
