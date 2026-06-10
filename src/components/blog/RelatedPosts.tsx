import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, FileText } from 'lucide-react'
import Container from '@/components/common/Container'
import type { PostWithCategory } from '@/lib/types/database'

interface RelatedPostsProps {
  posts: PostWithCategory[]
}

// Sección de artículos relacionados al final de cada post. Reparte autoridad
// interna entre los posts y mejora la permanencia del usuario en el sitio.
export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <section className="relative py-fluid-xl bg-brand-deep">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
      <Container>
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-fluid-lg">
          <span className="eyebrow justify-center">Sigue leyendo</span>
          <h2 className="headline text-fluid-4xl text-white">
            Artículos <span className="text-gradient-brand">relacionados</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {posts.map((post) => (
            <article
              key={post.id}
              className="surface-card hover-lift rounded-2xl overflow-hidden group flex flex-col"
            >
              <Link href={`/blog/${post.slug}`} className="relative h-40 bg-brand-night overflow-hidden block">
                {post.main_image_url ? (
                  <Image
                    src={post.main_image_url}
                    alt={post.main_image_alt || post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-violet/20 to-brand-deep flex items-center justify-center">
                    <FileText className="w-10 h-10 text-accent/30" />
                  </div>
                )}
              </Link>

              <div className="p-6 flex flex-col flex-1">
                {post.category && (
                  <span className="self-start inline-block text-fluid-xs font-bold px-3 py-1 rounded-full bg-accent-soft text-accent border border-accent/20 uppercase tracking-wider mb-3">
                    {post.category.title}
                  </span>
                )}
                <h3 className="text-fluid-base font-semibold text-white mb-4 tracking-tight line-clamp-2 leading-snug flex-1">
                  <Link href={`/blog/${post.slug}`} className="hover:text-accent transition-colors">
                    {post.title}
                  </Link>
                </h3>
                <Link
                  href={`/blog/${post.slug}`}
                  aria-label={`Leer artículo: ${post.title}`}
                  className="inline-flex items-center gap-1.5 text-fluid-sm font-semibold text-accent hover:gap-2.5 transition-all"
                >
                  Leer artículo
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
