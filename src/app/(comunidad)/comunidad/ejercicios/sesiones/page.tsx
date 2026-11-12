import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getSessionMember, isApproved } from '@/lib/db/comunidad'
import { getCommunityExercise } from '@/lib/community-exercises'
import { COMMUNITY_WORKOUTS } from '@/lib/community-workouts'

export const metadata: Metadata = { title: 'Sesiones de fuerza de ejemplo · Comunidad Tiroides', robots: { index: false, follow: false } }

export default async function ExampleWorkoutsPage() {
  const member = await getSessionMember()
  if (!member) redirect('/comunidad/entrar?next=/comunidad/ejercicios/sesiones')
  if (!isApproved(member)) redirect('/comunidad')

  return <main className="mx-auto max-w-4xl space-y-9 py-4">
    <Link href="/comunidad/ejercicios" className="inline-flex min-h-11 items-center gap-2 text-sm text-accent underline underline-offset-4"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Biblioteca de ejercicios</Link>
    <header className="max-w-3xl space-y-4"><p className="community-eyebrow">De la ficha a la práctica</p><h1 className="headline text-fluid-4xl text-white">Dos sesiones de fuerza de ejemplo</h1><p className="leading-relaxed text-muted">Saber cómo se hace un ejercicio es el primer paso. Aquí puedes ver cómo combinar varios y ajustar el trabajo sin tener que hacerlo todo desde el primer día.</p><p className="text-sm leading-relaxed text-muted">Ejemplos educativos para adultos que pueden entrenar fuerza. No son un plan individual ni una pauta de tratamiento del hipotiroidismo. Si tienes limitaciones o síntomas que condicionan el ejercicio, necesitas adaptar la propuesta con ayuda profesional.</p></header>

    <nav aria-label="Contenido de las sesiones" className="flex flex-wrap gap-x-6 gap-y-2 border-y border-border-subtle py-3">
      <a href="#como-usarlas" className="inline-flex min-h-11 items-center text-accent underline underline-offset-4">Cómo usarlas</a>
      {COMMUNITY_WORKOUTS.map(workout => <a key={workout.id} href={`#${workout.id}`} className="inline-flex min-h-11 items-center text-accent underline underline-offset-4">{workout.title}</a>)}
    </nav>

    <section id="como-usarlas" aria-labelledby="workout-guidance" className="scroll-mt-24 space-y-5">
      <h2 id="workout-guidance" className="headline text-fluid-2xl text-white">Cómo usarlas</h2>
      <dl className="grid gap-6 sm:grid-cols-2">
        <div><dt className="font-semibold text-white">Semana</dt><dd className="mt-2 leading-relaxed text-muted">Como ejemplo, reserva dos días separados por al menos un día sin esta sesión de fuerza: lunes y jueves. Puedes repetir la misma propuesta o alternar ambas; no tienes que completar las dos el mismo día.</dd></div>
        <div><dt className="font-semibold text-white">Series y descanso</dt><dd className="mt-2 leading-relaxed text-muted">Para familiarizarte, prueba una serie de cada ejercicio. Si la toleras bien, pasa a dos. Descansa unos 2 minutos entre series y ejercicios, o más si lo necesitas. En los movimientos por lado, descansa también entre lados si hace falta.</dd></div>
        <div><dt className="font-semibold text-white">Esfuerzo</dt><dd className="mt-2 leading-relaxed text-muted">Elige carga y variante para terminar pensando que podrías hacer unas 2–3 repeticiones más con buena técnica. Es una estimación: al aprender, prioriza el control y no busques comprobarla llegando al fallo.</dd></div>
        <div><dt className="font-semibold text-white">Antes de empezar</dt><dd className="mt-2 leading-relaxed text-muted">Muévete unos minutos y ensaya cada ejercicio sin carga o con menos peso. Añade aproximaciones suaves antes de las series de trabajo. Consulta la ficha si no conoces la variante.</dd></div>
      </dl>
      <p className="text-sm leading-relaxed text-muted">Una serie es una tanda de repeticiones seguida de descanso. Aquí, «8–12 por lado» significa 8–12 con cada brazo o pierna. Completa las series de un ejercicio antes de pasar al siguiente; no es un circuito contra reloj.</p>
    </section>

    {COMMUNITY_WORKOUTS.map(workout => <section key={workout.id} id={workout.id} aria-labelledby={`${workout.id}-heading`} className="scroll-mt-24 border-t border-border-subtle pt-8">
      <header className="space-y-3"><h2 id={`${workout.id}-heading`} className="headline text-fluid-3xl text-white">{workout.title}</h2><p className="leading-relaxed text-muted">{workout.description}</p><p className="text-sm text-muted"><span className="font-semibold text-white">Material: </span>{workout.equipment}</p></header>
      <ol className="mt-5 divide-y divide-border-subtle">{workout.exercises.map((exercise, index) => <li key={`${workout.id}-${exercise.slug}`} className="grid min-w-0 gap-5 py-6 sm:grid-cols-[13rem_minmax(0,1fr)]">
        <figure className="min-w-0 space-y-2"><Link href={`/comunidad/ejercicios/${exercise.slug}`} aria-label={`Ver ficha ilustrada: ${exercise.variant}`} className="relative block aspect-[3/2] w-full max-w-xs overflow-hidden rounded-lg bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"><Image src={`/community/exercises/${exercise.slug}-v1.webp`} alt={getCommunityExercise(exercise.slug)?.imageAlt ?? exercise.variant} fill sizes="(max-width: 639px) 280px, 208px" className="object-contain" /></Link><figcaption className="max-w-xs text-xs leading-relaxed text-muted">{getCommunityExercise(exercise.slug)?.imageCaption}</figcaption></figure>
        <div className="min-w-0 space-y-3">
        <p className="text-sm text-muted">{exercise.optional ? 'Opcional' : `Movimiento ${index + 1}`} · {getCommunityExercise(exercise.slug)?.pattern}</p>
        <h3 className="text-xl font-semibold text-white">{exercise.variant}</h3>
        <p className="font-semibold text-white">1–2 series · {exercise.repetitions} · unos 2 min de descanso</p>
        <p className="max-w-2xl leading-relaxed text-muted">{exercise.note}</p>
        <Link href={`/comunidad/ejercicios/${exercise.slug}`} className="inline-flex min-h-11 items-center gap-2 text-accent underline underline-offset-4">Ver técnica y alternativas <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
      </li>)}</ol>
    </section>)}

    <section aria-labelledby="workout-adjustments" className="space-y-5 border-t border-border-subtle pt-8">
      <h2 id="workout-adjustments" className="headline text-fluid-2xl text-white">Cómo decidir el siguiente paso</h2>
      <div className="space-y-3 leading-relaxed text-muted"><p><strong className="text-white">Si completas el rango con margen: </strong>repite para afianzar el control. Cuando alcances el extremo alto en todas las series durante dos sesiones y aún te queden repeticiones posibles, prueba el incremento de carga más pequeño disponible. Vuelve hacia el extremo bajo del rango.</p><p><strong className="text-white">Ejemplo: </strong>si haces 2 × 12 en el remo sin balancearte y con margen durante dos sesiones, puedes subir un poco el peso y volver a 8–10. Si pierdes el control, ese incremento aún no te encaja.</p><p><strong className="text-white">Si hoy cuesta más: </strong>mantén o reduce la carga, usa una variante menos exigente o haz una serie. Si la fatiga es inusual, empeora o no cede, no la atribuyas automáticamente al entrenamiento o a la tiroides: busca orientación sanitaria.</p><p><strong className="text-white">Si aparece dolor: </strong>interrumpe ese ejercicio. No fuerces otra variante para terminar la sesión. Una molestia persistente o que no entiendes merece valoración.</p></div>
      <p className="text-sm leading-relaxed text-muted">Anota ejercicio, variante, peso, repeticiones y cómo terminó cada serie en tu registro habitual. Son ejemplos de fuerza; caminar y otras actividades aeróbicas siguen formando parte de una semana activa.</p>
      <Link href="/comunidad/mi-semana#sesiones" className="inline-flex min-h-11 items-center gap-2 font-semibold text-accent underline underline-offset-4">Reservar mis días en Mi semana <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
    </section>

    <footer className="space-y-3 border-t border-border-subtle pt-6 text-sm leading-relaxed text-muted"><p>Propuesta didáctica de <Link href="/sobre-mi" className="text-accent underline underline-offset-4">Fernando Royano</Link>. La selección, los descansos y la regla práctica de progresión son ejemplos editoriales ajustables, no una receta validada como conjunto ni una prescripción específica para tiroides.</p><p>Base general: entrenar los principales grupos musculares al menos dos días por semana, empezar de forma gradual y ajustar el programa a la persona. No es necesario llevar cada serie al fallo. Referencias consultadas el 12 de noviembre de 2026: <a href="https://acsm.org/resistance-training-guidelines-update-2026/" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4">ACSM, actualización de fuerza 2026</a> y <a href="https://www.cdc.gov/physical-activity-basics/adding-adults/what-counts.html" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4">CDC, actividad física y fortalecimiento</a>.</p></footer>
  </main>
}
