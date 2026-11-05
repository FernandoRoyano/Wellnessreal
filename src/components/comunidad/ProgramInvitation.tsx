import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function ProgramInvitation({ hasPremium }: { hasPremium: boolean }) {
  return <section className="my-8 border-y border-border-subtle py-7" aria-label={hasPremium ? 'Tu programa' : 'Acompañamiento de Método BASE'}>
    <h2 className="headline text-fluid-2xl text-white">{hasPremium ? 'Tu Método BASE, a mano.' : '¿Quieres aplicar esto con un plan adaptado y seguimiento?'}</h2>
    <p className="mt-3 max-w-2xl text-fluid-base leading-relaxed text-muted">{hasPremium
      ? 'Continúa con tu evaluación, tu plan y las revisiones desde tu espacio del programa.'
      : 'La comunidad te ayuda a aprender y practicar por tu cuenta. Método BASE Tiroides añade evaluación, plan adaptado, seguimiento semanal y revisiones durante 12 semanas. Conoce cómo funciona y comprueba si encaja contigo.'}</p>
    <Link href={hasPremium ? '/comunidad/metodo-base-tiroides' : '/metodo-tiroides?origen=comunidad'} className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-accent">{hasPremium ? 'Ir a mi programa' : 'Ver cómo funciona Método BASE'} <ArrowRight className="h-4 w-4" /></Link>
  </section>
}
