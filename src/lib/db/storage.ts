import { supabase } from '@/lib/supabase'

export async function uploadImage(buffer: Buffer, fileName: string, contentType: string): Promise<string> {
  const path = `blog/${Date.now()}-${fileName}`

  const { error } = await supabase.storage
    .from('media')
    .upload(path, buffer, {
      cacheControl: '3600',
      contentType,
      upsert: false,
    })

  if (error) throw error

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
