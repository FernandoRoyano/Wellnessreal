import { NextResponse } from 'next/server'
import { getAllPosts } from '../../../../sanity/lib/queries'
import { urlFor } from '../../../../sanity/lib/image'

export async function GET() {
  try {
    const posts = await getAllPosts()

    // Devolver datos formateados para el listado
    const postsForListing = posts.map(post => ({
      slug: post.slug.current,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category?.title || 'Sin categoría',
      author: post.author,
      date: post.publishedAt,
      readTime: post.readTime,
      image: post.mainImage ? urlFor(post.mainImage).width(400).height(200).url() : null,
    }))

    return NextResponse.json(postsForListing)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Error al cargar los artículos' },
      { status: 500 }
    )
  }
}
