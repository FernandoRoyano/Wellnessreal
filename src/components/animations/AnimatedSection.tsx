'use client'

import { useReveal } from '@/hooks/useGSAP'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  y?: number
  duration?: number
  delay?: number
}

export default function AnimatedSection({
  children,
  className,
  y = 60,
  duration = 0.8,
  delay = 0,
}: AnimatedSectionProps) {
  const ref = useReveal<HTMLDivElement>({ y, duration, delay })

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
