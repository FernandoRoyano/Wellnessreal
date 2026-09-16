'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowRight, Eye, EyeOff, LoaderCircle, ShieldCheck } from 'lucide-react'
import styles from './login.module.css'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        setError('La contraseña no es correcta. Revísala y vuelve a intentarlo.')
        return
      }

      router.push('/admin/dashboard')
    } catch {
      setError('No se ha podido conectar. Comprueba tu conexión y vuelve a intentarlo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.brandPanel} aria-label="WellnessReal">
        <div className={styles.brandContent}>
          <Image
            src="/images/logos/WR_AUX_normal_bg.png"
            alt="WellnessReal"
            width={4167}
            height={507}
            priority
            className={styles.logo}
          />
          <div className={styles.statement}>
            <p>Centro de control</p>
            <h1>Todo el negocio.<br /><span>Un solo pulso.</span></h1>
          </div>
          <p className={styles.brandNote}>Contenido, comunidad, clientes y crecimiento conectados en un mismo lugar.</p>
        </div>
        <div className={styles.pulseLine} aria-hidden="true"><span /></div>
        <p className={styles.brandFooter}>WellnessReal · Área privada</p>
      </section>

      <section className={styles.accessPanel}>
        <div className={styles.mobileBrand}>
          <Image src="/images/logos/WR_AUX_normal_bg.png" alt="WellnessReal" width={4167} height={507} priority />
        </div>

        <div className={styles.loginBox}>
          <div className={styles.accessLabel}><ShieldCheck size={15} aria-hidden="true" /> Acceso privado</div>
          <h2>Bienvenido de nuevo.</h2>
          <p className={styles.intro}>Introduce tu contraseña para entrar al centro de control.</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="admin-password">Contraseña</label>
              <div className={styles.inputWrap}>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Tu contraseña"
                  autoComplete="current-password"
                  autoFocus
                  required
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'login-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(current => !current)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && <p id="login-error" className={styles.error} role="alert">{error}</p>}
            </div>

            <button type="submit" disabled={loading} className={styles.submit}>
              <span>{loading ? 'Accediendo…' : 'Entrar al panel'}</span>
              {loading ? <LoaderCircle size={18} className={styles.spinner} /> : <ArrowRight size={18} />}
            </button>
          </form>

          <p className={styles.security}><span /> Conexión protegida · Acceso restringido</p>
        </div>
      </section>
    </main>
  )
}
