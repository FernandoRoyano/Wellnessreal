'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import SubscriberStatusBadge from '@/components/admin/email/SubscriberStatusBadge'
import { ArrowLeft, Mail, User, Calendar, Layers, Trash2 } from 'lucide-react'
import Link from 'next/link'
import type { MLSubscriber } from '@/lib/types/mailerlite'

export default function SubscriberDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [subscriber, setSubscriber] = useState<MLSubscriber | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/email/subscribers/${params.id}`)
      .then((r) => r.json())
      .then((data) => setSubscriber(data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [params.id])

  const handleDelete = async () => {
    if (!subscriber) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/email/subscribers/${subscriber.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        router.push('/admin/email/subscribers')
      }
    } catch {
      setDeleting(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8" style={{ backgroundColor: '#16122B' }}>
        <Link
          href="/admin/email/subscribers"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6 text-sm"
        >
          <ArrowLeft size={16} />
          Volver a suscriptores
        </Link>

        {loading ? (
          <p className="text-gray-500 text-center py-8">Cargando...</p>
        ) : !subscriber ? (
          <p className="text-gray-500 text-center py-8">Suscriptor no encontrado</p>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <h1 className="text-2xl font-bold text-white">{subscriber.email}</h1>
              <SubscriberStatusBadge status={subscriber.status} />
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Contact */}
              <div
                className="p-6 rounded-xl"
                style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
              >
                <h3 className="text-sm font-bold text-gray-500 mb-4">Contacto</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail size={16} style={{ color: '#FCEE21' }} />
                    <span className="text-white text-sm">{subscriber.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User size={16} style={{ color: '#FCEE21' }} />
                    <span className="text-white text-sm">
                      {subscriber.fields?.name || 'Sin nombre'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={16} style={{ color: '#FCEE21' }} />
                    <span className="text-gray-400 text-sm">
                      Suscrito el{' '}
                      {new Date(subscriber.subscribed_at || subscriber.created_at).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Groups */}
              <div
                className="p-6 rounded-xl"
                style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
              >
                <h3 className="text-sm font-bold text-gray-500 mb-4">Grupos</h3>
                {subscriber.groups && subscriber.groups.length > 0 ? (
                  <div className="space-y-2">
                    {subscriber.groups.map((g) => (
                      <div key={g.id} className="flex items-center gap-2">
                        <Layers size={14} style={{ color: '#a855f7' }} />
                        <span className="text-white text-sm">{g.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Sin grupos asignados</p>
                )}
              </div>

              {/* Details */}
              <div
                className="p-6 rounded-xl"
                style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102, 45, 145, 0.3)' }}
              >
                <h3 className="text-sm font-bold text-gray-500 mb-4">Detalles</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Fuente</p>
                    <p className="text-white text-sm">{subscriber.source || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">IP opt-in</p>
                    <p className="text-white text-sm">{subscriber.optin_ip || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Actualizado</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(subscriber.updated_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delete */}
            <div
              className="p-6 rounded-xl"
              style={{ backgroundColor: '#1a1535', border: '1px solid rgba(239, 68, 68, 0.3)' }}
            >
              <h3 className="text-sm font-bold text-red-400 mb-3">Zona peligrosa</h3>
              {!showDelete ? (
                <button
                  onClick={() => setShowDelete(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-red-400 border transition hover:bg-red-400/10"
                  style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}
                >
                  <Trash2 size={16} />
                  Eliminar suscriptor
                </button>
              ) : (
                <div>
                  <p className="text-gray-400 text-sm mb-3">
                    Esta acción eliminará al suscriptor de MailerLite. No se puede deshacer.
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="px-4 py-2 rounded-lg text-sm font-bold text-white transition disabled:opacity-50"
                      style={{ backgroundColor: '#ef4444' }}
                    >
                      {deleting ? 'Eliminando...' : 'Confirmar eliminación'}
                    </button>
                    <button
                      onClick={() => setShowDelete(false)}
                      className="px-4 py-2 rounded-lg text-sm font-bold text-gray-400 hover:text-white transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
