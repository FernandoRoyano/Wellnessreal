import { z } from 'zod'

const ContextSchema = z.object({ anonymousId: z.uuid(), sessionId: z.uuid() })
export type CommunityTrackingContext = z.infer<typeof ContextSchema>

export function parseCommunityTracking(value: FormDataEntryValue | null): CommunityTrackingContext | undefined {
  if (typeof value !== 'string' || value.length > 250) return undefined
  try {
    const result = ContextSchema.safeParse(JSON.parse(value))
    return result.success ? result.data : undefined
  } catch { return undefined }
}
