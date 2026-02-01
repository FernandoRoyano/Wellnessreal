import { groq } from 'next-sanity'
import { client, projectId } from './client'

// Helper para verificar si Sanity está configurado
const isSanityConfigured = () => projectId !== 'placeholder'

// Tipos
export interface SanityPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  author: string
  mainImage?: {
    asset: {
      _ref: string
    }
    alt?: string
  }
  category: {
    _id: string
    title: string
    slug: { current: string }
  }
  publishedAt: string
  readTime?: string
  content: any[]
  published: boolean
}

export interface SanityCategory {
  _id: string
  title: string
  slug: { current: string }
  description?: string
}

// Queries
const postFields = groq`
  _id,
  title,
  slug,
  excerpt,
  author,
  mainImage,
  category->{
    _id,
    title,
    slug
  },
  publishedAt,
  readTime,
  published
`

const postWithContentFields = groq`
  _id,
  title,
  slug,
  excerpt,
  author,
  mainImage,
  category->{
    _id,
    title,
    slug
  },
  publishedAt,
  readTime,
  content,
  published
`

// Obtener todos los posts publicados
export async function getAllPosts(): Promise<SanityPost[]> {
  if (!isSanityConfigured()) return []
  return client.fetch(
    groq`*[_type == "post" && published == true] | order(publishedAt desc) {
      ${postFields}
    }`
  )
}

// Obtener post por slug
export async function getPostBySlug(slug: string): Promise<SanityPost | null> {
  if (!isSanityConfigured()) return null
  return client.fetch(
    groq`*[_type == "post" && slug.current == $slug][0] {
      ${postWithContentFields}
    }`,
    { slug }
  )
}

// Obtener todos los slugs de posts (para generateStaticParams)
export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  if (!isSanityConfigured()) return []
  const posts = await client.fetch(
    groq`*[_type == "post" && published == true] {
      "slug": slug.current
    }`
  )
  return posts
}

// Obtener todas las categorías
export async function getAllCategories(): Promise<SanityCategory[]> {
  if (!isSanityConfigured()) return []
  return client.fetch(
    groq`*[_type == "category"] | order(title asc) {
      _id,
      title,
      slug,
      description
    }`
  )
}

// Obtener posts por categoría
export async function getPostsByCategory(categorySlug: string): Promise<SanityPost[]> {
  if (!isSanityConfigured()) return []
  return client.fetch(
    groq`*[_type == "post" && published == true && category->slug.current == $categorySlug] | order(publishedAt desc) {
      ${postFields}
    }`,
    { categorySlug }
  )
}
