'use client'

import { useScrollProgress } from '@/hooks/useGSAP'

export default function ScrollProgressBar() {
  const ref = useScrollProgress<HTMLDivElement>()

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[100] pointer-events-none">
      <div
        ref={ref}
        className="h-full origin-left"
        style={{
          background: 'linear-gradient(90deg, #FCEE21, #662D91)',
          transform: 'scaleX(0)',
        }}
      />
    </div>
  )
}
