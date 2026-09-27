import { z } from 'zod'

export const serviceTypes = [
  'personal_12_semanas',
  'entrenamiento_presencial',
  'consulta_nutricion',
  'analisis_corporal',
  'sesion_osteopatia',
  'pack_combinado',
  'personalizado',
] as const

export const serviceLabels: Record<(typeof serviceTypes)[number], string> = {
  personal_12_semanas: 'Entrenamiento personalizado — 12 semanas',
  entrenamiento_presencial: 'Entrenamiento Presencial',
  consulta_nutricion: 'Consulta Nutrición',
  analisis_corporal: 'Análisis Corporal',
  sesion_osteopatia: 'Sesión Osteopatía',
  pack_combinado: 'Pack Combinado',
  personalizado: 'Servicio Personalizado',
}

export interface PlanPreset {
  price: number
  duration: string
  description: string
}

export const planPresets: Record<(typeof serviceTypes)[number], PlanPreset> = {
  personal_12_semanas: {
    price: 750,
    duration: '12 semanas',
    description: 'Valoración inicial, programación completamente individual, seguimiento semanal y ajustes según la respuesta y el contexto del cliente.',
  },
  entrenamiento_presencial: {
    price: 0,
    duration: '',
    description: 'Sesiones 1 a 1 presenciales en Madrid.',
  },
  consulta_nutricion: {
    price: 50,
    duration: '1 sesión',
    description: 'Sesión individual para diseñar pautas nutricionales adaptadas a tu objetivo y contexto.',
  },
  analisis_corporal: {
    price: 40,
    duration: '1 sesión',
    description: 'Medición de composición corporal y seguimiento de cambios reales.',
  },
  sesion_osteopatia: {
    price: 60,
    duration: '1 sesión',
    description: 'Tratamiento de lesiones y recuperación. Sesión presencial en Madrid.',
  },
  pack_combinado: {
    price: 0,
    duration: '',
    description: 'Combinación personalizada de servicios.',
  },
  personalizado: {
    price: 0,
    duration: '',
    description: '',
  },
}

export const createProposalSchema = z.object({
  clientName: z.string().min(2, 'Nombre requerido'),
  clientEmail: z.string().email('Email inválido'),
  clientPhone: z.string().min(9, 'Teléfono inválido'),
  serviceType: z.enum(serviceTypes),
  price: z.number().positive('El precio debe ser positivo'),
  duration: z.string().min(1, 'Duración requerida'),
  description: z.string().optional().default(''),
  contractText: z.string().min(50, 'El contrato debe tener al menos 50 caracteres'),
  notes: z.string().optional().default(''),
})

export const signContractSchema = z.object({
  fullName: z.string().min(3, 'Nombre completo requerido'),
  accepted: z.literal(true, { message: 'Debes aceptar los términos' }),
})

export const adminLoginSchema = z.object({
  password: z.string().min(1, 'Contraseña requerida'),
})
