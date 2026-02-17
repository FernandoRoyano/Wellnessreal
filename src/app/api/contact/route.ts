import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    await sendEmail({
      to: ['info@wellnessreal.es', 'wellnessrealoficial@gmail.com'],
      replyTo: email,
      subject: `[WellnessReal] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #16122B; padding: 20px; text-align: center;">
            <h1 style="color: #FCEE21; margin: 0;">Nuevo mensaje de contacto</h1>
          </div>

          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #16122B; border-bottom: 2px solid #662D91; padding-bottom: 10px;">
              Datos del contacto
            </h2>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #662D91;">Nombre:</td>
                <td style="padding: 10px 0;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #662D91;">Email:</td>
                <td style="padding: 10px 0;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #662D91;">Teléfono:</td>
                <td style="padding: 10px 0;"><a href="tel:${phone}">${phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #662D91;">Asunto:</td>
                <td style="padding: 10px 0;">${subject}</td>
              </tr>
            </table>

            <h3 style="color: #16122B; margin-top: 20px;">Mensaje:</h3>
            <div style="background: white; padding: 15px; border-left: 4px solid #FCEE21; border-radius: 4px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>

          <div style="background: #16122B; padding: 15px; text-align: center;">
            <p style="color: #888; margin: 0; font-size: 12px;">
              Este mensaje fue enviado desde el formulario de contacto de wellnessreal.es
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
      message: 'Mensaje recibido correctamente'
    })

  } catch (error) {
    console.error('Error en API de contacto:', error)
    return NextResponse.json(
      { error: 'Error al enviar el mensaje' },
      { status: 500 }
    )
  }
}
