'use client'

import { useStagger } from '@/hooks/useGSAP'

interface StaggerChildrenProps {
  children: React.ReactNode
  className?: string
  y?: number
  stagger?: number
  duration?: number
  childSelector?: string
}

export default function StaggerChildren({
  children,
  className,
  y = 50,
  stagger = 0.12,
  duration = 0.7,
  childSelector,
}: StaggerChildrenProps) {
  const ref = useStagger<HTMLDivElement>({ y, stagger, duration, childSelector })

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
