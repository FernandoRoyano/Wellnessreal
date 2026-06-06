import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { getAllProposals } from '@/lib/db/proposals'
import { getAllPostsAdmin } from '@/lib/db/posts'
import { getSubscriberCount } from '@/lib/mailerlite'
import { supabase } from '@/lib/supabase'

const DAY_MS = 24 * 60 * 60 * 1000

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const now = new Date()
    const nowMs = now.getTime()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
    const sevenDaysAgo = new Date(nowMs - 7 * DAY_MS).toISOString()
    const fourteenDaysAgo = new Date(nowMs - 14 * DAY_MS).toISOString()
    const twentyFourHoursAgo = new Date(nowMs - DAY_MS).toISOString()
    const threeDaysAgo = new Date(nowMs - 3 * DAY_MS).toISOString()

    // Fetch all data in parallel
    const [proposals, posts, subscriberCount, leadsResp] = await Promise.all([
      getAllProposals(),
      getAllPostsAdmin(),
      getSubscriberCount().catch(() => ({ active: 0, unsubscribed: 0, bounced: 0, total: 0 })),
      supabase
        .from('leads')
        .select('id,name,email,phone,source,status,created_at,utm_campaign,utm_source')
        .order('created_at', { ascending: false }),
    ])

    const leads = leadsResp.data || []

    // ────────────────────────────────────────────────────────────────────
    // PROPOSAL stats
    // ────────────────────────────────────────────────────────────────────
    const statusCounts: Record<string, number> = {}
    for (const p of proposals) {
      statusCounts[p.status] = (statusCounts[p.status] || 0) + 1
    }

    const paidStatuses = ['paid', 'confirmed']
    const pendingPayStatuses = ['signed', 'payment_pending']

    const revenue = proposals
      .filter(p => paidStatuses.includes(p.status))
      .reduce((sum, p) => sum + Number(p.price), 0)

    const pendingRevenue = proposals
      .filter(p => pendingPayStatuses.includes(p.status))
      .reduce((sum, p) => sum + Number(p.price), 0)

    const activeProposals = proposals.filter(p =>
      ['pending', 'viewed', 'signed', 'payment_pending'].includes(p.status)
    ).length

    const conversionRate = proposals.length > 0
      ? Math.round((proposals.filter(p => paidStatuses.includes(p.status)).length / proposals.length) * 100)
      : 0

    const thisMonthProposals = proposals.filter(p => p.created_at >= startOfMonth).length
    const lastMonthProposals = proposals.filter(p =>
      p.created_at >= startOfLastMonth && p.created_at < startOfMonth
    ).length

    const thisMonthRevenue = proposals
      .filter(p => paidStatuses.includes(p.status) && (p.paid_at || p.created_at) >= startOfMonth)
      .reduce((s, p) => s + Number(p.price), 0)
    const lastMonthRevenue = proposals
      .filter(p => {
        const t = p.paid_at || p.created_at
        return paidStatuses.includes(p.status) && t >= startOfLastMonth && t < startOfMonth
      })
      .reduce((s, p) => s + Number(p.price), 0)

    const stripePayments = proposals.filter(p => p.payment_method === 'stripe' && paidStatuses.includes(p.status)).length
    const transferPayments = proposals.filter(p => p.payment_method === 'transfer' && paidStatuses.includes(p.status)).length

    const recentProposals = proposals.slice(0, 5).map(p => ({
      id: p.id,
      clientName: p.client_name,
      serviceLabel: p.service_label,
      price: p.price,
      status: p.status,
      createdAt: p.created_at,
    }))

    // Próximos cobros previstos (firmados o payment_pending)
    const pendingPayments = proposals
      .filter(p => pendingPayStatuses.includes(p.status))
      .sort((a, b) => (a.signed_at || a.created_at).localeCompare(b.signed_at || b.created_at))
      .slice(0, 10)
      .map(p => ({
        id: p.id,
        clientName: p.client_name,
        serviceLabel: p.service_label,
        price: Number(p.price),
        status: p.status,
        signedAt: p.signed_at,
        paymentMethod: p.payment_method,
      }))

    // ────────────────────────────────────────────────────────────────────
    // BLOG stats
    // ────────────────────────────────────────────────────────────────────
    const publishedPosts = posts.filter(p => p.published).length
    const draftPosts = posts.filter(p => !p.published).length
    const lastPost = posts.find(p => p.published) || null

    // ────────────────────────────────────────────────────────────────────
    // LEADS stats
    // ────────────────────────────────────────────────────────────────────
    const leadsByStatus: Record<string, number> = {}
    const leadsBySource: Record<string, number> = {}
    const leadsByCampaign: Record<string, number> = {}
    for (const l of leads) {
      leadsByStatus[l.status] = (leadsByStatus[l.status] || 0) + 1
      const src = l.utm_source || l.source || 'unknown'
      leadsBySource[src] = (leadsBySource[src] || 0) + 1
      if (l.utm_campaign) leadsByCampaign[l.utm_campaign] = (leadsByCampaign[l.utm_campaign] || 0) + 1
    }

    const leadsThisWeek = leads.filter(l => l.created_at >= sevenDaysAgo).length
    const leadsPrevWeek = leads.filter(l =>
      l.created_at >= fourteenDaysAgo && l.created_at < sevenDaysAgo
    ).length

    // Leads sin contactar (status=nuevo) creados hace más de 24h
    const uncontactedOver24h = leads.filter(l =>
      l.status === 'nuevo' && l.created_at < twentyFourHoursAgo
    )
    const uncontactedOver24hSample = uncontactedOver24h.slice(0, 5).map(l => ({
      id: l.id,
      name: l.name || l.email,
      hoursAgo: Math.floor((nowMs - new Date(l.created_at).getTime()) / (60 * 60 * 1000)),
    }))

    const topSources = Object.entries(leadsBySource)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([source, count]) => ({ source, count }))

    // ────────────────────────────────────────────────────────────────────
    // ATTENTION (acciones requeridas hoy)
    // ────────────────────────────────────────────────────────────────────
    const attention: Array<{
      type: string
      severity: 'critical' | 'warning' | 'info'
      label: string
      count: number
      href: string
    }> = []

    // 1. Leads sin contactar >24h
    if (uncontactedOver24h.length > 0) {
      attention.push({
        type: 'uncontacted_leads',
        severity: 'critical',
        label: uncontactedOver24h.length === 1
          ? '1 lead sin contactar (>24h)'
          : `${uncontactedOver24h.length} leads sin contactar (>24h)`,
        count: uncontactedOver24h.length,
        href: '/admin/leads?status=nuevo',
      })
    }

    // 2. Propuestas vistas pero sin firmar >3 días
    const staleViewed = proposals.filter(p =>
      p.status === 'viewed' && (p.viewed_at || p.created_at) < threeDaysAgo
    )
    if (staleViewed.length > 0) {
      attention.push({
        type: 'stale_viewed',
        severity: 'warning',
        label: staleViewed.length === 1
          ? '1 propuesta vista sin firmar (>3 días)'
          : `${staleViewed.length} propuestas vistas sin firmar (>3 días)`,
        count: staleViewed.length,
        href: '/admin/proposals',
      })
    }

    // 3. Propuestas firmadas pendientes de pago
    const signedNoPay = proposals.filter(p => p.status === 'signed')
    if (signedNoPay.length > 0) {
      attention.push({
        type: 'signed_no_pay',
        severity: 'warning',
        label: signedNoPay.length === 1
          ? '1 propuesta firmada sin pago'
          : `${signedNoPay.length} propuestas firmadas sin pago`,
        count: signedNoPay.length,
        href: '/admin/proposals',
      })
    }

    // 4. Transferencias marcadas pero sin confirmar
    const transferToConfirm = proposals.filter(p =>
      p.payment_method === 'transfer' &&
      p.transfer_marked_at &&
      p.status === 'payment_pending'
    )
    if (transferToConfirm.length > 0) {
      attention.push({
        type: 'transfer_to_confirm',
        severity: 'critical',
        label: transferToConfirm.length === 1
          ? '1 transferencia pendiente de confirmar'
          : `${transferToConfirm.length} transferencias pendientes de confirmar`,
        count: transferToConfirm.length,
        href: '/admin/proposals',
      })
    }

    // ────────────────────────────────────────────────────────────────────
    // SUMMARY ejecutivo
    // ────────────────────────────────────────────────────────────────────
    const summary = {
      hour: now.getHours(),
      leadsThisWeek,
      leadsPrevWeek,
      thisMonthRevenue,
      lastMonthRevenue,
      attentionCount: attention.reduce((s, a) => s + a.count, 0),
    }

    return NextResponse.json({
      summary,
      attention,
      proposals: {
        total: proposals.length,
        statusCounts,
        activeProposals,
        revenue,
        pendingRevenue,
        conversionRate,
        thisMonth: thisMonthProposals,
        lastMonth: lastMonthProposals,
        thisMonthRevenue,
        lastMonthRevenue,
        stripePayments,
        transferPayments,
        recent: recentProposals,
        pendingPayments,
      },
      leads: {
        total: leads.length,
        byStatus: leadsByStatus,
        topSources,
        thisWeek: leadsThisWeek,
        prevWeek: leadsPrevWeek,
        uncontactedOver24h: uncontactedOver24h.length,
        uncontactedSample: uncontactedOver24hSample,
      },
      blog: {
        published: publishedPosts,
        drafts: draftPosts,
        lastPost: lastPost ? { title: lastPost.title, publishedAt: lastPost.published_at } : null,
      },
      subscribers: subscriberCount,
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 })
  }
}
