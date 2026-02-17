import { NextRequest, NextResponse } from 'next/server'
import { getAllProposals, createProposal, toClientProposal } from '@/lib/db/proposals'
import { createProposalSchema, serviceLabels } from '@/lib/validations/proposal'
import { isAdminAuthenticated } from '@/lib/auth'
import { nanoid } from 'nanoid'

export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const proposals = await getAllProposals()

    return NextResponse.json({ proposals: proposals.map(toClientProposal) })
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

    const proposal = await createProposal({
      client_name: data.clientName,
      client_email: data.clientEmail.toLowerCase().trim(),
      client_phone: data.clientPhone,
      service_type: data.serviceType,
      service_label: serviceLabel,
      price: data.price,
      duration: data.duration,
      description: data.description || '',
      contract_text: data.contractText,
      token,
      status: 'pending',
      signed_at: null,
      signature_full_name: null,
      signature_ip: null,
      payment_method: null,
      stripe_session_id: null,
      stripe_payment_intent_id: null,
      transfer_marked_at: null,
      paid_at: null,
      confirmed_at: null,
      confirmed_by: null,
      viewed_at: null,
      notes: data.notes || '',
    })

    const clientUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/cliente/${token}`

    return NextResponse.json({
      success: true,
      proposal: { _id: proposal.id, token },
      clientUrl,
    })
  } catch (err) {
    console.error('[POST /api/admin/proposals]', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
