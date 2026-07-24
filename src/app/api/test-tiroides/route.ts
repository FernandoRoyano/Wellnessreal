import { NextRequest, NextResponse } from 'next/server'
import { captureLead } from '@/lib/leadCapture'
import { sendEmail } from '@/lib/email'
import { NIVELES, calcularNivel, type NivelId, type TestAnswers } from '@/lib/test-tiroides'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://wellnessreal.es'

function resultEmailHTML(name: string, nivelId: NivelId): string {
  const n = NIVELES[nivelId]
  const displayName = name || 'crack'
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#16122B;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#16122B;padding:40px 20px;"><tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td style="text-align:center;padding-bottom:26px;">
        <h1 style="color:#FCEE21;font-size:26px;margin:0;letter-spacing:2px;">WELLNESS<span style="color:#ffffff;">REAL</span></h1>
      </td></tr>
      <tr><td style="background-color:#1a1535;border-radius:16px;padding:36px 30px;border:1px solid rgba(102,45,145,0.3);">
        <p style="color:#9ca3af;font-size:13px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Tu resultado</p>
        <h2 style="color:#ffffff;font-size:24px;margin:0 0 16px;">${n.emoji} ${n.titulo}</h2>
        <p style="color:#d1d5db;font-size:15px;line-height:1.7;margin:0 0 20px;">Hola ${displayName}, ${n.resumen}</p>
        <div style="background-color:#16122B;border-radius:12px;padding:18px 20px;border:1px solid rgba(252,238,33,0.25);margin:0 0 24px;">
          <p style="color:#FCEE21;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Tu siguiente paso</p>
          <p style="color:#d1d5db;font-size:15px;line-height:1.7;margin:0;">${n.siguientePaso}</p>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:4px 0 8px;">
          <a href="${BASE_URL}/comunidad/entrar" target="_blank" style="display:inline-block;background-color:#FCEE21;color:#16122B;font-size:16px;font-weight:bold;text-decoration:none;padding:15px 34px;border-radius:10px;">
            Entrar en la comunidad gratis
          </a>
        </td></tr></table>
        <p style="color:#9ca3af;font-size:13px;text-align:center;margin:18px 0 0;">
          Y de regalo, tu guía completa: <a href="${BASE_URL}/tiroides.pdf" style="color:#FCEE21;">descárgala aquí</a>.
        </p>
      </td></tr>
      <tr><td style="text-align:center;padding-top:22px;">
        <p style="color:#6b7280;font-size:12px;line-height:1.6;margin:0;">
          Este test es orientativo, no es un diagnóstico. Tu tiroides la lleva tu endocrino;
          lo de entrenar y comer para verte bien con ella regulada, lo vemos juntos.
        </p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, answers, _attribution } = body as {
      name?: string
      email?: string
      answers?: TestAnswers
      _attribution?: Record<string, string>
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }
    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Faltan las respuestas' }, { status: 400 })
    }

    const nivel = calcularNivel(answers)

    // Lead en Supabase con el nivel como etiqueta y las respuestas guardadas.
    await captureLead({
      request,
      email,
      name: name || null,
      source: 'tiroides',
      attribution: _attribution,
      tags: ['form:test-tiroides', `nivel:${nivel}`],
      form_data: { ...answers, nivel },
    })

    // Email de resultado personalizado (esperar: serverless).
    try {
      await sendEmail({
        to: email,
        subject: `Tu resultado del test de tiroides: ${NIVELES[nivel].titulo}`,
        html: resultEmailHTML(name || '', nivel),
      })
    } catch (mailErr) {
      console.error('[test-tiroides] email de resultado falló:', mailErr)
    }

    // MailerLite: mismo grupo de tiroides + el nivel como campo (best-effort).
    const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY
    const GROUP_ID = process.env.MAILERLITE_TIROIDES_GROUP_ID || process.env.MAILERLITE_GROUP_ID
    if (MAILERLITE_API_KEY) {
      try {
        await fetch('https://connect.mailerlite.com/api/subscribers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${MAILERLITE_API_KEY}`,
          },
          body: JSON.stringify({
            email,
            fields: { name: name || '', nivel_tiroides: nivel },
            groups: GROUP_ID ? [GROUP_ID] : [],
            status: 'active',
          }),
        })
      } catch (mlErr) {
        console.error('[test-tiroides] MailerLite:', mlErr)
      }
    }

    return NextResponse.json({ success: true, nivel })
  } catch (err) {
    console.error('[POST /api/test-tiroides]', err)
    return NextResponse.json({ error: 'Error al procesar el test' }, { status: 500 })
  }
}
