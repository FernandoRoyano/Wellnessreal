interface CommunityEvent {
  event_name: string
  created_at: string
  external_id: string | null
  metadata: Record<string, unknown> | null
}

const DAY = 86_400_000
const dayStamp = (value: string) => Date.parse(`${value.slice(0, 10)}T00:00:00Z`)

export function getCommunityRetention(events: CommunityEvent[], since: string, now: Date, startedAt?: string) {
  const started = Date.parse(startedAt ?? '')
  const enabled = Number.isFinite(started) && started <= now.getTime()
  const activeMembers = new Set<string>()
  const resourceMembers = new Set<string>()
  const visits = new Map<string, Set<number>>()
  const cohorts = new Map<string, number>()
  const cohortStart = dayStamp(since) - 7 * DAY
  const cohortEnd = dayStamp(now.toISOString()) - 7 * DAY
  if (enabled) for (const event of events) {
    const date = Date.parse(event.created_at)
    if (!Number.isFinite(date) || date < started || date > now.getTime()) continue
    const memberId = typeof event.metadata?.member_id === 'string' ? event.metadata.member_id : null
    if (event.event_name === 'community_signup_confirmed') {
      const id = event.external_id?.match(/^community:signup:([0-9a-f-]{36})$/i)?.[1]
      const signup = dayStamp(event.created_at)
      if (id && signup >= cohortStart && signup < cohortEnd && !cohorts.has(id)) cohorts.set(id, signup)
    }
    if (event.event_name === 'community_active_day' && memberId) {
      const days = visits.get(memberId) ?? new Set<number>()
      days.add(dayStamp(event.created_at))
      visits.set(memberId, days)
      if (date >= Date.parse(since)) activeMembers.add(memberId)
    }
    if (event.event_name === 'community_resource_click' && memberId && date >= Date.parse(since)) resourceMembers.add(memberId)
  }
  const returned = [...cohorts].filter(([id, signup]) => [...(visits.get(id) ?? [])].some(day => day >= signup + DAY && day <= signup + 7 * DAY)).length
  return {
    enabled, startedAt: enabled ? startedAt : null,
    activeMembers: activeMembers.size, resourceMembers: resourceMembers.size,
    eligibleMembers: cohorts.size, returnedMembers: returned,
    returnRate: cohorts.size ? Math.round(returned / cohorts.size * 1000) / 10 : null,
    cohortStart: new Date(cohortStart).toISOString().slice(0, 10),
    cohortEnd: new Date(cohortEnd - DAY).toISOString().slice(0, 10),
  }
}
