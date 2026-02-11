export interface MLSubscriber {
  id: string
  email: string
  status: 'active' | 'unsubscribed' | 'unconfirmed' | 'bounced' | 'junk'
  source: string
  fields: {
    name: string | null
    last_name: string | null
    [key: string]: string | null | undefined
  }
  groups: Array<{ id: string; name: string }>
  opted_in_at: string | null
  optin_ip: string | null
  subscribed_at: string
  created_at: string
  updated_at: string
}

export interface MLGroup {
  id: string
  name: string
  active_count: number
  sent_count: number
  opens_count: number
  open_rate: { float: number; string: string }
  clicks_count: number
  click_rate: { float: number; string: string }
  unsubscribed_count: number
  unconfirmed_count: number
  bounced_count: number
  junk_count: number
  created_at: string
}

export interface MLCampaignEmail {
  id: string
  from: string
  from_name: string
  subject: string
  content: string
}

export interface MLCampaignStats {
  sent: number
  opens_count: number
  unique_opens_count: number
  open_rate: { float: number; string: string }
  clicks_count: number
  unique_clicks_count: number
  click_rate: { float: number; string: string }
  unsubscribes_count: number
  spam_count: number
  hard_bounces_count: number
  soft_bounces_count: number
}

export interface MLCampaign {
  id: string
  account_id: string
  name: string
  type: 'regular' | 'ab' | 'resend' | 'rss'
  status: 'draft' | 'ready' | 'sent' | 'sending'
  emails: MLCampaignEmail[]
  stats?: MLCampaignStats
  created_at: string
  updated_at: string
  scheduled_for: string | null
  sent_at: string | null
}

export interface MLPaginatedResponse<T> {
  data: T[]
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: {
    path: string
    per_page: number
    next_cursor: string | null
    prev_cursor: string | null
  }
}
