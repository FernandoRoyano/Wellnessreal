import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getThyroidLaunchPhase, THYROID_PROGRAM } from '@/lib/metodo-tiroides'

export function ProgramInvitation({ hasPremium }: { hasPremium: boolean }) {
  return <section className="my-8 border-y border-border-subtle py-7" aria-label={hasPremium ? 'Tu programa' : 'Acompañamiento de Método BASE'}>
    <h2 className="headline text-fluid-2xl text-white">{hasPremium ? 'Tu Método BASE, a mano.' : '¿Quieres aplicar esto con un plan adaptado y seguimiento?'}</h2>
    <p className="mt-3 max-w-2xl text-fluid-base leading-relaxed text-muted">{hasPremium
      ? 'Continúa con tu evaluación, tu plan y las revisiones desde tu espacio del programa.'
      : 'La comunidad te ayuda a aprender y practicar por tu cuenta. Método BASE Tiroides añade evaluación, plan adaptado, seguimiento semanal y revisiones durante 12 semanas. Conoce cómo funciona y comprueba si encaja contigo.'}</p>
    {!hasPremium && <details className="mt-5 max-w-2xl text-sm text-muted">
      <summary className="min-h-11 cursor-pointer py-3 font-semibold text-accent">Ver un ejemplo de qué añade BASE</summary>
      <p className="mt-3">Ejemplo didáctico, no caso de una clienta ni pauta individual: tienes dos huecos para entrenar, pero uno cambia cada semana.</p>
      <ol className="mt-4 list-decimal space-y-3 pl-5">
        <li><strong className="text-white">En la comunidad:</strong> aprendes a usar el planificador, consultas ejemplos y eliges una acción por tu cuenta.</li>
        <li><strong className="text-white">Evaluación en BASE:</strong> revisamos disponibilidad, experiencia, material y limitaciones dentro del ámbito del entrenamiento.</li>
        <li><strong className="text-white">Plan adaptado:</strong> se concreta una estructura y una alternativa para ese hueco que cambia.</li>
        <li><strong className="text-white">Seguimiento:</strong> revisamos lo realizado y la respuesta para decidir qué mantener o ajustar. No se promete un resultado ni un aumento obligatorio de carga.</li>
      </ol>
      <h3 className="mt-5 font-semibold text-white">Cuándo puede encajarte</h3>
      <p className="mt-2">Quieres convertir ejemplos generales en un plan revisado contigo, puedes reservar al menos dos momentos semanales y buscas acompañamiento dentro del entrenamiento y los hábitos.</p>
      <p className="mt-3">Incluye check-in semanal y dos revisiones individuales. Los directos se ofrecen cuando están programados; no implica una videollamada individual cada semana ni atención inmediata.</p>
      <h3 className="mt-5 font-semibold text-white">Qué ocurre si lo solicitas</h3>
      <ol className="mt-3 list-decimal space-y-2 pl-5"><li>Envías el formulario para explicar objetivo y disponibilidad.</li><li>Hablamos y comprobamos si el programa encaja. Enviar la solicitud no implica pago ni confirma una plaza.</li><li>Si seguimos adelante, se concreta el pago, la evaluación y el primer plan. Las 12 semanas empiezan cuando se aprueba ese plan.</li></ol>
      <p className="mt-4">Programa completo: {THYROID_PROGRAM.price} € en un pago o {THYROID_PROGRAM.installmentCount} pagos de {THYROID_PROGRAM.installmentPrice} € ({THYROID_PROGRAM.installmentCount * THYROID_PROGRAM.installmentPrice} € en total). BASE es de pago. No interpreta analíticas, modifica medicación ni sustituye atención sanitaria. Seguir aprendiendo gratis sigue siendo una opción.</p>
      {getThyroidLaunchPhase() === 'applications' && <Link href="/metodo-tiroides?origen=comunidad#solicitud-formulario" className="mt-3 inline-flex min-h-11 items-center text-accent underline underline-offset-4">Consultar condiciones y preparar mi solicitud</Link>}
    </details>}
    <Link href={hasPremium ? '/comunidad/metodo-base-tiroides' : '/metodo-tiroides?origen=comunidad'} className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-accent">{hasPremium ? 'Ir a mi programa' : 'Ver cómo funciona Método BASE'} <ArrowRight className="h-4 w-4" /></Link>
  </section>
}
