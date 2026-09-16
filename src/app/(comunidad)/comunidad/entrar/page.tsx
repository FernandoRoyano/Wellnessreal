import type { Metadata } from 'next'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { BookOpen, Download, MessageCircle } from 'lucide-react'
import { getSessionMember } from '@/lib/db/comunidad'
import { supabaseConfigStatus } from '@/lib/supabase-env'
import { EntrarForm } from './EntrarForm'
import styles from './entrar.module.css'

export const metadata: Metadata = {
  title: 'Entrar · Comunidad Tiroides · WellnessReal',
  description: 'Accede a la comunidad gratuita de tiroides de WellnessReal con tu email.',
  robots: { index: false, follow: false },
}

const ERROR_MESSAGES: Record<string, string> = {
  missing_code: 'El enlace no es válido o está incompleto. Pide uno nuevo.',
  auth: 'El enlace ha caducado o ya se ha usado. Pide uno nuevo.',
  callback: 'Algo falló al confirmar el acceso. Inténtalo de nuevo en un momento.',
}

export default async function EntrarPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const member = await getSessionMember()
  if (member) redirect('/comunidad')

  const { error } = await searchParams
  const errorMessage = error ? (ERROR_MESSAGES[error] ?? ERROR_MESSAGES.callback) : undefined
  const cfg = supabaseConfigStatus()

  return (
    <main className={styles.page}>
      <section className={styles.story} aria-label="Comunidad Tiroides WellnessReal">
        <div className={styles.storyInner}>
          <Image src="/images/logos/WR_AUX_normal_bg.png" alt="WellnessReal" width={4167} height={507} priority className={styles.logo} />
          <div className={styles.copy}>
            <p>Comunidad gratuita · Tiroides</p>
            <h1>No entras a otro grupo.<br /><span>Entras a un recorrido.</span></h1>
            <p className={styles.lead}>Contenido revisado, herramientas para aplicar y un espacio donde preguntar sin sentir que llegas tarde.</p>
          </div>

          <div className={styles.features}>
            <div><BookOpen size={18} /><span><strong>Entender</strong><small>Lecciones paso a paso y con fuentes.</small></span></div>
            <div><Download size={18} /><span><strong>Aplicar</strong><small>Recursos que puedes descargar y usar.</small></span></div>
            <div><MessageCircle size={18} /><span><strong>Compartir</strong><small>Preguntas y apoyo sin juicios.</small></span></div>
          </div>
        </div>
        <div className={styles.visual} aria-hidden="true">
          <Image src="/community/fuerza-en-casa.webp" alt="" width={900} height={600} className={styles.visualMain} />
          <Image src="/community/alimentacion-practica.webp" alt="" width={420} height={300} className={styles.visualInset} />
          <span>Una cosa cada vez.</span>
        </div>
      </section>

      <section className={styles.access}>
        <div className={styles.mobileLogo}><Image src="/images/logos/WR_AUX_normal_bg.png" alt="WellnessReal" width={4167} height={507} priority /></div>
        <div className={styles.accessInner}>
          <p className={styles.kicker}>Tu acceso a la comunidad</p>
          <h2>Entra con tu email.</h2>
          <p className={styles.intro}>Si ya eres miembro, utiliza el mismo correo con el que te registraste. Si es tu primera vez, ese correo creará tu acceso.</p>
          {cfg.ok ? <EntrarForm errorMessage={errorMessage} /> : <ConfigError missing={cfg.missing} />}
          <ol className={styles.steps} aria-label="Cómo funciona el acceso">
            <li><span>1</span><p>Escribe tu email</p></li>
            <li><span>2</span><p>Abre el enlace que recibirás</p></li>
            <li><span>3</span><p>Confirma y entra</p></li>
          </ol>
        </div>
      </section>
    </main>
  )
}

function ConfigError({ missing }: { missing: string[] }) {
  return <div className={styles.configError}><h2>Configuración pendiente</h2><p>Falta configurar el acceso en el servidor:</p><ul>{missing.map(item => <li key={item}><code>{item}</code></li>)}</ul></div>
}
