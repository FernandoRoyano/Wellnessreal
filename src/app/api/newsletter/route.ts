import { NextRequest, NextResponse } from 'next/server'

// API para suscripción a newsletter
// Integración preparada para Mailerlite

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

    // ============================================================
    // INTEGRACIÓN MAILERLITE
    // ============================================================
    // 1. Ve a mailerlite.com → Settings → API
    // 2. Copia tu API key
    // 3. Crea un archivo .env.local con:
    //    MAILERLITE_API_KEY=tu_api_key
    //    MAILERLITE_GROUP_ID=tu_group_id (opcional)
    // 4. Descomenta el código de abajo
    // ============================================================

    /*
    const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY
    const MAILERLITE_GROUP_ID = process.env.MAILERLITE_GROUP_ID

    if (!MAILERLITE_API_KEY) {
      throw new Error('MAILERLITE_API_KEY no configurada')
    }

    // Añadir suscriptor a Mailerlite
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({
        email: email,
        fields: {
          name: name || '',
        },
        groups: MAILERLITE_GROUP_ID ? [MAILERLITE_GROUP_ID] : [],
        status: 'active',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error Mailerlite:', errorData)

      // Si el email ya existe, no es un error para el usuario
      if (response.status === 409) {
        return NextResponse.json({
          success: true,
          message: 'Ya estás suscrito'
        })
      }

      throw new Error('Error al suscribir')
    }

    const data = await response.json()
    console.log('✅ Nuevo suscriptor añadido:', email)
    */

    // TEMPORAL: Log para desarrollo
    console.log('📬 Nueva suscripción newsletter:')
    console.log('- Email:', email)
    console.log('- Nombre:', name || '(no proporcionado)')
    console.log('---')
    console.log('⚠️  Activa la integración con Mailerlite en /api/newsletter/route.ts')

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
