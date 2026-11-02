'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Container from '@/components/common/Container'
import Link from 'next/link'
import { Calendar, Clock, Filter, ArrowRight, FileText } from 'lucide-react'
import type { Category } from '@/lib/types/database'
import type { PostSummary } from '@/lib/db/posts'
import { formatPostDate } from '@/lib/post-date'

interface BlogFiltersProps {
  posts: PostSummary[]
  categories: Category[]
  selectedCategory: string
  page: number
  totalPages: number
}

export default function BlogFilters({ posts, categories, selectedCategory, page, totalPages }: BlogFiltersProps) {
  const router = useRouter()
  const allCategories = [{ slug: '', title: 'Todos' }, ...categories]
  const urlFor = (category: string, number = 1) => {
    const params = new URLSearchParams()
    if (category) params.set('categoria', category)
    if (number > 1) params.set('pagina', String(number))
    return `/blog${params.size ? `?${params}` : ''}`
  }

  return (
    <>
      {/* ═══════ Filtros ═══════ */}
      <section className="relative bg-brand-dusk py-6 border-y border-border-subtle sticky top-20 md:top-24 z-20 backdrop-blur-sm">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-fluid-xs text-muted mr-3 uppercase tracking-wider font-semibold">
              <Filter className="w-3.5 h-3.5" />
              Filtros
            </span>
            {allCategories.map((category) => {
              const active = selectedCategory === category.slug
              return (
                <button
                  key={category.slug}
                  type="button"
                  aria-pressed={active}
                  onClick={() => router.push(urlFor(category.slug), { scroll: false })}
                  className={
                    'px-4 py-1.5 rounded-full text-fluid-xs font-semibold transition-all ' +
                    (active
                      ? 'bg-accent text-accent-fg shadow-glow'
                      : 'text-muted border border-border-subtle hover:text-white hover:border-border-strong bg-brand-night')
                  }
                >
                  {category.title}
                </button>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ═══════ Posts ═══════ */}
      <section className="relative py-fluid-xl bg-brand-deep">
        <Container>
          {posts.length === 0 ? (
            <div className="text-center py-fluid-lg max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-accent-muted border border-border-subtle flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6 text-muted" />
              </div>
              <p className="text-fluid-lg text-muted">No hay artículos en esta categoría todavía.</p>
              <button
                onClick={() => router.push('/blog', { scroll: false })}
                className="btn-ghost text-fluid-sm px-6 py-2.5"
              >
                Ver todos los artículos
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="surface-card hover-lift rounded-2xl overflow-hidden group flex flex-col"
                >
                  <div className="relative h-48 bg-brand-night overflow-hidden">
                    {post.main_image_url ? (
                      <Image
                        src={post.main_image_url}
                        alt={post.main_image_alt || post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-violet/20 to-brand-deep flex items-center justify-center">
                        <FileText className="w-12 h-12 text-accent/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <span className="self-start inline-block text-fluid-xs font-bold px-3 py-1 rounded-full bg-accent-soft text-accent border border-accent/20 uppercase tracking-wider">
                      {post.category?.title || 'Sin categoría'}
                    </span>

                    <h2 className="text-fluid-lg font-semibold text-white mt-4 mb-3 tracking-tight line-clamp-2 leading-snug">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-accent transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-fluid-sm text-muted mb-4 line-clamp-3 leading-relaxed flex-1">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-4 text-fluid-xs text-subtle mb-5">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatPostDate(post.published_at)}
                      </span>
                      {post.read_time && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {post.read_time}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      aria-label={`Leer artículo: ${post.title}`}
                      className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-fluid-sm border border-border-strong text-accent hover:bg-accent hover:text-accent-fg transition-all"
                    >
                      Leer artículo
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
          {totalPages > 1 && (
            <nav aria-label="Páginas del blog" className="mt-10 flex flex-wrap justify-center gap-3">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(number => (
                <Link key={number} href={urlFor(selectedCategory, number)} aria-current={page === number ? 'page' : undefined} className={page === number ? 'btn-brand min-h-11 px-4' : 'btn-ghost min-h-11 px-4'}>
                  <span className="sr-only">Página </span>{number}
                </Link>
              ))}
            </nav>
          )}
        </Container>
      </section>
    </>
  )
}
