import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSessionMember, yaSolicitoAsesoria } from '@/lib/db/comunidad'
import { SolicitudForm } from './SolicitudForm'
import { Check, X, Users, Video, ClipboardCheck, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { THYROID_PROGRAM } from '@/lib/metodo-tiroides'

export const metadata: Metadata = {
  title: 'Método BASE Tiroides · Comunidad WellnessReal',
  robots: { index: false, follow: false },
}

const INCLUYE = [
  {
    icon: ClipboardCheck,
    title: 'Plan de fuerza adaptado y orientación de hábitos',
    desc: 'Se tienen en cuenta experiencia, días disponibles, material y limitaciones dentro del ámbito del entrenamiento. No incluye dieta clínica.',
  },
  {
    icon: Video,
    title: 'Contenido y directos privados',
    desc: 'Contenido por bloques y sesiones en directo cuando estén programadas. No se promete un encuentro individual semanal.',
  },
  {
    icon: Users,
    title: 'Espacio privado solo para el grupo',
    desc: 'Dentro de esta misma comunidad, con los contenidos y el calendario del programa.',
  },
  {
    icon: MessageCircle,
    title: 'Check-in semanal y dos revisiones individuales',
    desc: 'Observamos cómo respondes, resolvemos obstáculos y decidimos qué mantener, reducir o progresar.',
  },
] as const

export default async function AsesoriaPage() {
  const member = await getSessionMember()
  if (!member) redirect('/comunidad/entrar')

  const yaSolicitada = await yaSolicitoAsesoria(member.id)

  return (
    <div className="animate-[fadeUp_500ms_var(--ease-out)_both]">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
        Acompañamiento opcional de pago
      </p>
      <h1 className="headline text-3xl text-white sm:text-4xl">Método BASE Tiroides</h1>
      <p className="mt-3 text-lg text-white/70">
        12 semanas con un plan de fuerza adaptado, hábitos y acompañamiento. El proceso empieza
        con la aprobación de tu primer plan, sin esperar a que se forme un grupo.
      </p>
      <Link href="/metodo-tiroides" className="mt-4 inline-flex text-sm font-semibold text-[var(--color-accent)] hover:underline">
        Ver la página completa del Método BASE Tiroides →
      </Link>

      {/* El problema que resuelve */}
      <div className="surface-card mt-8 rounded-2xl p-6">
        <p className="text-white/80">
          La comunidad ofrece principios, ejercicios y ejemplos para aprender por tu cuenta.
          BASE añade una evaluación del punto de partida, un plan de fuerza adaptado y revisiones
          para decidir qué mantener o ajustar según tu disponibilidad y respuesta.
        </p>
        <p className="mt-3 text-white/80">
          Puede encajar si buscas acompañamiento para organizar entrenamiento y hábitos.
          No incluye interpretar analíticas, modificar medicación ni tratar síntomas. Puedes
          seguir utilizando la comunidad gratuita aunque no solicites el programa.
        </p>
      </div>

      {/* Qué incluye */}
      <h2 className="headline mt-10 text-2xl text-white">Qué incluye</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {INCLUYE.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="surface-card rounded-2xl p-5">
            <Icon className="mb-3 h-6 w-6 text-[var(--color-accent)]" />
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm text-white/55">{desc}</p>
          </div>
        ))}
      </div>

      {/* Precio */}
      <div className="surface-card-accent mt-10 rounded-2xl p-7 text-center">
        <p className="text-sm text-white/60">Las 12 semanas completas</p>
        <p className="headline my-2 text-5xl text-[var(--color-accent)]">{THYROID_PROGRAM.price} €</p>
        <p className="text-sm text-white/60">
          Pago único o {THYROID_PROGRAM.installmentCount} pagos de {THYROID_PROGRAM.installmentPrice} € ({THYROID_PROGRAM.installmentCount * THYROID_PROGRAM.installmentPrice} € en total).
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm text-white/50">
          Las 12 semanas empiezan con la aprobación de tu primer plan. La duración permite
          organizar y revisar el proceso; no garantiza un resultado concreto.
        </p>
      </div>

      {/* Para quién sí / para quién no */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="surface-card rounded-2xl p-6">
          <h3 className="mb-3 font-semibold text-white">Es para ti si…</h3>
          <ul className="space-y-2.5 text-sm text-white/70">
            {[
              'Tienes hipotiroidismo o Hashimoto diagnosticado y seguimiento sanitario.',
              'Has probado por tu cuenta y te falta que alguien concrete.',
              'Puedes entrenar al menos 2 días por semana.',
              'Te viene bien no hacerlo sola.',
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-success)]" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="surface-card rounded-2xl p-6">
          <h3 className="mb-3 font-semibold text-white">No es para ti si…</h3>
          <ul className="space-y-2.5 text-sm text-white/70">
            {[
              'Buscas perder 10 kilos en un mes.',
              'Quieres que te resuelva la medicación: eso es de tu endocrino.',
              'No vas a poder dedicarle nada de tiempo estos 3 meses.',
              'Buscas atención individual exclusiva o respuesta inmediata, que este programa no incluye.',
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-white/30" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Formulario */}
      <h2 className="headline mt-12 text-2xl text-white">Solicita tu plaza</h2>
      <p className="mb-4 mt-2 text-white/60">
        Enviar este formulario <strong className="text-white">no implica pago ni confirma una plaza</strong>.
        Explicas tu objetivo y disponibilidad; después hablamos para comprobar si encaja y decides
        con las condiciones completas. La comunidad gratuita sigue disponible aunque no continúes.
      </p>
      <SolicitudForm yaSolicitada={yaSolicitada} />
    </div>
  )
}
