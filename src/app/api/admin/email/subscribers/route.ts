import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { getSubscribers, createSubscriber } from '@/lib/mailerlite'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor') || undefined
    const limit = Number(searchParams.get('limit')) || 50
    const status = searchParams.get('status') || undefined

    const result = await getSubscribers({
      cursor,
      limit,
      filter: status ? { status } : undefined,
    })

    return NextResponse.json(result)
  } catch (err) {
    console.error('[GET /api/admin/email/subscribers]', err)
    return NextResponse.json({ error: 'Error al obtener suscriptores' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { email, name, groupId } = await request.json()

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    const result = await createSubscriber({
      email: String(email).toLowerCase().trim(),
      name: name ? String(name).trim() : undefined,
      groups: groupId ? [groupId] : undefined,
    })

    return NextResponse.json(result)
  } catch (err) {
    console.error('[POST /api/admin/email/subscribers]', err)
    // Propaga el motivo real de MailerLite (p. ej. límites de plan)
    const message = err instanceof Error ? err.message : 'Error al añadir suscriptor'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
