import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, Check, CheckCircle2 } from 'lucide-react'
import Container from '@/components/common/Container'
import { getStripe } from '@/lib/stripe'

export const metadata: Metadata = {
  title: 'Plaza confirmada | Método BASE Tiroides',
  robots: { index: false, follow: false },
}

async function getPaidSession(sessionId: string | undefined) {
  if (!sessionId?.startsWith('cs_')) return null

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId)
    if (session.metadata?.kind !== 'metodo_tiroides' || session.payment_status !== 'paid') {
      return null
    }
    return session
  } catch (error) {
    console.error('[MetodoTiroides:paymentConfirmation]', error)
    return null
  }
}

function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@')
  if (!domain) return email
  const visible = localPart.slice(0, 2)
  return `${visible}${'*'.repeat(Math.max(3, localPart.length - visible.length))}@${domain}`
}

export default async function ThyroidPaymentConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id: sessionId } = await searchParams
  const session = await getPaidSession(sessionId)
  if (!session) redirect('/metodo-tiroides?payment=unverified')

  const paymentEmail = session.customer_details?.email ?? session.customer_email
  const isSecondInstallment = session.metadata?.payment_plan === 'installments'
    && session.metadata?.installment_index === '2'

  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-brand-deep py-fluid-xl">
      <div className="absolute inset-0 bg-radial-accent opacity-40" />
      <Container>
        <div className="relative mx-auto max-w-2xl rounded-[1.75rem] border border-success/30 bg-brand-dusk p-fluid-md text-center shadow-2xl">
          <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
          <span className="mt-5 inline-block text-fluid-xs font-semibold uppercase tracking-[0.18em] text-accent">Pago confirmado</span>
          <h1 className="headline mt-3 text-fluid-4xl text-white">
            {isSecondInstallment ? 'Segundo pago confirmado.' : 'Pago verificado. Empezamos.'}
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-fluid-base leading-relaxed text-muted">
            {isSecondInstallment
              ? 'El fraccionamiento de tu plaza está completado. No queda ningún cobro pendiente.'
              : 'Tu plaza en Método BASE Tiroides está confirmada. Ahora necesito conocer tu punto de partida antes de preparar el plan.'}
          </p>
          {!isSecondInstallment && <div className="mx-auto mt-7 max-w-lg space-y-3 rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-left">
            {[
              'Completa la evaluación inicial con el mismo email del pago.',
              'Fernando revisará el plan generado antes de entregarlo.',
              'Utiliza ese mismo email para entrar en la comunidad.',
            ].map((step, index) => (
              <div key={step} className="flex items-start gap-3 text-fluid-sm text-white/80">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-fg">
                  {index + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>}
          {paymentEmail && (
            <p className="mx-auto mt-4 max-w-lg text-fluid-xs text-subtle">
              Email del pago: <span className="text-white/75">{maskEmail(paymentEmail)}</span>
            </p>
          )}
          <Link href={isSecondInstallment ? '/comunidad' : '/cuestionario?origen=metodo-tiroides'} className="btn-brand mt-7 px-7 py-4">
            {isSecondInstallment ? 'Ir a la comunidad' : 'Completar evaluación inicial'} <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-5 text-fluid-xs leading-relaxed text-subtle">
            <Check className="mr-1 inline h-3.5 w-3.5 text-success" aria-hidden="true" />
            Si ya la completaste, puedes{' '}
            <Link href="/comunidad/entrar" className="underline underline-offset-2 hover:text-white">
              entrar en la comunidad
            </Link>
            .
          </p>
          <p className="mx-auto mt-3 max-w-lg text-fluid-xs leading-relaxed text-subtle">
            Si el cuestionario todavía no reconoce el pago, espera unos segundos y vuelve a
            intentarlo. El acceso se activa mediante la confirmación segura de Stripe.
          </p>
        </div>
      </Container>
    </section>
  )
}
