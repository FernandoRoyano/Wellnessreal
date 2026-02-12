import Container from '@/components/common/Container'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPostSlugs } from '../../../../../sanity/lib/queries'
import { urlFor } from '../../../../../sanity/lib/image'
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

  const ogImage = post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : undefined

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
      publishedTime: post.publishedAt,
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

// Componentes personalizados para Portable Text
const portableTextComponents: any = {
  types: {
    image: ({ value }: { value: any }) => {
      if (!value?.asset?._ref) return null
      return (
        <figure className="my-8">
          <img
            src={urlFor(value).width(800).url()}
            alt={value.alt || ''}
            className="rounded-lg w-full"
          />
          {value.caption && (
            <figcaption className="text-center text-gray-500 text-sm mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
    code: ({ value }: { value: any }) => (
      <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto my-4">
        <code className="text-sm text-gray-300">{value.code}</code>
      </pre>
    ),
  },
  block: {
    h2: ({ children }: { children?: any }) => (
      <h2 className="text-3xl font-bold mt-10 mb-4" style={{ color: '#FCEE21' }}>{children}</h2>
    ),
    h3: ({ children }: { children?: any }) => (
      <h3 className="text-2xl font-bold mt-8 mb-3" style={{ color: '#FCEE21' }}>{children}</h3>
    ),
    h4: ({ children }: { children?: any }) => (
      <h4 className="text-xl font-bold mt-6 mb-2 text-white">{children}</h4>
    ),
    blockquote: ({ children }: { children?: any }) => (
      <blockquote className="border-l-4 border-[#FCEE21] pl-4 my-6 italic text-gray-300">
        {children}
      </blockquote>
    ),
    normal: ({ children }: { children?: any }) => (
      <p className="text-gray-300 leading-relaxed mb-4">{children}</p>
    ),
  },
  marks: {
    link: ({ children, value }: { children?: any; value?: any }) => (
      <a
        href={value?.href || '#'}
        className="text-[#FCEE21] hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    strong: ({ children }: { children?: any }) => (
      <strong className="font-bold text-white">{children}</strong>
    ),
  },
  list: {
    bullet: ({ children }: { children?: any }) => (
      <ul className="list-disc list-inside space-y-2 my-4 text-gray-300">{children}</ul>
    ),
    number: ({ children }: { children?: any }) => (
      <ol className="list-decimal list-inside space-y-2 my-4 text-gray-300">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: any }) => <li>{children}</li>,
    number: ({ children }: { children?: any }) => <li>{children}</li>,
  },
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
          image: post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : undefined,
          datePublished: post.publishedAt,
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
                {new Date(post.publishedAt).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
              {post.readTime && (
                <span className="flex items-center gap-2">
                  <Clock size={16} />
                  {post.readTime}
                </span>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Imagen destacada */}
      {post.mainImage && (
        <section style={{ backgroundColor: '#16122B' }} className="pb-12">
          <Container>
            <div className="max-w-4xl mx-auto">
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
                <img
                  src={urlFor(post.mainImage).width(1200).height(675).url()}
                  alt={post.mainImage.alt || post.title}
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

            {/* Contenido principal con Portable Text */}
            <article className="prose prose-invert prose-lg max-w-none markdown-content">
              {post.content && (
                <PortableText value={post.content} components={portableTextComponents} />
              )}
            </article>
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
