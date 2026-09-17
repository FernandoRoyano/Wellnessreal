import type { Metadata } from 'next'
import Image from 'next/image'
import { Check, Clock3, Dumbbell, ShieldCheck } from 'lucide-react'
import ThyroidClassForm from './ThyroidClassForm'

export const metadata: Metadata = {
  title: 'Clase gratuita: entrenamiento y tiroides | WellnessReal',
  description: 'Aprende a organizar fuerza, alimentación y descanso cuando tienes hipotiroidismo, sin planes extremos ni falsas promesas.',
  robots: { index: false, follow: false },
}

const LEARNINGS = [
  'Por qué un plan genérico deja de servirte cuando tu energía cambia.',
  'Cómo adaptar la fuerza sin confundir adaptación con dejar de avanzar.',
  'Qué sistema usar para no empezar de cero después de una semana difícil.',
]

export default function ThyroidClassPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-night text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(102,45,145,.28),transparent_36%),radial-gradient(circle_at_84%_82%,rgba(252,238,33,.07),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:64px_64px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-7 sm:px-8 lg:py-10">
        <header className="flex items-center justify-center border-b border-white/[0.07] pb-6 lg:justify-start">
          <Image src="/images/logos/WR_AUX_normal_bg.png" alt="WellnessReal" width={4167} height={507} priority className="h-auto w-[min(15rem,62vw)]" />
        </header>

        <section className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.12fr_.88fr] lg:gap-16 lg:py-14">
          <div>
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-accent"><Clock3 className="h-3.5 w-3.5" /> Clase de 15 minutos</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.7rem] font-semibold text-white/65"><ShieldCheck className="h-3.5 w-3.5" /> Sin promesas milagro</span>
            </div>
            <h1 className="headline max-w-3xl text-[clamp(2.5rem,7vw,5.7rem)] leading-[0.97] tracking-[-0.045em] text-white">
              Tu tiroides no necesita otro plan <span className="text-accent">imposible de mantener.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-fluid-lg leading-relaxed text-white/68">
              Te explico cómo organizar entrenamiento, alimentación y descanso cuando tienes hipotiroidismo o Hashimoto, incluso si tu energía no se comporta igual todas las semanas.
            </p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {LEARNINGS.map((learning) => (
                <li key={learning} className="flex items-start gap-3 text-fluid-sm leading-relaxed text-white/80">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-brand-night"><Check className="h-3.5 w-3.5 stroke-[3]" /></span>
                  {learning}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6 text-fluid-xs leading-relaxed text-white/45">
              <Dumbbell className="h-5 w-5 shrink-0 text-accent" /> Formación sobre entrenamiento y hábitos. Tu diagnóstico, medicación y analíticas corresponden a tus profesionales sanitarios.
            </div>
          </div>

          <aside className="mx-auto w-full max-w-md lg:mx-0 lg:ml-auto">
            <div className="mb-4 px-2 text-center">
              <p className="font-semibold text-white">Recibe acceso inmediato</p>
              <p className="mt-1 text-fluid-sm text-white/50">Sin teléfono. Sin tarjeta. Sin compromiso.</p>
            </div>
            <ThyroidClassForm />
          </aside>
        </section>
      </div>
    </main>
  )
}
