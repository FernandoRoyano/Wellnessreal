'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const BASE =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 ease-out ' +
  'disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep'

const VARIANTS = {
  primary:
    'bg-accent text-accent-fg shadow-[0_8px_24px_-8px_rgba(252,238,33,0.55)] hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-8px_rgba(252,238,33,0.7)] active:translate-y-0',
  secondary:
    'bg-brand-violet text-white shadow-md hover:bg-brand-violet/90 hover:-translate-y-0.5',
  outline:
    'border border-border-strong text-accent bg-accent-muted/30 hover:bg-accent-muted hover:border-accent',
  ghost:
    'text-white/75 hover:text-white hover:bg-white/5',
} as const

const SIZES = {
  sm: 'h-9  px-4 text-fluid-sm',
  md: 'h-11 px-6 text-fluid-sm',
  lg: 'h-14 px-8 text-fluid-base',
} as const

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      {...props}
    >
      {children}
    </button>
  )
)

Button.displayName = 'Button'

export default Button
