'use client'

import { useActionState } from 'react'
import { requestMagicLink, type MagicLinkResult } from '../actions'
import { Mail, Loader2, CheckCircle2 } from 'lucide-react'

export function EntrarForm() {
  const [state, action, pending] = useActionState<MagicLinkResult | null, FormData>(
    requestMagicLink,
    null
  )

  if (state?.ok) {
    return (
      <div className="surface-card rounded-3xl p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-[var(--color-accent)]" />
        <h2 className="headline mb-2 text-2xl text-white">Revisa tu correo</h2>
        <p className="text-white/70">
          Te hemos enviado un enlace de acceso. Ábrelo desde este dispositivo para entrar en la
          comunidad. Si no lo ves, mira en spam.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="surface-card rounded-3xl p-8">
      <label htmlFor="email" className="mb-2 block text-sm font-semibold text-white/80">
        Tu email
      </label>
      <div className="relative">
        <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="tu@email.com"
          className="w-full rounded-full border border-[var(--color-border)] bg-[var(--color-brand-deep)] py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:border-[var(--color-accent)] focus:outline-none"
        />
      </div>

      {state?.error && <p className="mt-3 text-sm text-red-400">{state.error}</p>}

      <button type="submit" disabled={pending} className="btn-brand mt-5 w-full disabled:opacity-60">
        {pending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Enviando…
          </>
        ) : (
          'Enviar enlace de acceso'
        )}
      </button>

      <p className="mt-4 text-center text-xs text-white/40">
        Sin contraseñas. Te enviamos un enlace mágico a tu correo.
      </p>
    </form>
  )
}
