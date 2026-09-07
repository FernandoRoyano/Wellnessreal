import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowRight, Check, ShieldCheck, X } from 'lucide-react'
import Container from '@/components/common/Container'
import ApplicationForm from './ApplicationForm'
import { THYROID_PROGRAM, THYROID_PROGRAM_INCLUDES, THYROID_PROGRAM_PHASES } from '@/lib/metodo-tiroides'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Método BASE Tiroides | Programa de 12 semanas',
  description: 'Programa acompañado para organizar fuerza, alimentación y descanso cuando tienes hipotiroidismo o Hashimoto. 12 semanas, grupo reducido y plan adaptado.',
  path: '/metodo-tiroides',
  keywords: [
    'programa entrenamiento hipotiroidismo',
    'entrenar con Hashimoto',
    'Método BASE Tiroides',
    'plan de fuerza hipotiroidismo',
  ],
})

const FITS = [
  'Tienes hipotiroidismo o Hashimoto diagnosticado y seguimiento sanitario.',
  'Quieres entrenar fuerza, pero no sabes cómo adaptarla a tu energía.',
  'Puedes reservar al menos dos momentos semanales para trabajar sobre el plan.',
  'Buscas estructura, seguimiento y criterios que puedas mantener después.',
] as const

const DOES_NOT_FIT = [
  'Buscas modificar tu medicación o interpretar analíticas.',
  'Quieres una dieta clínica, una cura o una promesa rápida de pérdida de peso.',
  'Necesitas atención sanitaria urgente o tratamiento de una patología.',
] as const

export default function MetodoTiroidesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-deep py-[clamp(4rem,8vw,7.5rem)]">
        <div className="absolute inset-0 bg-grid-soft opacity-35" />
        <div className="absolute -right-32 top-12 h-[34rem] w-[34rem] rounded-full bg-accent/10 blur-[120px]" />
        <Container>
          <div className="relative grid items-center gap-fluid-lg lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <span className="eyebrow">Programa acompañado · 12 semanas</span>
              <h1 className="headline mt-5 text-fluid-5xl leading-[1.02] text-white">
                Tu tiroides no necesita otra promesa.
                <span className="mt-2 block text-gradient-brand">Tú necesitas un plan que se pueda ajustar.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-fluid-lg leading-relaxed text-muted">
                Método BASE Tiroides organiza fuerza, alimentación, descanso y seguimiento alrededor de tu vida real. No tratamos la tiroides: construimos contigo la parte que sí puedes entrenar.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href="#solicitud" className="btn-brand px-7 py-4 text-fluid-base">Solicitar una plaza <ArrowRight className="h-4 w-4" /></a>
                <a href="#programa" className="inline-flex items-center justify-center gap-2 px-5 py-3 text-fluid-sm font-semibold text-white/70 hover:text-white">Ver cómo funciona <ArrowDown className="h-4 w-4" /></a>
              </div>
              <p className="mt-4 flex items-center gap-2 text-fluid-xs text-subtle"><ShieldCheck className="h-4 w-4 text-accent" /> Solicitar no es pagar. Primero comprobamos si encaja contigo.</p>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-accent/20 via-transparent to-brand-purple/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-brand-dusk shadow-2xl">
                <div className="relative aspect-[4/3]">
                  <Image src="/images/fernando-royano-about.jpg" alt="Fernando Royano, creador del Método BASE Tiroides" fill priority sizes="(max-width: 1024px) 448px, 38vw" className="object-cover object-top" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dusk via-transparent to-transparent" />
                </div>
                <div className="relative -mt-12 p-6">
                  <p className="text-fluid-xs font-semibold uppercase tracking-[0.18em] text-accent">Con Fernando Royano</p>
                  <p className="mt-2 text-fluid-lg font-semibold leading-snug text-white">14 años convirtiendo “sé lo que debería hacer” en planes que caben en una semana real.</p>
                  <div className="mt-5 grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-5 text-center">
                    <Stat value="12" label="semanas" /><Stat value="8–12" label="personas" /><Stat value="249 €" label="pago único" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-brand-dusk py-fluid-lg">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-fluid-xl leading-relaxed text-white/90">
              El problema rara vez es que no sepas que deberías moverte, comer mejor o descansar. El problema es convertir todo eso en decisiones concretas cuando <span className="font-semibold text-accent">tu energía, tus horarios y tu cuerpo no responden igual cada semana.</span>
            </p>
          </div>
        </Container>
      </section>

      <section id="programa" className="bg-brand-deep py-fluid-xl scroll-mt-24">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="max-w-3xl">
              <span className="eyebrow">Lo que vas a recibir</span>
              <h2 className="headline mt-4 text-fluid-4xl text-white">Un sistema acompañado, no una carpeta con rutinas.</h2>
              <p className="mt-4 text-fluid-base leading-relaxed text-muted">Cada pieza existe para ayudarte a ejecutar, observar y ajustar. Sin convertir tu diagnóstico en una identidad ni tu semana en un examen.</p>
            </div>
            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
              {THYROID_PROGRAM_INCLUDES.map(({ icon: Icon, title, description }) => (
                <article key={title} className="bg-brand-dusk p-6">
                  <Icon className="h-6 w-6 text-accent" />
                  <h3 className="mt-5 text-fluid-lg font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-fluid-sm leading-relaxed text-muted">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-brand-dusk py-fluid-xl">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <span className="eyebrow justify-center">El recorrido</span>
              <h2 className="headline mt-4 text-fluid-4xl text-white">Doce semanas con una función clara.</h2>
            </div>
            <div className="relative mt-12 grid gap-6 md:grid-cols-4">
              <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent md:block" />
              {THYROID_PROGRAM_PHASES.map((phase, index) => (
                <article key={phase.weeks} className="relative">
                  <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 bg-brand-deep headline text-fluid-lg text-accent">{index + 1}</span>
                  <p className="mt-5 text-fluid-xs font-semibold uppercase tracking-widest text-accent">{phase.weeks}</p>
                  <h3 className="mt-2 text-fluid-lg font-semibold text-white">{phase.title}</h3>
                  <p className="mt-2 text-fluid-sm leading-relaxed text-muted">{phase.description}</p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-brand-deep py-fluid-xl">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            <Audience title="Encaja contigo si…" items={FITS} positive />
            <Audience title="No es lo que necesitas si…" items={DOES_NOT_FIT} />
          </div>
          <p className="mx-auto mt-8 max-w-3xl text-center text-fluid-xs leading-relaxed text-subtle">El programa no diagnostica, no interpreta analíticas y no modifica tratamientos. Para síntomas, medicación y seguimiento clínico debes acudir a tu equipo sanitario.</p>
        </Container>
      </section>

      <section id="solicitud" className="relative overflow-hidden bg-brand-dusk py-fluid-xl scroll-mt-20">
        <div className="absolute inset-0 bg-radial-accent opacity-35" />
        <Container>
          <div className="relative mx-auto grid max-w-5xl items-start gap-fluid-lg lg:grid-cols-[0.82fr_1.18fr]">
            <div className="lg:sticky lg:top-28">
              <span className="eyebrow">Primera edición</span>
              <h2 className="headline mt-4 text-fluid-4xl text-white">{THYROID_PROGRAM.duration}. {THYROID_PROGRAM.price} €.</h2>
              <p className="mt-5 text-fluid-base leading-relaxed text-muted">Pago único después de hablar contigo y confirmar que el programa encaja. No hay cobro en este formulario.</p>
              <ol className="mt-7 space-y-4">
                {['Envías tu solicitud.', 'La reviso personalmente.', 'Hablamos y resolvemos dudas.', 'Si encajas y quieres entrar, formalizamos la plaza.'].map((step, index) => (
                  <li key={step} className="flex items-center gap-3 text-fluid-sm text-white/85"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent/35 text-fluid-xs font-semibold text-accent">{index + 1}</span>{step}</li>
                ))}
              </ol>
            </div>
            <ApplicationForm />
          </div>
        </Container>
      </section>

      <section className="bg-brand-deep py-fluid-lg">
        <Container><div className="mx-auto max-w-3xl text-center"><h2 className="headline text-fluid-3xl text-white">¿Todavía no sabes si necesitas el programa?</h2><p className="mt-3 text-fluid-base text-muted">Empieza por el test gratuito y descubre qué merece la pena priorizar en tu situación.</p><Link href="/tiroides#test" className="btn-ghost mt-6 px-7">Hacer el test primero <ArrowRight className="h-4 w-4" /></Link></div></Container>
      </section>
    </>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return <div><strong className="block text-fluid-lg text-white">{value}</strong><span className="text-[0.7rem] text-subtle">{label}</span></div>
}

function Audience({ title, items, positive = false }: { title: string; items: readonly string[]; positive?: boolean }) {
  const Icon = positive ? Check : X
  return <article className={`rounded-2xl border p-7 ${positive ? 'border-success/25 bg-success/[0.05]' : 'border-white/10 bg-white/[0.025]'}`}><h2 className="headline text-fluid-2xl text-white">{title}</h2><ul className="mt-6 space-y-4">{items.map((item) => <li key={item} className="flex items-start gap-3 text-fluid-sm leading-relaxed text-white/80"><Icon className={`mt-0.5 h-4 w-4 shrink-0 ${positive ? 'text-success' : 'text-white/35'}`} />{item}</li>)}</ul></article>
}
