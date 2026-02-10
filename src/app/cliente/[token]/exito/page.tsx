'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function PaymentSuccessPage() {
  const params = useParams()
  const token = params.token as string

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#16122B' }}>
      <div className="max-w-md text-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: 'rgba(74, 222, 128, 0.2)' }}
        >
          <CheckCircle size={48} className="text-green-400" />
        </div>

        <h1 className="text-3xl font-bold text-green-400 mb-4">
          Pago realizado
        </h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Tu pago se ha procesado correctamente. Nos pondremos en contacto contigo
          para comenzar con tu servicio.
        </p>

        <Link
          href={`/cliente/${token}`}
          className="inline-block px-8 py-3 rounded-lg font-bold transition-all"
          style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
        >
          Ver tu propuesta
        </Link>
      </div>
    </div>
  )
}
