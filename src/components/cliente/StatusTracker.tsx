'use client'

import { FileText, Pen, CreditCard, CheckCircle } from 'lucide-react'

const steps = [
  { key: 'proposal', label: 'Propuesta', icon: FileText },
  { key: 'signed', label: 'Firmado', icon: Pen },
  { key: 'payment', label: 'Pago', icon: CreditCard },
  { key: 'confirmed', label: 'Confirmado', icon: CheckCircle },
]

function getStepIndex(status: string): number {
  switch (status) {
    case 'pending':
    case 'viewed':
      return 0
    case 'signed':
      return 1
    case 'payment_pending':
      return 2
    case 'paid':
    case 'confirmed':
      return 3
    default:
      return 0
  }
}

export default function StatusTracker({ status }: { status: string }) {
  const currentStep = getStepIndex(status)

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 py-6">
      {steps.map((step, index) => {
        const Icon = step.icon
        const isCompleted = index <= currentStep
        const isCurrent = index === currentStep

        return (
          <div key={step.key} className="flex items-center gap-2 md:gap-4">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all"
                style={{
                  backgroundColor: isCompleted ? 'rgba(252, 238, 33, 0.2)' : 'rgba(156, 163, 175, 0.1)',
                  border: isCurrent ? '2px solid #FCEE21' : '2px solid transparent',
                }}
              >
                <Icon
                  size={20}
                  style={{ color: isCompleted ? '#FCEE21' : '#4b5563' }}
                />
              </div>
              <span
                className="text-xs font-medium hidden md:block"
                style={{ color: isCompleted ? '#FCEE21' : '#4b5563' }}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className="w-8 md:w-16 h-0.5"
                style={{ backgroundColor: index < currentStep ? '#FCEE21' : '#374151' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
