import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { getAllPostsAdmin, createPost } from '@/lib/db/posts'

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const posts = await getAllPostsAdmin()
    return NextResponse.json({ posts })
  } catch (err) {
    console.error('[GET /api/admin/blog]', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { title, slug, excerpt, author, main_image_url, main_image_alt, category_id, published_at, read_time, content, published } = body

    if (!title || !slug || !excerpt || !content) {
      return NextResponse.json({ error: 'Faltan campos obligatorios (title, slug, excerpt, content)' }, { status: 400 })
    }

    const post = await createPost({
      title,
      slug,
      excerpt,
      author: author || 'Fernando Royano',
      main_image_url: main_image_url || null,
      main_image_alt: main_image_alt || null,
      category_id: category_id || null,
      published_at: published_at || new Date().toISOString(),
      read_time: read_time || null,
      content,
      published: published || false,
    })

    return NextResponse.json({ success: true, post })
  } catch (err) {
    console.error('[POST /api/admin/blog]', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
