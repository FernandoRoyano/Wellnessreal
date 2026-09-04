import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { captureLead } from '@/lib/leadCapture'
import { sendEmail } from '@/lib/email'
import {
  buildTestResult,
  validateAndSanitizeAnswers,
  type TestAnswers,
  type TestResult,
} from '@/lib/test-tiroides'
import { attachAnonymousEventsToLead, recordThyroidFunnelEvent } from '@/lib/db/thyroid-funnel'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://wellnessreal.es'

const SubmissionSchema = z.object({
  name: z.string().trim().max(80).optional().default(''),
  email: z.email(),
  answers: z.record(z.string(), z.string()),
  _attribution: z.record(z.string(), z.string()).optional(),
  _funnel: z.object({
    anonymousId: z.string().min(8).max(100),
    sessionId: z.string().min(8).max(100),
  }).nullable().optional(),
})

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character] || character)
}

function resultEmailHTML(name: string, result: TestResult): string {
  const displayName = escapeHtml(name || 'crack')
  const priorities = result.priorities
    .map((priority) => `<li style="color:#d1d5db;font-size:15px;line-height:1.6;margin-bottom:8px;">${escapeHtml(priority)}</li>`)
    .join('')
  const ctaUrl = `${BASE_URL}${result.cta.href}`

  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#16122B;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#16122B;padding:40px 20px;"><tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td style="text-align:center;padding-bottom:26px;"><h1 style="color:#FCEE21;font-size:26px;margin:0;letter-spacing:2px;">WELLNESS<span style="color:#ffffff;">REAL</span></h1></td></tr>
      <tr><td style="background-color:#1a1535;border-radius:16px;padding:36px 30px;border:1px solid rgba(102,45,145,0.3);">
        <p style="color:#9ca3af;font-size:13px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Tu resultado personalizado</p>
        <h2 style="color:#ffffff;font-size:24px;margin:0 0 16px;">${result.emoji} ${escapeHtml(result.title)}</h2>
        <p style="color:#d1d5db;font-size:15px;line-height:1.7;margin:0 0 20px;">Hola ${displayName}, ${escapeHtml(result.summary)}</p>
        <div style="background-color:#16122B;border-radius:12px;padding:18px 20px;border:1px solid rgba(252,238,33,0.25);margin:0 0 20px;">
          <p style="color:#FCEE21;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Tus prioridades</p>
          <ul style="padding-left:20px;margin:0;">${priorities}</ul>
        </div>
        <p style="color:#d1d5db;font-size:15px;line-height:1.7;margin:0 0 24px;"><strong style="color:#ffffff;">Tu siguiente paso:</strong> ${escapeHtml(result.nextStep)}</p>
        <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
          <a href="${ctaUrl}" target="_blank" style="display:inline-block;background-color:#FCEE21;color:#16122B;font-size:16px;font-weight:bold;text-decoration:none;padding:15px 34px;border-radius:10px;">${escapeHtml(result.cta.label)}</a>
        </td></tr></table>
        <p style="color:#9ca3af;font-size:13px;text-align:center;margin:18px 0 0;">Tu guía completa: <a href="${BASE_URL}/tiroides.pdf" style="color:#FCEE21;">descárgala aquí</a>.</p>
      </td></tr>
      <tr><td style="text-align:center;padding-top:22px;"><p style="color:#6b7280;font-size:12px;line-height:1.6;margin:0;">Este test es orientativo: no diagnostica ni interpreta síntomas, medicación o analíticas. El seguimiento médico corresponde a tu equipo sanitario.</p></td></tr>
    </table>
  </td></tr></table>
</body></html>`
}

export async function POST(request: NextRequest) {
  try {
    const parsed = SubmissionSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Revisa el email y completa el test' }, { status: 400 })
    }

    const { name, email, _attribution, _funnel } = parsed.data
    const answers = validateAndSanitizeAnswers(parsed.data.answers as TestAnswers)
    if (!answers) {
      return NextResponse.json({ error: 'El recorrido del test está incompleto' }, { status: 400 })
    }

    const result = buildTestResult(answers)
    const lead = await captureLead({
      request,
      email,
      name: name || null,
      source: 'tiroides',
      attribution: _attribution,
      tags: [
        'form:test-tiroides',
        `perfil:${result.profile}`,
        `intencion:${result.intent}`,
        `revision-medica:${result.requiresMedicalReview ? 'recomendada' : 'actualizada'}`,
      ],
      form_data: {
        ...answers,
        profile: result.profile,
        intent: result.intent,
        requires_medical_review: result.requiresMedicalReview,
      },
    })

    if (lead) {
      if (_funnel?.anonymousId) {
        await attachAnonymousEventsToLead(_funnel.anonymousId, lead.id)
      }
      await recordThyroidFunnelEvent({
        eventName: 'thyroid_lead_capture',
        leadId: lead.id,
        anonymousId: _funnel?.anonymousId,
        sessionId: _funnel?.sessionId,
        profile: result.profile,
        intent: result.intent,
        source: _attribution?.utm_source ?? 'direct',
        medium: _attribution?.utm_medium,
        campaign: _attribution?.utm_campaign,
      })
    }

    const resultForLead: TestResult = lead && result.cta.href.startsWith('/valoracion')
      ? { ...result, cta: { ...result.cta, href: `${result.cta.href}&lead_id=${lead.id}` } }
      : result

    try {
      await sendEmail({
        to: email,
        subject: `Tus prioridades: ${resultForLead.title}`,
        html: resultEmailHTML(name, resultForLead),
      })
    } catch (mailError) {
      console.error('[TestTiroides:sendResultEmail] No se pudo enviar el resultado:', mailError)
    }

    const mailerLiteApiKey = process.env.MAILERLITE_API_KEY
    const groupId = process.env.MAILERLITE_TIROIDES_GROUP_ID || process.env.MAILERLITE_GROUP_ID
    if (mailerLiteApiKey) {
      try {
        await fetch('https://connect.mailerlite.com/api/subscribers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${mailerLiteApiKey}` },
          body: JSON.stringify({
            email,
            fields: { name, nivel_tiroides: result.profile },
            groups: groupId ? [groupId] : [],
            status: 'active',
          }),
        })
      } catch (mailerLiteError) {
        console.error('[TestTiroides:syncMailerLite] No se pudo sincronizar el lead:', mailerLiteError)
      }
    }

    return NextResponse.json({ success: true, result: resultForLead, leadId: lead?.id ?? null })
  } catch (error) {
    console.error('[TestTiroides:POST] Error al procesar el test:', error)
    return NextResponse.json({ error: 'Error al procesar el test' }, { status: 500 })
  }
}
