'use client'

import { useEffect, useRef } from 'react'
import { Play } from 'lucide-react'
import { trackThyroidFunnel } from '@/lib/analytics'

const MILESTONES = [25, 50, 75, 90] as const

function youtubeEmbed(url: string): string {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?\s]+)/)
  return `https://www.youtube-nocookie.com/embed/${match?.[1] ?? ''}?rel=0&modestbranding=1`
}

function vimeoEmbed(url: string): string {
  const match = url.match(/vimeo\.com\/(\d+)/)
  return `https://player.vimeo.com/video/${match?.[1] ?? ''}?dnt=1`
}

export default function ThyroidClassVideo({ url }: { url: string }) {
  const reachedMilestones = useRef(new Set<number>())
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be')
  const isVimeo = url.includes('vimeo.com')
  const isNativeVideo = /\.(mp4|webm)(\?.*)?$/i.test(url)

  useEffect(() => {
    trackThyroidFunnel('thyroid_vsl_view', { page: 'thyroid_class_video' })
  }, [])

  function handleTimeUpdate(event: React.SyntheticEvent<HTMLVideoElement>) {
    const video = event.currentTarget
    if (!video.duration) return
    const progress = (video.currentTime / video.duration) * 100

    for (const milestone of MILESTONES) {
      if (progress >= milestone && !reachedMilestones.current.has(milestone)) {
        reachedMilestones.current.add(milestone)
        trackThyroidFunnel('thyroid_vsl_progress', { percent: milestone })
      }
    }
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#0d0a18] shadow-[0_28px_90px_rgba(0,0,0,.48)]">
      {url && isYouTube && <iframe title="Clase gratuita sobre entrenamiento y tiroides" src={youtubeEmbed(url)} className="absolute inset-0 h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />}
      {url && isVimeo && <iframe title="Clase gratuita sobre entrenamiento y tiroides" src={vimeoEmbed(url)} className="absolute inset-0 h-full w-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />}
      {url && isNativeVideo && <video src={url} controls playsInline preload="metadata" onPlay={() => trackThyroidFunnel('thyroid_vsl_progress', { percent: 0, action: 'play' })} onTimeUpdate={handleTimeUpdate} className="absolute inset-0 h-full w-full object-cover" />}
      {url && !isYouTube && !isVimeo && !isNativeVideo && <div className="absolute inset-0 grid place-items-center p-6 text-center text-white/60">El formato configurado no es compatible.</div>}
      {!url && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_20%,rgba(102,45,145,.35),transparent_58%)] p-6 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full border border-accent/35 bg-accent/10 text-accent"><Play className="ml-1 h-7 w-7 fill-current" /></span>
          <p className="mt-5 text-fluid-xl font-semibold text-white">Vídeo pendiente de grabación</p>
          <p className="mt-2 max-w-md text-fluid-sm leading-relaxed text-white/50">El guion ya está preparado. Cuando subas el vídeo, esta página lo mostrará sin cambiar el diseño.</p>
        </div>
      )}
    </div>
  )
}
