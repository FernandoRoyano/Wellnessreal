import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { getLead, updateLead, deleteLead } from '@/lib/db/leads'
import { z } from 'zod'
import { COMMERCIAL_STAGES, LEAD_KINDS, getCommercialStage, getLeadKind, updateCommercialTags } from '@/lib/lead-measurement'

const updateSchema = z.object({
  name: z.string().max(100).nullable().optional(),
  phone: z.string().max(30).nullable().optional(),
  notes: z.string().max(10000).nullable().optional(),
  status: z.enum(['nuevo', 'contactado', 'qualified', 'cliente', 'descartado']).optional(),
  tags: z.array(z.string().max(200).refine(tag => !tag.startsWith('crm:'))).max(100).optional(),
  contacted_at: z.iso.datetime().nullable().optional(),
  converted_at: z.iso.datetime().nullable().optional(),
  commercialKind: z.enum(LEAD_KINDS.map(option => option.value)).optional(),
  commercialStage: z.enum(COMMERCIAL_STAGES.map(option => option.value)).optional(),
  confirmPayment: z.boolean().optional(),
  expectedUpdatedAt: z.string().max(60).optional(),
}).strict()

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    const { id } = await params
    const lead = await getLead(id)
    if (!lead) return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 })
    return NextResponse.json({ lead })
  } catch (err) {
    console.error('[GET /api/admin/leads/[id]]', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    const { id } = await params
    const parsed = updateSchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) return NextResponse.json({ error: 'Revisa los datos del contacto.' }, { status: 400 })
    const current = await getLead(id)
    if (!current) return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 })
    const { commercialKind, commercialStage, confirmPayment, expectedUpdatedAt, ...updates } = parsed.data
    if (updates.tags) updates.tags = [...updates.tags, ...(current.tags ?? []).filter(tag => tag.startsWith('crm:'))]
    if (commercialKind !== undefined || commercialStage !== undefined) {
      const kind = commercialKind ?? getLeadKind(current)
      const stage = commercialStage ?? getCommercialStage(current)
      if (stage !== 'sin_revisar' && kind !== 'oportunidad') {
        return NextResponse.json({ error: 'Solo las solicitudes comerciales tienen fase de venta.' }, { status: 400 })
      }
      if (stage === 'pagado' && getCommercialStage(current) !== 'pagado' && !confirmPayment) {
        return NextResponse.json({ error: 'Confirma que has verificado el pago antes de registrarlo.' }, { status: 400 })
      }
      if (stage === 'contactado') updates.contacted_at = current.contacted_at ?? new Date().toISOString()
      if (stage === 'pagado') updates.converted_at = current.converted_at ?? new Date().toISOString()
      updates.tags = updateCommercialTags(updates.tags ?? current.tags ?? [], kind, stage, new Date().toISOString())
      if (kind === 'oportunidad' && stage !== 'sin_revisar') {
        updates.status = stage === 'pagado' ? 'cliente' : stage === 'no_continua' ? 'descartado' : stage === 'nuevo' ? 'nuevo' : stage === 'contactado' ? 'contactado' : 'qualified'
      }
    }
    const lead = await updateLead(id, updates, expectedUpdatedAt ?? current.updated_at)
    return NextResponse.json({ lead })
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 'PGRST116') {
      return NextResponse.json({ error: 'El contacto ha cambiado. Recarga antes de guardar.' }, { status: 409 })
    }
    console.error('[PATCH /api/admin/leads/[id]]', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    const { id } = await params
    await deleteLead(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/admin/leads/[id]]', err)
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
  }
}
