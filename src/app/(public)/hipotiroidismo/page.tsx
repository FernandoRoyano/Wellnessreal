import Link from 'next/link'
import Container from '@/components/common/Container'
import TopicHubPage, { type TopicHubConfig } from '@/components/seo/TopicHubPage'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Hipotiroidismo: ejercicio, peso y hábitos | Guía',
  description: 'Guía sobre hipotiroidismo, entrenamiento, pérdida de peso, cansancio y alimentación basada en evidencia y sin soluciones milagro.',
  path: '/hipotiroidismo',
  keywords: ['hipotiroidismo', 'hipotiroidismo ejercicio', 'hipotiroidismo perder peso'],
})

const config: TopicHubConfig = {
  eyebrow: 'Centro temático sobre hipotiroidismo',
  title: 'Hipotiroidismo:',
  highlightedTitle: 'qué puedes hacer de verdad',
  introduction: 'Información práctica para entender cómo encajan el ejercicio, el peso, la alimentación y la recuperación cuando tienes hipotiroidismo o Hashimoto.',
  answer: 'El tratamiento médico y un estilo de vida activo cumplen funciones diferentes. El ejercicio no cura el hipotiroidismo, pero una fuerza bien dosificada, el movimiento diario, una alimentación suficiente y el descanso pueden ayudarte a mejorar capacidad y composición corporal.',
  path: '/hipotiroidismo',
  sections: [
    { title: 'Parte médica', body: 'Diagnóstico, analíticas y medicación corresponden a tu equipo sanitario. No ajustes levotiroxina por síntomas o por el peso.' },
    { title: 'Entrenamiento', body: 'Fuerza y cardio pueden convivir. La dosis se adapta a tu nivel, energía y recuperación, no a una etiqueta universal.' },
    { title: 'Hábitos', body: 'Comida, sueño y actividad diaria aportan estructura. No necesitas detox, prohibiciones generales ni suplementos milagro.' },
  ],
  guides: [
    { href: '/hashimoto/entrenamiento', title: 'Entrenamiento con Hashimoto', description: 'Contexto clínico, fuerza y un ejemplo de cómo ajustar las sesiones según tu recuperación.' },
    { href: '/hipotiroidismo/ejercicio', title: 'Ejercicio con hipotiroidismo', description: 'Cómo combinar fuerza y cardio y adaptar la carga cuando cambia tu energía.' },
    { href: '/hipotiroidismo/perder-peso', title: 'Perder peso con hipotiroidismo', description: 'Qué puede influir, cómo medir el progreso y qué promesas conviene evitar.' },
    { href: '/blog/cansancio-e-hipotiroidismo', title: 'Cansancio e hipotiroidismo', description: 'Qué revisar con tu profesional y cómo ajustar el entrenamiento mientras tanto.' },
    { href: '/blog/suplementos-tiroides', title: 'Suplementos y tiroides', description: 'Yodo, selenio, hierro y vitamina D explicados con evidencia y prudencia.' },
    { href: '/blog/gluten-e-hipotiroidismo', title: 'Gluten e hipotiroidismo', description: 'Cuándo hay una indicación para retirarlo y por qué no hacerlo de forma general.' },
    { href: '/blog/menopausia-y-tiroides', title: 'Menopausia e hipotiroidismo', description: 'Cómo entender este contexto y organizar entrenamiento, descanso y seguimiento sanitario.' },
  ],
  faqs: [
    { question: '¿El ejercicio puede curar el hipotiroidismo?', answer: 'No. Puede mejorar capacidad física, fuerza y otros resultados de salud, pero no sustituye el diagnóstico ni el tratamiento médico.' },
    { question: '¿Puedo entrenar si tengo Hashimoto?', answer: 'En general sí, con una dosis adaptada a tu situación y a las indicaciones clínicas que correspondan.' },
    { question: '¿Necesito eliminar el gluten?', answer: 'No de forma general. La indicación cambia si existe celiaquía u otra razón clínica confirmada.' },
  ],
  cta: { title: 'Ordena tus prioridades', description: 'El test gratuito te ayuda a identificar por dónde empezar sin diagnosticar ni modificar tu tratamiento.', href: '/tiroides', label: 'Hacer el test gratuito' },
}

export default function HipotiroidismoPage() {
  return (
    <>
      <TopicHubPage config={config} />
      <section className="bg-brand-dusk py-fluid-xl" aria-labelledby="comunidad-privada">
        <Container>
          <div className="mx-auto max-w-3xl">
            <span className="eyebrow">Comunidad gratuita · acceso con email</span>
            <h2 id="comunidad-privada" className="headline mt-4 text-fluid-3xl text-white">Aprende paso a paso dentro de la comunidad</h2>
            <p className="mt-4 text-fluid-base leading-relaxed text-muted">Encontrarás lecciones escritas sobre tiroides, entrenamiento y hábitos, además de un foro para plantear preguntas generales. Puedes avanzar a medida que se desbloquea el contenido.</p>
            <p className="mt-3 text-fluid-base leading-relaxed text-muted">La entrada es gratuita y se confirma con tu email. Las lecciones y conversaciones están reservadas a los miembros; el programa Método BASE tiene su propio acceso de pago.</p>
            <Link href="/comunidad/entrar" className="btn-brand mt-6">Entrar en la comunidad gratuita</Link>
          </div>
        </Container>
      </section>
    </>
  )
}
