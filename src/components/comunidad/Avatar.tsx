import { initials } from '@/lib/comunidad-format'

export function Avatar({
  name,
  url,
  size = 36,
}: {
  name: string
  url?: string | null
  size?: number
}) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={url}
        alt={name}
        width={size}
        height={size}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-night)] font-semibold text-[var(--color-accent)]"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-hidden
    >
      {initials(name)}
    </div>
  )
}
