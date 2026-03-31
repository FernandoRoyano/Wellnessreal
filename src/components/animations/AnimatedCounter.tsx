'use client'

import { useCounter } from '@/hooks/useGSAP'

interface AnimatedCounterProps {
  end: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}

export default function AnimatedCounter({
  end,
  prefix = '',
  suffix = '',
  duration = 2,
  className,
}: AnimatedCounterProps) {
  const ref = useCounter<HTMLSpanElement>(end, { duration, prefix, suffix })

  return (
    <span ref={ref} className={className} style={{ color: '#FCEE21' }}>
      {prefix}0{suffix}
    </span>
  )
}
