import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connection'
import Proposal from '@/lib/db/models/Proposal'
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

    await connectDB()
    const proposal = await Proposal.findOne({ token })

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

    proposal.status = 'signed'
    proposal.signedAt = new Date()
    proposal.signatureFullName = parsed.data.fullName
    proposal.signatureIP = clientIP
    await proposal.save()

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
