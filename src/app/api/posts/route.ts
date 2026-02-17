import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/db/posts'

export async function GET() {
  try {
    const posts = await getAllPosts()

    const postsForListing = posts.map(post => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category?.title || 'Sin categoría',
      author: post.author,
      date: post.published_at,
      readTime: post.read_time,
      image: post.main_image_url,
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
