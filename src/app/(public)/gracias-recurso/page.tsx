import Container from '@/components/common/Container'
import Link from 'next/link'
import { CheckCircle, Download, MessageCircle, ArrowRight, BookOpen, PenLine } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Descarga tu Guía | WellnessReal',
  description: 'Descarga tu guía gratuita de fitness real.',
  robots: 'noindex, nofollow',
}

const NEXT_STEPS = [
  {
    icon: BookOpen,
    title: 'Léela con calma',
    desc: 'No es un PDF de 100 páginas. Es directo y al grano. Puedes leerla en 10 minutos.',
  },
  {
    icon: PenLine,
    title: 'Aplica una cosa',
    desc: 'No intentes cambiar todo a la vez. Elige UNA idea de la guía y ponla en práctica esta semana.',
  },
  {
    icon: MessageCircle,
    title: 'Cuéntame qué tal',
    desc: 'Si tienes dudas o quieres contarme tu caso, responde al email o escríbeme por aquí.',
  },
] as const

export default function GraciasRecursoPage() {
  return (
    <>
      {/* ═══════════════ CONFIRMACIÓN + DESCARGA ═══════════════ */}
      <section className="relative py-fluid-xl overflow-hidden bg-brand-deep">
        <div className="absolute inset-0 bg-radial-accent opacity-60" />
        <div className="absolute inset-0 bg-grid-soft opacity-30" />
        <Container>
          <div className="relative max-w-3xl mx-auto text-center space-y-6">
            <div className="mb-2 flex justify-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center bg-success/15 border border-success/30 shadow-[0_0_40px_-8px_rgba(52,211,153,0.5)]">
                <CheckCircle className="w-12 h-12 text-success" strokeWidth={2} />
              </div>
            </div>

            <h1 className="headline text-fluid-5xl text-white">
              ¡Tu guía <span className="text-gradient-brand">está lista!</span>
            </h1>

            <p className="text-fluid-xl text-white/85 font-medium">
              Descárgala ahora y empieza a entrenar con sentido.
            </p>

            <div className="pt-4">
              <a
                href="/guia-wellness-real.pdf"
                download
                className="btn-brand text-fluid-lg px-8 py-5"
              >
                <Download className="w-5 h-5" />
                Descargar guía gratis
              </a>
            </div>

            <p className="text-fluid-sm text-subtle">PDF · Lectura de 10 minutos</p>
          </div>
        </Container>
      </section>

      {/* ═══════════════ ¿QUIERES IR MÁS RÁPIDO? ═══════════════ */}
      <section className="relative py-fluid-lg bg-brand-dusk">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <Container>
          <div className="max-w-3xl mx-auto surface-card-accent rounded-2xl p-fluid-md text-center space-y-5">
            <h2 className="headline text-fluid-3xl text-white">
              ¿Quieres ir <span className="text-gradient-brand">más rápido?</span>
            </h2>
            <p className="text-fluid-lg text-muted max-w-xl mx-auto leading-relaxed">
              La guía te da las bases. Pero si quieres un{' '}
              <span className="text-accent font-semibold">plan 100% personalizado</span> a tu situación, podemos hablar.
            </p>
            <div className="pt-2">
              <Link href="/valoracion" className="btn-brand text-fluid-base px-8">
                Solicitar valoración gratuita
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-fluid-xs text-subtle">
              Sin compromiso. Solo una conversación para ver si puedo ayudarte.
            </p>
          </div>
        </Container>
      </section>

      {/* ═══════════════ MIENTRAS TANTO ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-deep">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-fluid-lg">
            <span className="eyebrow justify-center">Mientras tanto</span>
            <h2 className="headline text-fluid-3xl text-white">Lee la guía y…</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {NEXT_STEPS.map(({ icon: Icon, title, desc }, i) => (
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

      {/* ═══════════════ BLOG CTA ═══════════════ */}
      <section className="relative py-fluid-lg bg-brand-dusk">
        <Container>
          <div className="max-w-2xl mx-auto text-center space-y-5">
            <h2 className="headline text-fluid-2xl text-white">
              ¿Quieres más <span className="text-gradient-brand">contenido como este?</span>
            </h2>
            <p className="text-fluid-base text-muted leading-relaxed">
              En el blog comparto artículos con consejos prácticos sobre entrenamiento y nutrición. Sin rollos, sin
              postureo.
            </p>
            <div className="pt-2">
              <Link href="/blog" className="btn-ghost text-fluid-base px-8">
                Ver el blog
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ CONTACTO DIRECTO ═══════════════ */}
      <section className="relative py-fluid-lg bg-brand-deep">
        <Container>
          <div className="max-w-2xl mx-auto surface-card rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="shrink-0 w-10 h-10 rounded-xl bg-accent-muted border border-border-strong flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-accent" />
              </span>
              <span className="text-fluid-sm text-muted">
                ¿Alguna duda?{' '}
                <a href="mailto:info@wellnessreal.es" className="text-accent font-semibold hover:underline">
                  info@wellnessreal.es
                </a>
              </span>
            </div>
            <Link href="/" className="btn-ghost text-fluid-sm px-5 py-2.5 shrink-0">
              Volver al inicio
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
