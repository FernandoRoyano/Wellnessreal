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
    { href: '/hipotiroidismo/ejercicio', title: 'Ejercicio con hipotiroidismo', description: 'Cómo combinar fuerza y cardio y adaptar la carga cuando cambia tu energía.' },
    { href: '/hipotiroidismo/perder-peso', title: 'Perder peso con hipotiroidismo', description: 'Qué puede influir, cómo medir el progreso y qué promesas conviene evitar.' },
    { href: '/blog/cansancio-e-hipotiroidismo', title: 'Cansancio e hipotiroidismo', description: 'Qué revisar con tu profesional y cómo ajustar el entrenamiento mientras tanto.' },
    { href: '/blog/suplementos-tiroides', title: 'Suplementos y tiroides', description: 'Yodo, selenio, hierro y vitamina D explicados con evidencia y prudencia.' },
  ],
  faqs: [
    { question: '¿El ejercicio puede curar el hipotiroidismo?', answer: 'No. Puede mejorar capacidad física, fuerza y otros resultados de salud, pero no sustituye el diagnóstico ni el tratamiento médico.' },
    { question: '¿Puedo entrenar si tengo Hashimoto?', answer: 'En general sí, con una dosis adaptada a tu situación y a las indicaciones clínicas que correspondan.' },
    { question: '¿Necesito eliminar el gluten?', answer: 'No de forma general. La indicación cambia si existe celiaquía u otra razón clínica confirmada.' },
  ],
  cta: { title: 'Ordena tus prioridades', description: 'El test gratuito te ayuda a identificar por dónde empezar sin diagnosticar ni modificar tu tratamiento.', href: '/tiroides', label: 'Hacer el test gratuito' },
}

export default function HipotiroidismoPage() { return <TopicHubPage config={config} /> }
