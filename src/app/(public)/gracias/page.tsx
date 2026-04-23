import Container from '@/components/common/Container'
import Link from 'next/link'
import { CheckCircle, Clock, Mail, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mensaje Enviado | WellnessReal',
  description: 'Tu mensaje ha sido enviado correctamente. Te contactaremos en menos de 24 horas.',
  robots: 'noindex, nofollow',
}

const STEPS = [
  { icon: Mail,       title: '1. Reviso tu mensaje', desc: 'Leo personalmente cada mensaje para entender tu situación.' },
  { icon: Clock,      title: '2. Te contacto',       desc: 'Respondo por email o teléfono según prefieras, en menos de 24h.' },
  { icon: ArrowRight, title: '3. Hablamos',          desc: 'Analizamos tu caso sin compromiso y vemos si puedo ayudarte.' },
] as const

export default function GraciasPage() {
  return (
    <>
      {/* ═══════════════ CONFIRMACIÓN ═══════════════ */}
      <section className="relative py-fluid-xl overflow-hidden bg-brand-deep">
        <div className="absolute inset-0 bg-radial-accent opacity-60" />
        <div className="absolute inset-0 bg-grid-soft opacity-30" />
        <Container>
          <div className="relative max-w-3xl mx-auto text-center space-y-6">
            <div className="mb-4 flex justify-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center bg-success/15 border border-success/30 shadow-[0_0_40px_-8px_rgba(52,211,153,0.5)]">
                <CheckCircle className="w-12 h-12 text-success" strokeWidth={2} />
              </div>
            </div>

            <h1 className="headline text-fluid-6xl text-white">
              ¡Mensaje <span className="text-gradient-brand">recibido!</span>
            </h1>

            <p className="text-fluid-xl text-white/85 font-medium">
              Gracias por contactar con WellnessReal.
            </p>

            <p className="text-fluid-lg text-muted leading-relaxed">
              He recibido tu mensaje y te responderé{' '}
              <span className="text-accent font-bold">en menos de 24 horas</span>.
            </p>
          </div>
        </Container>
      </section>

      {/* ═══════════════ QUÉ PASA AHORA ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-dusk">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-fluid-lg">
            <span className="eyebrow justify-center">Siguientes pasos</span>
            <h2 className="headline text-fluid-4xl text-white">¿Qué pasa ahora?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <article key={i} className="surface-card rounded-2xl p-7 text-center hover-lift">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-accent-muted border border-border-strong mx-auto mb-5">
                  <Icon className="w-6 h-6 text-accent" strokeWidth={2} />
                </div>
                <h3 className="text-fluid-lg text-white mb-2 tracking-tight">{title}</h3>
                <p className="text-fluid-sm text-muted leading-relaxed">{desc}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════ MIENTRAS ESPERAS ═══════════════ */}
      <section className="relative py-fluid-lg bg-brand-deep">
        <Container>
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="headline text-fluid-3xl text-white">
              Mientras esperas <span className="text-gradient-brand">mi respuesta…</span>
            </h2>
            <p className="text-fluid-base text-muted leading-relaxed">
              Puedes echar un vistazo al blog donde comparto consejos prácticos sobre entrenamiento y nutrición sin
              complicaciones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link href="/blog" className="btn-ghost text-fluid-base px-8">
                Leer el blog
              </Link>
              <Link href="/" className="btn-brand text-fluid-base px-8">
                Volver al inicio
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ URGENCIA ═══════════════ */}
      <section className="relative py-fluid-lg bg-brand-dusk">
        <Container>
          <div className="max-w-2xl mx-auto surface-card-accent rounded-2xl p-6 text-center">
            <p className="text-fluid-base text-muted">
              <span className="text-accent font-bold">¿Es urgente?</span> Puedes llamarme directamente al{' '}
              <a href="tel:+34633261963" className="text-accent font-bold underline underline-offset-2 hover:opacity-80 transition">
                +34 633 261 963
              </a>
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}
