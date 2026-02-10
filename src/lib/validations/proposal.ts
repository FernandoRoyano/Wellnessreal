import { z } from 'zod'

export const serviceTypes = [
  'starter_1mes',
  'pack_3meses',
  'premium_3meses',
  'solo_entrenamiento_trimestral',
  'entrenamiento_presencial',
  'consulta_nutricion',
  'analisis_corporal',
  'sesion_osteopatia',
  'pack_combinado',
  'personalizado',
] as const

export const serviceLabels: Record<(typeof serviceTypes)[number], string> = {
  starter_1mes: 'Starter — Entrenamiento Online (1 mes)',
  pack_3meses: 'Pack 3 Meses — Entrenamiento Online',
  premium_3meses: 'Premium — Máxima Personalización (3 meses)',
  solo_entrenamiento_trimestral: 'Solo Entrenamiento (trimestral)',
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
  starter_1mes: {
    price: 120,
    duration: '1 mes',
    description: 'Plan personalizado en app, revisión semanal, vídeos explicativos, soporte por chat y valoración inicial gratuita.',
  },
  pack_3meses: {
    price: 300,
    duration: '3 meses',
    description: '12 semanas de seguimiento, ajustes semanales del plan, biblioteca de vídeos y revisión mensual en profundidad. Ahorras 60€.',
  },
  premium_3meses: {
    price: 500,
    duration: '3 meses',
    description: 'Videollamada semanal, análisis mensual de progreso, soporte prioritario WhatsApp y pautas nutricionales incluidas.',
  },
  solo_entrenamiento_trimestral: {
    price: 180,
    duration: '3 meses (60€/mes)',
    description: 'Plan de entrenamiento personalizado. Cobro trimestral a 60€/mes.',
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
