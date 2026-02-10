'use client'

import Link from 'next/link'
import ProposalStatusBadge from './ProposalStatusBadge'

interface Proposal {
  _id: string
  clientName: string
  clientEmail: string
  serviceLabel: string
  price: number
  status: string
  createdAt: string
}

export default function ProposalList({ proposals }: { proposals: Proposal[] }) {
  if (proposals.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg mb-2">No hay propuestas todavía</p>
        <Link
          href="/admin/proposals/new"
          className="font-bold hover:underline"
          style={{ color: '#FCEE21' }}
        >
          Crear la primera propuesta
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-gray-500 border-b" style={{ borderBottomColor: '#662D91' }}>
            <th className="pb-3 font-medium">Cliente</th>
            <th className="pb-3 font-medium">Servicio</th>
            <th className="pb-3 font-medium">Precio</th>
            <th className="pb-3 font-medium">Estado</th>
            <th className="pb-3 font-medium">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {proposals.map((p) => (
            <tr
              key={p._id}
              className="border-b cursor-pointer hover:bg-white/5 transition"
              style={{ borderBottomColor: 'rgba(102, 45, 145, 0.3)' }}
            >
              <td className="py-4">
                <Link href={`/admin/proposals/${p._id}`} className="block">
                  <p className="font-medium text-white">{p.clientName}</p>
                  <p className="text-xs text-gray-500">{p.clientEmail}</p>
                </Link>
              </td>
              <td className="py-4 text-gray-300 text-sm">
                <Link href={`/admin/proposals/${p._id}`} className="block">
                  {p.serviceLabel}
                </Link>
              </td>
              <td className="py-4 font-bold" style={{ color: '#FCEE21' }}>
                <Link href={`/admin/proposals/${p._id}`} className="block">
                  {p.price}€
                </Link>
              </td>
              <td className="py-4">
                <Link href={`/admin/proposals/${p._id}`} className="block">
                  <ProposalStatusBadge status={p.status} />
                </Link>
              </td>
              <td className="py-4 text-gray-500 text-sm">
                <Link href={`/admin/proposals/${p._id}`} className="block">
                  {new Date(p.createdAt).toLocaleDateString('es-ES')}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
