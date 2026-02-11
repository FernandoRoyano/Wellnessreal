'use client'

import Link from 'next/link'
import SubscriberStatusBadge from './SubscriberStatusBadge'
import type { MLSubscriber } from '@/lib/types/mailerlite'

export default function SubscriberList({ subscribers }: { subscribers: MLSubscriber[] }) {
  if (subscribers.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg mb-2">No hay suscriptores todavía</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-gray-500 border-b" style={{ borderBottomColor: '#662D91' }}>
            <th className="pb-3 font-medium">Email</th>
            <th className="pb-3 font-medium">Nombre</th>
            <th className="pb-3 font-medium">Estado</th>
            <th className="pb-3 font-medium">Grupos</th>
            <th className="pb-3 font-medium">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((s) => (
            <tr
              key={s.id}
              className="border-b cursor-pointer hover:bg-white/5 transition"
              style={{ borderBottomColor: 'rgba(102, 45, 145, 0.3)' }}
            >
              <td className="py-4">
                <Link href={`/admin/email/subscribers/${s.id}`} className="block">
                  <p className="font-medium text-white">{s.email}</p>
                </Link>
              </td>
              <td className="py-4 text-gray-300 text-sm">
                <Link href={`/admin/email/subscribers/${s.id}`} className="block">
                  {s.fields?.name || '—'}
                </Link>
              </td>
              <td className="py-4">
                <Link href={`/admin/email/subscribers/${s.id}`} className="block">
                  <SubscriberStatusBadge status={s.status} />
                </Link>
              </td>
              <td className="py-4 text-gray-400 text-sm">
                <Link href={`/admin/email/subscribers/${s.id}`} className="block">
                  {s.groups?.length || 0}
                </Link>
              </td>
              <td className="py-4 text-gray-500 text-sm">
                <Link href={`/admin/email/subscribers/${s.id}`} className="block">
                  {new Date(s.subscribed_at || s.created_at).toLocaleDateString('es-ES')}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
