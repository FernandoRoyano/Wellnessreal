import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { getAllProposals } from '@/lib/db/proposals'
import { getAllPostsAdmin } from '@/lib/db/posts'
import { getSubscriberCount } from '@/lib/mailerlite'

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()

    // Fetch all data in parallel
    const [proposals, posts, subscriberCount] = await Promise.all([
      getAllProposals(),
      getAllPostsAdmin(),
      getSubscriberCount().catch(() => ({ active: 0, unsubscribed: 0, bounced: 0, total: 0 })),
    ])

    // --- Proposal stats ---
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

    const totalWithAction = proposals.filter(p =>
      !['pending'].includes(p.status)
    ).length
    const conversionRate = proposals.length > 0
      ? Math.round((proposals.filter(p => paidStatuses.includes(p.status)).length / proposals.length) * 100)
      : 0

    const thisMonthProposals = proposals.filter(p => p.created_at >= startOfMonth).length
    const lastMonthProposals = proposals.filter(p =>
      p.created_at >= startOfLastMonth && p.created_at < startOfMonth
    ).length

    const stripePayments = proposals.filter(p => p.payment_method === 'stripe' && paidStatuses.includes(p.status)).length
    const transferPayments = proposals.filter(p => p.payment_method === 'transfer' && paidStatuses.includes(p.status)).length

    // Recent proposals (last 5)
    const recentProposals = proposals.slice(0, 5).map(p => ({
      id: p.id,
      clientName: p.client_name,
      serviceLabel: p.service_label,
      price: p.price,
      status: p.status,
      createdAt: p.created_at,
    }))

    // --- Blog stats ---
    const publishedPosts = posts.filter(p => p.published).length
    const draftPosts = posts.filter(p => !p.published).length
    const lastPost = posts.find(p => p.published) || null

    return NextResponse.json({
      proposals: {
        total: proposals.length,
        statusCounts,
        activeProposals,
        revenue,
        pendingRevenue,
        conversionRate,
        thisMonth: thisMonthProposals,
        lastMonth: lastMonthProposals,
        stripePayments,
        transferPayments,
        recent: recentProposals,
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
