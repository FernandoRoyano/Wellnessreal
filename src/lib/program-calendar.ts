const DAY_MS = 86_400_000

function timestamp(value: string | null | undefined): number {
  const parsed = value ? Date.parse(value) : NaN
  return Number.isFinite(parsed) ? parsed : 0
}

export function programProgress(startedAt: string | null, now = Date.now()) {
  const start = timestamp(startedAt)
  const days = start && now >= start ? Math.floor((now - start) / DAY_MS) : -1
  return {
    startedAt: start ? startedAt : null,
    week: days < 0 ? 0 : Math.min(12, Math.floor(days / 7) + 1),
    complete: days >= 84,
  }
}

export function planUpdateAvailability(
  plan: { revisado: boolean; revisado_en?: string | null; creado_en?: string | null } | null,
  paidAt: string | null,
  thyroid: boolean,
  now = Date.now(),
) {
  const cycleWeeks = thyroid ? 3 : 4
  // En Tiroides el bloque empieza cuando Fernando lo entrega aprobado.
  const start = thyroid ? timestamp(plan?.revisado_en) : Math.max(timestamp(plan?.creado_en), timestamp(paidAt))
  const days = start ? Math.max(0, (now - start) / DAY_MS) : 0
  return {
    cycleWeeks,
    approvalDatePending: Boolean(thyroid && plan?.revisado && !start),
    eligible: Boolean(plan?.revisado && start && days >= cycleWeeks * 7),
    daysRemaining: Math.max(0, Math.ceil(cycleWeeks * 7 - days)),
  }
}
