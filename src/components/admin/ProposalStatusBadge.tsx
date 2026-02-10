'use client'

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pendiente', bg: 'rgba(156, 163, 175, 0.2)', text: '#9ca3af' },
  viewed: { label: 'Visto', bg: 'rgba(96, 165, 250, 0.2)', text: '#60a5fa' },
  signed: { label: 'Firmado', bg: 'rgba(252, 238, 33, 0.2)', text: '#FCEE21' },
  payment_pending: { label: 'Pago pendiente', bg: 'rgba(251, 146, 60, 0.2)', text: '#fb923c' },
  paid: { label: 'Pagado', bg: 'rgba(74, 222, 128, 0.2)', text: '#4ade80' },
  confirmed: { label: 'Confirmado', bg: 'rgba(74, 222, 128, 0.3)', text: '#22c55e' },
}

export default function ProposalStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.pending

  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-bold inline-block"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {config.label}
    </span>
  )
}
