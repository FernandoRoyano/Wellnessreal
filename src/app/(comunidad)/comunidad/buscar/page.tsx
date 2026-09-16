import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { CommunitySearch } from '@/components/comunidad/CommunitySearch'
import { getLessons, getSessionMember, getSpaces } from '@/lib/db/comunidad'

export const metadata: Metadata = { title: 'Buscar · Comunidad Tiroides · WellnessReal', robots: { index: false, follow: false } }

export default async function BuscarPage() {
  const member = await getSessionMember()
  if (!member) redirect('/comunidad/entrar?next=/comunidad/buscar')
  const spaces = (await getSpaces(member)).filter((space) => space.type === 'content')
  const groups = await Promise.all(spaces.map((space) => getLessons(space.id, member)))
  const lessons = spaces.flatMap((space, index) => groups[index].map((lesson) => ({ id: lesson.id, title: lesson.title, slug: lesson.slug, spaceName: space.name, spaceSlug: space.slug, locked: lesson.locked })))

  return <main className="community-search-page"><header><p>Biblioteca WellnessReal</p><h1 className="headline">Encuentra justo lo que necesitas.</h1><span>Busca entre todas las lecciones disponibles para ti. Los permisos del Método BASE siguen protegidos.</span></header><CommunitySearch lessons={lessons} /></main>
}
