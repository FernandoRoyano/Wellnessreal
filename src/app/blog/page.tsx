import Container from '@/components/common/Container'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { Calendar, Clock, Filter } from 'lucide-react'
import { getAllPosts, getAllCategories, type SanityPost, type SanityCategory } from '../../../sanity/lib/queries'
import { urlFor } from '../../../sanity/lib/image'
import BlogFilters from './BlogFilters'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | WellnessReal',
  description: 'Consejos de entrenamiento y nutrición sin rodeos. Lo que funciona, explicado simple.',
}

export const revalidate = 60 // Revalidar cada 60 segundos

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
  ])

  return (
    <>
      {/* Hero del Blog */}
      <section style={{ backgroundColor: '#16122B' }} className="py-20 md:py-28">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 style={{ color: '#FCEE21' }} className="text-5xl md:text-6xl font-bold mb-6 tracking-wide">
              BLOG
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Consejos de entrenamiento y nutrición{' '}
              <span style={{ color: '#FCEE21' }} className="font-bold">sin rodeos</span>.
              <br />
              Lo que funciona, explicado simple.
            </p>
          </div>
        </Container>
      </section>

      {/* Contenido del blog con filtros */}
      <BlogFilters posts={posts} categories={categories} />

      {/* CTA al Lead Magnet */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-16 md:py-20">
        <Container>
          <div
            className="max-w-3xl mx-auto p-8 md:p-12 rounded-2xl text-center"
            style={{ backgroundColor: '#16122B', border: '2px solid #FCEE21' }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              ¿Quieres ir al grano?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
              Descarga la guía gratuita:{' '}
              <span style={{ color: '#FCEE21' }} className="font-bold">
                "Fitness real para gente con vida real"
              </span>
              . Sin teoría, solo lo que funciona.
            </p>
            <Link href="/recurso-gratis">
              <Button variant="primary" size="lg">
                Descargar guía gratis
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* CTA Final */}
      <section style={{ backgroundColor: '#16122B' }} className="py-16">
        <Container className="text-center">
          <p className="text-gray-400 mb-6">
            ¿Prefieres un plan personalizado a tu situación?
          </p>
          <Link href="/contacto">
            <Button variant="outline" size="lg">
              Solicitar valoración gratuita
            </Button>
          </Link>
        </Container>
      </section>
    </>
  )
}
