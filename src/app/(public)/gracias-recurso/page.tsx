import Container from '@/components/common/Container'
import GuideDownloadLink from '@/components/common/GuideDownloadLink'
import Link from 'next/link'
import { CheckCircle, Download, MessageCircle, ArrowRight, BookOpen, PenLine, Activity } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Descarga tu Guía | WellnessReal',
  description: 'Descarga Fuerza para la vida real, tu guía gratuita de entrenamiento y alimentación para la salud.',
  robots: 'noindex, nofollow',
}

const NEXT_STEPS = [
  {
    icon: BookOpen,
    title: 'Entiende las bases',
    desc: 'Empieza por las páginas 3 y 4: movimiento, series, repeticiones y esfuerzo. No necesitas leer toda la guía de una vez.',
  },
  {
    icon: PenLine,
    title: 'Elige un primer paso',
    desc: 'Revisa la sesión de ejemplo de la página 12 y elige variantes que ya sepas hacer con control. Si un movimiento te resulta nuevo, pide ayuda para aprenderlo.',
  },
  {
    icon: MessageCircle,
    title: 'Ponlo en tu semana',
    desc: 'Rellena el plan de la página 19 con tus momentos disponibles y un cambio de alimentación. Al terminar la semana, anota qué encajó y qué ajustarás.',
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
              Fuerza para la vida real: <span className="text-gradient-brand">tu guía está lista.</span>
            </h1>

            <p className="text-fluid-xl text-white/85 font-medium">
              Descárgala ahora y empieza a entrenar con sentido.
            </p>

            <div className="pt-4">
              <GuideDownloadLink
                resource="guia"
                placement="confirmation"
                className="btn-brand text-fluid-lg px-8 py-5"
              >
                <Download className="w-5 h-5" />
                Descargar guía gratis
              </GuideDownloadLink>
            </div>

            <p className="text-fluid-sm text-subtle">PDF · 20 páginas · Ejercicios, variantes y plan rellenable</p>
            <p className="text-fluid-sm text-muted">Puedes guardar una copia aquí. Si esperabas el correo y no lo ves, revisa también promociones y spam.</p>
          </div>
        </Container>
      </section>

      {/* ═══════════════ MIENTRAS TANTO ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-deep">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-fluid-lg">
            <span className="eyebrow justify-center">Tu primer paso</span>
            <h2 className="headline text-fluid-3xl text-white">Empieza por una decisión concreta.</h2>
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

      {/* ═══════════════ ¿QUIERES IR MÁS RÁPIDO? — DOS CAMINOS ═══════════════ */}
      <section className="relative py-fluid-lg bg-brand-dusk">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-fluid-md">
            <h2 className="headline text-fluid-3xl text-white">
              ¿Quieres <span className="text-gradient-brand">adaptarlo a tu caso?</span>
            </h2>
            <p className="text-fluid-lg text-muted max-w-xl mx-auto leading-relaxed">
              Puedes empezar con la guía por tu cuenta. Si necesitas orientación o un plan individual, estas son las opciones.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {/* Especialización prioritaria: tiroides */}
            <article className="surface-card rounded-2xl p-7 flex flex-col text-center hover-lift">
              <span className="w-14 h-14 rounded-xl flex items-center justify-center bg-accent-muted border border-border-strong mx-auto mb-4">
                <Activity className="w-6 h-6 text-accent" strokeWidth={2} />
              </span>
              <h3 className="text-fluid-xl text-white mb-2 tracking-tight">Tengo hipotiroidismo o Hashimoto</h3>
              <p className="text-fluid-sm text-muted leading-relaxed mb-5">
                Haz el test gratuito y descubre qué parte de tu entrenamiento y tus hábitos merece
                atención primero. <span className="text-white font-semibold">No es un diagnóstico</span>.
              </p>
              <Link href="/tiroides#test" className="btn-brand text-fluid-base px-6 mt-auto">
                Hacer el test gratuito
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-fluid-xs text-subtle mt-3">Orientación inicial · 2 minutos</p>
            </article>

            {/* Alternativa de alto contacto: entrenamiento individual */}
            <article className="surface-card rounded-2xl p-7 flex flex-col text-center hover-lift">
              <span className="w-14 h-14 rounded-xl flex items-center justify-center bg-accent-muted border border-border-strong mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-accent" strokeWidth={2} />
              </span>
              <h3 className="text-fluid-xl text-white mb-2 tracking-tight">Prefiero que hablemos</h3>
              <p className="text-fluid-sm text-muted leading-relaxed mb-5">
                Cuéntame tu caso y te digo honestamente si puedo ayudarte y cómo. Una conversación,{' '}
                <span className="text-white font-semibold">sin compromiso</span>.
              </p>
              <Link href="/servicios/entrenamiento-online" className="btn-ghost text-fluid-base px-6 mt-auto">
                Ver entrenamiento personalizado
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-fluid-xs text-subtle mt-3">Proceso individual · 12 semanas</p>
            </article>
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
