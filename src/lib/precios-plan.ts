// ============================================================
//  Método BASE · Precios y niveles del plan
//  Punto único para cambiar precios y copy de las dos opciones.
//  Suscripción mensual (Stripe): el precio está en EUROS/mes.
//  Los price IDs viven en env (test en .env.local, live en Vercel).
// ============================================================

// Permanencia mínima antes de poder cancelar (meses).
export const PERMANENCIA_MESES = 3

export type PlanTier = 'auto' | 'revisado'

export interface PlanOpcion {
  tier: PlanTier
  nombre: string
  precio: number // EUR
  gancho: string
  ventajas: string[]
  destacado?: boolean
}

export const PLAN_OPCIONES: Record<PlanTier, PlanOpcion> = {
  auto: {
    tier: 'auto',
    nombre: 'Plan automático',
    precio: 19,
    gancho: 'Tu plan completo, al instante',
    ventajas: [
      'Todos los días de entreno, completos',
      'Tu nutrición por raciones, sin pesar nada',
      'Tu sistema de seguimiento y progresión',
      'Acceso inmediato, sin esperas',
    ],
  },
  revisado: {
    tier: 'revisado',
    nombre: 'Plan revisado por Fernando',
    precio: 49,
    gancho: 'Todo lo anterior + el ojo experto de Fernando',
    ventajas: [
      'Fernando revisa y ajusta TU plan a mano',
      'Adaptado de verdad a tus lesiones y tu vida',
      'Ajustes semanales según cómo respondas',
      'Hablas directamente con él',
    ],
    destacado: true,
  },
}

export function getPlanOpcion(tier: string): PlanOpcion | null {
  return tier === 'auto' || tier === 'revisado' ? PLAN_OPCIONES[tier] : null
}

// Price ID recurrente de Stripe para el tier (env: test/live según el entorno).
export function getPriceId(tier: PlanTier): string | undefined {
  return tier === 'auto' ? process.env.STRIPE_PRICE_AUTO : process.env.STRIPE_PRICE_REVISADO
}
