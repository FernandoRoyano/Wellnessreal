import Container from '@/components/common/Container'
import Link from 'next/link'

const EXAMPLES = [
  {
    situation: 'La carga se vuelve fácil',
    observe: 'Completas el rango previsto con control y margen en varias sesiones.',
    decision: 'Prueba el incremento más pequeño de carga. Mantén los ejercicios para poder comparar y vuelve atrás si pierdes control.',
  },
  {
    situation: 'Tu semana tiene menos huecos',
    observe: 'Dispones de veinte minutos en lugar de cuarenta, pero te encuentras como de costumbre.',
    decision: 'Haz menos series de los movimientos que ya conoces. Ajustar la dosis permite seguir practicando sin correr ni acumular todo al día siguiente.',
  },
  {
    situation: 'Una variante no te encaja',
    observe: 'El equilibrio, el material o un recorrido concreto te impiden repetir el movimiento con comodidad.',
    decision: 'Prueba un apoyo estable, menos carga o una variante conocida. Si hay dolor preocupante o persistente, detén ese ejercicio y solicita valoración.',
  },
] as const

export default function TrainingDecisions() {
  return (
    <section aria-labelledby="training-decisions-title" className="bg-brand-deep py-fluid-lg">
      <Container>
        <div className="mx-auto max-w-5xl">
          <span className="eyebrow">Del dato a la decisión</span>
          <h2 id="training-decisions-title" className="headline mt-4 text-fluid-3xl text-white">Qué cambiar, y qué dejar como está.</h2>
          <p className="mt-4 max-w-2xl text-fluid-base text-muted">Una repetición más no cuenta lo mismo si cambias la carga, el recorrido y el descanso a la vez. Primero observa qué ha pasado; después cambia una cosa que puedas comprobar.</p>
          <p className="mt-3 text-fluid-sm text-subtle">Ejemplos didácticos, no casos de clientes ni pautas individuales.</p>
          <div className="mt-7 divide-y divide-border-subtle">
            {EXAMPLES.map(example => (
              <article key={example.situation} className="grid gap-3 py-6 md:grid-cols-[1fr_1.2fr_1.5fr] md:gap-8">
                <h3 className="text-fluid-lg font-semibold text-white">{example.situation}</h3>
                <p className="text-fluid-sm leading-relaxed text-muted"><span className="mb-1 block font-semibold text-accent">Qué observar</span>{example.observe}</p>
                <p className="text-fluid-sm leading-relaxed text-muted"><span className="mb-1 block font-semibold text-accent">Una decisión posible</span>{example.decision}</p>
              </article>
            ))}
          </div>
          <Link href="/recurso-gratis" className="mt-4 inline-flex min-h-11 items-center text-fluid-sm font-semibold text-accent underline underline-offset-4">Aprender las bases con la guía gratuita</Link>
        </div>
      </Container>
    </section>
  )
}
