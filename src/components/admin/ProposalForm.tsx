'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState, useEffect } from 'react'
import { serviceLabels, serviceTypes, planPresets } from '@/lib/validations/proposal'
import { getDefaultContractText } from '@/lib/contracts'
import { Copy, Check } from 'lucide-react'

const formSchema = z.object({
  clientName: z.string().min(2, 'Nombre requerido'),
  clientEmail: z.string().email('Email inválido'),
  clientPhone: z.string().min(9, 'Teléfono inválido'),
  serviceType: z.enum(serviceTypes),
  price: z.string().min(1, 'Precio requerido'),
  duration: z.string().min(1, 'Duración requerida'),
  description: z.string().optional(),
  contractText: z.string().min(50, 'El contrato debe tener al menos 50 caracteres'),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

export default function ProposalForm() {
  const [error, setError] = useState('')
  const [clientUrl, setClientUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceType: 'starter_1mes',
      price: '120',
      duration: '1 mes',
      description: planPresets.starter_1mes.description,
      contractText: '',
    },
  })

  const watchName = watch('clientName')
  const watchService = watch('serviceType')
  const watchPrice = watch('price')
  const watchDuration = watch('duration')

  // Auto-fill price, duration and description when service changes
  useEffect(() => {
    const preset = planPresets[watchService]
    if (preset && preset.price > 0) {
      setValue('price', String(preset.price))
    }
    if (preset && preset.duration) {
      setValue('duration', preset.duration)
    }
    if (preset && preset.description) {
      setValue('description', preset.description)
    }
  }, [watchService, setValue])

  const generateContract = () => {
    const text = getDefaultContractText({
      clientName: watchName || '[Nombre del cliente]',
      serviceLabel: serviceLabels[watchService] || '',
      price: parseFloat(watchPrice) || 0,
      duration: watchDuration || '[Duración]',
    })
    setValue('contractText', text)
  }

  const onSubmit = async (data: FormData) => {
    try {
      setError('')
      const response = await fetch('/api/admin/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          price: parseFloat(data.price),
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Error al crear propuesta')
      }

      const result = await response.json()
      setClientUrl(result.clientUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear propuesta')
    }
  }

  const copyUrl = async () => {
    await navigator.clipboard.writeText(clientUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (clientUrl) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: 'rgba(74, 222, 128, 0.2)' }}
        >
          <Check size={40} className="text-green-400" />
        </div>
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#FCEE21' }}>
          Propuesta creada
        </h2>
        <p className="text-gray-400 mb-6">Comparte este enlace con tu cliente:</p>
        <div
          className="flex items-center gap-2 p-4 rounded-lg mb-6"
          style={{ backgroundColor: '#16122B', border: '1px solid #662D91' }}
        >
          <input
            readOnly
            value={clientUrl}
            className="flex-1 bg-transparent text-white text-sm outline-none"
          />
          <button
            onClick={copyUrl}
            className="px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
            style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
          >
            {copied ? <><Check size={16} /> Copiado</> : <><Copy size={16} /> Copiar</>}
          </button>
        </div>
        <a
          href="/admin/dashboard"
          className="text-sm hover:underline"
          style={{ color: '#FCEE21' }}
        >
          Volver al dashboard
        </a>
      </div>
    )
  }

  const inputStyle = (hasError: boolean) => ({
    backgroundColor: '#16122B',
    borderColor: hasError ? '#ff6b6b' : '#662D91',
  })

  // Show price hint for the selected plan
  const currentPreset = planPresets[watchService]
  const priceHint = currentPreset?.price > 0
    ? `Tarifa: ${currentPreset.price}€ / ${currentPreset.duration}`
    : null

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <h3 className="text-lg font-bold" style={{ color: '#FCEE21' }}>Datos del cliente</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">Nombre *</label>
          <input
            {...register('clientName')}
            placeholder="Nombre completo"
            style={inputStyle(!!errors.clientName)}
            className="w-full px-4 py-3 rounded-lg text-white border focus:outline-none transition"
          />
          {errors.clientName && <p className="text-red-400 text-xs mt-1">{errors.clientName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">Email *</label>
          <input
            {...register('clientEmail')}
            type="email"
            placeholder="email@ejemplo.com"
            style={inputStyle(!!errors.clientEmail)}
            className="w-full px-4 py-3 rounded-lg text-white border focus:outline-none transition"
          />
          {errors.clientEmail && <p className="text-red-400 text-xs mt-1">{errors.clientEmail.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2">Teléfono *</label>
        <input
          {...register('clientPhone')}
          type="tel"
          placeholder="+34 XXX XXX XXX"
          style={inputStyle(!!errors.clientPhone)}
          className="w-full px-4 py-3 rounded-lg text-white border focus:outline-none transition"
        />
        {errors.clientPhone && <p className="text-red-400 text-xs mt-1">{errors.clientPhone.message}</p>}
      </div>

      <h3 className="text-lg font-bold pt-4" style={{ color: '#FCEE21' }}>Servicio</h3>

      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2">Plan / Servicio *</label>
        <select
          {...register('serviceType')}
          style={inputStyle(false)}
          className="w-full px-4 py-3 rounded-lg text-white border focus:outline-none transition"
        >
          <optgroup label="Planes de entrenamiento online" style={{ backgroundColor: '#16122B' }}>
            <option value="starter_1mes" style={{ backgroundColor: '#16122B' }}>Starter — 120€/mes</option>
            <option value="pack_3meses" style={{ backgroundColor: '#16122B' }}>Pack 3 Meses — 300€ (ahorra 60€)</option>
            <option value="premium_3meses" style={{ backgroundColor: '#16122B' }}>Premium — 500€/3 meses</option>
            <option value="solo_entrenamiento_trimestral" style={{ backgroundColor: '#16122B' }}>Solo Entrenamiento — 180€/trimestre (60€/mes)</option>
          </optgroup>
          <optgroup label="Servicios individuales" style={{ backgroundColor: '#16122B' }}>
            <option value="entrenamiento_presencial" style={{ backgroundColor: '#16122B' }}>Entrenamiento Presencial</option>
            <option value="consulta_nutricion" style={{ backgroundColor: '#16122B' }}>Consulta Nutrición — 50€</option>
            <option value="analisis_corporal" style={{ backgroundColor: '#16122B' }}>Análisis Corporal — 40€</option>
            <option value="sesion_osteopatia" style={{ backgroundColor: '#16122B' }}>Sesión Osteopatía — 60€</option>
          </optgroup>
          <optgroup label="Otros" style={{ backgroundColor: '#16122B' }}>
            <option value="pack_combinado" style={{ backgroundColor: '#16122B' }}>Pack Combinado (personalizar)</option>
            <option value="personalizado" style={{ backgroundColor: '#16122B' }}>Servicio Personalizado</option>
          </optgroup>
        </select>
        {priceHint && (
          <p className="text-xs mt-1" style={{ color: '#FCEE21' }}>{priceHint}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">Precio (€) *</label>
          <input
            {...register('price')}
            type="number"
            step="0.01"
            placeholder="120"
            style={inputStyle(!!errors.price)}
            className="w-full px-4 py-3 rounded-lg text-white border focus:outline-none transition"
          />
          {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price.message}</p>}
          <p className="text-xs text-gray-600 mt-1">Se puede ajustar manualmente</p>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-2">Duración *</label>
          <input
            {...register('duration')}
            placeholder="1 mes, 3 meses, 1 sesión..."
            style={inputStyle(!!errors.duration)}
            className="w-full px-4 py-3 rounded-lg text-white border focus:outline-none transition"
          />
          {errors.duration && <p className="text-red-400 text-xs mt-1">{errors.duration.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2">Descripción del servicio</label>
        <textarea
          {...register('description')}
          rows={3}
          placeholder="Detalles específicos del servicio..."
          style={inputStyle(false)}
          className="w-full px-4 py-3 rounded-lg text-white border focus:outline-none transition resize-none"
        />
      </div>

      <h3 className="text-lg font-bold pt-4" style={{ color: '#FCEE21' }}>Contrato</h3>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-bold text-gray-300">Texto del contrato *</label>
          <button
            type="button"
            onClick={generateContract}
            className="text-xs px-3 py-1 rounded-full font-bold transition"
            style={{ backgroundColor: 'rgba(252, 238, 33, 0.1)', color: '#FCEE21' }}
          >
            Generar plantilla
          </button>
        </div>
        <textarea
          {...register('contractText')}
          rows={12}
          placeholder="Escribe el contrato o genera la plantilla..."
          style={inputStyle(!!errors.contractText)}
          className="w-full px-4 py-3 rounded-lg text-white border focus:outline-none transition resize-none text-sm"
        />
        {errors.contractText && <p className="text-red-400 text-xs mt-1">{errors.contractText.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2">Notas internas</label>
        <textarea
          {...register('notes')}
          rows={2}
          placeholder="Notas visibles solo para ti..."
          style={inputStyle(false)}
          className="w-full px-4 py-3 rounded-lg text-white border focus:outline-none transition resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 rounded-lg font-bold text-lg transition-all disabled:opacity-50"
        style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
      >
        {isSubmitting ? 'Creando propuesta...' : 'Crear propuesta y generar enlace'}
      </button>
    </form>
  )
}
