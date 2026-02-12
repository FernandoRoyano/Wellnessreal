'use client'

import Container from '@/components/common/Container'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, ChevronLeft, User, Target, Dumbbell, Calendar, Heart, Send } from 'lucide-react'

const TOTAL_STEPS = 6

const objectives = [
  { value: 'perder-grasa', label: 'Perder grasa' },
  { value: 'ganar-musculo', label: 'Ganar músculo' },
  { value: 'mejorar-salud', label: 'Mejorar salud general' },
  { value: 'rendimiento', label: 'Rendimiento deportivo' },
  { value: 'recuperacion', label: 'Recuperación de lesión' },
  { value: 'habito', label: 'Crear hábito de ejercicio' },
]

const levels = [
  { value: 'nunca', label: 'Nunca he entrenado' },
  { value: 'principiante', label: 'Principiante (< 1 año)' },
  { value: 'intermedio', label: 'Intermedio (1-3 años)' },
  { value: 'avanzado', label: 'Avanzado (3+ años)' },
]

const daysOptions = ['2 días', '3 días', '4 días', '5+ días']
const timeOptions = ['30 min', '45 min', '60 min', '90 min']
const scheduleOptions = ['Mañana', 'Mediodía', 'Tarde', 'Noche', 'Me da igual']
const modalityOptions = ['Online', 'Presencial (Madrid)', 'Me da igual']
const sourceOptions = [
  'Google',
  'Instagram',
  'Recomendación',
  'Blog / Artículo',
  'Otro',
]

interface FormData {
  name: string
  email: string
  phone: string
  age: string
  objective: string
  objectiveDetail: string
  level: string
  currentlyTraining: string
  trainingDetail: string
  daysPerWeek: string
  sessionDuration: string
  schedule: string
  modality: string
  injuries: string
  medicalConditions: string
  diet: string
  expectations: string
  source: string
}

const initialData: FormData = {
  name: '',
  email: '',
  phone: '',
  age: '',
  objective: '',
  objectiveDetail: '',
  level: '',
  currentlyTraining: '',
  trainingDetail: '',
  daysPerWeek: '',
  sessionDuration: '',
  schedule: '',
  modality: '',
  injuries: '',
  medicalConditions: '',
  diet: '',
  expectations: '',
  source: '',
}

const stepIcons = [User, Target, Dumbbell, Calendar, Heart, Send]
const stepLabels = ['Tus datos', 'Objetivo', 'Experiencia', 'Disponibilidad', 'Salud', 'Enviar']

export default function ValoracionPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<FormData>(initialData)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const update = (field: keyof FormData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const canNext = (): boolean => {
    switch (step) {
      case 1:
        return data.name.length >= 2 && data.email.includes('@') && data.phone.length >= 9
      case 2:
        return data.objective !== ''
      case 3:
        return data.level !== ''
      case 4:
        return data.daysPerWeek !== '' && data.sessionDuration !== ''
      case 5:
        return true
      case 6:
        return true
      default:
        return false
    }
  }

  const next = () => {
    if (canNext() && step < TOTAL_STEPS) setStep(step + 1)
  }

  const prev = () => {
    if (step > 1) setStep(step - 1)
  }

  const submit = async () => {
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/valoracion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Error al enviar')
      router.push('/gracias-valoracion')
    } catch {
      setError('Hubo un error al enviar. Inténtalo de nuevo o escríbenos por WhatsApp.')
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-lg text-white border border-[#662D91] focus:border-[#FCEE21] focus:outline-none transition'
  const inputStyle = { backgroundColor: '#16122B' }

  const RadioOption = ({
    options,
    value,
    onChange,
  }: {
    options: { value: string; label: string }[] | string[]
    value: string
    onChange: (v: string) => void
  }) => (
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt) => {
        const val = typeof opt === 'string' ? opt : opt.value
        const label = typeof opt === 'string' ? opt : opt.label
        const selected = value === val
        return (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            className="p-4 rounded-lg text-left font-medium transition-all border-2"
            style={{
              backgroundColor: selected ? 'rgba(252, 238, 33, 0.1)' : '#16122B',
              borderColor: selected ? '#FCEE21' : '#662D91',
              color: selected ? '#FCEE21' : '#e0e0e0',
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )

  return (
    <>
      <section style={{ backgroundColor: '#16122B' }} className="py-16 md:py-24">
        <Container>
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 style={{ color: '#FCEE21' }} className="text-3xl md:text-5xl font-bold mb-4">
                Valoración Gratuita
              </h1>
              <p className="text-gray-400 text-lg">
                Responde unas preguntas para que pueda analizar tu caso y proponerte un plan real.
              </p>
            </div>

            {/* Progress */}
            <div className="flex items-center justify-between mb-10 px-2">
              {stepLabels.map((label, i) => {
                const Icon = stepIcons[i]
                const stepNum = i + 1
                const active = step === stepNum
                const completed = step > stepNum
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                      style={{
                        backgroundColor: active
                          ? '#FCEE21'
                          : completed
                            ? 'rgba(252, 238, 33, 0.3)'
                            : 'rgba(102, 45, 145, 0.3)',
                        color: active ? '#16122B' : completed ? '#FCEE21' : '#666',
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <span
                      className="text-[10px] font-bold hidden sm:block"
                      style={{ color: active ? '#FCEE21' : '#666' }}
                    >
                      {label}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Form Card */}
            <div
              className="rounded-2xl p-6 md:p-10"
              style={{ backgroundColor: '#1a1535', border: '1px solid #662D91' }}
            >
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-white mb-2">Tus datos de contacto</h2>
                  <p className="text-gray-400 text-sm mb-6">Para poder enviarte el análisis personalizado.</p>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Nombre completo *</label>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      value={data.name}
                      onChange={(e) => update('name', e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Email *</label>
                      <input
                        type="email"
                        placeholder="tu@email.com"
                        value={data.email}
                        onChange={(e) => update('email', e.target.value)}
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Teléfono *</label>
                      <input
                        type="tel"
                        placeholder="+34 XXX XXX XXX"
                        value={data.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div className="max-w-[200px]">
                    <label className="block text-sm font-bold text-gray-300 mb-2">Edad</label>
                    <input
                      type="number"
                      placeholder="30"
                      value={data.age}
                      onChange={(e) => update('age', e.target.value)}
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Objective */}
              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-white mb-2">¿Cuál es tu objetivo principal?</h2>
                  <p className="text-gray-400 text-sm mb-6">Elige el que más se acerque a lo que buscas.</p>
                  <RadioOption
                    options={objectives}
                    value={data.objective}
                    onChange={(v) => update('objective', v)}
                  />
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">
                      ¿Algo más sobre tu objetivo? (opcional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Ej: quiero perder 10 kg antes del verano, prepararme una media maratón..."
                      value={data.objectiveDetail}
                      onChange={(e) => update('objectiveDetail', e.target.value)}
                      className={inputClass + ' resize-none'}
                      style={inputStyle}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Experience */}
              {step === 3 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-white mb-2">Tu experiencia entrenando</h2>
                  <p className="text-gray-400 text-sm mb-6">Para adaptar el plan a tu nivel real.</p>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3">Nivel de experiencia *</label>
                    <RadioOption
                      options={levels}
                      value={data.level}
                      onChange={(v) => update('level', v)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3">¿Entrenas actualmente?</label>
                    <RadioOption
                      options={['Sí', 'No']}
                      value={data.currentlyTraining}
                      onChange={(v) => update('currentlyTraining', v)}
                    />
                  </div>
                  {data.currentlyTraining === 'Sí' && (
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">
                        ¿Qué haces actualmente?
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Ej: voy al gimnasio 3 días, hago running los fines de semana..."
                        value={data.trainingDetail}
                        onChange={(e) => update('trainingDetail', e.target.value)}
                        className={inputClass + ' resize-none'}
                        style={inputStyle}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Availability */}
              {step === 4 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-white mb-2">Tu disponibilidad</h2>
                  <p className="text-gray-400 text-sm mb-6">Para diseñar un plan que encaje en tu vida real.</p>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3">Días por semana *</label>
                    <RadioOption
                      options={daysOptions}
                      value={data.daysPerWeek}
                      onChange={(v) => update('daysPerWeek', v)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3">Duración por sesión *</label>
                    <RadioOption
                      options={timeOptions}
                      value={data.sessionDuration}
                      onChange={(v) => update('sessionDuration', v)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3">Horario preferido</label>
                    <RadioOption
                      options={scheduleOptions}
                      value={data.schedule}
                      onChange={(v) => update('schedule', v)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3">Modalidad preferida</label>
                    <RadioOption
                      options={modalityOptions}
                      value={data.modality}
                      onChange={(v) => update('modality', v)}
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Health */}
              {step === 5 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-white mb-2">Salud y limitaciones</h2>
                  <p className="text-gray-400 text-sm mb-6">
                    Para asegurarnos de que tu plan es seguro y efectivo.
                  </p>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">
                      ¿Tienes alguna lesión o limitación física?
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Ej: dolor de espalda, lesión de rodilla antigua, hernia discal..."
                      value={data.injuries}
                      onChange={(e) => update('injuries', e.target.value)}
                      className={inputClass + ' resize-none'}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">
                      ¿Alguna condición médica relevante?
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ej: hipertensión, diabetes, problemas de tiroides..."
                      value={data.medicalConditions}
                      onChange={(e) => update('medicalConditions', e.target.value)}
                      className={inputClass + ' resize-none'}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">
                      ¿Sigues alguna pauta de alimentación?
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ej: como de todo sin control, intento comer sano, sigo una dieta específica..."
                      value={data.diet}
                      onChange={(e) => update('diet', e.target.value)}
                      className={inputClass + ' resize-none'}
                      style={inputStyle}
                    />
                  </div>
                </div>
              )}

              {/* Step 6: Final */}
              {step === 6 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-white mb-2">Último paso</h2>
                  <p className="text-gray-400 text-sm mb-6">
                    Cuéntame qué esperas de esto y envía tu valoración.
                  </p>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">
                      ¿Qué esperas de un entrenador online?
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Ej: que me motive, que me enseñe a entrenar bien, que se adapte a mi horario..."
                      value={data.expectations}
                      onChange={(e) => update('expectations', e.target.value)}
                      className={inputClass + ' resize-none'}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3">
                      ¿Cómo nos has conocido?
                    </label>
                    <RadioOption
                      options={sourceOptions}
                      value={data.source}
                      onChange={(v) => update('source', v)}
                    />
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div
                  className="mt-6 p-4 rounded-lg text-sm"
                  style={{ backgroundColor: 'rgba(255, 107, 107, 0.1)', color: '#ff6b6b' }}
                >
                  {error}
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#662D91]">
                {step > 1 ? (
                  <button
                    onClick={prev}
                    className="flex items-center gap-2 px-5 py-3 rounded-lg font-bold transition-all text-gray-400 hover:text-white"
                  >
                    <ChevronLeft size={18} />
                    Anterior
                  </button>
                ) : (
                  <div />
                )}

                {step < TOTAL_STEPS ? (
                  <button
                    onClick={next}
                    disabled={!canNext()}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-lg transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                    style={{
                      backgroundColor: canNext() ? '#FCEE21' : '#444',
                      color: canNext() ? '#16122B' : '#888',
                    }}
                  >
                    Siguiente
                    <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    onClick={submit}
                    disabled={submitting}
                    className="flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-lg transition-all hover:scale-105 disabled:opacity-50"
                    style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
                  >
                    {submitting ? 'Enviando...' : 'Enviar valoración'}
                    {!submitting && <Send size={18} />}
                  </button>
                )}
              </div>

              {/* Step indicator */}
              <p className="text-center text-gray-500 text-sm mt-4">
                Paso {step} de {TOTAL_STEPS}
              </p>
            </div>

            {/* Trust signal */}
            <p className="text-center text-gray-500 text-xs mt-6">
              100% gratuito. Sin compromiso. Tus datos están seguros.
            </p>
          </div>
        </Container>
      </section>
    </>
  )
}
