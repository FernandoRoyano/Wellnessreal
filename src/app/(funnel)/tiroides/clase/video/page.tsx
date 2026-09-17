import type { Metadata } from 'next'
import Image from 'next/image'
import { Check, Dumbbell, HeartPulse, RotateCcw, ShieldCheck } from 'lucide-react'
import ThyroidClassVideo from './ThyroidClassVideo'
import ThyroidVslCta from './ThyroidVslCta'

export const metadata: Metadata = {
  title: 'Tu clase de tiroides | WellnessReal',
  description: 'Clase gratuita sobre entrenamiento, alimentación y descanso cuando tienes hipotiroidismo.',
  robots: { index: false, follow: false },
}

const VIDEO_URL = process.env.NEXT_PUBLIC_THYROID_CLASS_VIDEO_URL || ''

const PILLARS = [
  { icon: Dumbbell, number: '01', title: 'Fuerza adaptable', text: 'Una estructura que pueda progresar y también reducirse cuando la semana lo exige.' },
  { icon: HeartPulse, number: '02', title: 'Energía con contexto', text: 'La energía orienta el ajuste del plan; no se utiliza para juzgarte ni diagnosticarte.' },
  { icon: RotateCcw, number: '03', title: 'Continuidad real', text: 'Una versión mínima evita que una semana difícil borre todo lo que ya habías construido.' },
]

export default function ThyroidClassVideoPage() {
  return (
    <main className="min-h-screen bg-brand-night text-white">
      <header className="border-b border-white/[0.07]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <Image src="/images/logos/WR_AUX_normal_bg.png" alt="WellnessReal" width={4167} height={507} priority className="h-auto w-[min(14rem,56vw)]" />
          <span className="hidden text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/35 sm:block">Clase privada</span>
        </div>
      </header>

      <section className="relative overflow-hidden px-5 pb-16 pt-10 sm:px-8 md:pt-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(102,45,145,.38),transparent_52%)]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-accent">Antes de cambiar otro plan, mira esto</p>
          <h1 className="headline mx-auto mt-4 max-w-4xl text-[clamp(2.1rem,6vw,4.7rem)] leading-[1] tracking-[-0.04em]">Cómo dejar de empezar de cero cuando tu energía cambia</h1>
          <p className="mx-auto mt-5 max-w-2xl text-fluid-base leading-relaxed text-white/58">Una explicación práctica del enfoque BASE aplicado al entrenamiento con hipotiroidismo o Hashimoto.</p>
          <div className="mt-9"><ThyroidClassVideo url={VIDEO_URL} /></div>
          <p className="mt-4 text-fluid-xs text-white/35">Puedes pausar y continuar cuando quieras · Duración prevista: 15–17 minutos</p>
        </div>
      </section>

      <section className="border-y border-white/[0.07] bg-white/[0.025] px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-accent">El cambio de enfoque</p>
              <h2 className="headline mt-4 text-fluid-4xl leading-tight">No necesitas hacerlo perfecto. Necesitas saber qué ajustar.</h2>
              <p className="mt-5 text-fluid-base leading-relaxed text-white/58">El Método BASE organiza las decisiones que suelen quedar sueltas: cuánto entrenar, qué hacer cuando baja la energía y cómo mantener una estructura sin recurrir a extremos.</p>
            </div>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
              {PILLARS.map(({ icon: Icon, number, title, text }) => (
                <article key={title} className="bg-brand-night p-6 sm:p-7">
                  <div className="flex items-center justify-between"><Icon className="h-5 w-5 text-accent" /><span className="font-mono text-[0.68rem] text-white/25">{number}</span></div>
                  <h3 className="mt-8 text-fluid-lg font-semibold">{title}</h3>
                  <p className="mt-3 text-fluid-sm leading-relaxed text-white/50">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 md:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-10 rounded-[2rem] border border-accent/20 bg-accent/[0.055] p-7 sm:p-10 md:grid-cols-[1fr_auto] md:p-12">
          <div>
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-accent">Siguiente paso</p>
            <h2 className="headline mt-3 text-fluid-3xl">¿Quieres que revise si este método encaja contigo?</h2>
            <p className="mt-4 max-w-2xl text-fluid-sm leading-relaxed text-white/58">Cuéntame tu punto de partida. Revisaré personalmente la solicitud antes de hablar de pago o reservar una plaza.</p>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-fluid-xs text-white/65">
              {['Solicitud de 2 minutos', 'Sin pago ahora', 'Respuesta personal'].map((item) => <li key={item} className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent" />{item}</li>)}
            </ul>
          </div>
          <ThyroidVslCta position="primary" />
        </div>
      </section>

      <section className="border-t border-white/[0.07] px-5 py-12 text-center sm:px-8">
        <ShieldCheck className="mx-auto h-5 w-5 text-white/35" />
        <p className="mx-auto mt-4 max-w-2xl text-fluid-xs leading-relaxed text-white/38">Este contenido explica entrenamiento y hábitos; no diagnostica, no modifica medicación y no sustituye el seguimiento médico. Si tus síntomas cambian o te preocupan, consulta con el profesional sanitario que conoce tu caso.</p>
        <div className="mt-7 flex justify-center"><ThyroidVslCta position="final" /></div>
      </section>
    </main>
  )
}
