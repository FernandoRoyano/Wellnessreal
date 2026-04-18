import type { Metadata } from 'next'
import Image from 'next/image'
import MetodoOptInForm from './MetodoOptInForm'

export const metadata: Metadata = {
  title: 'El método — WellnessReal',
  description:
    'El problema del entrenamiento online no es el plan. Es que nadie te sigue. Te explico cómo lo hago yo en 15 minutos.',
  robots: { index: false, follow: false },
}

export default function MetodoOptInPage() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#16122B] py-12 md:py-20 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-pattern opacity-60 z-0" />
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(circle at 30% 20%, rgba(102,45,145,0.25) 0%, transparent 60%), radial-gradient(circle at 70% 80%, rgba(252,238,33,0.08) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Image
            src="/images/logos/WR_AUX_normal_bg.png"
            alt="WellnessReal"
            width={360}
            height={44}
            priority
            className="object-contain w-[280px] sm:w-[360px] h-auto"
          />
        </div>

        {/* Hero */}
        <div className="mb-10">
          <p
            className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
            style={{
              backgroundColor: 'rgba(252,238,33,0.1)',
              border: '1px solid rgba(252,238,33,0.3)',
              color: '#FCEE21',
            }}
          >
            Vídeo de 15 minutos · Acceso inmediato
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 leading-tight gradient-text">
            El problema del entrenamiento online no es el plan.<br />
            Es que nadie te sigue.
          </h1>

          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-4">
            Llevo <span style={{ color: '#FCEE21' }} className="font-bold">14 años</span> entrenando personas reales — con trabajo, familia y poco tiempo.
            En este vídeo te explico qué hago diferente y por qué mis clientes <em>terminan</em> lo que empiezan.
          </p>

          <p className="text-base text-gray-400">
            Sin humo. Sin jerga. Sin promesas imposibles.
          </p>
        </div>

        {/* Form */}
        <MetodoOptInForm />

        {/* Trust row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
          <span>14 años de experiencia</span>
          <span className="hidden sm:inline">·</span>
          <span>+100 transformaciones reales</span>
          <span className="hidden sm:inline">·</span>
          <span>Ciencias del Deporte</span>
        </div>

        {/* Legal */}
        <p className="mt-8 text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
          Al registrarte aceptas recibir información sobre el método WellnessReal en tu email.
          Puedes darte de baja cuando quieras. Sin spam.
        </p>
      </div>
    </section>
  )
}
