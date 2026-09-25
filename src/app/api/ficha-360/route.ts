import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { sendEmail } from '@/lib/email'
import { FICHA_360_GROUPS, FICHA_360_LABELS, formatFicha360Answer } from '@/lib/ficha-360'

const AnswerSchema = z.union([z.string().max(5000), z.array(z.string().max(200)).max(30), z.record(z.string(), z.string().max(200))])
const SubmissionSchema = z.object({ answers: z.record(z.string().max(80), AnswerSchema) })

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character)
}

function emailSection(title: string, ids: string[], answers: Record<string, z.infer<typeof AnswerSchema>>) {
  const rows = ids.flatMap((id) => {
    const value = answers[id]
    if (!value || (Array.isArray(value) && value.length === 0)) return []
    return [`<tr><td style="padding:8px 12px;color:#662D91;font-weight:bold;vertical-align:top;width:32%">${escapeHtml(FICHA_360_LABELS[id] ?? id)}</td><td style="padding:8px 12px;color:#333;white-space:pre-line">${escapeHtml(formatFicha360Answer(value))}</td></tr>`]
  }).join('')
  return rows ? `<h2 style="color:#16122B;border-bottom:2px solid #662D91;padding-bottom:8px;font-size:18px;margin-top:28px">${title}</h2><table style="width:100%;border-collapse:collapse">${rows}</table>` : ''
}

export async function POST(request: NextRequest) {
  try {
    const parsed = SubmissionSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ error: 'Hay respuestas que no tienen el formato esperado.' }, { status: 400 })
    const { answers } = parsed.data
    const nombre = typeof answers.nombre === 'string' ? answers.nombre.trim() : ''
    const email = typeof answers.email === 'string' ? answers.email.trim().toLowerCase() : ''
    if (nombre.length < 2 || !z.string().email().safeParse(email).success) return NextResponse.json({ error: 'Revisa el nombre y el email.' }, { status: 400 })

    const { error: databaseError } = await supabase.from('cliente_fichas_360').insert({ nombre, email, telefono: typeof answers.telefono === 'string' ? answers.telefono.trim() || null : null, respuestas: answers })
    if (databaseError) throw new Error(`[Ficha360:guardar] ${databaseError.message}`)

    const sections = FICHA_360_GROUPS.map((group) => emailSection(group.title, [...group.ids], answers)).join('')
    await sendEmail({
      to: ['info@wellnessreal.es', 'wellnessrealoficial@gmail.com'], replyTo: email,
      subject: `[Ficha 360] ${nombre}`,
      html: `<div style="background:#f4f4f4;padding:24px;font-family:Arial,sans-serif"><div style="max-width:760px;margin:auto;background:white"><header style="background:#16122B;padding:24px"><h1 style="margin:0;color:#FCEE21;font-size:24px">Ficha 360 · ${escapeHtml(nombre)}</h1><p style="color:#ccc;margin:8px 0 0">${escapeHtml(email)}</p></header><main style="padding:24px">${sections}</main></div></div>`,
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Ficha360:POST]', error)
    return NextResponse.json({ error: 'No se pudo guardar la ficha. Inténtalo de nuevo.' }, { status: 500 })
  }
}
