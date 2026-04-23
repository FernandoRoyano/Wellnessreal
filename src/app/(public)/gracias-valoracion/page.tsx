import Container from '@/components/common/Container'
import Link from 'next/link'
import { CheckCircle, Clock, MessageCircle, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Valoración Recibida | WellnessReal',
  robots: { index: false, follow: false },
}

const STEPS = [
  {
    icon: Clock,
    title: 'Analizo tu caso',
    description: 'Reviso tus respuestas, tu situación y tus objetivos para entender qué necesitas exactamente.',
  },
  {
    icon: MessageCircle,
    title: 'Te contacto en menos de 24h',
    description: 'Te escribo por WhatsApp o email con mi análisis y una propuesta de plan personalizado.',
  },
  {
    icon: CheckCircle,
    title: 'Empezamos cuando tú quieras',
    description: 'Sin presión. Te explico todo, resuelvo tus dudas, y si encajamos, arrancamos.',
  },
] as const

export default function GraciasValoracionPage() {
  return (
    <>
      {/* ═══════════════ CONFIRMACIÓN ═══════════════ */}
      <section className="relative py-fluid-xl overflow-hidden bg-brand-deep">
        <div className="absolute inset-0 bg-radial-accent opacity-60" />
        <div className="absolute inset-0 bg-grid-soft opacity-30" />
        <Container>
          <div className="relative max-w-2xl mx-auto text-center space-y-6">
            <div className="mb-2 flex justify-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-success/15 border border-success/30 shadow-[0_0_40px_-8px_rgba(52,211,153,0.5)]">
                <CheckCircle className="w-10 h-10 text-success" strokeWidth={2} />
              </div>
            </div>

            <h1 className="headline text-fluid-5xl text-white">
              Valoración <span className="text-gradient-brand">recibida</span>
            </h1>

            <p className="text-fluid-lg text-muted leading-relaxed">
              He recibido tu información. Ahora me toca a mí analizarla y preparar una propuesta adaptada a tu situación
              real.
            </p>
          </div>
        </Container>
      </section>

      {/* ═══════════════ QUÉ PASA AHORA ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-dusk">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="text-center space-y-4 mb-fluid-md">
              <span className="eyebrow justify-center">Siguientes pasos</span>
              <h2 className="headline text-fluid-3xl text-white">¿Qué pasa ahora?</h2>
            </div>

            <div className="space-y-4">
              {STEPS.map(({ icon: Icon, title, description }, i) => (
                <article key={i} className="surface-card rounded-2xl p-6 flex items-start gap-4 hover-lift">
                  <span className="shrink-0 w-12 h-12 rounded-xl bg-accent-muted border border-border-strong flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" strokeWidth={2} />
                  </span>
                  <div>
                    <h3 className="text-fluid-lg text-white font-semibold mb-1 tracking-tight">{title}</h3>
                    <p className="text-fluid-sm text-muted leading-relaxed">{description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ BLOG CTA ═══════════════ */}
      <section className="relative py-fluid-lg bg-brand-deep">
        <Container>
          <div className="text-center max-w-2xl mx-auto space-y-5">
            <p className="text-fluid-base text-muted">Mientras tanto, echa un vistazo al blog:</p>
            <Link href="/blog" className="btn-ghost text-fluid-base px-8">
              Ver artículos del blog
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
