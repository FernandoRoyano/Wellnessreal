'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { confirmMagicLink, type ConfirmResult } from '../actions'
import { ShieldCheck, Loader2 } from 'lucide-react'
import styles from '../entrar/entrar.module.css'
import { getThyroidTrackingContext } from '@/lib/analytics'
import { safeInternalPath } from '@/lib/safe-redirect'

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
    <form action={formData => {
      formData.set('_community_tracking', JSON.stringify(getThyroidTrackingContext()))
      action(formData)
    }} className={styles.confirmForm}>
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
      {state?.error && <Link href={`/comunidad/entrar?next=${encodeURIComponent(safeInternalPath(next, '/comunidad'))}`} className={styles.confirmRetry}>Pedir un nuevo enlace de acceso</Link>}
    </form>
  )
}
