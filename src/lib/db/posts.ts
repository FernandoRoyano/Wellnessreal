import { supabase } from '@/lib/supabase'
import type { PostWithCategory, Category } from '@/lib/types/database'

// --- Public queries ---

export async function getAllPosts(): Promise<PostWithCategory[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*, category:categories(*)')
    .eq('published', true)
    .order('published_at', { ascending: false })

  if (error) throw error
  return (data || []) as PostWithCategory[]
}

export async function getPostBySlug(slug: string): Promise<PostWithCategory | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return (data as PostWithCategory) || null
}

export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('slug')
    .eq('published', true)

  if (error) throw error
  return data || []
}

export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('title', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getPostsByCategory(categorySlug: string): Promise<PostWithCategory[]> {
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single()

  if (!category) return []

  const { data, error } = await supabase
    .from('posts')
    .select('*, category:categories(*)')
    .eq('published', true)
    .eq('category_id', category.id)
    .order('published_at', { ascending: false })

  if (error) throw error
  return (data || []) as PostWithCategory[]
}

// --- Admin CRUD ---

export async function getAllPostsAdmin(): Promise<PostWithCategory[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*, category:categories(*)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []) as PostWithCategory[]
}

export async function getPostById(id: string): Promise<PostWithCategory | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return (data as PostWithCategory) || null
}

export async function createPost(post: {
  title: string
  slug: string
  excerpt: string
  author?: string
  main_image_url?: string | null
  main_image_alt?: string | null
  category_id?: string | null
  published_at?: string
  read_time?: string | null
  content: string
  published?: boolean
}) {
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updatePost(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deletePost(id: string) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

// --- Category CRUD ---

export async function createCategory(category: { title: string; slug: string; description?: string }) {
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateCategory(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteCategory(id: string) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}
