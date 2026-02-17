export type ProposalStatus =
  | 'pending'
  | 'viewed'
  | 'signed'
  | 'payment_pending'
  | 'paid'
  | 'confirmed'

export type PaymentMethod = 'stripe' | 'transfer'

export type ServiceType =
  | 'starter_1mes'
  | 'pack_3meses'
  | 'premium_3meses'
  | 'solo_entrenamiento_trimestral'
  | 'entrenamiento_presencial'
  | 'consulta_nutricion'
  | 'analisis_corporal'
  | 'sesion_osteopatia'
  | 'pack_combinado'
  | 'personalizado'

export interface Proposal {
  id: string
  client_name: string
  client_email: string
  client_phone: string
  service_type: ServiceType
  service_label: string
  price: number
  duration: string
  description: string
  contract_text: string
  token: string
  status: ProposalStatus
  signed_at: string | null
  signature_full_name: string | null
  signature_ip: string | null
  payment_method: PaymentMethod | null
  stripe_session_id: string | null
  stripe_payment_intent_id: string | null
  transfer_marked_at: string | null
  paid_at: string | null
  confirmed_at: string | null
  confirmed_by: string | null
  viewed_at: string | null
  notes: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  title: string
  slug: string
  description: string | null
  created_at: string
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  author: string
  main_image_url: string | null
  main_image_alt: string | null
  category_id: string | null
  published_at: string
  read_time: string | null
  content: string
  published: boolean
  created_at: string
  updated_at: string
}

export interface PostWithCategory extends Post {
  category: Category | null
}
