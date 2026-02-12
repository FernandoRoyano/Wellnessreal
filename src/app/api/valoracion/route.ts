import { NextRequest, NextResponse } from 'next/server'

const objectiveLabels: Record<string, string> = {
  'perder-grasa': 'Perder grasa',
  'ganar-musculo': 'Ganar músculo',
  'mejorar-salud': 'Mejorar salud general',
  'rendimiento': 'Rendimiento deportivo',
  'recuperacion': 'Recuperación de lesión',
  'habito': 'Crear hábito de ejercicio',
}

const levelLabels: Record<string, string> = {
  'nunca': 'Nunca ha entrenado',
  'principiante': 'Principiante (< 1 año)',
  'intermedio': 'Intermedio (1-3 años)',
  'avanzado': 'Avanzado (3+ años)',
}

function row(label: string, value: string | undefined) {
  if (!value) return ''
  return `<tr>
    <td style="padding:8px 12px;font-weight:bold;color:#662D91;vertical-align:top;white-space:nowrap;">${label}</td>
    <td style="padding:8px 12px;color:#333;">${value}</td>
  </tr>`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name, email, phone, age,
      objective, objectiveDetail,
      level, currentlyTraining, trainingDetail,
      daysPerWeek, sessionDuration, schedule, modality,
      injuries, medicalConditions, diet,
      expectations, source,
    } = body

    if (!name || !email || !phone || !objective || !level) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    // Email to business owner
    const businessHtml = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;">
<div style="max-width:600px;margin:0 auto;background:#fff;">
  <div style="background:#16122B;padding:24px;text-align:center;">
    <h1 style="color:#FCEE21;margin:0;font-size:22px;">Nueva Valoración Recibida</h1>
  </div>
  <div style="padding:24px;">
    <h2 style="color:#16122B;border-bottom:2px solid #662D91;padding-bottom:8px;font-size:18px;">Datos personales</h2>
    <table style="width:100%;border-collapse:collapse;">
      ${row('Nombre', name)}
      ${row('Email', `<a href="mailto:${email}">${email}</a>`)}
      ${row('Teléfono', `<a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}">${phone}</a>`)}
      ${row('Edad', age)}
    </table>

    <h2 style="color:#16122B;border-bottom:2px solid #662D91;padding-bottom:8px;font-size:18px;margin-top:24px;">Objetivo</h2>
    <table style="width:100%;border-collapse:collapse;">
      ${row('Objetivo principal', objectiveLabels[objective] || objective)}
      ${row('Detalle', objectiveDetail)}
    </table>

    <h2 style="color:#16122B;border-bottom:2px solid #662D91;padding-bottom:8px;font-size:18px;margin-top:24px;">Experiencia</h2>
    <table style="width:100%;border-collapse:collapse;">
      ${row('Nivel', levelLabels[level] || level)}
      ${row('Entrena actualmente', currentlyTraining)}
      ${row('Qué hace', trainingDetail)}
    </table>

    <h2 style="color:#16122B;border-bottom:2px solid #662D91;padding-bottom:8px;font-size:18px;margin-top:24px;">Disponibilidad</h2>
    <table style="width:100%;border-collapse:collapse;">
      ${row('Días/semana', daysPerWeek)}
      ${row('Duración sesión', sessionDuration)}
      ${row('Horario', schedule)}
      ${row('Modalidad', modality)}
    </table>

    <h2 style="color:#16122B;border-bottom:2px solid #662D91;padding-bottom:8px;font-size:18px;margin-top:24px;">Salud</h2>
    <table style="width:100%;border-collapse:collapse;">
      ${row('Lesiones', injuries || 'Ninguna indicada')}
      ${row('Condiciones médicas', medicalConditions || 'Ninguna indicada')}
      ${row('Alimentación', diet || 'No indicada')}
    </table>

    <h2 style="color:#16122B;border-bottom:2px solid #662D91;padding-bottom:8px;font-size:18px;margin-top:24px;">Otros</h2>
    <table style="width:100%;border-collapse:collapse;">
      ${row('Expectativas', expectations)}
      ${row('Nos conoció por', source)}
    </table>

    <div style="margin-top:24px;padding:16px;background:#f0f0f0;border-radius:8px;text-align:center;">
      <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" style="display:inline-block;padding:12px 24px;background:#25D366;color:white;text-decoration:none;border-radius:8px;font-weight:bold;">
        Responder por WhatsApp
      </a>
      <a href="mailto:${email}" style="display:inline-block;padding:12px 24px;background:#662D91;color:white;text-decoration:none;border-radius:8px;font-weight:bold;margin-left:8px;">
        Responder por Email
      </a>
    </div>
  </div>
  <div style="background:#16122B;padding:16px;text-align:center;">
    <p style="color:#888;margin:0;font-size:12px;">Valoración enviada desde wellnessreal.es</p>
  </div>
</div>
</body></html>`

    // Confirmation email to user
    const userHtml = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;">
<div style="max-width:600px;margin:0 auto;background:#16122B;">
  <div style="padding:40px 30px;text-align:center;">
    <h1 style="color:#FCEE21;font-size:24px;margin:0 0 8px;">WellnessReal</h1>
    <div style="height:2px;background:linear-gradient(90deg,#662D91,#FCEE21,#662D91);margin:16px 0;"></div>
    <h2 style="color:#fff;font-size:22px;margin:16px 0 8px;">¡Valoración recibida, ${name}!</h2>
    <p style="color:#ccc;font-size:16px;line-height:1.6;margin:0 0 24px;">
      He recibido tu información y voy a analizarla con detalle.
      En menos de 24 horas te contacto con mi análisis y una propuesta personalizada.
    </p>
    <div style="background:rgba(252,238,33,0.1);padding:20px;border-radius:12px;border-left:4px solid #FCEE21;text-align:left;margin:0 0 24px;">
      <p style="color:#FCEE21;font-weight:bold;margin:0 0 8px;">Tu objetivo: ${objectiveLabels[objective] || objective}</p>
      <p style="color:#ccc;margin:0;">Nivel: ${levelLabels[level] || level} · ${daysPerWeek} · ${sessionDuration}</p>
    </div>
    <p style="color:#999;font-size:14px;margin:0;">
      Si tienes cualquier duda, escríbeme directamente por WhatsApp.
    </p>
  </div>
  <div style="padding:16px;text-align:center;border-top:1px solid rgba(102,45,145,0.3);">
    <p style="color:#666;font-size:12px;margin:0;">WellnessReal · wellnessreal.es</p>
  </div>
</div>
</body></html>`

    // Send emails via Resend
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      const { Resend } = await import('resend')
      const resend = new Resend(resendKey)

      // Email to business
      await resend.emails.send({
        from: 'WellnessReal <noreply@wellnessreal.es>',
        to: ['info@wellnessreal.es', 'wellnessrealoficial@gmail.com'],
        replyTo: email,
        subject: `[Valoración] ${name} — ${objectiveLabels[objective] || objective}`,
        html: businessHtml,
      })

      // Confirmation to user
      await resend.emails.send({
        from: 'WellnessReal <noreply@wellnessreal.es>',
        to: email,
        subject: 'Tu valoración en WellnessReal — La hemos recibido',
        html: userHtml,
      })
    } else {
      console.log('⚠️ RESEND_API_KEY no configurada. Valoración recibida:', name, email)
    }

    // Subscribe to MailerLite
    const mlKey = process.env.MAILERLITE_API_KEY
    if (mlKey) {
      try {
        await fetch('https://connect.mailerlite.com/api/subscribers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${mlKey}`,
          },
          body: JSON.stringify({
            email,
            fields: { name, phone, city: modality || '' },
            groups: process.env.MAILERLITE_GROUP_ID ? [process.env.MAILERLITE_GROUP_ID] : [],
          }),
        })
      } catch (e) {
        console.error('Error subscribing to MailerLite:', e)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error en API de valoración:', error)
    return NextResponse.json({ error: 'Error al procesar la valoración' }, { status: 500 })
  }
}
