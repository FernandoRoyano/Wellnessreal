'use client'

import { useState } from 'react'
import Container from '@/components/common/Container'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { Calendar, Clock, Filter } from 'lucide-react'
import { urlFor } from '../../../../sanity/lib/image'
import type { SanityPost, SanityCategory } from '../../../../sanity/lib/queries'

interface BlogFiltersProps {
  posts: SanityPost[]
  categories: SanityCategory[]
}

export default function BlogFilters({ posts, categories }: BlogFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos')

  const filteredPosts = selectedCategory === 'Todos'
    ? posts
    : posts.filter(post => post.category?.title === selectedCategory)

  const allCategories = ['Todos', ...categories.map(c => c.title)]

  return (
    <>
      {/* Filtros por categoría */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-6 border-b border-gray-800">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Filter size={18} className="text-gray-400 mr-2" />
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'text-[#16122B] font-bold'
                    : 'text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500'
                }`}
                style={selectedCategory === category ? { backgroundColor: '#FCEE21' } : {}}
              >
                {category}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Listado de posts */}
      <section style={{ backgroundColor: '#16122B' }} className="py-16 md:py-20">
        <Container>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No hay artículos en esta categoría todavía.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post._id}
                  className="rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300"
                  style={{ backgroundColor: '#1a1535', border: '1px solid #662D91' }}
                >
                  <div className="relative h-48 bg-gray-800">
                    {post.mainImage ? (
                      <img
                        src={urlFor(post.mainImage).width(400).height(200).url()}
                        alt={post.mainImage.alt || post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(102, 45, 145, 0.3)' }}
                      >
                        <span className="text-6xl opacity-30">📝</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{ backgroundColor: 'rgba(252, 238, 33, 0.15)', color: '#FCEE21' }}
                    >
                      {post.category?.title || 'Sin categoría'}
                    </span>

                    <h2 className="text-xl font-bold text-white mt-4 mb-3 line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-5">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(post.publishedAt).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      {post.readTime && (
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {post.readTime}
                        </span>
                      )}
                    </div>

                    <Link href={`/blog/${post.slug.current}`}>
                      <Button variant="primary" size="md" className="w-full">
                        Leer artículo
                      </Button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
