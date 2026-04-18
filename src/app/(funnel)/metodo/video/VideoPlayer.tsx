'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { PlayCircle } from 'lucide-react'

interface VideoPlayerProps {
  url: string
}

export default function VideoPlayer({ url }: VideoPlayerProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power3.out',
      delay: 0.2,
    })
  }, [])

  // Detect video type and render accordingly
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be')
  const isVimeo = url.includes('vimeo.com')
  const isMp4 = url.endsWith('.mp4') || url.endsWith('.webm')

  const getYouTubeEmbed = (u: string) => {
    const match = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?\s]+)/)
    const id = match ? match[1] : ''
    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`
  }

  const getVimeoEmbed = (u: string) => {
    const match = u.match(/vimeo\.com\/(\d+)/)
    const id = match ? match[1] : ''
    return `https://player.vimeo.com/video/${id}`
  }

  return (
    <div
      ref={ref}
      className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
      style={{
        aspectRatio: '16 / 9',
        border: '2px solid rgba(252,238,33,0.3)',
        boxShadow: '0 0 60px rgba(252,238,33,0.15)',
      }}
    >
      {url ? (
        isYouTube ? (
          <iframe
            src={getYouTubeEmbed(url)}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : isVimeo ? (
          <iframe
            src={getVimeoEmbed(url)}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : isMp4 ? (
          <video
            src={url}
            controls
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0f0c20] text-gray-400">
            Formato de vídeo no soportado
          </div>
        )
      ) : (
        // Placeholder — vídeo aún no grabado
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
          style={{
            background:
              'linear-gradient(135deg, #0f0c20 0%, #1a1535 50%, #16122B 100%)',
          }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{
              backgroundColor: 'rgba(252,238,33,0.1)',
              border: '2px solid rgba(252,238,33,0.4)',
            }}
          >
            <PlayCircle size={42} style={{ color: '#FCEE21' }} />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
            Estoy preparando el vídeo
          </h3>
          <p className="text-gray-400 text-sm md:text-base max-w-md">
            En cuanto esté listo recibirás un email con el enlace directo.
            Mientras tanto, puedes solicitar la valoración abajo si lo tienes claro.
          </p>
        </div>
      )}
    </div>
  )
}
