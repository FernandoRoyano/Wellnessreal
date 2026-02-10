'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import ProposalList from '@/components/admin/ProposalList'
import Link from 'next/link'
import { PlusCircle, FileText, Clock, CreditCard, CheckCircle } from 'lucide-react'

interface Proposal {
  _id: string
  clientName: string
  clientEmail: string
  serviceLabel: string
  price: number
  status: string
  createdAt: string
}

export default function AdminDashboardPage() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/proposals')
      .then((res) => res.json())
      .then((data) => setProposals(data.proposals || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const stats = {
    total: proposals.length,
    pending: proposals.filter((p) => ['pending', 'viewed'].includes(p.status)).length,
    signed: proposals.filter((p) => ['signed', 'payment_pending'].includes(p.status)).length,
    paid: proposals.filter((p) => ['paid', 'confirmed'].includes(p.status)).length,
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8" style={{ backgroundColor: '#16122B' }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" style={{ color: '#FCEE21' }}>
            Dashboard
          </h1>
          <Link
            href="/admin/proposals/new"
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all hover:scale-105"
            style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
          >
            <PlusCircle size={20} />
            Nueva propuesta
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total', value: stats.total, icon: FileText, color: '#FCEE21' },
            { label: 'Pendientes', value: stats.pending, icon: Clock, color: '#60a5fa' },
            { label: 'Firmadas', value: stats.signed, icon: CreditCard, color: '#fb923c' },
            { label: 'Pagadas', value: stats.paid, icon: CheckCircle, color: '#4ade80' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-6 rounded-xl"
              style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <stat.icon size={20} style={{ color: stat.color }} />
                <span className="text-sm text-gray-500">{stat.label}</span>
              </div>
              <p className="text-3xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Proposals table */}
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
        >
          <h2 className="text-xl font-bold text-white mb-6">Propuestas</h2>
          {loading ? (
            <p className="text-gray-500 text-center py-8">Cargando...</p>
          ) : (
            <ProposalList proposals={proposals} />
          )}
        </div>
      </main>
    </div>
  )
}
