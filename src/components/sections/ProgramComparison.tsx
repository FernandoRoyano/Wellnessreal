import Link from 'next/link'
import Container from '@/components/common/Container'
import { THYROID_PROGRAM } from '@/lib/metodo-tiroides'

export default function ProgramComparison() {
  return (
    <section id="comparar-programas" aria-labelledby="program-comparison-title" className="scroll-mt-24 bg-brand-deep py-fluid-lg">
      <Container>
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow">Recibir acompañamiento</p>
          <h2 id="program-comparison-title" className="headline mt-4 text-fluid-3xl text-white">Dos formatos, una elección según lo que necesitas.</h2>
          <p className="mt-4 max-w-2xl text-fluid-base text-muted">Son programas de pago de 12 semanas. Método BASE combina una estructura adaptada, contenidos y grupo; el formato individual centra la programación y el seguimiento en tu caso. La comunidad gratuita no incluye ninguno de los dos.</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <article className="rounded-xl border border-border-subtle p-6">
              <h3 className="text-fluid-xl font-bold text-white">Método BASE Tiroides</h3>
              <p className="mt-3 text-fluid-sm text-muted">Para personas con hipotiroidismo o Hashimoto diagnosticado y seguimiento sanitario que buscan una estructura de fuerza y hábitos.</p>
              <ul className="mt-5 list-disc space-y-2 pl-5 text-fluid-sm text-white/85 marker:text-accent">
                <li>Plan de fuerza adaptado, contenidos y grupo privado.</li>
                <li>Check-in semanal y dos revisiones individuales durante el recorrido.</li>
                <li>Inicio individual tras confirmar el acceso y revisar tu evaluación.</li>
              </ul>
              <p className="mt-6 font-semibold text-accent">{THYROID_PROGRAM.price} € · pago único</p>
              <p className="mt-1 text-fluid-sm text-muted">2 pagos de {THYROID_PROGRAM.installmentPrice} € · total {THYROID_PROGRAM.installmentPrice * THYROID_PROGRAM.installmentCount} €. El segundo pago se solicita a los 30 días.</p>
              <Link href="/metodo-tiroides" className="mt-5 inline-flex min-h-11 items-center font-semibold text-accent underline underline-offset-4">Ver alcance y solicitar plaza</Link>
            </article>
            <article className="rounded-xl border border-border-subtle p-6">
              <h3 className="text-fluid-xl font-bold text-white">Entrenamiento individual</h3>
              <p className="mt-3 text-fluid-sm text-muted">Para objetivos o contextos que necesitan una programación y un seguimiento completamente individuales.</p>
              <ul className="mt-5 list-disc space-y-2 pl-5 text-fluid-sm text-white/85 marker:text-accent">
                <li>Valoración y programación diseñadas para tu caso.</li>
                <li>Revisión semanal y ajustes del plan según tu respuesta.</li>
                <li>Contacto directo en los canales y tiempos acordados.</li>
              </ul>
              <p className="mt-6 font-semibold text-accent">750 € · pago único</p>
              <p className="mt-1 text-fluid-sm text-muted">3 pagos de 270 € · total 810 €. El calendario se concreta antes de contratar.</p>
              <Link href="/servicios/entrenamiento-online" className="mt-5 inline-flex min-h-11 items-center font-semibold text-accent underline underline-offset-4">Ver el acompañamiento individual</Link>
            </article>
          </div>
          <p className="mt-5 text-fluid-sm text-muted">La solicitud o valoración inicial no implica contratar. Ningún formato incluye diagnóstico, modificación de tratamientos ni atención ilimitada.</p>
        </div>
      </Container>
    </section>
  )
}
