import Container from '@/components/common/Container'
import Image from 'next/image'
import { CheckCircle, X, ArrowRight, Sparkles, ShieldCheck, Clock3, BadgeCheck } from 'lucide-react'
import TiroidesConversionPanel from '@/components/tiroides/TiroidesConversionPanel'

const WHATS_INSIDE = [
  'Tu prioridad real entre fuerza, alimentación, descanso y seguimiento.',
  'Los frenos que pueden estar dispersando tu esfuerzo.',
  'Un siguiente paso concreto según tu situación y objetivo.',
] as const

const IS_FOR = [
  'Tienes hipotiroidismo o Hashimoto y quieres volver a entrenar con confianza.',
  'Te cuesta organizar la fuerza, la alimentación y el descanso de forma sostenible.',
  'Estás cansada de milagros, detox y mensajes contradictorios.',
  'Quieres saber qué merece la pena priorizar en tu situación.',
] as const

const IS_NOT_FOR = [
  'Buscas un diagnóstico, interpretar analíticas o modificar tu medicación.',
  'Buscas una cura, una dieta exprés o una promesa hormonal.',
  'No quieres hacer cambios progresivos en entrenamiento y hábitos.',
] as const

const PRIORIDADES = [
  { t: 'Fuerza', d: 'Una progresión adaptada a tu punto de partida, no más ejercicio por castigo.' },
  { t: 'Hábitos', d: 'Alimentación y descanso que puedas sostener sin perseguir la perfección.' },
  { t: 'Seguimiento', d: 'Revisar qué funciona y ajustar el plan según tu evolución real.' },
  { t: 'Contexto médico', d: 'Tu diagnóstico, medicación y analíticas siempre con tu profesional sanitario.' },
] as const

// "Enemigo sin enemigos": el consejo de siempre vs lo que de verdad mueve la aguja.
const CONSEJO_VS = [
  { mal: 'Hacer cada vez más para compensar.', bien: 'Elegir una dosis de entrenamiento que puedas recuperar y sostener.' },
  { mal: 'Usar el cardio como único plan.', bien: 'Entrenar fuerza con una progresión adaptada a ti.' },
  { mal: 'Perseguir detox y suplementos milagro.', bien: 'Construir hábitos y consultar la parte médica con tu profesional sanitario.' },
  { mal: 'Juzgarlo todo por el peso diario.', bien: 'Observar también fuerza, adherencia, medidas y cómo te sientes.' },
] as const

export default function TiroidesPage() {
  return (
    <>
      {/* ═══════════════ HERO + TEST ═══════════════ */}
      <section className="relative overflow-hidden bg-brand-deep py-[clamp(3.5rem,7vw,6.5rem)]">
        <div className="absolute inset-0 bg-radial-accent opacity-60" />
        <div className="absolute inset-0 bg-grid-soft opacity-40" />
        <div className="absolute -right-24 top-16 h-96 w-96 rounded-full bg-accent/10 blur-[100px]" />
        <Container>
          <div className="relative grid items-center gap-fluid-lg lg:grid-cols-[1.06fr_0.94fr]">
            {/* Copy */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-subtle bg-accent-muted backdrop-blur-sm animate-fade-in">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span className="text-fluid-xs font-semibold tracking-wider uppercase text-accent">
                  Test gratis · 1 minuto
                </span>
              </div>

              <h1 className="headline text-fluid-5xl text-white animate-fade-up">
                No necesitas hacer más.
                <br />
                <span className="text-gradient-brand">Necesitas saber qué priorizar.</span>
              </h1>

              <p className="max-w-2xl text-fluid-lg text-muted leading-relaxed">
                Si tienes hipotiroidismo o Hashimoto, el entrenamiento no debería sumar más confusión.{' '}
                <span className="text-white font-semibold">Haz el test</span> y descubre qué merece la pena priorizar
                ahora en tu fuerza, hábitos y seguimiento.
              </p>

              <ul className="space-y-3">
                {WHATS_INSIDE.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-fluid-base text-white/85">
                    <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center">
                      <CheckCircle className="w-3.5 h-3.5 text-accent" strokeWidth={2.2} />
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-3 border-t border-white/10 pt-5">
                <Image
                  src="/images/fernando-royano-about.jpg"
                  alt="Fernando Royano, entrenador de WellnessReal"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full border-2 border-accent/50 object-cover object-top"
                />
                <div>
                  <p className="text-fluid-sm font-semibold text-white">Diseñado por Fernando Royano</p>
                  <p className="text-fluid-xs text-subtle">Graduado en CAFYD · 14 años de experiencia · +100 clientes</p>
                </div>
              </div>
            </div>

            {/* Test (o formulario de la guía como fallback) */}
            <div id="test" className="relative scroll-mt-28">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-accent/20 via-transparent to-brand-purple/20 blur-xl" />
              <div className="relative">
                <TiroidesConversionPanel />
              </div>
            </div>
          </div>

          <div className="relative mt-fluid-md grid grid-cols-1 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 backdrop-blur-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              { icon: Clock3, label: '1 minuto', detail: 'Recorrido breve y adaptativo' },
              { icon: BadgeCheck, label: 'Resultado personal', detail: 'Prioridades según tus respuestas' },
              { icon: ShieldCheck, label: 'Criterio profesional', detail: 'Sin milagros ni promesas médicas' },
            ].map(({ icon: Icon, label, detail }) => (
              <div key={label} className="flex items-center gap-3 px-3 py-3 sm:py-0 sm:not-first:pl-6">
                <Icon className="h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="text-fluid-sm font-semibold text-white">{label}</p>
                  <p className="text-fluid-xs text-subtle">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════ PRIORIDADES ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-dusk">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 space-y-3">
              <h2 className="headline text-fluid-3xl text-white">
                Trabajamos sobre lo que <span className="text-gradient-brand">sí puedes cambiar.</span>
              </h2>
              <p className="text-fluid-base text-muted max-w-2xl mx-auto">
                Sin diagnosticar ni prometer resultados hormonales: ordenamos entrenamiento, hábitos y seguimiento
                para construir un proceso realista.
              </p>
            </div>
            <div className="grid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] sm:grid-cols-2 lg:grid-cols-4">
              {PRIORIDADES.map((p, i) => (
                <div key={i} className="relative min-h-52 border-b border-white/10 p-6 last:border-b-0 sm:odd:border-r lg:border-b-0 lg:not-last:border-r">
                  <span className="absolute right-5 top-3 headline text-5xl text-white/[0.035]">0{i + 1}</span>
                  <p className="mb-8 text-fluid-xs font-semibold uppercase tracking-[0.2em] text-accent">Prioridad 0{i + 1}</p>
                  <p className="headline text-fluid-xl text-accent">{p.t}</p>
                  <p className="text-fluid-sm text-white/85 leading-relaxed mt-2">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ EL CONSEJO DE SIEMPRE vs LO QUE FUNCIONA ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-deep">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 space-y-3">
              <h2 className="headline text-fluid-3xl text-white">
                Puede que no te falte esfuerzo. <span className="text-gradient-brand">Puede faltarte estructura.</span>
              </h2>
              <p className="text-fluid-base text-muted max-w-2xl mx-auto">
                El test no diagnostica ni mide tu tiroides. Te ayuda a ordenar las decisiones que sí están dentro
                de nuestro ámbito profesional.
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
              <div className="hidden grid-cols-2 border-b border-white/10 bg-white/[0.025] px-6 py-4 md:grid">
                <p className="text-fluid-xs font-semibold uppercase tracking-widest text-danger">Ruido que te frena</p>
                <p className="text-fluid-xs font-semibold uppercase tracking-widest text-success">Una dirección más útil</p>
              </div>
              {CONSEJO_VS.map((c, i) => (
                <div key={i} className="grid gap-4 border-b border-white/10 p-6 last:border-b-0 md:grid-cols-2 md:gap-8">
                  <div className="flex items-start gap-3 text-fluid-sm leading-relaxed text-white/65">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-danger" />{c.mal}
                  </div>
                  <div className="flex items-start gap-3 text-fluid-sm leading-relaxed text-white/90">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />{c.bien}
                  </div>
                </div>
              ))}
            </div>

            {/* Mantra */}
            <blockquote className="max-w-2xl mx-auto mt-12 text-center">
              <p className="headline text-fluid-2xl text-white leading-snug">
                “No entrenamos para mover un número en la analítica.
                <br />
                <span className="text-gradient-brand">Entrenamos para recuperar fuerza, capacidad y confianza.”</span>
              </p>
            </blockquote>
          </div>
        </Container>
      </section>

      {/* ═══════════════ PARA QUIÉN / NO ES ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-dusk">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <Container>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <article className="surface-card rounded-2xl p-8 border-l-4 border-l-success">
              <h3 className="text-fluid-xl font-semibold text-white mb-6 flex items-center gap-2 tracking-tight">
                <CheckCircle className="w-5 h-5 text-success" />
                Esto es para ti si...
              </h3>
              <ul className="space-y-3">
                {IS_FOR.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-fluid-sm text-white/85 leading-relaxed">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="surface-card rounded-2xl p-8 border-l-4 border-l-danger">
              <h3 className="text-fluid-xl font-semibold text-white mb-6 flex items-center gap-2 tracking-tight">
                <X className="w-5 h-5 text-danger" />
                NO es para ti si...
              </h3>
              <ul className="space-y-3">
                {IS_NOT_FOR.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-fluid-sm text-white/85 leading-relaxed">
                    <X className="w-4 h-4 text-danger mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </Container>
      </section>

      {/* ═══════════════ CTA FINAL ═══════════════ */}
      <section className="relative py-fluid-lg bg-brand-deep">
        <Container>
          <div className="max-w-2xl mx-auto surface-card-accent rounded-2xl p-fluid-md text-center space-y-5">
            <h2 className="headline text-fluid-3xl text-white">
              Empieza por saber <span className="text-gradient-brand">dónde estás.</span>
            </h2>
            <p className="text-fluid-base text-muted">
              Haz el test en 1 minuto e identifica qué merece la pena priorizar en tu situación.
            </p>
            <a
              href="#test"
              className="btn-brand text-fluid-base px-8 py-4"
            >
              Hacer el test gratis
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>

          {/* Aviso legal */}
          <p className="max-w-2xl mx-auto mt-8 text-fluid-xs text-subtle text-center leading-relaxed">
            Este test y esta guía son información general y no sustituyen el consejo de tu médico ni son un
            diagnóstico. El seguimiento de tu tiroides, medicación y analíticas corresponde a tu equipo sanitario;
            WellnessReal trabaja entrenamiento, hábitos y composición corporal dentro de su ámbito profesional.
          </p>
        </Container>
      </section>
    </>
  )
}
