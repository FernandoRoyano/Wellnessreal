'use client'

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  draft: { label: 'Borrador', bg: 'rgba(252, 238, 33, 0.2)', text: '#FCEE21' },
  ready: { label: 'Listo', bg: 'rgba(96, 165, 250, 0.2)', text: '#60a5fa' },
  sending: { label: 'Enviando', bg: 'rgba(251, 146, 60, 0.2)', text: '#fb923c' },
  sent: { label: 'Enviado', bg: 'rgba(74, 222, 128, 0.2)', text: '#4ade80' },
}

export default function CampaignStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.draft

  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-bold inline-block"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {config.label}
    </span>
  )
}
