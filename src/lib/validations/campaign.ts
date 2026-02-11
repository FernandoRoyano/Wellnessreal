import { z } from 'zod'

export const createCampaignSchema = z.object({
  name: z.string().min(2, 'Nombre de campaña requerido'),
  subject: z.string().min(2, 'Asunto requerido'),
  fromName: z.string().min(2, 'Nombre del remitente requerido'),
  fromEmail: z.string().email('Email del remitente inválido'),
  content: z.string().min(20, 'El contenido debe tener al menos 20 caracteres'),
  groupId: z.string().min(1, 'Selecciona un grupo'),
})

export type CreateCampaignData = z.infer<typeof createCampaignSchema>

export const createGroupSchema = z.object({
  name: z.string().min(1, 'Nombre del grupo requerido').max(255),
})

export type CreateGroupData = z.infer<typeof createGroupSchema>
