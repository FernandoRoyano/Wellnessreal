import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSessionMember, yaSolicitoAsesoria } from '@/lib/db/comunidad'
import { SolicitudForm } from './SolicitudForm'
import { Check, X, Users, Video, ClipboardCheck, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Grupo Tiroides · Comunidad WellnessReal',
  robots: { index: false, follow: false },
}

const INCLUYE = [
  {
    icon: ClipboardCheck,
    title: 'Tu plan de entreno y nutrición, hecho para ti',
    desc: 'No una plantilla. Tus días, tu material, tus lesiones, tus horarios.',
  },
  {
    icon: Video,
    title: 'Directo conmigo cada semana (45 min)',
    desc: 'Entrenamiento, comida real, descanso, energía… y lo que se te atragante esa semana. En vivo, no grabado.',
  },
  {
    icon: Users,
    title: 'Espacio privado solo para el grupo',
    desc: 'Dentro de esta misma comunidad. 8-12 mujeres, todas con lo mismo que tú.',
  },
  {
    icon: MessageCircle,
    title: 'Ajustamos tu día a día, no solo tu rutina',
    desc: 'Sueño, organización, la comida cuando no tienes tiempo… Reviso cómo vas cada 3 semanas y lo movemos contigo.',
  },
] as const

export default async function AsesoriaPage() {
  const member = await getSessionMember()
  if (!member) redirect('/comunidad/entrar')

  const yaSolicitada = await yaSolicitoAsesoria(member.id)

  return (
    <div className="animate-[fadeUp_500ms_var(--ease-out)_both]">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
        Plazas limitadas · Solo para miembros
      </p>
      <h1 className="headline text-3xl text-white sm:text-4xl">Grupo Tiroides</h1>
      <p className="mt-3 text-lg text-white/70">
        12 semanas trabajando conmigo y con un grupo pequeño de mujeres que están exactamente
        donde tú.
      </p>

      {/* El problema que resuelve */}
      <div className="surface-card mt-8 rounded-2xl p-6">
        <p className="text-white/80">
          En la comunidad te doy los principios, y funcionan. Pero llega un punto en el que
          necesitas que alguien mire <em>tu</em> vida: cuántos días puedes de verdad, qué hacemos
          con esa rodilla, cómo encajas la comida cuando no tienes tiempo, por qué duermes mal y
          qué toco cuando llevas tres semanas sin ver nada.
        </p>
        <p className="mt-3 text-white/80">
          Porque esto no va solo de entrenar. Va de <strong className="text-white">ajustar tu día
          a día</strong> —descanso, energía, comida, hábitos— y de desatascar eso que se te
          resiste. Y en grupo, porque descubrí una cosa: la mayoría no falla por falta de plan.
          Falla por hacerlo sola.
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
        <p className="headline my-2 text-5xl text-[var(--color-accent)]">249 €</p>
        <p className="text-sm text-white/60">Pago único. Sin cuotas después, sin permanencia.</p>
        <p className="mx-auto mt-4 max-w-md text-sm text-white/50">
          Lo cobro por trimestre entero porque en menos de tres meses no se ve nada serio. Y
          porque quien se compromete tres meses, aparece.
        </p>
      </div>

      {/* Para quién sí / para quién no */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="surface-card rounded-2xl p-6">
          <h3 className="mb-3 font-semibold text-white">Es para ti si…</h3>
          <ul className="space-y-2.5 text-sm text-white/70">
            {[
              'Tienes hipotiroidismo o Hashimoto y ya estás en tratamiento.',
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
              'Prefieres atención 1-a-1 exclusiva (entonces te va mejor el Premium).',
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
        Son 8-12 plazas por grupo. Léelo bien: <strong className="text-white">esto no es un
        pago</strong>. Me cuentas tu caso, te escribo yo, y decides con toda la información.
        Si veo que no encajas, te lo digo — prefiero eso a cobrarte por algo que no te va a servir.
      </p>
      <SolicitudForm yaSolicitada={yaSolicitada} />
    </div>
  )
}
