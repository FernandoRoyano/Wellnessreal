'use client'

import { useActionState } from 'react'
import { ArrowRight, CheckCircle2, LoaderCircle, Mail } from 'lucide-react'
import { requestMagicLink, type MagicLinkResult } from '../actions'
import styles from './entrar.module.css'

export function EntrarForm({ errorMessage }: { errorMessage?: string }) {
  const [state, action, pending] = useActionState<MagicLinkResult | null, FormData>(requestMagicLink, null)

  if (state?.ok) {
    return (
      <div className={styles.success} role="status">
        <span><CheckCircle2 size={24} /></span>
        <div>
          <h3>Revisa tu correo</h3>
          <p>Te hemos enviado un enlace de acceso. Ábrelo y pulsa “Confirmar acceso”. Si no aparece en unos minutos, revisa spam o promociones.</p>
        </div>
      </div>
    )
  }

  return (
    <form action={action} className={styles.form}>
      {(errorMessage || state?.error) && <p className={styles.error} role="alert">{errorMessage ?? state?.error}</p>}
      <label htmlFor="email">Email de acceso</label>
      <div className={styles.inputWrap}>
        <Mail size={18} aria-hidden="true" />
        <input id="email" name="email" type="email" required autoComplete="email" autoFocus placeholder="tu@email.com" aria-invalid={Boolean(errorMessage || state?.error)} />
      </div>
      <button type="submit" disabled={pending}>
        <span>{pending ? 'Enviando enlace…' : 'Recibir enlace de acceso'}</span>
        {pending ? <LoaderCircle size={18} className={styles.spinner} /> : <ArrowRight size={18} />}
      </button>
      <p className={styles.formNote}>Sin contraseña. El enlace es personal y solo se puede utilizar una vez.</p>
    </form>
  )
}
