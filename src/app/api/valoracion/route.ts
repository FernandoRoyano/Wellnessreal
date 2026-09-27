import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendEmail } from '@/lib/email'
import { captureLead } from '@/lib/leadCapture'
import { escapeHtml } from '@/lib/utils/escapeHtml'

const OBJECTIVES = {
  'perder-grasa': 'Perder grasa',
  'ganar-musculo': 'Ganar músculo',
  'mejorar-salud': 'Mejorar fuerza y salud general',
  rendimiento: 'Mejorar el rendimiento',
  recuperacion: 'Volver a entrenar tras una lesión',
  habito: 'Crear un hábito de ejercicio',
} as const

const LEVELS = {
  nunca: 'No ha entrenado',
  principiante: 'Menos de un año',
  intermedio: 'Entre uno y tres años',
  avanzado: 'Más de tres años',
} as const

const attributionSchema = z
  .record(z.string(), z.union([z.string(), z.null(), z.undefined()]))
  .optional()

const valuationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().transform((value) => value.toLowerCase().trim()),
  phone: z.string().trim().min(9).max(30),
  objective: z.enum(Object.keys(OBJECTIVES) as [keyof typeof OBJECTIVES, ...(keyof typeof OBJECTIVES)[]]),
  objectiveDetail: z.string().trim().min(20).max(1000),
  level: z.enum(Object.keys(LEVELS) as [keyof typeof LEVELS, ...(keyof typeof LEVELS)[]]),
  daysPerWeek: z.enum(['1 día', '2 días', '3 días', '4 días', '5+ días']),
  sessionDuration: z.enum(['30 min', '45 min', '60 min', '90 min']),
  limitations: z.string().trim().max(1000).optional().default(''),
  interestedPlan: z.literal('personal_12_semanas').optional(),
  _attribution: attributionSchema,
})

function row(label: string, value: string): string {
  return `<tr><td style="padding:8px 12px;font-weight:bold;color:#662D91;vertical-align:top;">${label}</td><td style="padding:8px 12px;color:#333;">${escapeHtml(value)}</td></tr>`
}

export async function POST(request: NextRequest) {
  try {
    const parsed = valuationSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Revisa los campos obligatorios antes de enviar.' },
        { status: 400 }
      )
    }

    const data = parsed.data
    await captureLead({
      request,
      email: data.email,
      name: data.name,
      phone: data.phone,
      source: 'valoracion',
      attribution: data._attribution,
      tags: ['plan:personal_12_semanas'],
      form_data: {
        objective: data.objective,
        objectiveDetail: data.objectiveDetail,
        level: data.level,
        daysPerWeek: data.daysPerWeek,
        sessionDuration: data.sessionDuration,
        limitations: data.limitations || null,
        interestedPlan: 'personal_12_semanas',
      },
    })

    const safeName = escapeHtml(data.name)
    const safeEmail = escapeHtml(data.email)
    const phoneDigits = data.phone.replace(/[^0-9]/g, '')
    const businessHtml = `
      <div style="max-width:640px;margin:auto;padding:28px;font-family:Arial,sans-serif;color:#16122B">
        <h1>Nueva solicitud de entrenamiento individual</h1>
        <table style="width:100%;border-collapse:collapse">
          ${row('Nombre', data.name)}
          ${row('Email', data.email)}
          ${row('Teléfono', data.phone)}
          ${row('Objetivo', OBJECTIVES[data.objective])}
          ${row('Detalle', data.objectiveDetail)}
          ${row('Experiencia', LEVELS[data.level])}
          ${row('Disponibilidad', `${data.daysPerWeek} · ${data.sessionDuration}`)}
          ${row('Limitaciones', data.limitations || 'No indicadas')}
        </table>
        <p style="margin-top:24px"><a href="https://wa.me/${phoneDigits}">Responder por WhatsApp</a> · <a href="mailto:${safeEmail}">Responder por email</a></p>
      </div>`

    const userHtml = `
      <div style="max-width:600px;margin:auto;padding:32px;background:#16122B;color:#fff;font-family:Arial,sans-serif">
        <p style="color:#FCEE21;font-weight:700;letter-spacing:.08em">WELLNESSREAL</p>
        <h1 style="font-size:25px">Solicitud recibida, ${safeName}</h1>
        <p style="color:#d5d0df;line-height:1.7">Revisaré la información y te escribiré para decirte si el acompañamiento individual encaja con tu objetivo. Enviar la solicitud no implica pagar ni reservar una plaza.</p>
        <p style="color:#8f889e;font-size:13px;line-height:1.6">No necesitas responder a este mensaje con información médica. Si avanzamos, te explicaré qué datos son necesarios para adaptar el entrenamiento.</p>
      </div>`

    await Promise.all([
      sendEmail({
        to: ['info@wellnessreal.es', 'wellnessrealoficial@gmail.com'],
        replyTo: data.email,
        subject: `[Entrenamiento individual] ${safeName} — ${OBJECTIVES[data.objective]}`,
        html: businessHtml,
      }),
      sendEmail({
        to: data.email,
        subject: 'He recibido tu solicitud — WellnessReal',
        html: userHtml,
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Valoracion:POST] No se pudo procesar la solicitud:', error)
    return NextResponse.json({ error: 'No se pudo procesar la solicitud.' }, { status: 500 })
  }
}
