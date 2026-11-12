import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getCommunityExercise, EXERCISE_EQUIPMENT, EXERCISE_ALTERNATIVES } from '@/lib/community-exercises'
import { getSessionMember, isApproved } from '@/lib/db/comunidad'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const exercise = getCommunityExercise((await params).slug)
  return { title: `${exercise?.name ?? 'Ficha de ejercicio'} · Comunidad Tiroides`, robots: { index: false, follow: false } }
}

export default async function ExercisePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const member = await getSessionMember()
  if (!member) redirect(`/comunidad/entrar?next=${encodeURIComponent(`/comunidad/ejercicios/${slug}`)}`)
  if (!isApproved(member)) redirect('/comunidad')
  const exercise = getCommunityExercise(slug)
  if (!exercise) notFound()
  const image = `/community/exercises/${exercise.slug}-v1.webp`

  return <main className="mx-auto max-w-4xl space-y-8 py-4">
    <Link href="/comunidad/ejercicios" className="inline-flex min-h-11 items-center gap-2 text-sm text-accent underline underline-offset-4"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Todos los ejercicios</Link>
    <header className="space-y-4"><p className="community-eyebrow">{exercise.pattern}</p><h1 className="headline text-fluid-4xl text-white">{exercise.name}</h1><p className="max-w-2xl leading-relaxed text-muted">{exercise.summary}</p></header>

    <figure className="space-y-4">
      <a href={image} target="_blank" rel="noopener noreferrer" aria-label={`Ampliar ilustración de ${exercise.name} (abre en otra pestaña)`} className="relative block aspect-[3/2] overflow-hidden rounded-xl bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"><Image src={image} alt={exercise.imageAlt} fill loading="eager" sizes="(max-width: 1024px) 100vw, 900px" className="object-contain" /></a>
      <figcaption className="space-y-2 text-sm leading-relaxed text-muted"><p>{exercise.imageCaption}</p><p>Ilustración generada para WellnessReal. El resaltado orienta sobre algunos músculos implicados; no representa su activación exacta.</p></figcaption>
    </figure>

    <section aria-labelledby="exercise-muscles" className="border-y border-border-subtle py-6"><h2 id="exercise-muscles" className="headline text-fluid-2xl text-white">Músculos implicados</h2><ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-muted">{exercise.muscles.map(muscle => <li key={muscle}>{muscle}</li>)}</ul></section>
    <section aria-labelledby="exercise-steps"><h2 id="exercise-steps" className="headline text-fluid-2xl text-white">Cómo realizarlo</h2><ol className="mt-5 list-decimal space-y-4 pl-5 leading-relaxed text-muted">{exercise.steps.map(step => <li key={step}>{step}</li>)}</ol></section>
    <section aria-labelledby="exercise-checks"><h2 id="exercise-checks" className="headline text-fluid-2xl text-white">Qué conviene revisar</h2><ul className="mt-5 list-disc space-y-3 pl-5 leading-relaxed text-muted">{exercise.checks.map(check => <li key={check}>{check}</li>)}</ul></section>
    <section aria-labelledby="exercise-variants"><h2 id="exercise-variants" className="headline text-fluid-2xl text-white">Variantes habituales</h2><div className="mt-5 divide-y divide-border-subtle">{exercise.variants.map(variant => <article key={variant.name} className="space-y-2 py-5"><h3 className="font-semibold text-white">{variant.name}</h3><p className="leading-relaxed text-muted">{variant.description}</p>{variant.equipment.length > 0 && <p className="text-sm text-muted">Material: {variant.equipment.map(id => EXERCISE_EQUIPMENT.find(item => item.id === id)?.label).join(' · ')}</p>}</article>)}</div></section>

    <section aria-labelledby="exercise-alternatives">
      <h2 id="exercise-alternatives" className="headline text-fluid-2xl text-white">Si necesitas otra opción</h2>
      <p className="mt-4 leading-relaxed text-muted">Elige según el material y lo que puedas controlar. Cambiar de ejercicio también cambia la carga y, a veces, el patrón. Una alternativa no garantiza resolver un dolor.</p>
      <ul className="mt-5 divide-y divide-border-subtle">{EXERCISE_ALTERNATIVES[exercise.slug]?.map(option => <li key={option.label} className="space-y-2 py-5">
        <h3 className="font-semibold text-white">{option.label}</h3><p className="leading-relaxed text-muted">{option.reason}</p>
        <a href={option.slug === exercise.slug ? '#exercise-variants' : `/comunidad/ejercicios/${option.slug}#exercise-variants`} className="inline-flex min-h-11 items-center text-accent underline underline-offset-4">{option.slug === exercise.slug ? 'Consultar las variantes de esta ficha' : `Ver ${getCommunityExercise(option.slug)?.name.toLocaleLowerCase('es')}`}</a>
      </li>)}</ul>
    </section>

    <section className="space-y-3 border-t border-border-subtle pt-6"><h2 className="headline text-fluid-2xl text-white">Llévalo a una sesión</h2><p className="text-muted">Consulta dos ejemplos de cuerpo completo y aprende a ajustar series, repeticiones y esfuerzo.</p><Link href="/comunidad/ejercicios/sesiones" className="inline-flex min-h-11 items-center gap-2 font-semibold text-accent underline underline-offset-4">Ver sesiones de ejemplo <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></section>
    <footer className="space-y-4 border-t border-border-subtle pt-6 text-sm leading-relaxed text-muted"><p>Elige material, carga y recorrido que puedas controlar. Si aparece dolor o una molestia que no entiendes, interrumpe el intento y busca orientación adecuada.</p><p>Contenido educativo de <Link href="/sobre-mi" className="text-accent underline underline-offset-4">Fernando Royano</Link>. Fuentes consultadas el 12 de noviembre de 2026: <a href={exercise.source.url} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4">{exercise.source.title}</a>. La fuente no avala estas ilustraciones ni implica una revisión externa de la ficha.</p><Link href="/comunidad/rutas" className="inline-flex min-h-11 items-center gap-2 font-semibold text-accent">Volver a mis rutas de aprendizaje <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></footer>
  </main>
}
