import Container from '@/components/common/Container'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPostSlugs } from '@/lib/db/posts'
import type { Metadata } from 'next'
import JsonLd, { articleSchema, breadcrumbSchema } from '@/components/seo/JsonLd'
import '../markdown.css'

export const revalidate = 60

// Generar rutas estáticas
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((item) => ({
    slug: item.slug,
  }))
}

// Generar metadata dinámica
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post no encontrado | WellnessReal',
    }
  }

  const ogImage = post.main_image_url || undefined

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `https://wellnessreal.es/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author],
      url: `https://wellnessreal.es/blog/${slug}`,
      siteName: 'WellnessReal',
      locale: 'es_ES',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: post.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: ogImage ? [ogImage] : [],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.excerpt,
          url: `https://wellnessreal.es/blog/${slug}`,
          image: post.main_image_url || undefined,
          datePublished: post.published_at,
          author: post.author,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Inicio', url: 'https://wellnessreal.es' },
          { name: 'Blog', url: 'https://wellnessreal.es/blog' },
          { name: post.title, url: `https://wellnessreal.es/blog/${slug}` },
        ])}
      />
      {/* Hero del Post */}
      <section style={{ backgroundColor: '#16122B' }} className="pt-24 pb-8">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition font-medium text-sm"
            >
              <ArrowLeft size={16} />
              Volver al blog
            </Link>

            {/* Categoría */}
            {post.category && (
              <span
                style={{ backgroundColor: 'rgba(252, 238, 33, 0.15)', color: '#FCEE21' }}
                className="inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-4"
              >
                {post.category.title}
              </span>
            )}

            {/* Título */}
            <h1
              style={{ color: '#FCEE21' }}
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
            >
              {post.title}
            </h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-gray-400 pb-8 border-b border-gray-800">
              <span className="flex items-center gap-2">
                <User size={16} />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                {new Date(post.published_at).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
              {post.read_time && (
                <span className="flex items-center gap-2">
                  <Clock size={16} />
                  {post.read_time}
                </span>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Imagen destacada */}
      {post.main_image_url && (
        <section style={{ backgroundColor: '#16122B' }} className="pb-12">
          <Container>
            <div className="max-w-4xl mx-auto">
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
                <img
                  src={post.main_image_url}
                  alt={post.main_image_alt || post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Contenido del Post */}
      <section style={{ backgroundColor: '#16122B' }} className="pb-20">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Excerpt destacado */}
            <p className="text-xl text-gray-300 leading-relaxed mb-12 pb-8 border-b border-gray-800">
              {post.excerpt}
            </p>

            {/* Contenido principal HTML */}
            <article
              className="prose prose-invert prose-lg max-w-none markdown-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </Container>
      </section>

      {/* CTA Lead Magnet */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-16">
        <Container>
          <div
            className="max-w-3xl mx-auto p-8 md:p-10 rounded-2xl"
            style={{ backgroundColor: '#16122B', border: '2px solid #FCEE21' }}
          >
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                ¿Quieres más contenido como este?
              </h2>
              <p className="text-lg text-gray-300 mb-6 max-w-xl mx-auto">
                Descarga la guía gratuita:{' '}
                <span style={{ color: '#FCEE21' }} className="font-bold">
                  "Fitness real para gente con vida real"
                </span>
              </p>
              <Link href="/recurso-gratis">
                <Button variant="primary" size="lg">
                  Descargar guía gratis
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Final */}
      <section style={{ backgroundColor: '#16122B' }} className="py-16">
        <Container className="text-center max-w-3xl mx-auto">
          <h2 style={{ color: '#FCEE21' }} className="text-3xl md:text-4xl font-bold mb-6">
            ¿Prefieres un plan personalizado?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Esto que lees aquí es contenido general. Una valoración analiza TU caso
            y diseña un plan adaptado a tu vida real.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/valoracion">
              <Button variant="primary" size="lg">
                Solicitar valoración gratuita
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant="outline" size="lg">
                Ver más artículos
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
