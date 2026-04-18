import type { Metadata } from 'next'
import Image from 'next/image'
import VideoPlayer from './VideoPlayer'
import FinalCTA from './FinalCTA'
import AnimatedSection from '@/components/animations/AnimatedSection'
import StaggerChildren from '@/components/animations/StaggerChildren'

export const metadata: Metadata = {
  title: 'El método — Vídeo · WellnessReal',
  description: 'El método WellnessReal explicado en 15 minutos.',
  robots: { index: false, follow: false },
}

// Si más adelante tienes un vídeo subido (YouTube, Vimeo, MP4), define la URL aquí
// o en una variable de entorno y se cogerá automáticamente.
const VIDEO_URL = process.env.NEXT_PUBLIC_METODO_VIDEO_URL || ''

export default function MetodoVideoPage() {
  return (
    <div className="bg-[#16122B] min-h-screen">
      {/* Header con logo */}
      <header className="border-b" style={{ borderBottomColor: '#662D91' }}>
        <div className="max-w-5xl mx-auto px-4 py-5 flex items-center justify-center">
          <Image
            src="/images/logos/WR_AUX_normal_bg.png"
            alt="WellnessReal"
            width={180}
            height={54}
            className="object-contain"
          />
        </div>
      </header>

      {/* Intro sobre el vídeo */}
      <section className="py-10 md:py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5"
            style={{
              backgroundColor: 'rgba(252,238,33,0.1)',
              border: '1px solid rgba(252,238,33,0.3)',
              color: '#FCEE21',
            }}
          >
            Mira esto antes de decidir nada
          </p>
          <h1 className="text-2xl md:text-4xl font-bold gradient-text mb-4 leading-tight">
            El método WellnessReal, en 15 minutos
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Te explico exactamente cómo trabajo, qué incluye el servicio y por qué no es para todo el mundo.
          </p>
        </div>
      </section>

      {/* Video */}
      <section className="px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <VideoPlayer url={VIDEO_URL} />
        </div>
      </section>

      {/* CTA tras el vídeo */}
      <section className="py-16 md:py-24 px-4" style={{ backgroundColor: '#1a1535' }}>
        <FinalCTA />
      </section>

      {/* Testimonios cortos */}
      <section className="py-16 md:py-20 px-4 bg-[#16122B]">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" style={{ color: '#FCEE21' }}>
              Personas reales, resultados reales
            </h2>
          </AnimatedSection>
          <StaggerChildren className="grid md:grid-cols-2 gap-6">
            {[
              {
                text: '"En 14 meses bajé 21 kilos. Pero lo que más me sorprendió fue darme cuenta de que por primera vez no estaba a dieta. Estaba viviendo."',
                author: 'Hombre, 41 años',
                badge: '-21kg en 14 meses',
              },
              {
                text: '"A los 45 me dijeron que tenía colesterol alto y tensión límite. En 12 meses perdí 19kg y dejé la medicación. Mi médico no se lo creía."',
                author: 'Hombre, 45 años',
                badge: '-19kg · sin medicación',
              },
              {
                text: '"Empecé en 88kg y terminé en 86kg. Casi igual en la báscula — pero la ropa me queda distinta. Tengo músculo donde no había nada."',
                author: 'Mujer, 34 años',
                badge: 'Recomposición corporal',
              },
              {
                text: '"Lo que cambió no fue solo mi cuerpo. Cambié yo. Me sentí cómoda en mi propio cuerpo por primera vez desde que era adolescente."',
                author: 'Mujer, 29 años',
                badge: 'Cambio de autopercepción',
              },
            ].map((t, i) => (
              <div
                key={i}
                className="p-6 md:p-7 rounded-xl"
                style={{ backgroundColor: '#1a1535', border: '1px solid rgba(252,238,33,0.25)' }}
              >
                <p className="text-gray-300 italic leading-relaxed mb-4">{t.text}</p>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-white text-sm font-bold">{t.author}</span>
                  <span
                    className="text-[11px] font-bold px-3 py-1 rounded-full"
                    style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
                  >
                    {t.badge}
                  </span>
                </div>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* FAQ rápida */}
      <section className="py-16 md:py-20 px-4" style={{ backgroundColor: '#1a1535' }}>
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center" style={{ color: '#FCEE21' }}>
              Dudas frecuentes antes de solicitar
            </h2>
          </AnimatedSection>
          <StaggerChildren className="space-y-5" stagger={0.08}>
            {[
              {
                q: '¿Cuánto cuesta?',
                a: 'El Pack 3 meses arranca en 450€ (150€/mes). El Pack 6 meses Transformación — el que más eligen — en 750€ (125€/mes). El Premium con videollamada semanal en 750€/3 meses. En la valoración te digo cuál encaja mejor contigo.',
              },
              {
                q: '¿Puedo cancelar?',
                a: 'Sí, sin permanencia. Pero no acepto planes de menos de 3 meses porque los cambios reales necesitan tiempo. Si no estás dispuesto a comprometerte 3 meses mínimo, no perdamos el tiempo ninguno de los dos.',
              },
              {
                q: '¿Qué necesito para empezar?',
                a: 'Un móvil con la app. Puedes entrenar en casa, en el gimnasio o en un parque. El plan se adapta al espacio y al material que tengas, no al contrario.',
              },
              {
                q: '¿Incluye nutrición?',
                a: 'Pautas nutricionales básicas en todos los planes. Plan nutricional completo y personalizado en el Premium.',
              },
              {
                q: '¿Qué pasa después de enviar la valoración?',
                a: 'La miro personalmente. En menos de 24h te contacto, analizamos tu caso a fondo y te explico qué haríamos. Si no encajas con lo que hago, también te lo digo.',
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="p-5 md:p-6 rounded-xl"
                style={{ backgroundColor: '#16122B', borderLeft: '3px solid #FCEE21' }}
              >
                <h3 className="font-bold text-white mb-2 text-base md:text-lg">{faq.q}</h3>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* CTA final repetido */}
      <section className="py-16 md:py-24 px-4 bg-[#16122B]">
        <FinalCTA />
      </section>

      {/* Footer mínimo */}
      <footer className="py-8 px-4 text-center border-t" style={{ borderTopColor: '#662D91' }}>
        <p className="text-gray-600 text-xs">
          © {new Date().getFullYear()} WellnessReal · Fernando Royano · info@wellnessreal.es
        </p>
      </footer>
    </div>
  )
}
