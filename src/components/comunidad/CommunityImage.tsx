import { communityMedia } from '@/lib/community-media'

export function CommunityImage({ src, alt, className, sizes = '100vw', loading = 'lazy' }: {
  src: string; alt?: string; className?: string; sizes?: string; loading?: 'lazy' | 'eager'
}) {
  const media = communityMedia(src)
  return (
    // Imágenes comprimidas y variantes propias: la optimización de Vercel está desactivada por cuota.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt ?? media.alt} className={className} width={media.kind === 'portrait' ? 896 : 1600} height={media.kind === 'portrait' ? 1152 : 900}
      srcSet={media.thumbnail ? `${media.thumbnail} 400w, ${src} 1600w` : undefined} sizes={media.thumbnail ? sizes : undefined}
      loading={loading} decoding="async" style={{ objectPosition: media.position }} />
  )
}
