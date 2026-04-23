'use client'

import Container from '@/components/common/Container'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronRight, ChevronLeft, User, Target, Dumbbell, Calendar, Heart, Send, AlertCircle, Sparkles,
} from 'lucide-react'
import { trackGenerateLead } from '@/lib/analytics'

const TOTAL_STEPS = 6

const objectives = [
  { value: 'perder-grasa',  label: 'Perder grasa' },
  { value: 'ganar-musculo', label: 'Ganar músculo' },
  { value: 'mejorar-salud', label: 'Mejorar salud general' },
  { value: 'rendimiento',   label: 'Rendimiento deportivo' },
  { value: 'recuperacion',  label: 'Recuperación de lesión' },
  { value: 'habito',        label: 'Crear hábito de ejercicio' },
]

const levels = [
  { value: 'nunca',        label: 'Nunca he entrenado' },
  { value: 'principiante', label: 'Principiante (< 1 año)' },
  { value: 'intermedio',   label: 'Intermedio (1-3 años)' },
  { value: 'avanzado',     label: 'Avanzado (3+ años)' },
]

const daysOptions     = ['2 días', '3 días', '4 días', '5+ días']
const timeOptions     = ['30 min', '45 min', '60 min', '90 min']
const scheduleOptions = ['Mañana', 'Mediodía', 'Tarde', 'Noche', 'Me da igual']
const modalityOptions = ['Online', 'Presencial (Madrid)', 'Me da igual']
const budgetOptions = [
  { value: 'menos-100', label: 'Menos de 100€/mes' },
  { value: '100-200',   label: '100 - 200€/mes' },
  { value: '200-300',   label: '200 - 300€/mes' },
  { value: 'mas-300',   label: 'Más de 300€/mes' },
  { value: 'no-seguro', label: 'Aún no lo tengo claro' },
]
const sourceOptions = ['Google', 'Instagram', 'Recomendación', 'Blog / Artículo', 'Otro']

interface FormData {
  name: string; email: string; phone: string; age: string
  objective: string; objectiveDetail: string
  level: string; currentlyTraining: string; trainingDetail: string
  daysPerWeek: string; sessionDuration: string; schedule: string; modality: string
  injuries: string; medicalConditions: string; diet: string
  expectations: string; budget: string; source: string
}

const initialData: FormData = {
  name: '', email: '', phone: '', age: '',
  objective: '', objectiveDetail: '',
  level: '', currentlyTraining: '', trainingDetail: '',
  daysPerWeek: '', sessionDuration: '', schedule: '', modality: '',
  injuries: '', medicalConditions: '', diet: '',
  expectations: '', budget: '', source: '',
}

const stepIcons  = [User, Target, Dumbbell, Calendar, Heart, Send]
const stepLabels = ['Tus datos', 'Objetivo', 'Experiencia', 'Disponibilidad', 'Salud', 'Enviar']

const FIELD_CLASS =
  'w-full px-4 py-3 rounded-xl bg-brand-night text-white border border-border-subtle ' +
  'placeholder:text-dim ' +
  'focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all'

const LABEL_CLASS = 'block text-fluid-xs font-bold text-muted mb-2 uppercase tracking-wider'

export default function ValoracionPage() {
  const router = useRouter()
  const [step, setStep]           = useState(1)
  const [data, setData]           = useState<FormData>(initialData)
  const [error, setError]         = useState('')
  const [submitting, setSubmitting] = useState(false)

  const update = (field: keyof FormData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const canNext = (): boolean => {
    switch (step) {
      case 1: return data.name.length >= 2 && data.email.includes('@') && data.phone.length >= 9
      case 2: return data.objective !== ''
      case 3: return data.level !== ''
      case 4: return data.daysPerWeek !== '' && data.sessionDuration !== ''
      case 5: return true
      case 6: return data.budget !== ''
      default: return false
    }
  }

  const next = () => { if (canNext() && step < TOTAL_STEPS) setStep(step + 1) }
  const prev = () => { if (step > 1) setStep(step - 1) }

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
      trackGenerateLead()
      router.push('/gracias-valoracion')
    } catch {
      setError('Hubo un error al enviar. Inténtalo de nuevo o escríbenos por WhatsApp.')
      setSubmitting(false)
    }
  }

  const RadioOption = ({
    options, value, onChange,
  }: {
    options: { value: string; label: string }[] | string[]
    value: string
    onChange: (v: string) => void
  }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((opt) => {
        const val = typeof opt === 'string' ? opt : opt.value
        const label = typeof opt === 'string' ? opt : opt.label
        const selected = value === val
        return (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            className={
              'p-4 rounded-xl text-left font-medium text-fluid-sm transition-all border ' +
              (selected
                ? 'bg-accent-soft text-accent border-accent shadow-[0_0_0_1px_rgba(252,238,33,0.3)]'
                : 'bg-brand-night text-white/80 border-border-subtle hover:border-border-strong hover:text-white')
            }
          >
            {label}
          </button>
        )
      })}
    </div>
  )

  return (
    <section className="relative py-fluid-xl bg-brand-deep overflow-hidden">
      <div className="absolute inset-0 bg-radial-accent opacity-50" />
      <div className="absolute inset-0 bg-grid-soft opacity-30" />

      <Container>
        <div className="relative max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-fluid-md space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-subtle bg-accent-muted backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-fluid-xs font-semibold tracking-wider uppercase text-accent">
                100% gratuito
              </span>
            </div>
            <h1 className="headline text-fluid-5xl text-white">
              Valoración <span className="text-gradient-brand">gratuita.</span>
            </h1>
            <p className="text-fluid-lg text-muted max-w-xl mx-auto leading-relaxed">
              Responde unas preguntas para que pueda analizar tu caso y proponerte un plan real.
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between mb-fluid-md px-1 relative">
            {/* línea base */}
            <div className="absolute left-5 right-5 top-5 h-px bg-border-subtle" />
            <div
              className="absolute left-5 top-5 h-px bg-accent transition-all duration-500"
              style={{ width: `calc((100% - 2.5rem) * ${(step - 1) / (TOTAL_STEPS - 1)})` }}
            />
            {stepLabels.map((label, i) => {
              const Icon = stepIcons[i]
              const stepNum  = i + 1
              const active   = step === stepNum
              const completed = step > stepNum
              return (
                <div key={i} className="flex flex-col items-center gap-1.5 relative z-10">
                  <div
                    className={
                      'w-10 h-10 rounded-full flex items-center justify-center transition-all border ' +
                      (active
                        ? 'bg-accent text-accent-fg border-accent shadow-glow scale-110'
                        : completed
                          ? 'bg-accent-soft text-accent border-accent/50'
                          : 'bg-brand-night text-dim border-border-subtle')
                    }
                  >
                    <Icon size={16} />
                  </div>
                  <span
                    className={
                      'text-[10px] font-bold uppercase tracking-wider hidden sm:block ' +
                      (active ? 'text-accent' : completed ? 'text-muted' : 'text-dim')
                    }
                  >
                    {label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Form card */}
          <div className="surface-card rounded-2xl p-6 md:p-10">
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div className="space-y-2 mb-6">
                  <h2 className="text-fluid-xl font-semibold text-white tracking-tight">Tus datos de contacto</h2>
                  <p className="text-fluid-sm text-muted">Para poder enviarte el análisis personalizado.</p>
                </div>
                <div>
                  <label className={LABEL_CLASS}>Nombre completo *</label>
                  <input type="text" placeholder="Tu nombre" value={data.name}
                    onChange={(e) => update('name', e.target.value)} className={FIELD_CLASS} />
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className={LABEL_CLASS}>Email *</label>
                    <input type="email" placeholder="tu@email.com" value={data.email}
                      onChange={(e) => update('email', e.target.value)} className={FIELD_CLASS} />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Teléfono *</label>
                    <input type="tel" placeholder="+34 XXX XXX XXX" value={data.phone}
                      onChange={(e) => update('phone', e.target.value)} className={FIELD_CLASS} />
                  </div>
                </div>
                <div className="max-w-[200px]">
                  <label className={LABEL_CLASS}>Edad</label>
                  <input type="number" placeholder="30" value={data.age}
                    onChange={(e) => update('age', e.target.value)} className={FIELD_CLASS} />
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div className="space-y-2 mb-6">
                  <h2 className="text-fluid-xl font-semibold text-white tracking-tight">¿Cuál es tu objetivo principal?</h2>
                  <p className="text-fluid-sm text-muted">Elige el que más se acerque a lo que buscas.</p>
                </div>
                <RadioOption options={objectives} value={data.objective} onChange={(v) => update('objective', v)} />
                <div>
                  <label className={LABEL_CLASS}>¿Algo más sobre tu objetivo? (opcional)</label>
                  <textarea rows={3} placeholder="Ej: quiero perder 10 kg antes del verano, prepararme una media maratón…"
                    value={data.objectiveDetail} onChange={(e) => update('objectiveDetail', e.target.value)}
                    className={FIELD_CLASS + ' resize-none'} />
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div className="space-y-2 mb-6">
                  <h2 className="text-fluid-xl font-semibold text-white tracking-tight">Tu experiencia entrenando</h2>
                  <p className="text-fluid-sm text-muted">Para adaptar el plan a tu nivel real.</p>
                </div>
                <div>
                  <label className={LABEL_CLASS}>Nivel de experiencia *</label>
                  <RadioOption options={levels} value={data.level} onChange={(v) => update('level', v)} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>¿Entrenas actualmente?</label>
                  <RadioOption options={['Sí', 'No']} value={data.currentlyTraining}
                    onChange={(v) => update('currentlyTraining', v)} />
                </div>
                {data.currentlyTraining === 'Sí' && (
                  <div>
                    <label className={LABEL_CLASS}>¿Qué haces actualmente?</label>
                    <textarea rows={2} placeholder="Ej: voy al gimnasio 3 días, hago running los fines de semana…"
                      value={data.trainingDetail} onChange={(e) => update('trainingDetail', e.target.value)}
                      className={FIELD_CLASS + ' resize-none'} />
                  </div>
                )}
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div className="space-y-5 animate-fade-in">
                <div className="space-y-2 mb-6">
                  <h2 className="text-fluid-xl font-semibold text-white tracking-tight">Tu disponibilidad</h2>
                  <p className="text-fluid-sm text-muted">Para diseñar un plan que encaje en tu vida real.</p>
                </div>
                <div>
                  <label className={LABEL_CLASS}>Días por semana *</label>
                  <RadioOption options={daysOptions} value={data.daysPerWeek} onChange={(v) => update('daysPerWeek', v)} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Duración por sesión *</label>
                  <RadioOption options={timeOptions} value={data.sessionDuration} onChange={(v) => update('sessionDuration', v)} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Horario preferido</label>
                  <RadioOption options={scheduleOptions} value={data.schedule} onChange={(v) => update('schedule', v)} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Modalidad preferida</label>
                  <RadioOption options={modalityOptions} value={data.modality} onChange={(v) => update('modality', v)} />
                </div>
              </div>
            )}

            {/* Step 5 */}
            {step === 5 && (
              <div className="space-y-5 animate-fade-in">
                <div className="space-y-2 mb-6">
                  <h2 className="text-fluid-xl font-semibold text-white tracking-tight">Salud y limitaciones</h2>
                  <p className="text-fluid-sm text-muted">Para asegurar que tu plan es seguro y efectivo.</p>
                </div>
                <div>
                  <label className={LABEL_CLASS}>¿Tienes alguna lesión o limitación física?</label>
                  <textarea rows={3} placeholder="Ej: dolor de espalda, lesión de rodilla antigua, hernia discal…"
                    value={data.injuries} onChange={(e) => update('injuries', e.target.value)}
                    className={FIELD_CLASS + ' resize-none'} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>¿Alguna condición médica relevante?</label>
                  <textarea rows={2} placeholder="Ej: hipertensión, diabetes, problemas de tiroides…"
                    value={data.medicalConditions} onChange={(e) => update('medicalConditions', e.target.value)}
                    className={FIELD_CLASS + ' resize-none'} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>¿Sigues alguna pauta de alimentación?</label>
                  <textarea rows={2} placeholder="Ej: como de todo sin control, intento comer sano, sigo una dieta específica…"
                    value={data.diet} onChange={(e) => update('diet', e.target.value)}
                    className={FIELD_CLASS + ' resize-none'} />
                </div>
              </div>
            )}

            {/* Step 6 */}
            {step === 6 && (
              <div className="space-y-5 animate-fade-in">
                <div className="space-y-2 mb-6">
                  <h2 className="text-fluid-xl font-semibold text-white tracking-tight">Último paso</h2>
                  <p className="text-fluid-sm text-muted">Cuéntame qué esperas de esto y envía tu valoración.</p>
                </div>
                <div>
                  <label className={LABEL_CLASS}>Presupuesto mensual que estás considerando *</label>
                  <p className="text-fluid-xs text-subtle mb-3">
                    No es un filtro para venderte — es para que te proponga el plan que encaja con tu realidad. Sin sorpresas después.
                  </p>
                  <RadioOption options={budgetOptions} value={data.budget} onChange={(v) => update('budget', v)} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>¿Qué esperas de un entrenador online?</label>
                  <textarea rows={3} placeholder="Ej: que me motive, que me enseñe a entrenar bien, que se adapte a mi horario…"
                    value={data.expectations} onChange={(e) => update('expectations', e.target.value)}
                    className={FIELD_CLASS + ' resize-none'} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>¿Cómo nos has conocido?</label>
                  <RadioOption options={sourceOptions} value={data.source} onChange={(v) => update('source', v)} />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-xl p-4 flex items-start gap-3 bg-danger/10 border-l-4 border-danger">
                <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                <p className="text-fluid-sm text-danger">{error}</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-border-subtle">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prev}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-fluid-sm text-muted hover:text-white transition-colors"
                >
                  <ChevronLeft size={18} />
                  Anterior
                </button>
              ) : <div />}

              {step < TOTAL_STEPS ? (
                <button
                  type="button"
                  onClick={next}
                  disabled={!canNext()}
                  className={
                    'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-fluid-sm transition-all ' +
                    (canNext()
                      ? 'btn-brand'
                      : 'bg-brand-night text-dim cursor-not-allowed border border-border-subtle')
                  }
                >
                  Siguiente
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submit}
                  disabled={submitting}
                  className="btn-brand inline-flex items-center gap-2 px-8 py-3 text-fluid-sm disabled:opacity-60"
                >
                  {submitting ? 'Enviando…' : 'Enviar valoración'}
                  {!submitting && <Send size={18} />}
                </button>
              )}
            </div>

            {/* Step indicator */}
            <p className="text-center text-fluid-xs text-subtle mt-4">
              Paso {step} de {TOTAL_STEPS}
            </p>
          </div>

          {/* Trust */}
          <p className="text-center text-fluid-xs text-subtle mt-6">
            100% gratuito. Sin compromiso. Tus datos están seguros.
          </p>
        </div>
      </Container>
    </section>
  )
}
