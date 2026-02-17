import { supabase } from '@/lib/supabase'
import type { Proposal } from '@/lib/types/database'

// --- CRUD Functions ---

export async function getAllProposals() {
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getProposalById(id: string) {
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function getProposalByToken(token: string) {
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('token', token)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function createProposal(proposal: Omit<Proposal, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('proposals')
    .insert(proposal)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProposalById(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('proposals')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProposalByToken(token: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('proposals')
    .update(updates)
    .eq('token', token)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProposalById(id: string) {
  const { error } = await supabase
    .from('proposals')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

// --- Transform helper: snake_case → camelCase for frontend compatibility ---

export function toClientProposal(row: Proposal) {
  return {
    _id: row.id,
    clientName: row.client_name,
    clientEmail: row.client_email,
    clientPhone: row.client_phone,
    serviceType: row.service_type,
    serviceLabel: row.service_label,
    price: row.price,
    duration: row.duration,
    description: row.description,
    contractText: row.contract_text,
    token: row.token,
    status: row.status,
    signedAt: row.signed_at,
    signatureFullName: row.signature_full_name,
    signatureIP: row.signature_ip,
    paymentMethod: row.payment_method,
    stripeSessionId: row.stripe_session_id,
    stripePaymentIntentId: row.stripe_payment_intent_id,
    transferMarkedAt: row.transfer_marked_at,
    paidAt: row.paid_at,
    confirmedAt: row.confirmed_at,
    confirmedBy: row.confirmed_by,
    viewedAt: row.viewed_at,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
