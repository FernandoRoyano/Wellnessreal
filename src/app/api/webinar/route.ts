import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { captureLead } from '@/lib/leadCapture'
import { escapeHtml, sanitizeHeader } from '@/lib/utils/escapeHtml'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const rl = rateLimit(`webinar:${ip}`, 5, 60 * 1000)
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Demasiados intentos. Espera un momento.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
      )
    }

    const { name, email, phone, session, sessionLabel, _attribution } = await request.json()

    if (!name || !email || !phone || !session) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    // Guardar lead (no rompe el flujo si Supabase falla)
    await captureLead({
      request,
      email,
      name,
      phone,
      source: 'webinar',
      attribution: _attribution,
      tags: ['webinar'],
      form_data: { session, sessionLabel: sessionLabel || null },
    })

    const safe = {
      name: escapeHtml(name),
      sessionLabel: escapeHtml(sessionLabel || ''),
    }

    // Email de confirmación al asistente
    const userHtml = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;">
<div style="max-width:600px;margin:0 auto;background:#16122B;">
  <div style="padding:40px 30px;text-align:center;">
    <h1 style="color:#FCEE21;font-size:24px;margin:0 0 8px;">WellnessReal</h1>
    <div style="height:2px;background:linear-gradient(90deg,#662D91,#FCEE21,#662D91);margin:16px 0;"></div>
    <h2 style="color:#fff;font-size:22px;margin:16px 0 8px;">¡Plaza reservada, ${safe.name}!</h2>
    <p style="color:#ccc;font-size:16px;line-height:1.6;margin:0 0 24px;">
      Tu plaza para la clase online gratuita está confirmada.
      ${safe.sessionLabel ? `<br><strong style="color:#FCEE21;">Sesión: ${safe.sessionLabel}</strong>` : ''}
    </p>
    <div style="background:rgba(252,238,33,0.1);padding:20px;border-radius:12px;border-left:4px solid #FCEE21;text-align:left;margin:0 0 24px;">
      <p style="color:#fff;margin:0 0 8px;font-weight:bold;">Qué hacer ahora:</p>
      <p style="color:#ccc;margin:0;line-height:1.7;">
        1. Apunta el día y la hora.<br>
        2. Te enviaré el enlace de acceso antes de empezar.<br>
        3. Conéctate desde el móvil o el ordenador, sin instalar nada.
      </p>
    </div>
    <p style="color:#999;font-size:14px;margin:0;">Si tienes cualquier duda, responde a este email.</p>
  </div>
  <div style="padding:16px;text-align:center;border-top:1px solid rgba(102,45,145,0.3);">
    <p style="color:#666;font-size:12px;margin:0;">WellnessReal · wellnessreal.es</p>
  </div>
</div>
</body></html>`

    // Aviso interno
    const businessHtml = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#16122B;padding:20px;text-align:center;">
    <h1 style="color:#FCEE21;margin:0;font-size:20px;">Nueva reserva de webinar</h1>
  </div>
  <div style="padding:24px;background:#f9f9f9;">
    <p><strong>Nombre:</strong> ${safe.name}</p>
    <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
    <p><strong>Teléfono:</strong> <a href="https://wa.me/${String(phone).replace(/[^0-9]/g, '')}">${escapeHtml(phone)}</a></p>
    <p><strong>Sesión:</strong> ${safe.sessionLabel || '—'}</p>
  </div>
</div>`

    try {
      await sendEmail({
        to: email,
        subject: 'Tu plaza está reservada — Clase gratuita WellnessReal',
        html: userHtml,
      })
      await sendEmail({
        to: ['info@wellnessreal.es', 'wellnessrealoficial@gmail.com'],
        replyTo: email,
        subject: sanitizeHeader(`[Webinar] ${name}${sessionLabel ? ` — ${sessionLabel}` : ''}`),
        html: businessHtml,
      })
    } catch (mailErr) {
      console.error('[webinar] Error enviando emails:', mailErr)
      // El lead ya quedó guardado; no rompemos la respuesta
    }

    // Suscribir a MailerLite (grupo de webinar si está configurado)
    const mlKey = process.env.MAILERLITE_API_KEY
    const mlGroup = process.env.MAILERLITE_WEBINAR_GROUP_ID || process.env.MAILERLITE_GROUP_ID
    if (mlKey) {
      try {
        await fetch('https://connect.mailerlite.com/api/subscribers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${mlKey}`,
          },
          body: JSON.stringify({
            email,
            fields: { name, phone },
            groups: mlGroup ? [mlGroup] : [],
            status: 'active',
          }),
        })
      } catch (mlErr) {
        console.error('[webinar] Error MailerLite:', mlErr)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[webinar] Error:', error)
    return NextResponse.json({ error: 'Error al procesar la reserva' }, { status: 500 })
  }
}
