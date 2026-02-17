import { NextRequest, NextResponse } from 'next/server'
import { getProposalByToken, updateProposalByToken } from '@/lib/db/proposals'
import { signContractSchema } from '@/lib/validations/proposal'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const body = await request.json()
    const parsed = signContractSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const proposal = await getProposalByToken(token)

    if (!proposal) {
      return NextResponse.json({ error: 'Propuesta no encontrada' }, { status: 404 })
    }

    if (!['pending', 'viewed'].includes(proposal.status)) {
      return NextResponse.json({ error: 'El contrato ya ha sido firmado' }, { status: 400 })
    }

    const clientIP =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    await updateProposalByToken(token, {
      status: 'signed',
      signed_at: new Date().toISOString(),
      signature_full_name: parsed.data.fullName,
      signature_ip: clientIP,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
