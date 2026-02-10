import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import Proposal from '@/lib/db/models/Proposal'
import { createProposalSchema, serviceLabels } from '@/lib/validations/proposal'
import { isAdminAuthenticated } from '@/lib/auth'
import { nanoid } from 'nanoid'

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    await connectDB()
    const proposals = await Proposal.find({})
      .sort({ createdAt: -1 })
      .select('-contractText')
      .lean()

    return NextResponse.json({ proposals })
  } catch (err) {
    console.error('[GET /api/admin/proposals]', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = createProposalSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const data = parsed.data
    const token = nanoid(21)
    const serviceLabel = serviceLabels[data.serviceType]

    await connectDB()
    const proposal = await Proposal.create({
      ...data,
      serviceLabel,
      token,
      status: 'pending',
    })

    const clientUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/cliente/${token}`

    return NextResponse.json({
      success: true,
      proposal: { _id: proposal._id, token },
      clientUrl,
    })
  } catch (err) {
    console.error('[POST /api/admin/proposals]', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
