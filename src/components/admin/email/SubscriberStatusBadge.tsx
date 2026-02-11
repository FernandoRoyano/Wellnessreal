'use client'

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  active: { label: 'Activo', bg: 'rgba(74, 222, 128, 0.2)', text: '#4ade80' },
  unsubscribed: { label: 'Baja', bg: 'rgba(156, 163, 175, 0.2)', text: '#9ca3af' },
  unconfirmed: { label: 'Sin confirmar', bg: 'rgba(252, 238, 33, 0.2)', text: '#FCEE21' },
  bounced: { label: 'Rebotado', bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' },
  junk: { label: 'Spam', bg: 'rgba(251, 146, 60, 0.2)', text: '#fb923c' },
}

export default function SubscriberStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.active

  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-bold inline-block"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {config.label}
    </span>
  )
}
