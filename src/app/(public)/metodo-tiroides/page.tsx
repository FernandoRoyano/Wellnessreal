import Image from 'next/image'
import Link from 'next/link'
import { connection } from 'next/server'
import { ArrowDown, ArrowRight, Check, HelpCircle, ShieldCheck, X } from 'lucide-react'
import Container from '@/components/common/Container'
import ApplicationForm from './ApplicationForm'
import OfferViewTracker from './OfferViewTracker'
import PriorityListForm from './PriorityListForm'
import {
  getThyroidLaunchPhase,
  THYROID_PROGRAM,
  THYROID_PROGRAM_INCLUDES,
  THYROID_PROGRAM_PHASES,
  THYROID_WEEKLY_RHYTHM,
} from '@/lib/metodo-tiroides'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Método BASE Tiroides | Programa de 12 semanas',
  description:
    'Programa acompañado para organizar fuerza, alimentación y descanso cuando tienes hipotiroidismo o Hashimoto. 12 semanas, grupo reducido y plan adaptado.',
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

const NOT_INCLUDED = [
  'Atención ilimitada o respuesta inmediata por WhatsApp.',
  'Cambios diarios del plan o videollamadas individuales cada semana.',
  'Dieta clínica, interpretación de analíticas o modificación de tratamientos.',
  'Promesas de pérdida de peso, energía o resultados médicos concretos.',
] as const

const FAQ = [
  {
    question: '¿Necesito estar en buena forma para empezar?',
    answer:
      'No. El punto de partida se adapta a tu experiencia, disponibilidad y energía. Sí necesitas poder reservar al menos dos momentos semanales para trabajar sobre el plan.',
  },
  {
    question: '¿Qué ocurre si una semana tengo menos energía?',
    answer:
      'El plan contempla alternativas y una versión mínima. El check-in sirve para decidir si conviene mantener, reducir o progresar sin rehacer todo por un mal día.',
  },
  {
    question: '¿Tengo que asistir a todos los directos?',
    answer:
      'Es recomendable participar, pero podrás utilizar la grabación cuando una semana no puedas asistir. Las dos revisiones individuales sí se acuerdan contigo.',
  },
  {
    question: '¿El programa trata el hipotiroidismo?',
    answer:
      'No. Método BASE Tiroides organiza entrenamiento y hábitos. El diagnóstico, la medicación, las analíticas y el tratamiento corresponden a tu equipo sanitario.',
  },
  {
    question: '¿Qué ocurre después de pagar?',
    answer:
      'Completarás el cuestionario de incorporación. Revisaré tu punto de partida y prepararé el primer bloque antes del inicio. Después recibirás acceso al espacio del grupo, el calendario y las instrucciones de la primera semana.',
  },
] as const

export default async function MetodoTiroidesPage() {
  await connection()
  const launchPhase = getThyroidLaunchPhase()
  const primaryCta = launchPhase === 'priority'
    ? 'Entrar en la lista prioritaria'
    : launchPhase === 'applications'
      ? 'Solicitar una plaza'
      : 'Ver la clase gratuita'
  const primaryHref = launchPhase === 'closed' ? '/tiroides/clase' : '#solicitud'

  return (
    <>
      <OfferViewTracker />
      <section className="relative overflow-hidden bg-brand-deep py-[clamp(4rem,8vw,7.5rem)]">
        <div className="absolute inset-0 bg-grid-soft opacity-35" />
        <div className="absolute -right-32 top-12 h-[34rem] w-[34rem] rounded-full bg-accent/10 blur-[120px]" />
        <Container>
          <div className="relative grid items-center gap-fluid-lg lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <span className="eyebrow">
                Acceso por solicitud · recorrido individual de 12 semanas
              </span>
              <h1 className="headline mt-5 text-fluid-5xl leading-[1.02] text-white">
                Doce semanas para construir una rutina que puedas sostener.
                <span className="mt-2 block text-gradient-brand">
                  Incluso cuando tu energía cambia.
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-fluid-lg leading-relaxed text-muted">
                Método BASE Tiroides organiza fuerza, alimentación, descanso y seguimiento alrededor
                de tu vida real. No tratamos la tiroides: construimos contigo la parte que sí puedes
                entrenar.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href={primaryHref} className="btn-brand px-7 py-4 text-fluid-base">
                  {primaryCta} <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#programa"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 text-fluid-sm font-semibold text-white/70 hover:text-white"
                >
                  Ver cómo funciona <ArrowDown className="h-4 w-4" />
                </a>
              </div>
              {launchPhase === 'priority' ? (
                <p className="mt-4 flex items-center gap-2 text-fluid-xs text-subtle">
                  <ShieldCheck className="h-4 w-4 text-accent" /> La lista prioritaria recibe el aviso antes de la apertura del 5 de octubre.
                </p>
              ) : launchPhase === 'applications' ? (
                <>
                  <p className="mt-4 flex items-center gap-2 text-fluid-xs text-subtle">
                    <ShieldCheck className="h-4 w-4 text-accent" /> Solicitar no es pagar. Primero comprobamos si encaja contigo.
                  </p>
                  <p className="mt-2 text-fluid-xs text-subtle">Acceso por solicitud y plazas limitadas para poder revisar cada caso personalmente.</p>
                </>
              ) : (
                <p className="mt-4 text-fluid-xs text-subtle">Las solicitudes de esta edición están cerradas.</p>
              )}
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-accent/20 via-transparent to-brand-purple/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-brand-dusk shadow-2xl">
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/images/fernando-royano-tiroides.webp"
                    alt="Fernando Royano, creador del Método BASE Tiroides"
                    fill
                    priority
                    sizes="(max-width: 1024px) 448px, 38vw"
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dusk via-transparent to-transparent" />
                </div>
                <div className="relative -mt-12 p-6">
                  <p className="text-fluid-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    Con Fernando Royano
                  </p>
                  <p className="mt-2 text-fluid-lg font-semibold leading-snug text-white">
                    14 años convirtiendo “sé lo que debería hacer” en planes que caben en una semana
                    real.
                  </p>
                  <div className="mt-5 grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-5 text-center">
                    <Stat value="12" label="semanas" />
                    <Stat value={String(THYROID_PROGRAM.capacity)} label="plazas máximas" />
                    <Stat value={`${THYROID_PROGRAM.price} €`} label="programa completo" />
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
              El problema rara vez es que no sepas que deberías moverte, comer mejor o descansar. El
              problema es convertir todo eso en decisiones concretas cuando{' '}
              <span className="font-semibold text-accent">
                tu energía, tus horarios y tu cuerpo no responden igual cada semana.
              </span>
            </p>
          </div>
        </Container>
      </section>

      <section id="programa" className="bg-brand-deep py-fluid-xl scroll-mt-24">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="max-w-3xl">
              <span className="eyebrow">Lo que vas a recibir</span>
              <h2 className="headline mt-4 text-fluid-4xl text-white">
                Un sistema acompañado, no una carpeta con rutinas.
              </h2>
              <p className="mt-4 text-fluid-base leading-relaxed text-muted">
                Cada pieza existe para ayudarte a ejecutar, observar y ajustar. Sin convertir tu
                diagnóstico en una identidad ni tu semana en un examen.
              </p>
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

      <section className="bg-brand-deep py-fluid-xl" aria-labelledby="semana-programa">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-fluid-lg lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div>
                <span className="eyebrow">Una semana dentro</span>
                <h2 id="semana-programa" className="headline mt-4 text-fluid-4xl text-white">
                  No tienes que adivinar el siguiente paso.
                </h2>
              </div>
              <p className="max-w-2xl text-fluid-base leading-relaxed text-muted">
                El valor no está en recibir más información. Está en ejecutar una semana razonable,
                observar qué ocurre y utilizar ese contexto para tomar la siguiente decisión.
              </p>
            </div>
            <ol className="mt-10 grid overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-4">
              {THYROID_WEEKLY_RHYTHM.map((item) => (
                <li key={item.step} className="bg-brand-dusk p-6">
                  <span className="text-fluid-xs font-semibold tracking-[0.18em] text-accent">{item.step}</span>
                  <h3 className="mt-4 text-fluid-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-fluid-sm leading-relaxed text-muted">{item.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section className="bg-brand-dusk py-fluid-xl">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <span className="eyebrow justify-center">El recorrido</span>
              <h2 className="headline mt-4 text-fluid-4xl text-white">
                Doce semanas con una función clara.
              </h2>
            </div>
            <div className="relative mt-12 grid gap-6 md:grid-cols-4">
              <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent md:block" />
              {THYROID_PROGRAM_PHASES.map((phase, index) => (
                <article key={phase.weeks} className="relative">
                  <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 bg-brand-deep headline text-fluid-lg text-accent">
                    {index + 1}
                  </span>
                  <p className="mt-5 text-fluid-xs font-semibold uppercase tracking-widest text-accent">
                    {phase.weeks}
                  </p>
                  <h3 className="mt-2 text-fluid-lg font-semibold text-white">{phase.title}</h3>
                  <p className="mt-2 text-fluid-sm leading-relaxed text-muted">
                    {phase.description}
                  </p>
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
          <p className="mx-auto mt-8 max-w-3xl text-center text-fluid-xs leading-relaxed text-subtle">
            El programa no diagnostica, no interpreta analíticas y no modifica tratamientos. Para
            síntomas, medicación y seguimiento clínico debes acudir a tu equipo sanitario.
          </p>
        </Container>
      </section>

      <section className="bg-brand-dusk py-fluid-xl">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-fluid-lg lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <span className="eyebrow">Límites claros</span>
                <h2 className="headline mt-4 text-fluid-4xl text-white">
                  Acompañamiento no significa disponibilidad ilimitada.
                </h2>
                <p className="mt-4 text-fluid-base leading-relaxed text-muted">
                  Definir lo que no incluye el programa protege tu experiencia y permite dedicar
                  tiempo a las decisiones que realmente necesitan revisión.
                </p>
              </div>
              <ul className="grid gap-3">
                {NOT_INCLUDED.map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4 text-fluid-sm leading-relaxed text-white/80">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-white/35" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-brand-deep py-fluid-xl" aria-labelledby="preguntas-programa">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="max-w-3xl">
              <span className="eyebrow"><HelpCircle className="h-4 w-4" /> Antes de solicitar</span>
              <h2 id="preguntas-programa" className="headline mt-4 text-fluid-4xl text-white">
                Preguntas frecuentes.
              </h2>
            </div>
            <div className="mt-9 grid gap-4 md:grid-cols-2">
              {FAQ.map(({ question, answer }) => (
                <article key={question} className="surface-card rounded-2xl p-6">
                  <h3 className="text-fluid-lg font-semibold text-white">{question}</h3>
                  <p className="mt-3 text-fluid-sm leading-relaxed text-muted">{answer}</p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section
        id="solicitud"
        className="relative overflow-hidden bg-brand-dusk py-fluid-xl scroll-mt-20"
      >
        <div className="absolute inset-0 bg-radial-accent opacity-35" />
        <Container>
          <div className="relative mx-auto grid max-w-5xl items-start gap-fluid-lg lg:grid-cols-[0.82fr_1.18fr]">
            <div className="lg:sticky lg:top-28">
              <span className="eyebrow">Acceso individual</span>
              <h2 className="headline mt-4 text-fluid-4xl text-white">
                {launchPhase === 'priority'
                  ? 'Apúntate antes de la apertura.'
                  : launchPhase === 'applications'
                    ? `${THYROID_PROGRAM.duration}. ${THYROID_PROGRAM.price} €.`
                    : 'Solicitudes cerradas.'}
              </h2>
              {launchPhase === 'priority' ? (
                <p className="mt-5 text-fluid-base leading-relaxed text-muted">Recibirás la clase gratuita ahora y el aviso prioritario cuando se abran las solicitudes. Apuntarte no reserva una plaza ni implica ningún pago.</p>
              ) : launchPhase === 'applications' ? (
                <p className="mt-5 text-fluid-base leading-relaxed text-muted">Puedes realizar un pago único o {THYROID_PROGRAM.installmentCount} pagos de {THYROID_PROGRAM.installmentPrice} €. El pago solo se realiza después de hablar contigo y confirmar que el programa encaja. No hay ningún cobro en este formulario.</p>
              ) : (
                <p className="mt-5 text-fluid-base leading-relaxed text-muted">Ya no acepto nuevas solicitudes para este grupo. Puedes ver la clase gratuita y recibir contenidos para futuras ediciones.</p>
              )}
              <p className="mt-4 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 text-fluid-sm text-white/80">
                El recorrido comienza cuando confirmamos tu acceso y aprobamos tu plan. No necesitas esperar a que se forme un grupo.
              </p>
              {launchPhase === 'applications' && <ol className="mt-7 space-y-4">
                {[
                  'Envías tu solicitud.',
                  'La reviso personalmente.',
                  'Hablamos y resolvemos dudas.',
                  'Si encajas y quieres entrar, formalizamos la plaza.',
                ].map((step, index) => (
                  <li key={step} className="flex items-center gap-3 text-fluid-sm text-white/85">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent/35 text-fluid-xs font-semibold text-accent">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>}
            </div>
            {launchPhase === 'priority' ? (
              <PriorityListForm />
            ) : launchPhase === 'applications' ? (
              <ApplicationForm />
            ) : (
              <div className="rounded-[1.75rem] border border-white/10 bg-brand-dusk p-8 text-center shadow-2xl">
                <h3 className="headline text-fluid-2xl text-white">Continúa con la clase gratuita</h3>
                <p className="mt-3 text-fluid-sm leading-relaxed text-muted">Te avisaré cuando haya una nueva edición disponible.</p>
                <Link href="/tiroides/clase" className="btn-brand mt-6 px-7 py-4">Ver la clase gratuita <ArrowRight className="h-4 w-4" /></Link>
              </div>
            )}
          </div>
        </Container>
      </section>

      <section className="bg-brand-deep py-fluid-lg">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="headline text-fluid-3xl text-white">
              ¿Todavía no sabes si necesitas el programa?
            </h2>
            <p className="mt-3 text-fluid-base text-muted">
              Empieza por el test gratuito y descubre qué merece la pena priorizar en tu situación.
            </p>
            <Link href="/tiroides#test" className="btn-ghost mt-6 px-7">
              Hacer el test primero <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <strong className="block text-fluid-lg text-white">{value}</strong>
      <span className="text-[0.7rem] text-subtle">{label}</span>
    </div>
  )
}

function Audience({
  title,
  items,
  positive = false,
}: {
  title: string
  items: readonly string[]
  positive?: boolean
}) {
  const Icon = positive ? Check : X
  return (
    <article
      className={`rounded-2xl border p-7 ${positive ? 'border-success/25 bg-success/[0.05]' : 'border-white/10 bg-white/[0.025]'}`}
    >
      <h2 className="headline text-fluid-2xl text-white">{title}</h2>
      <ul className="mt-6 space-y-4">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-fluid-sm leading-relaxed text-white/80"
          >
            <Icon
              className={`mt-0.5 h-4 w-4 shrink-0 ${positive ? 'text-success' : 'text-white/35'}`}
            />
            {item}
          </li>
        ))}
      </ul>
    </article>
  )
}
