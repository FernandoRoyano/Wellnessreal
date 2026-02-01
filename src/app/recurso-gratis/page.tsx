'use client'

import Container from '@/components/common/Container'
import Button from '@/components/ui/Button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, X, Clock, Briefcase, Baby, Utensils } from 'lucide-react'

const newsletterSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Nombre requerido'),
})

type NewsletterFormData = z.infer<typeof newsletterSchema>

export default function RecursoGratisPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  })

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      setError('')
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Error al suscribir')
      }

      router.push('/gracias-recurso')
    } catch {
      setError('Hubo un problema. Inténtalo de nuevo.')
    }
  }

  return (
    <>
      {/* Hero con propuesta de valor */}
      <section style={{ backgroundColor: '#16122B' }} className="py-16 md:py-24">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Columna izquierda: Copy */}
            <div>
              <div
                className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-6"
                style={{ backgroundColor: 'rgba(252, 238, 33, 0.1)', color: '#FCEE21' }}
              >
                RECURSO GRATUITO
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                <span className="text-white">Fitness real para</span>
                <br />
                <span style={{ color: '#FCEE21' }}>gente con vida real</span>
              </h1>

              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                Descarga la guía que te enseña a ponerte en forma{' '}
                <span className="font-bold text-white">sin dietas extremas, sin vivir en el gimnasio</span>{' '}
                y sin necesitar una vida perfecta.
              </p>

              <p className="text-lg text-gray-400 mb-8">
                Para personas con trabajo, estrés, hijos y poco tiempo. Sin postureo, sin perfección.{' '}
                <span style={{ color: '#FCEE21' }}>Solo lo que funciona de verdad.</span>
              </p>

              {/* Puntos clave */}
              <ul className="space-y-3 mb-8">
                {[
                  'Por qué el "todo o nada" te sabotea',
                  'Cómo adaptar el fitness a TU contexto',
                  'Las 3 prioridades que realmente importan',
                  'Plan de acción para empezar esta semana',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle size={20} style={{ color: '#FCEE21' }} className="mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Columna derecha: Formulario */}
            <div
              className="p-8 rounded-2xl"
              style={{ backgroundColor: '#1a1535', border: '2px solid #662D91' }}
            >
              <h2 className="text-2xl font-bold text-white mb-2 text-center">
                Descarga la guía gratis
              </h2>
              <p className="text-gray-400 text-center mb-6">
                Déjame tu email y te la envío al momento
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg text-red-400 text-sm" style={{ backgroundColor: 'rgba(255, 107, 107, 0.1)' }}>
                    {error}
                  </div>
                )}

                <div>
                  <input
                    {...register('name')}
                    type="text"
                    placeholder="Tu nombre"
                    style={{ backgroundColor: '#16122B', borderColor: errors.name ? '#ff6b6b' : '#662D91' }}
                    className="w-full px-4 py-4 rounded-lg text-white border focus:border-yellow-400 focus:outline-none transition text-lg"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="tu@email.com"
                    style={{ backgroundColor: '#16122B', borderColor: errors.email ? '#ff6b6b' : '#662D91' }}
                    className="w-full px-4 py-4 rounded-lg text-white border focus:border-yellow-400 focus:outline-none transition text-lg"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="primary"
                  size="lg"
                  className="w-full text-lg py-4"
                >
                  {isSubmitting ? 'Enviando...' : 'QUIERO LA GUÍA GRATIS'}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Sin spam. Solo contenido útil. Puedes darte de baja cuando quieras.
                </p>
              </form>
            </div>
          </div>
        </Container>
      </section>

      {/* Para quién es / Para quién NO es */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-16 md:py-20">
        <Container>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Para quién ES */}
            <div className="p-8 rounded-xl" style={{ backgroundColor: '#16122B', borderLeft: '4px solid #4caf50' }}>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle size={24} style={{ color: '#4caf50' }} />
                <span className="text-white">Esta guía es para ti si...</span>
              </h3>
              <ul className="space-y-4">
                {[
                  'Tienes trabajo, familia y poco tiempo libre',
                  'Has probado dietas y siempre acabas rebotando',
                  'Quieres resultados pero sin obsesionarte',
                  'Buscas algo sostenible, no una solución mágica',
                  'Estás cansado de consejos extremos que no aplican a tu vida',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <span style={{ color: '#4caf50' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Para quién NO es */}
            <div className="p-8 rounded-xl" style={{ backgroundColor: '#16122B', borderLeft: '4px solid #ff6b6b' }}>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <X size={24} style={{ color: '#ff6b6b' }} />
                <span className="text-white">NO es para ti si...</span>
              </h3>
              <ul className="space-y-4">
                {[
                  'Buscas pastillas mágicas o atajos',
                  'Quieres resultados sin hacer nada',
                  'Crees que existe la dieta perfecta',
                  'No estás dispuesto a ser flexible',
                  'Prefieres excusas antes que soluciones',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <span style={{ color: '#ff6b6b' }}>✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* El problema */}
      <section style={{ backgroundColor: '#16122B' }} className="py-16 md:py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              <span className="text-white">El problema del fitness </span>
              <span style={{ color: '#FCEE21' }}>"blanco o negro"</span>
            </h2>

            <p className="text-lg text-gray-300 mb-10 leading-relaxed">
              Unos te dicen que puedes comer basura y adelgazar. Otros que todo tiene que ser perfecto.
              <br /><br />
              <span className="font-bold text-white">La realidad:</span> ninguno de los dos extremos funciona para alguien con una vida real.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Briefcase, text: 'Trabajo estresante con poco tiempo' },
                { icon: Baby, text: 'Hijos y responsabilidades familiares' },
                { icon: Utensils, text: 'Sin tiempo para cocinar elaborado' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl"
                  style={{ backgroundColor: '#1a1535' }}
                >
                  <item.icon size={40} style={{ color: '#FCEE21' }} className="mx-auto mb-4" />
                  <p className="text-gray-300">{item.text}</p>
                </div>
              ))}
            </div>

            <p className="text-xl text-gray-300 mt-10">
              <span style={{ color: '#FCEE21' }} className="font-bold">El contexto es lo más importante.</span>
              <br />
              Y esta guía te enseña a trabajar con el tuyo, no contra él.
            </p>
          </div>
        </Container>
      </section>

      {/* CTA final */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-16">
        <Container>
          <div
            className="max-w-2xl mx-auto p-8 rounded-2xl text-center"
            style={{ backgroundColor: '#16122B', border: '2px solid #FCEE21' }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Empieza hoy. Sin excusas.
            </h2>
            <p className="text-gray-400 mb-6">
              Deja tu email y recibe la guía ahora mismo.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                {...register('email')}
                type="email"
                placeholder="tu@email.com"
                style={{ backgroundColor: '#1a1535', borderColor: '#662D91' }}
                className="flex-1 px-4 py-3 rounded-lg text-white border focus:border-yellow-400 focus:outline-none transition"
              />
              <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
                {isSubmitting ? '...' : 'DESCARGAR'}
              </Button>
            </form>
          </div>
        </Container>
      </section>
    </>
  )
}
