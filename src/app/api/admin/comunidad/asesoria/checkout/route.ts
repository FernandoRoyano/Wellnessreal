import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { isAdminAuthenticated } from '@/lib/auth'
import { getStripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { THYROID_PROGRAM } from '@/lib/metodo-tiroides'

const RequestSchema = z.object({
  id: z.uuid(),
  paymentPlan: z.enum(['one_time', 'installment_1', 'installment_2']).default('one_time'),
})

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const parsed = RequestSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ error: 'Solicitud no válida' }, { status: 400 })

    const { data: application, error } = await supabase
      .from('asesoria_solicitudes')
      .select('id, nombre, email, estado, notas')
      .eq('id', parsed.data.id)
      .single()

    if (error || !application) return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
    const isSecondInstallment = parsed.data.paymentPlan === 'installment_2'
    const hasFirstInstallment = application.notas?.includes('[payment:installments:1]')
    if (isSecondInstallment && (application.estado !== 'pagada' || !hasFirstInstallment)) {
      return NextResponse.json({ error: 'El segundo pago solo puede generarse después de confirmar el primero.' }, { status: 409 })
    }
    if (!isSecondInstallment && application.estado !== 'aceptada') {
      return NextResponse.json({ error: 'Acepta primero a la persona antes de generar el cobro.' }, { status: 409 })
    }

    const isInstallment = parsed.data.paymentPlan !== 'one_time'
    const installmentIndex = parsed.data.paymentPlan === 'installment_2' ? '2' : '1'
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://wellnessreal.es'
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: application.email,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: (isInstallment ? THYROID_PROGRAM.installmentPrice : THYROID_PROGRAM.price) * 100,
          product_data: {
            name: THYROID_PROGRAM.name,
            description: isInstallment
              ? `${THYROID_PROGRAM.duration} · pago ${installmentIndex} de 2`
              : `${THYROID_PROGRAM.duration} · pago único`,
          },
        },
      }],
      metadata: {
        kind: 'metodo_tiroides',
        asesoria_id: application.id,
        customer_name: application.nombre,
        payment_plan: isInstallment ? 'installments' : 'one_time',
        installment_index: isInstallment ? installmentIndex : '0',
      },
      payment_intent_data: {
        metadata: {
          kind: 'metodo_tiroides',
          asesoria_id: application.id,
          payment_plan: isInstallment ? 'installments' : 'one_time',
          installment_index: isInstallment ? installmentIndex : '0',
        },
      },
      success_url: `${baseUrl}/metodo-tiroides/pago-confirmado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/metodo-tiroides?payment=cancelled#solicitud`,
    })

    if (!session.url) throw new Error('Stripe no devolvió una URL de pago')
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('[MetodoTiroides:createCheckout]', error)
    return NextResponse.json({ error: 'No se pudo generar el enlace de pago' }, { status: 500 })
  }
}
