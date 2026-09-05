import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import Container from '@/components/common/Container'

export const metadata: Metadata = {
  title: 'Plaza confirmada | Método BASE Tiroides',
  robots: { index: false, follow: false },
}

export default function ThyroidPaymentConfirmedPage() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-brand-deep py-fluid-xl">
      <div className="absolute inset-0 bg-radial-accent opacity-40" />
      <Container>
        <div className="relative mx-auto max-w-2xl rounded-[1.75rem] border border-success/30 bg-brand-dusk p-fluid-md text-center shadow-2xl">
          <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
          <span className="mt-5 inline-block text-fluid-xs font-semibold uppercase tracking-[0.18em] text-accent">Pago confirmado</span>
          <h1 className="headline mt-3 text-fluid-4xl text-white">Tu plaza está confirmada.</h1>
          <p className="mx-auto mt-4 max-w-lg text-fluid-base leading-relaxed text-muted">
            El siguiente paso es completar la evaluación inicial con el mismo correo que utilizaste al pagar. Así podré preparar y revisar tu plan.
          </p>
          <Link href="/cuestionario?origen=metodo-tiroides" className="btn-brand mt-7 px-7 py-4">Completar mi evaluación <ArrowRight className="h-4 w-4" /></Link>
          <p className="mt-4 text-sm text-muted"><Link href="/comunidad/entrar" className="underline hover:text-white">Ya la completé: entrar en la comunidad</Link></p>
        </div>
      </Container>
    </section>
  )
}
