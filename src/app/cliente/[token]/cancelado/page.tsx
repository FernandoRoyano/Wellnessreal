'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default function PaymentCancelledPage() {
  const params = useParams()
  const token = params.token as string

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#16122B' }}>
      <div className="max-w-md text-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: 'rgba(251, 146, 60, 0.2)' }}
        >
          <XCircle size={48} className="text-orange-400" />
        </div>

        <h1 className="text-3xl font-bold text-orange-400 mb-4">
          Pago cancelado
        </h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          El pago no se ha completado. No se ha realizado ningún cargo.
          Puedes volver a intentarlo cuando quieras.
        </p>

        <Link
          href={`/cliente/${token}`}
          className="inline-block px-8 py-3 rounded-lg font-bold transition-all"
          style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
        >
          Volver a mi propuesta
        </Link>
      </div>
    </div>
  )
}
