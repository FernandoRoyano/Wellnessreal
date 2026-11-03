export const LEAD_KINDS = [
  { value: 'sin_revisar', label: 'Sin revisar' },
  { value: 'prueba', label: 'Prueba' },
  { value: 'suscriptor', label: 'Descarga / suscripción' },
  { value: 'oportunidad', label: 'Solicitud comercial' },
] as const

export const COMMERCIAL_STAGES = [
  { value: 'sin_revisar', label: 'Sin revisar' },
  { value: 'nuevo', label: 'Pendiente de contacto' },
  { value: 'contactado', label: 'Contactado' },
  { value: 'conversacion', label: 'Conversación realizada' },
  { value: 'propuesta', label: 'Propuesta enviada' },
  { value: 'pagado', label: 'Pago confirmado' },
  { value: 'no_continua', label: 'No continúa' },
] as const

export type LeadKind = typeof LEAD_KINDS[number]['value']
export type CommercialStage = typeof COMMERCIAL_STAGES[number]['value']

interface MeasurementLead {
  tags: string[] | null
  status?: string
  utm_source?: string | null
  utm_medium?: string | null
  referrer?: string | null
}

export function getLeadKind(lead: MeasurementLead): LeadKind {
  return LEAD_KINDS.find(kind => lead.tags?.includes(`crm:tipo:${kind.value}`))?.value ?? 'sin_revisar'
}

export function getCommercialStage(lead: MeasurementLead): CommercialStage {
  return COMMERCIAL_STAGES.find(stage => lead.tags?.includes(`crm:fase:${stage.value}`))?.value ?? 'sin_revisar'
}

export function getAcquisitionChannel(lead: MeasurementLead): string {
  if (lead.utm_source) return `${lead.utm_source}${lead.utm_medium ? ` / ${lead.utm_medium}` : ''}`
  if (lead.referrer) {
    try {
      const host = new URL(lead.referrer).hostname.toLowerCase()
      if (host !== 'wellnessreal.es' && host !== 'www.wellnessreal.es') return `Referencia: ${host}`
    } catch { /* Las referencias antiguas pueden no ser URLs válidas. */ }
  }
  return 'Sin atribución'
}

export function captureCommercialKind(tags: string[], source: string): string[] {
  const kind = getLeadKind({ tags })
  if (kind === 'prueba' || kind === 'oportunidad') return tags
  if (source === 'valoracion') {
    return [...tags.filter(tag => !tag.startsWith('crm:tipo:')), 'crm:tipo:oportunidad', ...(getCommercialStage({ tags }) === 'sin_revisar' ? ['crm:fase:nuevo'] : [])]
  }
  if (kind === 'sin_revisar' && ['guia', 'newsletter'].includes(source)) return [...tags, 'crm:tipo:suscriptor']
  return tags
}

export function buildCommercialSummary(leads: MeasurementLead[]) {
  const summary = { opportunities: 0, subscribers: 0, tests: 0, unreviewed: 0, conversations: 0, proposals: 0, paid: 0, legacyCustomers: 0, byChannel: [] as { channel: string; opportunities: number; conversations: number; proposals: number; paid: number }[] }
  const channels = new Map<string, typeof summary.byChannel[number]>()
  for (const lead of leads) {
    const kind = getLeadKind(lead)
    if (kind === 'prueba') { summary.tests++; continue }
    if (kind === 'suscriptor') { summary.subscribers++; continue }
    if (kind === 'sin_revisar') summary.unreviewed++
    const stage = getCommercialStage(lead)
    if (lead.status === 'cliente' && stage !== 'pagado') summary.legacyCustomers++
    if (kind !== 'oportunidad') continue
    summary.opportunities++
    const channel = getAcquisitionChannel(lead)
    const row = channels.get(channel) ?? { channel, opportunities: 0, conversations: 0, proposals: 0, paid: 0 }
    row.opportunities++
    if (lead.tags?.some(tag => tag.startsWith('crm:conversacion:')) || stage === 'conversacion') { summary.conversations++; row.conversations++ }
    if (lead.tags?.some(tag => tag.startsWith('crm:propuesta:')) || stage === 'propuesta') { summary.proposals++; row.proposals++ }
    if (stage === 'pagado') { summary.paid++; row.paid++ }
    channels.set(channel, row)
  }
  summary.byChannel = [...channels.values()].sort((a, b) => b.opportunities - a.opportunities)
  return summary
}

export type CommercialSummary = ReturnType<typeof buildCommercialSummary>

export function updateCommercialTags(tags: string[], kind: LeadKind, stage: CommercialStage, now: string): string[] {
  const next = tags.filter(tag => !tag.startsWith('crm:tipo:') && !tag.startsWith('crm:fase:'))
  next.push(`crm:tipo:${kind}`)
  if (kind === 'oportunidad') {
    next.push(`crm:fase:${stage}`)
    const marker = stage === 'conversacion' ? 'crm:conversacion:' : stage === 'propuesta' ? 'crm:propuesta:' : stage === 'pagado' ? 'crm:pago:' : null
    if (marker && !next.some(tag => tag.startsWith(marker))) next.push(`${marker}${now}`)
  }
  return next
}
