import type {
  MLSubscriber,
  MLGroup,
  MLCampaign,
  MLPaginatedResponse,
} from '@/lib/types/mailerlite'

const MAILERLITE_BASE = 'https://connect.mailerlite.com/api'

function getHeaders(): HeadersInit {
  const apiKey = process.env.MAILERLITE_API_KEY
  if (!apiKey) throw new Error('MAILERLITE_API_KEY no configurada')
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${apiKey}`,
  }
}

// MailerLite only accepts specific limit values: 10, 25, 50, 100
function normalizeLimit(limit?: number): number {
  if (!limit) return 25
  if (limit <= 10) return 10
  if (limit <= 25) return 25
  if (limit <= 50) return 50
  return 100
}

async function mailerliteRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${MAILERLITE_BASE}${endpoint}`, {
    ...options,
    headers: getHeaders(),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `MailerLite API error: ${response.status}`)
  }
  return response.json()
}

// --- Subscribers ---

export async function getSubscribers(params?: {
  cursor?: string
  limit?: number
  filter?: { status?: string }
}): Promise<MLPaginatedResponse<MLSubscriber>> {
  const searchParams = new URLSearchParams()
  searchParams.set('limit', String(normalizeLimit(params?.limit)))
  if (params?.cursor) searchParams.set('cursor', params.cursor)
  if (params?.filter?.status) searchParams.set('filter[status]', params.filter.status)
  return mailerliteRequest(`/subscribers?${searchParams}`)
}

export async function getSubscriber(id: string): Promise<{ data: MLSubscriber }> {
  return mailerliteRequest(`/subscribers/${id}`)
}

export async function deleteSubscriber(id: string): Promise<void> {
  await fetch(`${MAILERLITE_BASE}/subscribers/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  })
}

export async function getSubscriberCount(): Promise<{
  active: number
  unsubscribed: number
  bounced: number
  total: number
}> {
  // Fetch subscribers for each status and count them
  const [active, unsubscribed, bounced] = await Promise.all([
    mailerliteRequest<MLPaginatedResponse<MLSubscriber>>(
      '/subscribers?filter[status]=active&limit=100'
    ),
    mailerliteRequest<MLPaginatedResponse<MLSubscriber>>(
      '/subscribers?filter[status]=unsubscribed&limit=100'
    ),
    mailerliteRequest<MLPaginatedResponse<MLSubscriber>>(
      '/subscribers?filter[status]=bounced&limit=100'
    ),
  ])

  const activeCount = active.data?.length ?? 0
  const unsubscribedCount = unsubscribed.data?.length ?? 0
  const bouncedCount = bounced.data?.length ?? 0

  return {
    active: activeCount,
    unsubscribed: unsubscribedCount,
    bounced: bouncedCount,
    total: activeCount + unsubscribedCount + bouncedCount,
  }
}

// --- Groups ---

export async function getGroups(params?: {
  cursor?: string
  limit?: number
}): Promise<MLPaginatedResponse<MLGroup>> {
  const searchParams = new URLSearchParams()
  searchParams.set('limit', String(normalizeLimit(params?.limit)))
  if (params?.cursor) searchParams.set('cursor', params.cursor)
  return mailerliteRequest(`/groups?${searchParams}`)
}

export async function createGroup(name: string): Promise<{ data: MLGroup }> {
  return mailerliteRequest('/groups', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
}

// --- Campaigns ---

export async function getCampaigns(params?: {
  filter?: { status?: string; type?: string }
  cursor?: string
  limit?: number
}): Promise<MLPaginatedResponse<MLCampaign>> {
  const searchParams = new URLSearchParams()
  searchParams.set('limit', String(normalizeLimit(params?.limit)))
  if (params?.cursor) searchParams.set('cursor', params.cursor)
  if (params?.filter?.status) searchParams.set('filter[status]', params.filter.status)
  if (params?.filter?.type) searchParams.set('filter[type]', params.filter.type)
  return mailerliteRequest(`/campaigns?${searchParams}`)
}

export async function getCampaign(id: string): Promise<{ data: MLCampaign }> {
  return mailerliteRequest(`/campaigns/${id}`)
}

export async function createCampaign(data: {
  name: string
  subject: string
  from: string
  from_name: string
  content: string
  groups: string[]
}): Promise<{ data: MLCampaign }> {
  return mailerliteRequest('/campaigns', {
    method: 'POST',
    body: JSON.stringify({
      name: data.name,
      type: 'regular',
      groups: data.groups,
      emails: [
        {
          subject: data.subject,
          from: data.from,
          from_name: data.from_name,
          content: data.content,
        },
      ],
    }),
  })
}

export async function sendCampaign(campaignId: string): Promise<{ data: MLCampaign }> {
  return mailerliteRequest(`/campaigns/${campaignId}/schedule`, {
    method: 'POST',
    body: JSON.stringify({ delivery: 'instant' }),
  })
}

export async function deleteCampaign(campaignId: string): Promise<void> {
  const response = await fetch(`${MAILERLITE_BASE}/campaigns/${campaignId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  })
  if (!response.ok && response.status !== 204) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `Error al eliminar campaña: ${response.status}`)
  }
}

export async function deleteGroup(groupId: string): Promise<void> {
  const response = await fetch(`${MAILERLITE_BASE}/groups/${groupId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  })
  if (!response.ok && response.status !== 204) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `Error al eliminar grupo: ${response.status}`)
  }
}
