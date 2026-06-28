// ============================================================
//  Método BASE · Precios y niveles del plan
//  Punto único para cambiar precios y copy de las dos opciones.
//  El precio está en EUROS (se convierte a céntimos en Stripe).
// ============================================================

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
