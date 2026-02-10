import Image from 'next/image'
import Container from '@/components/common/Container'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Check, Smartphone, Clock, Target, MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Entrenamiento Online | WellnessReal',
  description: 'Entrenamiento personalizado 100% online. App profesional, seguimiento semanal y plan adaptado a tu vida real. Sin horarios fijos.',
}

export default function EntrenamientoOnlinePage() {
  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: '#16122B' }} className="py-20 md:py-28">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-6"
                style={{ backgroundColor: 'rgba(252, 238, 33, 0.1)', color: '#FCEE21' }}
              >
                SERVICIO PRINCIPAL
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: '#FCEE21' }}>
                Entrenamiento Online
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Tu plan de entrenamiento personalizado en una app profesional.
                Entrena cuando puedas, donde quieras, con seguimiento real cada semana.
                <span style={{ color: '#FCEE21' }} className="font-bold">
                  {' '}Adaptado a tu vida, no al revés.
                </span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contacto">
                  <Button variant="primary" size="lg">
                    Solicitar valoración gratuita
                  </Button>
                </Link>
                <Link href="/tarifas">
                  <Button variant="outline" size="lg">
                    Ver tarifas
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src="/images/wr_app_interface.png"
                alt="App de entrenamiento online"
                width={350}
                height={450}
                className="rounded-xl border-4 border-[#FCEE21] shadow-2xl"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Cómo funciona */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-20">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: '#FCEE21' }}>
            ¿Cómo funciona?
          </h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'Hablamos', desc: 'Me cuentas tu situación, objetivos y disponibilidad. Sin compromiso.' },
              { step: '02', title: 'Diseño tu plan', desc: 'Creo un programa 100% personalizado a tu contexto.' },
              { step: '03', title: 'Entrenas', desc: 'Sigues tu plan desde la app. Vídeos, instrucciones, todo claro.' },
              { step: '04', title: 'Ajustamos', desc: 'Cada semana revisamos y adaptamos según tu evolución.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4"
                  style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
                >
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Qué incluye */}
      <section style={{ backgroundColor: '#16122B' }} className="py-20">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: '#FCEE21' }}>
            ¿Qué incluye?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Smartphone, title: 'App profesional', desc: 'Tu plan en iOS/Android con vídeos explicativos, tracking de progreso y recordatorios.' },
              { icon: Target, title: 'Plan 100% personalizado', desc: 'Diseñado para tu objetivo, tu nivel, tu material disponible y tu tiempo.' },
              { icon: Clock, title: 'Flexibilidad total', desc: 'Sin horarios fijos. Entrenas cuando te venga bien, yo superviso tu progreso.' },
              { icon: MessageCircle, title: 'Soporte directo', desc: 'Dudas, ajustes, motivación. Estoy disponible cuando me necesites.' },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-xl flex items-start gap-4"
                style={{ backgroundColor: '#1a1535', border: '1px solid #662D91' }}
              >
                <item.icon size={32} style={{ color: '#FCEE21' }} className="flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Para quién es */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-20">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8" style={{ color: '#FCEE21' }}>
              Esto es para ti si...
            </h2>
            <div className="space-y-4">
              {[
                'Tienes poco tiempo pero quieres resultados reales',
                'Prefieres entrenar en casa, en el gimnasio o donde sea',
                'Quieres un plan adaptado a TU situación, no algo genérico',
                'Valoras tener a alguien que te guíe y te ajuste el plan',
                'Has probado apps o rutinas de internet sin éxito',
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-lg"
                  style={{ backgroundColor: '#16122B' }}
                >
                  <Check size={24} style={{ color: '#FCEE21' }} className="flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Lead Magnet */}
      <section style={{ backgroundColor: '#16122B' }} className="py-16">
        <Container>
          <div
            className="max-w-3xl mx-auto p-8 md:p-10 rounded-2xl text-center"
            style={{ backgroundColor: '#1a1535', border: '2px solid #FCEE21' }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              ¿Todavía no lo tienes claro?
            </h2>
            <p className="text-lg text-gray-300 mb-6 max-w-xl mx-auto">
              Descarga la guía gratuita:{' '}
              <span style={{ color: '#FCEE21' }} className="font-bold">
                "Fitness real para gente con vida real"
              </span>
            </p>
            <Link href="/recurso-gratis">
              <Button variant="primary" size="lg">
                Descargar guía gratis
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* CTA Final */}
      <section style={{ backgroundColor: '#1a1535' }} className="py-20">
        <Container className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#FCEE21' }}>
            ¿Empezamos?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            La valoración inicial es gratuita. Me cuentas tu situación y vemos si puedo ayudarte. Sin compromiso.
          </p>
          <Link href="/contacto">
            <Button variant="primary" size="lg">
              Solicitar valoración gratuita
            </Button>
          </Link>
        </Container>
      </section>
    </>
  )
}
