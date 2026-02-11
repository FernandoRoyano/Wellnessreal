'use client'

import AdminSidebar from '@/components/admin/AdminSidebar'
import CampaignForm from '@/components/admin/email/CampaignForm'

export default function NewCampaignPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8" style={{ backgroundColor: '#16122B' }}>
        <h1 className="text-3xl font-bold mb-8" style={{ color: '#FCEE21' }}>
          Nueva campaña
        </h1>
        <div
          className="rounded-xl p-8"
          style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
        >
          <CampaignForm />
        </div>
      </main>
    </div>
  )
}
