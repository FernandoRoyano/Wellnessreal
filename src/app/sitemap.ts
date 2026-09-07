import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/db/posts'

const SITE_URL = 'https://wellnessreal.es'
const STATIC_PAGES_UPDATED_AT = new Date('2026-09-07')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: STATIC_PAGES_UPDATED_AT,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/servicios`,
      lastModified: STATIC_PAGES_UPDATED_AT,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/servicios/entrenamiento-online`,
      lastModified: STATIC_PAGES_UPDATED_AT,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/servicios/entrenamiento-personalizado`,
      lastModified: STATIC_PAGES_UPDATED_AT,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/servicios/nutricion`,
      lastModified: STATIC_PAGES_UPDATED_AT,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/servicios/osteopatia`,
      lastModified: STATIC_PAGES_UPDATED_AT,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tarifas`,
      lastModified: STATIC_PAGES_UPDATED_AT,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/filosofia`,
      lastModified: STATIC_PAGES_UPDATED_AT,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/valoracion`,
      lastModified: STATIC_PAGES_UPDATED_AT,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contacto`,
      lastModified: STATIC_PAGES_UPDATED_AT,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/recurso-gratis`,
      lastModified: STATIC_PAGES_UPDATED_AT,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/tiroides`,
      lastModified: STATIC_PAGES_UPDATED_AT,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/metodo-tiroides`,
      lastModified: STATIC_PAGES_UPDATED_AT,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/caso-real`,
      lastModified: STATIC_PAGES_UPDATED_AT,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: STATIC_PAGES_UPDATED_AT,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/privacidad`,
      lastModified: STATIC_PAGES_UPDATED_AT,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/terminos`,
      lastModified: STATIC_PAGES_UPDATED_AT,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]

  // Blog posts from Supabase
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const posts = await getAllPosts()
    blogPages = posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || post.published_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch {
    // Supabase not configured or unavailable — skip blog posts
  }

  return [...staticPages, ...blogPages]
}
