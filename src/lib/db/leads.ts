import { supabase } from '@/lib/supabase'

export type LeadStatus = 'nuevo' | 'contactado' | 'qualified' | 'cliente' | 'descartado'
export type LeadSource = 'guia' | 'valoracion' | 'metodo-optin' | 'newsletter' | 'contacto' | 'unknown'

export interface Lead {
  id: string
  email: string
  name: string | null
  phone: string | null
  source: LeadSource
  landing_page: string | null
  referrer: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_term: string | null
  utm_content: string | null
  fbc: string | null
  fbp: string | null
  status: LeadStatus
  form_data: Record<string, unknown> | null
  tags: string[]
  notes: string | null
  user_agent: string | null
  ip: string | null
  created_at: string
  updated_at: string
  contacted_at: string | null
  converted_at: string | null
}

export interface CreateLeadInput {
  email: string
  name?: string | null
  phone?: string | null
  source: LeadSource
  landing_page?: string | null
  referrer?: string | null
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  utm_term?: string | null
  utm_content?: string | null
  fbc?: string | null
  fbp?: string | null
  form_data?: Record<string, unknown> | null
  tags?: string[]
  user_agent?: string | null
  ip?: string | null
}

/**
 * Crea o actualiza un lead. Si el email ya existe, hace merge:
 * - Mantiene el primer source/UTMs (no sobrescribe atribución original)
 * - Actualiza name/phone si vienen nuevos y antes estaban vacíos
 * - Añade el nuevo source al array de tags como `via:<source>`
 */
export async function upsertLead(input: CreateLeadInput): Promise<Lead> {
  const { data: existing } = await supabase
    .from('leads')
    .select('*')
    .eq('email', input.email.toLowerCase().trim())
    .maybeSingle()

  const newViaTag = `via:${input.source}`

  if (existing) {
    const updates: Partial<Lead> = {}
    if (!existing.name && input.name) updates.name = input.name
    if (!existing.phone && input.phone) updates.phone = input.phone

    const mergedTags = Array.from(new Set([...(existing.tags || []), newViaTag, ...(input.tags || [])]))
    updates.tags = mergedTags

    // Merge form_data sin perder lo anterior
    if (input.form_data) {
      updates.form_data = { ...(existing.form_data || {}), ...input.form_data }
    }

    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', existing.id)
      .select()
      .single()
    if (error) throw error
    return data as Lead
  }

  const payload = {
    email: input.email.toLowerCase().trim(),
    name: input.name || null,
    phone: input.phone || null,
    source: input.source,
    landing_page: input.landing_page || null,
    referrer: input.referrer || null,
    utm_source: input.utm_source || null,
    utm_medium: input.utm_medium || null,
    utm_campaign: input.utm_campaign || null,
    utm_term: input.utm_term || null,
    utm_content: input.utm_content || null,
    fbc: input.fbc || null,
    fbp: input.fbp || null,
    form_data: input.form_data || null,
    tags: Array.from(new Set([newViaTag, ...(input.tags || [])])),
    user_agent: input.user_agent || null,
    ip: input.ip || null,
  }

  const { data, error } = await supabase
    .from('leads')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data as Lead
}

export async function listLeads(params?: {
  status?: LeadStatus
  source?: LeadSource
  search?: string
  limit?: number
}): Promise<Lead[]> {
  let query = supabase.from('leads').select('*').order('created_at', { ascending: false })
  if (params?.status) query = query.eq('status', params.status)
  if (params?.source) query = query.eq('source', params.source)
  if (params?.search) {
    const term = `%${params.search}%`
    query = query.or(`email.ilike.${term},name.ilike.${term},phone.ilike.${term}`)
  }
  query = query.limit(params?.limit ?? 200)

  const { data, error } = await query
  if (error) throw error
  return (data || []) as Lead[]
}

export async function getLead(id: string): Promise<Lead | null> {
  const { data, error } = await supabase.from('leads').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return (data as Lead) || null
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
  const allowed: (keyof Lead)[] = [
    'name', 'phone', 'status', 'notes', 'tags', 'contacted_at', 'converted_at',
  ]
  const filtered: Partial<Lead> = {}
  for (const k of allowed) {
    if (updates[k] !== undefined) (filtered as Record<string, unknown>)[k] = updates[k]
  }

  // Auto-fechas según cambio de status
  if (updates.status === 'contactado' && !updates.contacted_at) {
    filtered.contacted_at = new Date().toISOString()
  }
  if (updates.status === 'cliente' && !updates.converted_at) {
    filtered.converted_at = new Date().toISOString()
  }

  const { data, error } = await supabase.from('leads').update(filtered).eq('id', id).select().single()
  if (error) throw error
  return data as Lead
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase.from('leads').delete().eq('id', id)
  if (error) throw error
}

export async function getLeadStats(): Promise<{
  total: number
  nuevo: number
  contactado: number
  qualified: number
  cliente: number
  descartado: number
  last_7_days: number
  last_30_days: number
}> {
  const { data, error } = await supabase
    .from('leads')
    .select('status, created_at')
  if (error) throw error

  const now = Date.now()
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000

  const stats = {
    total: 0,
    nuevo: 0,
    contactado: 0,
    qualified: 0,
    cliente: 0,
    descartado: 0,
    last_7_days: 0,
    last_30_days: 0,
  }

  for (const row of data || []) {
    stats.total++
    const status = row.status as LeadStatus
    if (status in stats) (stats as Record<string, number>)[status]++
    const created = new Date(row.created_at).getTime()
    if (created >= sevenDaysAgo) stats.last_7_days++
    if (created >= thirtyDaysAgo) stats.last_30_days++
  }

  return stats
}
