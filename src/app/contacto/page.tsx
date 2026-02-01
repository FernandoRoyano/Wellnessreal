'use client'

import Container from '@/components/common/Container'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const contactSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Teléfono inválido'),
  subject: z.string().min(5, 'Asunto requerido'),
  message: z.string().min(10, 'Mensaje muy corto'),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactoPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      setError('')
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Error al enviar')
      }

      router.push('/gracias')
    } catch {
      setError('Hubo un problema al enviar tu mensaje. Inténtalo de nuevo o escríbenos directamente a info@wellnessreal.es')
    }
  }

  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: '#16122B' }} className="py-20 md:py-32">
        <Container>
          <div className="max-w-4xl">
            <h1 style={{ color: '#FCEE21' }} className="text-5xl md:text-7xl font-bold mb-6 tracking-widest">
              CONTACTO
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Hablemos de tu transformación.
              <span style={{ color: '#FCEE21' }} className="font-bold"> Respondemos en menos de 24 horas.</span>
            </p>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-20 md:py-28">
        <Container>
          <div className="grid md:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="md:col-span-1">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(252, 238, 33, 0.1)' }}>
                    <MapPin size={24} style={{ color: '#FCEE21' }} />
                  </div>
                  <div>
                    <h3 style={{ color: '#FCEE21' }} className="font-bold mb-2 text-lg tracking-wide">Ubicación</h3>
                    <p className="text-gray-400 text-base">
                      Online (toda España)
                      <br />
                      Presencial: Madrid
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(252, 238, 33, 0.1)' }}>
                    <Mail size={24} style={{ color: '#FCEE21' }} />
                  </div>
                  <div>
                    <h3 style={{ color: '#FCEE21' }} className="font-bold mb-2 text-lg tracking-wide">Email</h3>
                    <p className="text-gray-400">
                      <a href="mailto:info@wellnessreal.es" className="hover:text-white transition text-base">
                        info@wellnessreal.es
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(252, 238, 33, 0.1)' }}>
                    <Phone size={24} style={{ color: '#FCEE21' }} />
                  </div>
                  <div>
                    <h3 style={{ color: '#FCEE21' }} className="font-bold mb-2 text-lg tracking-wide">Teléfono</h3>
                    <p className="text-gray-400">
                      <a href="tel:+34XXX" className="hover:text-white transition text-base">
                        +34 633 261 963
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(252, 238, 33, 0.1)' }}>
                    <Clock size={24} style={{ color: '#FCEE21' }} />
                  </div>
                  <div>
                    <h3 style={{ color: '#FCEE21' }} className="font-bold mb-2 text-lg tracking-wide">Horario</h3>
                    <p className="text-gray-400 text-base">
                      Lunes - Viernes
                      <br />
                      08:00 - 20:00
                      <br />
                      Sábados 10:00 - 14:00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-lg flex items-start gap-3" style={{ backgroundColor: 'rgba(255, 107, 107, 0.1)', borderLeft: '4px solid #ff6b6b' }}>
                    <MessageCircle size={20} style={{ color: '#ff6b6b' }} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <p style={{ color: '#ff6b6b' }} className="font-bold">Error al enviar</p>
                      <p style={{ color: '#ff6b6b' }} className="text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {/* Nombre */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide">
                    Nombre completo *
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    placeholder="Tu nombre"
                    style={{ backgroundColor: '#16122B', borderColor: errors.name ? '#ff6b6b' : '#662D91' }}
                    className="w-full px-4 py-3 rounded-lg text-white border focus:border-yellow-400 focus:outline-none transition"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                {/* Email y Teléfono */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide">
                      Email *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="tu@email.com"
                      style={{ backgroundColor: '#16122B', borderColor: errors.email ? '#ff6b6b' : '#662D91' }}
                      className="w-full px-4 py-3 rounded-lg text-white border focus:border-yellow-400 focus:outline-none transition"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide">
                      Teléfono *
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      placeholder="+34 XXX XXX XXX"
                      style={{ backgroundColor: '#16122B', borderColor: errors.phone ? '#ff6b6b' : '#662D91' }}
                      className="w-full px-4 py-3 rounded-lg text-white border focus:border-yellow-400 focus:outline-none transition"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                  </div>
                </div>

                {/* Asunto */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide">
                    Asunto *
                  </label>
                  <input
                    {...register('subject')}
                    type="text"
                    placeholder="¿En qué podemos ayudarte?"
                    style={{ backgroundColor: '#16122B', borderColor: errors.subject ? '#ff6b6b' : '#662D91' }}
                    className="w-full px-4 py-3 rounded-lg text-white border focus:border-yellow-400 focus:outline-none transition"
                  />
                  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
                </div>

                {/* Mensaje */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide">
                    Mensaje *
                  </label>
                  <textarea
                    {...register('message')}
                    rows={6}
                    placeholder="Cuéntanos cómo podemos ayudarte..."
                    style={{ backgroundColor: '#16122B', borderColor: errors.message ? '#ff6b6b' : '#662D91' }}
                    className="w-full px-4 py-3 rounded-lg text-white border focus:border-yellow-400 focus:outline-none transition resize-none"
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                </div>

                {/* Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    {isSubmitting ? 'Enviando...' : '🚀 Enviar mensaje'}
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Respetamos tu privacidad. Tus datos serán tratados de forma segura.
                </p>
              </form>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section style={{ backgroundColor: '#16122B' }} className="py-20 md:py-28">
        <Container>
          <h2 style={{ color: '#FCEE21' }} className="text-4xl md:text-5xl font-bold mb-12 text-center tracking-wide">
            Preguntas Frecuentes
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                q: '¿Cuándo recibiré respuesta a mi mensaje?',
                a: 'Nos comprometemos a responder todos los mensajes en menos de 24 horas hábiles. Generalmente respondemos en la primera hora de horas de oficina.'
              },
              {
                q: '¿Puedo llamar directamente?',
                a: 'Sí, puedes llamarnos en horario de oficina. Encuentra nuestro teléfono en la sección de contacto. También puedes solicitar una llamada programada.'
              },
              {
                q: '¿Dónde están ubicados?',
                a: 'Trabajamos 100% online y a domicilio en Madrid y alrededores. Entrenamientos personalizados, osteopatía y consultas directas donde tú estés.'
              },
              {
                q: '¿Hacen consultas online?',
                a: 'Sí, ofrecemos valoración profesional 100% online. Todo nuestro entrenamiento es digital, flexible y personalizado.'
              },
            ].map((faq, index) => (
              <div key={index} className="p-8 rounded-xl" style={{ backgroundColor: '#1a1535', borderLeft: '4px solid #FCEE21' }}>
                <h3 style={{ color: '#FCEE21' }} className="text-xl font-bold mb-3 tracking-wide">
                  {faq.q}
                </h3>
                <p className="text-gray-300 text-base leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Final */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-20">
        <Container className="text-center">
          <h2 style={{ color: '#FCEE21' }} className="text-4xl md:text-5xl font-bold mb-8 tracking-wide">
            ¿Listo para transformarte?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Tu valoración profesional es completamente gratis. Sin compromisos, sin presión. Solo análisis real y propuesta personalizada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contacto">
              <Button variant="primary" size="lg" className="px-8">
                🚀 Solicita tu valoración gratis
              </Button>
            </Link>
            <Link href="/tarifas">
              <Button variant="outline" size="lg" className="px-8">
                Ver tarifas
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
