import Container from '@/components/common/Container'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import JsonLd, { breadcrumbSchema } from '@/components/seo/JsonLd'

export const metadata = buildMetadata({
  title: 'De 92kg a 71kg en 14 meses | Caso Real — WellnessReal',
  description:
    'Cómo un padre de familia de 41 años perdió 21kg sin dietas extremas ni entrenamientos imposibles. Historia real de un cliente de WellnessReal.',
  path: '/caso-real',
  keywords: [
    'transformación física real',
    'perder peso sin dieta',
    'caso real entrenamiento online',
    'antes después entrenamiento',
  ],
})

export default function CasoRealPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Inicio', url: 'https://wellnessreal.es' },
          { name: 'Caso Real', url: 'https://wellnessreal.es/caso-real' },
        ])}
      />

      {/* Hero */}
      <section className="py-24 md:py-32 bg-[#16122B]">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 style={{ color: '#FCEE21' }} className="text-5xl md:text-7xl font-bold mb-6 tracking-wide">
              De 92kg a 71kg en 14 meses
            </h1>
            <p className="text-2xl md:text-3xl text-white font-medium mb-4">
              Sin dietas extremas. Sin entrenar 6 días a la semana. Sin dejar de vivir.
            </p>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
              La historia real de un padre de familia de 41 años que lo había intentado todo.
            </p>
            <Link href="/valoracion">
              <Button variant="primary" size="lg">
                Quiero mi valoración gratuita
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* El punto de partida */}
      <section className="py-20 md:py-28 bg-[#1a1535]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 style={{ color: '#FCEE21' }} className="text-3xl md:text-4xl font-bold mb-10">
              El punto de partida
            </h2>
            <blockquote className="text-2xl md:text-3xl text-white italic leading-relaxed mb-10 pl-6 border-l-4 border-[#FCEE21]">
              &ldquo;Llegué con 92kg, varios intentos fallidos a mis espaldas y sin creerme que esto fuera a funcionar.&rdquo;
            </blockquote>
            <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
              <p>
                41 años. Padre de dos hijos. Trabajo de oficina, 9 horas sentado. Llegaba a casa agotado.
                Había probado gimnasios, dietas de revista, apps de fitness, incluso un nutricionista durante tres meses.
              </p>
              <p>
                Resultado: siempre el mismo. Perdía algo de peso las primeras semanas, se estancaba,
                se frustraba y volvía a los hábitos de siempre. Cada intento fallido sumaba un poco más de desconfianza.
              </p>
              <p>
                Cuando contactó con WellnessReal, sus propias palabras fueron:
                <span style={{ color: '#FCEE21' }} className="font-bold">
                  {' '}&ldquo;No sé si esto va a funcionar, pero ya no sé qué más probar.&rdquo;
                </span>
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Qué hicimos diferente */}
      <section className="py-20 md:py-28 bg-[#16122B]">
        <Container>
          <h2 style={{ color: '#FCEE21' }} className="text-3xl md:text-4xl font-bold mb-14 text-center">
            Qué hicimos diferente
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                num: '01',
                title: 'Entender su vida real',
                text: 'No empezamos con una rutina ni una dieta. Empezamos entendiendo su horario, su estrés, sus compromisos familiares y qué había fallado antes. El plan se construyó alrededor de su vida — no al revés.',
              },
              {
                num: '02',
                title: 'Cambios pequeños y sostenibles',
                text: 'Nada de eliminar grupos de alimentos ni entrenar cinco días desde el primer momento. Empezó con tres sesiones de 40 minutos y ajustes nutricionales mínimos. Cada mes, un paso más.',
              },
              {
                num: '03',
                title: 'Seguimiento real, no automático',
                text: 'Cada semana revisábamos juntos cómo iba. Si un ejercicio no funcionaba, lo cambiábamos. Si una semana fue mala, ajustábamos. El plan nunca fue estático — evolucionó con él.',
              },
            ].map((item) => (
              <div key={item.num} className="p-8 rounded-xl bg-[#1a1535] border border-[#662D91]">
                <span style={{ color: '#FCEE21' }} className="text-5xl font-bold block mb-4">{item.num}</span>
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* La evolución */}
      <section className="py-20 md:py-28 bg-[#1a1535]">
        <Container>
          <h2 style={{ color: '#FCEE21' }} className="text-3xl md:text-4xl font-bold mb-14 text-center">
            La evolución
          </h2>
          <div className="max-w-3xl mx-auto space-y-0">
            {[
              {
                period: 'Mes 1-2',
                title: 'Adaptación',
                text: 'Empezó a entrenar 3 días/semana. Sin cambios drásticos en la dieta, solo ajustes. Perdió 3kg pero lo más importante: empezó a dormir mejor y tener más energía.',
              },
              {
                period: 'Mes 3-6',
                title: 'El cambio se nota',
                text: 'Ya entrenaba con más intensidad. La ropa empezó a quedarle diferente. -8kg acumulados. Su entorno empezó a notar el cambio.',
              },
              {
                period: 'Mes 7-10',
                title: 'Consistencia',
                text: 'El momento donde la mayoría abandona. Él no lo hizo porque el plan se adaptaba a sus semanas malas. -15kg acumulados. Dejó de pensar en "estar a dieta".',
              },
              {
                period: 'Mes 11-14',
                title: 'Resultado final',
                text: '-21kg. Pero no solo eso: valores de colesterol normalizados, energía para jugar con sus hijos, ropa nueva y una relación completamente diferente con la comida y el ejercicio.',
              },
            ].map((milestone, i) => (
              <div key={i} className="flex gap-6 md:gap-10">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-[#FCEE21] flex-shrink-0 mt-2" />
                  {i < 3 && <div className="w-0.5 flex-1 bg-[#662D91]" />}
                </div>
                {/* Content */}
                <div className="pb-12">
                  <span style={{ color: '#FCEE21' }} className="text-sm font-bold tracking-wider">{milestone.period}</span>
                  <h3 className="text-2xl font-bold text-white mt-1 mb-3">{milestone.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{milestone.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* En sus palabras */}
      <section className="py-20 md:py-28 bg-[#16122B]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <blockquote className="text-2xl md:text-3xl text-white italic leading-relaxed pl-8 border-l-4 border-[#FCEE21]">
              &ldquo;Lo que más me sorprendió no fue la báscula — fue darme cuenta de que por primera vez en años no estaba a dieta.
              Estaba viviendo. Comía bien, entrenaba porque me gustaba, y los resultados venían solos.&rdquo;
            </blockquote>
            <p className="text-gray-400 mt-6 pl-8">
              Padre de familia, 41 años — Cliente de WellnessReal
            </p>
          </div>
        </Container>
      </section>

      {/* Los números */}
      <section className="py-20 md:py-28 bg-[#1a1535]">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { num: '-21kg', label: 'Peso perdido' },
              { num: '14 meses', label: 'De proceso' },
              { num: '3 días/sem', label: 'De entrenamiento' },
              { num: '0 dietas', label: 'Restrictivas' },
            ].map((stat, i) => (
              <div key={i}>
                <span style={{ color: '#FCEE21' }} className="text-4xl md:text-5xl font-bold block mb-2">{stat.num}</span>
                <span className="text-gray-400 text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Final */}
      <section className="py-20 md:py-28 bg-[#16122B]">
        <Container className="text-center">
          <div className="max-w-3xl mx-auto">
            <h2 style={{ color: '#FCEE21' }} className="text-3xl md:text-4xl font-bold mb-6">
              ¿Te identificas con esta historia?
            </h2>
            <p className="text-lg text-gray-300 mb-4 leading-relaxed">
              No necesitas ser un caso extremo. Solo necesitas un plan que funcione en tu vida real
              y a alguien que te acompañe en el proceso.
            </p>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed">
              La valoración es gratuita, sin compromiso y sin presión.
              Analizamos tu caso y te digo exactamente qué haríamos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/valoracion">
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
        </Container>
      </section>
    </>
  )
}
