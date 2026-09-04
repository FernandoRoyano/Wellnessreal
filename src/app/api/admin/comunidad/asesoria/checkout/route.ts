import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { isAdminAuthenticated } from '@/lib/auth'
import { getStripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { THYROID_PROGRAM } from '@/lib/metodo-tiroides'

const RequestSchema = z.object({ id: z.uuid() })

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const parsed = RequestSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ error: 'Solicitud no válida' }, { status: 400 })

    const { data: application, error } = await supabase
      .from('asesoria_solicitudes')
      .select('id, nombre, email, estado')
      .eq('id', parsed.data.id)
      .single()

    if (error || !application) return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
    if (!['aceptada', 'pagada'].includes(application.estado)) {
      return NextResponse.json({ error: 'Acepta primero a la persona antes de generar el cobro.' }, { status: 409 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wellnessreal.es'
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      customer_email: application.email,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: THYROID_PROGRAM.price * 100,
          product_data: {
            name: THYROID_PROGRAM.name,
            description: `${THYROID_PROGRAM.duration} · programa acompañado`,
          },
        },
      }],
      metadata: {
        kind: 'metodo_tiroides',
        asesoria_id: application.id,
        customer_name: application.nombre,
      },
      payment_intent_data: {
        metadata: { kind: 'metodo_tiroides', asesoria_id: application.id },
      },
      success_url: `${baseUrl}/metodo-tiroides/pago-confirmado`,
      cancel_url: `${baseUrl}/metodo-tiroides?payment=cancelled#solicitud`,
    })

    if (!session.url) throw new Error('Stripe no devolvió una URL de pago')
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('[MetodoTiroides:createCheckout]', error)
    return NextResponse.json({ error: 'No se pudo generar el enlace de pago' }, { status: 500 })
  }
}
