'use client'

import Container from '@/components/common/Container'
import Link from 'next/link'
import { Mail, Phone, MapPin, Clock, AlertCircle, ArrowRight, Sparkles } from 'lucide-react'
import { trackContact } from '@/lib/analytics'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const contactSchema = z.object({
  name:    z.string().min(2,  'Nombre requerido'),
  email:   z.email({ message: 'Email inválido' }),
  phone:   z.string().min(9,  'Teléfono inválido'),
  subject: z.string().min(5,  'Asunto requerido'),
  message: z.string().min(10, 'Mensaje muy corto'),
})

type ContactFormData = z.infer<typeof contactSchema>

const CONTACT_INFO = [
  { icon: MapPin, title: 'Ubicación', lines: ['Online internacional', 'Presencial en Madrid'] },
  { icon: Mail,   title: 'Email',     lines: ['info@wellnessreal.es'], href: 'mailto:info@wellnessreal.es' },
  { icon: Phone,  title: 'Teléfono',  lines: ['+34 633 261 963'],      href: 'tel:+34633261963' },
  { icon: Clock,  title: 'Horario',   lines: ['Lun-Vie · 08:00 – 20:00', 'Sábados · 10:00 – 14:00'] },
] as const

const FAQ_ITEMS = [
  {
    q: '¿Cuándo recibiré respuesta a mi mensaje?',
    a: 'Respondo todos los mensajes en menos de 24 horas hábiles. Generalmente en la primera hora del horario de oficina.',
  },
  {
    q: '¿Puedo llamar directamente?',
    a: 'Sí, puedes llamar en horario de oficina. El teléfono está en la sección de contacto. También puedes solicitar una llamada programada.',
  },
  {
    q: '¿Dónde están ubicados?',
    a: 'Trabajo online para toda España y ofrezco servicio presencial en Madrid. Entrenamientos personalizados, osteopatía y consultas directas.',
  },
  {
    q: '¿Hacen consultas online?',
    a: 'Sí, la valoración profesional es 100% online. Todo el entrenamiento es digital, flexible y personalizado.',
  },
] as const

const FIELD_CLASS =
  'w-full px-4 py-3 rounded-xl bg-brand-night text-white border ' +
  'placeholder:text-dim ' +
  'focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all'

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
      if (!response.ok) throw new Error('Error al enviar')

      trackContact()
      router.push('/gracias')
    } catch {
      setError('Hubo un problema al enviar tu mensaje. Inténtalo de nuevo o escríbenos directamente a info@wellnessreal.es')
    }
  }

  const borderClass = (hasError: boolean) =>
    hasError ? 'border-danger focus:border-danger' : 'border-border-subtle focus:border-accent'

  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative py-fluid-xl overflow-hidden bg-brand-deep">
        <div className="absolute inset-0 bg-radial-accent opacity-70" />
        <div className="absolute inset-0 bg-grid-soft opacity-40" />
        <Container>
          <div className="relative max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border-subtle bg-accent-muted backdrop-blur-sm animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-fluid-xs font-semibold tracking-wider uppercase text-accent">
                Contacto
              </span>
            </div>

            <h1 className="headline text-fluid-7xl text-white animate-fade-up">
              Hablemos de tu <span className="text-gradient-brand">transformación.</span>
            </h1>

            <p className="text-fluid-xl text-white/85 leading-relaxed max-w-2xl font-medium animate-fade-up [animation-delay:100ms]">
              Cuéntame tu situación y vemos cómo puedo ayudarte.{' '}
              <span className="text-accent font-semibold">Respondo en menos de 24 horas.</span>
            </p>
          </div>
        </Container>
      </section>

      {/* ═══════════════ INFO + FORM ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-dusk">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <Container>
          <div className="grid lg:grid-cols-3 gap-fluid-md">
            {/* Info */}
            <aside className="lg:col-span-1 space-y-5">
              <span className="eyebrow">Cómo encontrarme</span>
              <h2 className="headline text-fluid-2xl text-white">Datos de contacto</h2>
              <ul className="space-y-4 pt-3">
                {CONTACT_INFO.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <li key={i} className="surface-card rounded-2xl p-5 flex items-start gap-4">
                      <span className="shrink-0 w-11 h-11 rounded-xl bg-accent-muted border border-border-strong flex items-center justify-center">
                        <Icon className="w-5 h-5 text-accent" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-fluid-sm font-bold text-white uppercase tracking-wider mb-1">{item.title}</h3>
                        {item.lines.map((line, j) => (
                          <p key={j} className="text-fluid-sm text-muted leading-relaxed">
                            {'href' in item && item.href && j === 0 ? (
                              <a href={item.href} className="hover:text-accent transition-colors">{line}</a>
                            ) : (
                              line
                            )}
                          </p>
                        ))}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </aside>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="surface-card rounded-2xl p-fluid-md">
                <div className="space-y-2 mb-8">
                  <span className="eyebrow">Formulario</span>
                  <h2 className="headline text-fluid-3xl text-white">Escríbeme</h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {error && (
                    <div className="rounded-xl p-4 flex items-start gap-3 bg-danger/10 border-l-4 border-danger">
                      <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                      <div className="text-fluid-sm">
                        <p className="font-bold text-danger">Error al enviar</p>
                        <p className="text-danger/90 mt-1">{error}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="name" className="block text-fluid-xs font-bold text-muted mb-2 uppercase tracking-wider">
                      Nombre completo *
                    </label>
                    <input
                      id="name"
                      {...register('name')}
                      type="text"
                      placeholder="Tu nombre"
                      className={`${FIELD_CLASS} ${borderClass(!!errors.name)}`}
                    />
                    {errors.name && <p className="text-fluid-xs text-danger mt-1.5">⚠ {errors.name.message}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="email" className="block text-fluid-xs font-bold text-muted mb-2 uppercase tracking-wider">
                        Email *
                      </label>
                      <input
                        id="email"
                        {...register('email')}
                        type="email"
                        placeholder="tu@email.com"
                        className={`${FIELD_CLASS} ${borderClass(!!errors.email)}`}
                      />
                      {errors.email && <p className="text-fluid-xs text-danger mt-1.5">⚠ {errors.email.message}</p>}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-fluid-xs font-bold text-muted mb-2 uppercase tracking-wider">
                        Teléfono *
                      </label>
                      <input
                        id="phone"
                        {...register('phone')}
                        type="tel"
                        placeholder="+34 XXX XXX XXX"
                        className={`${FIELD_CLASS} ${borderClass(!!errors.phone)}`}
                      />
                      {errors.phone && <p className="text-fluid-xs text-danger mt-1.5">⚠ {errors.phone.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-fluid-xs font-bold text-muted mb-2 uppercase tracking-wider">
                      Asunto *
                    </label>
                    <input
                      id="subject"
                      {...register('subject')}
                      type="text"
                      placeholder="¿En qué puedo ayudarte?"
                      className={`${FIELD_CLASS} ${borderClass(!!errors.subject)}`}
                    />
                    {errors.subject && <p className="text-fluid-xs text-danger mt-1.5">⚠ {errors.subject.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-fluid-xs font-bold text-muted mb-2 uppercase tracking-wider">
                      Mensaje *
                    </label>
                    <textarea
                      id="message"
                      {...register('message')}
                      rows={6}
                      placeholder="Cuéntame cómo puedo ayudarte…"
                      className={`${FIELD_CLASS} resize-none ${borderClass(!!errors.message)}`}
                    />
                    {errors.message && <p className="text-fluid-xs text-danger mt-1.5">⚠ {errors.message.message}</p>}
                  </div>

                  <button type="submit" disabled={isSubmitting} className="btn-brand w-full text-fluid-base py-4 disabled:opacity-60">
                    {isSubmitting ? 'Enviando…' : (<>Enviar mensaje <ArrowRight className="w-4 h-4" /></>)}
                  </button>

                  <p className="text-fluid-xs text-subtle text-center">
                    Respeto tu privacidad. Tus datos serán tratados de forma segura.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-deep">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-fluid-lg">
            <span className="eyebrow justify-center">Dudas rápidas</span>
            <h2 className="headline text-fluid-4xl text-white">Preguntas frecuentes</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {FAQ_ITEMS.map((faq, i) => (
              <article key={i} className="surface-card rounded-2xl p-7 border-l-4 border-l-accent hover-lift">
                <h3 className="text-fluid-lg font-semibold text-white mb-3 tracking-tight">{faq.q}</h3>
                <p className="text-fluid-sm text-muted leading-relaxed">{faq.a}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════ CTA FINAL ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-dusk overflow-hidden">
        <div className="absolute inset-0 bg-radial-accent opacity-40" />
        <Container>
          <div className="relative max-w-3xl mx-auto text-center space-y-8">
            <span className="eyebrow justify-center">Último paso</span>
            <h2 className="headline text-fluid-5xl text-white">
              ¿Listo para <span className="text-gradient-brand">transformarte?</span>
            </h2>
            <p className="text-fluid-xl text-muted leading-relaxed max-w-2xl mx-auto">
              Tu valoración profesional es completamente gratis. Sin compromisos, sin presión. Solo análisis real y
              propuesta personalizada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link href="/valoracion" className="btn-brand text-fluid-base px-8">
                Solicitar valoración gratis
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/tarifas" className="btn-ghost text-fluid-base px-8">
                Ver tarifas
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
