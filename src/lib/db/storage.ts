import { supabase } from '@/lib/supabase'

/**
 * Sanitiza un nombre de archivo para Supabase Storage:
 * - Quita acentos y caracteres no ASCII
 * - Reemplaza espacios y caracteres especiales por guiones
 * - Conserva la extensión
 */
function sanitizeFileName(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.')
  const name = lastDot > 0 ? fileName.slice(0, lastDot) : fileName
  const ext = lastDot > 0 ? fileName.slice(lastDot).toLowerCase() : ''

  const cleanName = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'image'

  return `${cleanName}${ext}`
}

export async function uploadImage(buffer: Buffer, fileName: string, contentType: string): Promise<string> {
  const safeName = sanitizeFileName(fileName)
  const path = `blog/${Date.now()}-${safeName}`

  const { error } = await supabase.storage
    .from('media')
    .upload(path, buffer, {
      cacheControl: '3600',
      contentType,
      upsert: false,
    })

  if (error) {
    console.error('[uploadImage] Supabase error:', error)
    throw error
  }

  const { data } = supabase.storage
    .from('media')
    .getPublicUrl(path)

  return data.publicUrl
}

export async function deleteImage(url: string): Promise<void> {
  try {
    const urlObj = new URL(url)
    const parts = urlObj.pathname.split('/storage/v1/object/public/media/')
    if (parts.length < 2) return

    await supabase.storage.from('media').remove([parts[1]])
  } catch {
    // Ignore deletion errors
  }
}
