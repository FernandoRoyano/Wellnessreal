import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone } = body

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wellnessreal.es'
    const videoUrl = `${baseUrl}/metodo/video`

    // Confirmation email to user with link to VSL (in case they close the tab)
    const userHtml = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;">
<div style="max-width:600px;margin:0 auto;background:#16122B;">
  <div style="padding:40px 30px;text-align:center;">
    <h1 style="color:#FCEE21;font-size:24px;margin:0 0 8px;">WellnessReal</h1>
    <div style="height:2px;background:linear-gradient(90deg,#662D91,#FCEE21,#662D91);margin:16px 0;"></div>
    <h2 style="color:#fff;font-size:22px;margin:16px 0 8px;">Tu acceso al vídeo, ${name}</h2>
    <p style="color:#ccc;font-size:16px;line-height:1.7;margin:0 0 24px;">
      En 15 minutos te cuento cómo trabajo y por qué el entrenamiento online que has probado antes no te ha funcionado.
      Guarda este enlace por si cierras la pestaña o quieres volver a verlo.
    </p>
    <a href="${videoUrl}" style="display:inline-block;padding:16px 32px;background:#FCEE21;color:#16122B;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;">
      Ver el vídeo ahora
    </a>
    <p style="color:#888;font-size:13px;margin:24px 0 0;">
      O copia este enlace: ${videoUrl}
    </p>
  </div>
  <div style="padding:16px;text-align:center;border-top:1px solid rgba(102,45,145,0.3);">
    <p style="color:#666;font-size:12px;margin:0;">WellnessReal · Fernando Royano · wellnessreal.es</p>
  </div>
</div>
</body></html>`

    // Notification email to business
    const businessHtml = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;">
<div style="max-width:600px;margin:0 auto;background:#fff;padding:24px;">
  <h1 style="color:#16122B;margin:0 0 16px;font-size:20px;">Nuevo registro VSL — /metodo</h1>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:8px 12px;font-weight:bold;color:#662D91;">Nombre</td><td style="padding:8px 12px;">${name}</td></tr>
    <tr><td style="padding:8px 12px;font-weight:bold;color:#662D91;">Email</td><td style="padding:8px 12px;"><a href="mailto:${email}">${email}</a></td></tr>
    <tr><td style="padding:8px 12px;font-weight:bold;color:#662D91;">Teléfono</td><td style="padding:8px 12px;"><a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}">${phone}</a></td></tr>
  </table>
  <p style="color:#888;font-size:12px;margin-top:16px;">Lead generado desde el funnel /metodo (VSL).</p>
</div>
</body></html>`

    // Send both emails
    await sendEmail({
      to: email,
      subject: 'Tu acceso al vídeo — WellnessReal',
      html: userHtml,
    })

    await sendEmail({
      to: ['info@wellnessreal.es', 'wellnessrealoficial@gmail.com'],
      replyTo: email,
      subject: `[VSL Lead] ${name}`,
      html: businessHtml,
    })

    // Subscribe to MailerLite with VSL group tag
    const mlKey = process.env.MAILERLITE_API_KEY
    const vslGroupId = process.env.MAILERLITE_VSL_GROUP_ID
    const defaultGroupId = process.env.MAILERLITE_GROUP_ID

    const diag = {
      mlKeySet: !!mlKey,
      vslGroupIdSet: !!vslGroupId,
      vslGroupIdPreview: vslGroupId ? `${vslGroupId.slice(0, 6)}...` : null,
      defaultGroupIdSet: !!defaultGroupId,
      groupsUsed: [] as string[],
      mlResponse: null as null | { ok: boolean; status: number },
    }

    if (mlKey) {
      try {
        const groups: string[] = []
        if (vslGroupId) groups.push(vslGroupId)
        else if (defaultGroupId) groups.push(defaultGroupId)
        diag.groupsUsed = groups

        const mlRes = await fetch('https://connect.mailerlite.com/api/subscribers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mlKey}`,
          },
          body: JSON.stringify({
            email,
            fields: { name, phone, source: 'VSL /metodo' },
            groups,
          }),
        })
        diag.mlResponse = { ok: mlRes.ok, status: mlRes.status }
      } catch (e) {
        console.error('Error subscribing VSL lead to MailerLite:', e)
      }
    }

    return NextResponse.json({ success: true, diag })
  } catch (error) {
    console.error('Error en API VSL opt-in:', error)
    return NextResponse.json({ error: 'Error al procesar el registro' }, { status: 500 })
  }
}
