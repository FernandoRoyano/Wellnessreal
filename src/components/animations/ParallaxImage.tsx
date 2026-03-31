'use client'

import { useParallax } from '@/hooks/useGSAP'
import Image from 'next/image'

interface ParallaxImageProps {
  src: string
  alt: string
  className?: string
  speed?: number
  priority?: boolean
}

export default function ParallaxImage({
  src,
  alt,
  className = '',
  speed = 0.2,
  priority = false,
}: ParallaxImageProps) {
  const ref = useParallax<HTMLDivElement>(speed)

  return (
    <div ref={ref} className={`absolute inset-0 scale-[1.2] ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-center"
        priority={priority}
      />
    </div>
  )
}
