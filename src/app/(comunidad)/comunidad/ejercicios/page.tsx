import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ExerciseLibrary } from '@/components/comunidad/ExerciseLibrary'
import { getExerciseSummaries } from '@/lib/community-exercises'
import { getSessionMember, isApproved } from '@/lib/db/comunidad'

export const metadata: Metadata = { title: 'Biblioteca de ejercicios · Comunidad Tiroides', robots: { index: false, follow: false } }

export default async function ExercisesPage() {
  const member = await getSessionMember()
  if (!member) redirect('/comunidad/entrar?next=/comunidad/ejercicios')
  if (!isApproved(member)) redirect('/comunidad')
  return <main className="mx-auto max-w-5xl space-y-7 py-4">
    <header className="max-w-3xl space-y-4"><p className="community-eyebrow">Comprender el movimiento</p><h1 className="headline text-fluid-4xl text-white">Biblioteca de ejercicios</h1><p className="leading-relaxed text-muted">Ejecución, músculos y variantes para entender cada movimiento.</p></header>
    <section className="space-y-2 border-l-2 border-accent pl-5"><h2 className="font-semibold text-white">¿Cómo los combino?</h2><p className="text-sm leading-relaxed text-muted">Dos ejemplos de cuerpo completo, con series, descansos y ajustes de esfuerzo.</p><Link href="/comunidad/ejercicios/sesiones" className="inline-flex min-h-11 items-center font-semibold text-accent underline underline-offset-4">Ver sesiones de ejemplo</Link></section>
    <ExerciseLibrary exercises={getExerciseSummaries()} />
    <p className="text-sm leading-relaxed text-muted">Material educativo general. No asigna cargas ni sustituye aprender la ejecución con ayuda cuando la necesitas. Las variantes son opciones, no una progresión obligatoria.</p>
  </main>
}
