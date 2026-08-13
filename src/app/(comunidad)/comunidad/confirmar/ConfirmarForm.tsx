'use client'

import { useActionState } from 'react'
import { confirmMagicLink, type ConfirmResult } from '../actions'
import { ShieldCheck, Loader2 } from 'lucide-react'

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
    <form action={action} className="surface-card rounded-3xl p-8 text-center">
      <input type="hidden" name="code" value={code ?? ''} />
      <input type="hidden" name="token_hash" value={tokenHash ?? ''} />
      <input type="hidden" name="type" value={type ?? ''} />
      <input type="hidden" name="next" value={next ?? ''} />

      <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-[var(--color-accent)]" />

      {state?.error && <p className="mb-4 text-sm text-red-400">{state.error}</p>}

      <button type="submit" disabled={pending} className="btn-brand w-full disabled:opacity-60">
        {pending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Entrando…
          </>
        ) : (
          'Confirmar acceso'
        )}
      </button>
    </form>
  )
}
