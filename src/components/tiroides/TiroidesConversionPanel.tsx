'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import TestTiroides from '@/components/tiroides/TestTiroides'
import { trackSignUp, trackThyroidFunnel } from '@/lib/analytics'

const FIELD_CLASS =
  'w-full rounded-xl border border-border-subtle bg-brand-night px-4 py-4 text-fluid-base text-white ' +
  'placeholder:text-dim focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-[border-color,box-shadow]'

export default function TiroidesConversionPanel() {
  const router = useRouter()
  const [showGuideForm, setShowGuideForm] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    trackThyroidFunnel('thyroid_landing_view')
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '')
        .trim()
        .toLowerCase(),
    }

    try {
      setIsSubmitting(true)
      setSubmitError('')
      const { getAttributionForSubmit } = await import('@/lib/tracking')
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          resource: 'tiroides',
          _source: 'tiroides',
          _attribution: getAttributionForSubmit(),
        }),
      })
      if (!response.ok) throw new Error('Error al suscribir')

      trackSignUp('tiroides')
      router.push('/gracias-tiroides')
    } catch {
      setSubmitError('Hubo un problema. Inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!showGuideForm) {
    return <TestTiroides onWantGuide={() => setShowGuideForm(true)} />
  }

  return (
    <div className="surface-card-accent rounded-2xl p-fluid-md">
      <button
        type="button"
        onClick={() => setShowGuideForm(false)}
        className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-fluid-xs text-subtle hover:text-white"
      >
        <span aria-hidden="true">←</span> Volver al test
      </button>

      <div className="mb-6 space-y-2 text-center">
        <h2 className="headline text-fluid-2xl text-white">Llévate la guía gratis</h2>
        <p className="text-fluid-sm text-muted">
          Entrena y mejora tus hábitos con criterios claros, sin milagros ni promesas médicas.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {submitError && (
          <div
            role="alert"
            className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-fluid-sm text-danger"
          >
            {submitError}
          </div>
        )}

        <div>
          <label
            htmlFor="thyroid-guide-name"
            className="mb-1.5 block text-fluid-xs font-semibold text-white/80"
          >
            Nombre
          </label>
          <input
            id="thyroid-guide-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            placeholder="Tu nombre"
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label
            htmlFor="thyroid-guide-email"
            className="mb-1.5 block text-fluid-xs font-semibold text-white/80"
          >
            Email
          </label>
          <input
            id="thyroid-guide-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            required
            placeholder="tu@email.com"
            className={FIELD_CLASS}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-brand w-full py-4 text-fluid-base disabled:opacity-60"
        >
          {isSubmitting ? (
            'Enviando…'
          ) : (
            <>
              Descargar la guía gratis <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>

        <p className="text-center text-fluid-xs text-subtle">
          Sin spam. Solo contenido útil. Puedes darte de baja cuando quieras.
        </p>
      </form>
    </div>
  )
}
