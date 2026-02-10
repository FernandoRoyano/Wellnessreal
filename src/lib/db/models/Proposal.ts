import mongoose, { Schema, Document, Model } from 'mongoose'

export type ProposalStatus =
  | 'pending'
  | 'viewed'
  | 'signed'
  | 'payment_pending'
  | 'paid'
  | 'confirmed'

export type PaymentMethod = 'stripe' | 'transfer' | null

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

export interface IProposal extends Document {
  clientName: string
  clientEmail: string
  clientPhone: string

  serviceType: ServiceType
  serviceLabel: string
  price: number
  duration: string
  description: string
  contractText: string

  token: string
  status: ProposalStatus

  signedAt: Date | null
  signatureFullName: string | null
  signatureIP: string | null

  paymentMethod: PaymentMethod
  stripeSessionId: string | null
  stripePaymentIntentId: string | null
  transferMarkedAt: Date | null
  paidAt: Date | null
  confirmedAt: Date | null
  confirmedBy: string | null

  viewedAt: Date | null
  notes: string

  createdAt: Date
  updatedAt: Date
}

const ProposalSchema = new Schema<IProposal>(
  {
    clientName: { type: String, required: true, trim: true },
    clientEmail: { type: String, required: true, trim: true, lowercase: true },
    clientPhone: { type: String, required: true, trim: true },

    serviceType: {
      type: String,
      required: true,
      enum: ['starter_1mes', 'pack_3meses', 'premium_3meses', 'solo_entrenamiento_trimestral', 'entrenamiento_presencial', 'consulta_nutricion', 'analisis_corporal', 'sesion_osteopatia', 'pack_combinado', 'personalizado'],
    },
    serviceLabel: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    duration: { type: String, required: true },
    description: { type: String, default: '' },
    contractText: { type: String, required: true },

    token: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'viewed', 'signed', 'payment_pending', 'paid', 'confirmed'],
    },

    signedAt: { type: Date, default: null },
    signatureFullName: { type: String, default: null },
    signatureIP: { type: String, default: null },

    paymentMethod: { type: String, default: null, enum: ['stripe', 'transfer', null] },
    stripeSessionId: { type: String, default: null },
    stripePaymentIntentId: { type: String, default: null },
    transferMarkedAt: { type: Date, default: null },
    paidAt: { type: Date, default: null },
    confirmedAt: { type: Date, default: null },
    confirmedBy: { type: String, default: null },

    viewedAt: { type: Date, default: null },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
)

const Proposal: Model<IProposal> =
  mongoose.models.Proposal || mongoose.model<IProposal>('Proposal', ProposalSchema)

export default Proposal
