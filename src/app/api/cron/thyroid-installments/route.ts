import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { sendEmail } from '@/lib/email'
import { THYROID_PROGRAM } from '@/lib/metodo-tiroides'

const FIRST_PAID_PATTERN = /\[payment:first_paid_at:([^\]]+)\]/
const SECOND_SENT_MARKER = '[payment:installments:2_sent]'
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character] ?? character)
}

export async function GET(request: NextRequest) {
  if (!process.env.CRON_SECRET || request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { data, error } = await supabase
      .from('asesoria_solicitudes')
      .select('id,nombre,email,notas')
      .eq('estado', 'pagada')
      .ilike('notas', '%[payment:installments:1]%')
      .limit(100)
    if (error) throw new Error(`[ThyroidInstallments:list] ${error.message}`)

    let sent = 0
    for (const application of data ?? []) {
      const notes = application.notas ?? ''
      if (notes.includes(SECOND_SENT_MARKER) || notes.includes('[payment:installments:2]')) continue
      const firstPaidAt = notes.match(FIRST_PAID_PATTERN)?.[1]
      if (!firstPaidAt || Date.now() - new Date(firstPaidAt).getTime() < THIRTY_DAYS_MS) continue

      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://wellnessreal.es'
      const session = await getStripe().checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        customer_email: application.email,
        line_items: [{
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: THYROID_PROGRAM.installmentPrice * 100,
            product_data: {
              name: THYROID_PROGRAM.name,
              description: `${THYROID_PROGRAM.duration} · pago 2 de 2`,
            },
          },
        }],
        metadata: {
          kind: 'metodo_tiroides',
          asesoria_id: application.id,
          customer_name: application.nombre,
          payment_plan: 'installments',
          installment_index: '2',
        },
        payment_intent_data: {
          metadata: {
            kind: 'metodo_tiroides',
            asesoria_id: application.id,
            payment_plan: 'installments',
            installment_index: '2',
          },
        },
        success_url: `${baseUrl}/metodo-tiroides/pago-confirmado?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/comunidad`,
      }, { idempotencyKey: `thyroid-installment-2-${application.id}` })
      if (!session.url) throw new Error(`[ThyroidInstallments:checkout] Sin URL para ${application.id}`)

      await sendEmail({
        to: application.email,
        subject: 'Segundo y último pago · Método BASE Tiroides',
        html: `<div style="max-width:600px;margin:auto;padding:32px;background:#16122b;color:#fff;font-family:Arial,sans-serif"><p style="color:#fcee21;font-weight:700">WELLNESSREAL</p><h1 style="font-size:24px">Segundo y último pago</h1><p style="color:#d5d0df;line-height:1.7">Hola ${escapeHtml(application.nombre)}. Han pasado 30 días desde el primer pago de tu plaza. Este es el enlace para completar el segundo y último pago de ${THYROID_PROGRAM.installmentPrice} €.</p><a href="${session.url}" style="display:inline-block;margin-top:16px;padding:15px 24px;border-radius:10px;background:#fcee21;color:#16122b;text-decoration:none;font-weight:700">Completar último pago</a><p style="margin-top:24px;color:#8f889e;font-size:12px">No se ha creado ninguna suscripción ni habrá cobros posteriores.</p></div>`,
      })

      const { error: updateError } = await supabase
        .from('asesoria_solicitudes')
        .update({ notas: `${notes}\n${SECOND_SENT_MARKER}`.trim() })
        .eq('id', application.id)
      if (updateError) throw new Error(`[ThyroidInstallments:markSent] ${updateError.message}`)
      sent += 1
    }

    return NextResponse.json({ success: true, sent })
  } catch (error) {
    console.error('[ThyroidInstallments:cron]', error)
    return NextResponse.json({ error: 'No se pudo procesar el segundo pago' }, { status: 500 })
  }
}
