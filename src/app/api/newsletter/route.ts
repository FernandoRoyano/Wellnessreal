import { NextRequest, NextResponse } from 'next/server'

// API para suscripción a newsletter + envío de guía gratuita por email

function buildGuideEmailHTML(name: string, downloadUrl: string): string {
  const displayName = name || 'crack'
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#16122B;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#16122B;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <!-- Logo -->
        <tr><td style="text-align:center;padding-bottom:30px;">
          <h1 style="color:#FCEE21;font-size:28px;margin:0;letter-spacing:2px;">WELLNESS<span style="color:#ffffff;">REAL</span></h1>
        </td></tr>
        <!-- Main card -->
        <tr><td style="background-color:#1a1535;border-radius:16px;padding:40px 30px;border:1px solid rgba(102,45,145,0.3);">
          <h2 style="color:#FCEE21;font-size:24px;margin:0 0 16px;text-align:center;">
            ¡Tu guía está lista, ${displayName}!
          </h2>
          <p style="color:#d1d5db;font-size:16px;line-height:1.6;text-align:center;margin:0 0 24px;">
            Gracias por unirte a la comunidad WellnessReal. Aquí tienes tu guía
            <strong style="color:#ffffff;">"Fitness real para gente con vida real"</strong>.
          </p>
          <!-- Download button -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding:16px 0;">
              <a href="${downloadUrl}" target="_blank"
                style="display:inline-block;background-color:#FCEE21;color:#16122B;font-size:18px;font-weight:bold;text-decoration:none;padding:16px 40px;border-radius:12px;">
                DESCARGAR GUÍA GRATIS
              </a>
            </td></tr>
          </table>
          <p style="color:#9ca3af;font-size:13px;text-align:center;margin:20px 0 0;">
            Si el botón no funciona, copia este enlace: <a href="${downloadUrl}" style="color:#FCEE21;">${downloadUrl}</a>
          </p>
        </td></tr>
        <!-- Tips section -->
        <tr><td style="padding:30px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a1535;border-radius:12px;padding:24px;border:1px solid rgba(102,45,145,0.2);">
            <tr><td>
              <h3 style="color:#ffffff;font-size:18px;margin:0 0 16px;">Próximos pasos:</h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:8px 0;color:#d1d5db;font-size:14px;">
                  <span style="color:#FCEE21;font-weight:bold;">1.</span> Lee la guía con calma (10 min de lectura)
                </td></tr>
                <tr><td style="padding:8px 0;color:#d1d5db;font-size:14px;">
                  <span style="color:#FCEE21;font-weight:bold;">2.</span> Elige UNA idea y ponla en práctica esta semana
                </td></tr>
                <tr><td style="padding:8px 0;color:#d1d5db;font-size:14px;">
                  <span style="color:#FCEE21;font-weight:bold;">3.</span> Si quieres ir más rápido, responde a este email
                </td></tr>
              </table>
            </td></tr>
          </table>
        </td></tr>
        <!-- Footer -->
        <tr><td style="text-align:center;padding-top:10px;">
          <p style="color:#6b7280;font-size:12px;margin:0;">
            WellnessReal · Fitness real para gente con vida real
          </p>
          <p style="color:#4b5563;font-size:11px;margin:8px 0 0;">
            Recibes este email porque te suscribiste para descargar nuestra guía gratuita.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

async function sendGuideEmail(email: string, name: string) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  if (!RESEND_API_KEY) {
    console.log('[Newsletter] RESEND_API_KEY no configurada, email de guía no enviado')
    return
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wellnessreal.com'
  const downloadUrl = `${baseUrl}/guia-wellness-real.pdf`

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'WellnessReal <onboarding@resend.dev>',
        to: [email],
        subject: '¡Tu guía WellnessReal está lista! Descárgala ahora',
        html: buildGuideEmailHTML(name, downloadUrl),
      }),
    })

    if (res.ok) {
      console.log('[Newsletter] Email de guía enviado a:', email)
    } else {
      const err = await res.json().catch(() => ({}))
      console.error('[Newsletter] Error enviando email de guía:', err)
    }
  } catch (err) {
    console.error('[Newsletter] Error enviando email de guía:', err)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = body

    // Validación básica
    if (!email) {
      return NextResponse.json(
        { error: 'El email es requerido' },
        { status: 400 }
      )
    }

    // Validar formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY
    const MAILERLITE_GROUP_ID = process.env.MAILERLITE_GROUP_ID

    if (!MAILERLITE_API_KEY) {
      console.error('MAILERLITE_API_KEY no configurada')
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      )
    }

    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({
        email,
        fields: { name: name || '' },
        groups: MAILERLITE_GROUP_ID ? [MAILERLITE_GROUP_ID] : [],
        status: 'active',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error Mailerlite:', errorData)

      if (response.status === 409) {
        // Ya suscrito — igualmente enviar el email con la guía
        sendGuideEmail(email, name || '').catch(() => {})
        return NextResponse.json({
          success: true,
          message: 'Ya estás suscrito'
        })
      }

      throw new Error('Error al suscribir en Mailerlite')
    }

    console.log('Nuevo suscriptor:', email)

    // Enviar email con la guía (en background, no bloquea la respuesta)
    sendGuideEmail(email, name || '').catch(() => {})

    return NextResponse.json({
      success: true,
      message: 'Suscripción completada'
    })

  } catch (error) {
    console.error('Error en API de newsletter:', error)
    return NextResponse.json(
      { error: 'Error al procesar la suscripción' },
      { status: 500 }
    )
  }
}
