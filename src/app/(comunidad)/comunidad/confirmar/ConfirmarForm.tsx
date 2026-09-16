'use client'

import { useActionState } from 'react'
import { confirmMagicLink, type ConfirmResult } from '../actions'
import { ShieldCheck, Loader2 } from 'lucide-react'
import styles from '../entrar/entrar.module.css'

export function ConfirmarForm({
  code,
  tokenHash,
  type,
  next,
}: {
  code?: string
  tokenHash?: string
  type?: string
  next?: string
}) {
  const [state, action, pending] = useActionState<ConfirmResult | null, FormData>(
    confirmMagicLink,
    null
  )

  return (
    <form action={action} className={styles.confirmForm}>
      <input type="hidden" name="code" value={code ?? ''} />
      <input type="hidden" name="token_hash" value={tokenHash ?? ''} />
      <input type="hidden" name="type" value={type ?? ''} />
      <input type="hidden" name="next" value={next ?? ''} />

      <ShieldCheck className={styles.confirmIcon} aria-hidden="true" />

      {state?.error && <p className={styles.error} role="alert">{state.error}</p>}

      <button type="submit" disabled={pending}>
        {pending ? (
          <>
            <Loader2 size={18} className={styles.spinner} /> Entrando…
          </>
        ) : (
          'Confirmar acceso'
        )}
      </button>
    </form>
  )
}
