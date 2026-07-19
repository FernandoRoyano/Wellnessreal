import { Node, mergeAttributes } from '@tiptap/core'

// ============================================================
//  Extensión TipTap · Vídeo embebido (YouTube / Vimeo)
//  Inserta un iframe responsive 16:9. Acepta cualquier enlace
//  de YouTube o Vimeo y lo normaliza a su URL de embed.
// ============================================================

export interface VideoEmbedOptions {
  HTMLAttributes: Record<string, unknown>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    videoEmbed: {
      setVideoEmbed: (options: { src: string }) => ReturnType
    }
  }
}

/** Convierte un enlace de YouTube/Vimeo en su URL de embed, o null si no es válido. */
export function toEmbedUrl(raw: string): string | null {
  const url = raw.trim()

  // YouTube: watch, youtu.be, shorts, embed
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  )
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`

  // Vimeo: vimeo.com/123456789 o player.vimeo.com/video/123456789
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`

  // Ya es una URL de embed
  if (/(?:youtube\.com\/embed\/|player\.vimeo\.com\/video\/)/.test(url)) return url

  return null
}

export const VideoEmbed = Node.create<VideoEmbedOptions>({
  name: 'videoEmbed',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,

  addOptions() {
    return { HTMLAttributes: {} }
  },

  addAttributes() {
    return {
      src: { default: null },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-video-embed]',
        getAttrs: (el) => {
          const iframe = (el as HTMLElement).querySelector('iframe')
          return { src: iframe?.getAttribute('src') ?? null }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { 'data-video-embed': '', class: 'video-embed' },
      [
        'iframe',
        mergeAttributes(this.options.HTMLAttributes, {
          src: HTMLAttributes.src,
          frameborder: '0',
          allow:
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
          allowfullscreen: 'true',
        }),
      ],
    ]
  },

  addCommands() {
    return {
      setVideoEmbed:
        (options) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { src: options.src } }),
    }
  },
})
