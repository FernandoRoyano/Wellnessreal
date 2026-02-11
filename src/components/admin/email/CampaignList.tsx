'use client'

import Link from 'next/link'
import CampaignStatusBadge from './CampaignStatusBadge'
import type { MLCampaign } from '@/lib/types/mailerlite'

export default function CampaignList({ campaigns }: { campaigns: MLCampaign[] }) {
  if (campaigns.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg mb-2">No hay campañas todavía</p>
        <Link
          href="/admin/email/campaigns/new"
          className="font-bold hover:underline"
          style={{ color: '#FCEE21' }}
        >
          Crear la primera campaña
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-gray-500 border-b" style={{ borderBottomColor: '#662D91' }}>
            <th className="pb-3 font-medium">Nombre</th>
            <th className="pb-3 font-medium">Asunto</th>
            <th className="pb-3 font-medium">Estado</th>
            <th className="pb-3 font-medium">Enviados</th>
            <th className="pb-3 font-medium">Aperturas</th>
            <th className="pb-3 font-medium">Clics</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr
              key={c.id}
              className="border-b cursor-pointer hover:bg-white/5 transition"
              style={{ borderBottomColor: 'rgba(102, 45, 145, 0.3)' }}
            >
              <td className="py-4">
                <Link href={`/admin/email/campaigns/${c.id}`} className="block">
                  <p className="font-medium text-white">{c.name}</p>
                  <p className="text-xs text-gray-500">
                    {c.sent_at
                      ? new Date(c.sent_at).toLocaleDateString('es-ES')
                      : new Date(c.created_at).toLocaleDateString('es-ES')}
                  </p>
                </Link>
              </td>
              <td className="py-4 text-gray-300 text-sm">
                <Link href={`/admin/email/campaigns/${c.id}`} className="block">
                  {c.emails?.[0]?.subject || '—'}
                </Link>
              </td>
              <td className="py-4">
                <Link href={`/admin/email/campaigns/${c.id}`} className="block">
                  <CampaignStatusBadge status={c.status} />
                </Link>
              </td>
              <td className="py-4 text-gray-300 text-sm">
                <Link href={`/admin/email/campaigns/${c.id}`} className="block">
                  {c.stats?.sent ?? '—'}
                </Link>
              </td>
              <td className="py-4 text-sm" style={{ color: '#4ade80' }}>
                <Link href={`/admin/email/campaigns/${c.id}`} className="block">
                  {c.stats?.open_rate?.string ?? '—'}
                </Link>
              </td>
              <td className="py-4 text-sm" style={{ color: '#60a5fa' }}>
                <Link href={`/admin/email/campaigns/${c.id}`} className="block">
                  {c.stats?.click_rate?.string ?? '—'}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
