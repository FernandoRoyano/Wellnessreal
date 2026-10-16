import TopicHubPage, { type TopicHubConfig } from '@/components/seo/TopicHubPage'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({ title: 'Entrenamiento de fuerza para mujeres | Guía', description: 'Cómo empezar y progresar en el entrenamiento de fuerza para mujeres: rutina, ciclo, menopausia, suelo pélvico y mitos.', path: '/entrenamiento-fuerza-mujeres', keywords: ['entrenamiento fuerza mujeres', 'rutina fuerza mujeres', 'fuerza menopausia'] })

const config: TopicHubConfig = {
  eyebrow: 'Centro temático de fuerza', title: 'Entrenamiento de fuerza para mujeres:', highlightedTitle: 'sin mitos ni rutinas de adorno',
  introduction: 'La fuerza se entrena con los mismos principios básicos: ejercicios adecuados, esfuerzo suficiente, progresión y recuperación. El contexto individual importa más que los estereotipos.',
  answer: 'Empieza con dos o tres sesiones semanales que trabajen sentadilla, bisagra de cadera, empujes y tracciones. Registra repeticiones y cargas, progresa poco a poco y adapta el plan si el ciclo, la menopausia o el suelo pélvico producen síntomas relevantes.', path: '/entrenamiento-fuerza-mujeres',
  sections: [
    { title: 'Entrena patrones', body: 'Una base de sentadilla, bisagra, empuje y tracción permite construir un programa completo sin necesitar decenas de ejercicios.' },
    { title: 'Progresa con datos', body: 'Anota carga, repeticiones y esfuerzo. La progresión puede ser pequeña y no tiene que aparecer cada semana.' },
    { title: 'Adapta el contexto', body: 'Los síntomas importan, pero no justifican prohibiciones universales por sexo, edad o fase del ciclo.' },
  ],
  guides: [
    { href: '/blog/mujer-entrenar-fuerza-mitos', title: 'Mujer y fuerza: mitos frecuentes', description: 'Qué cambia de verdad y qué ideas conviene dejar atrás.' },
    { href: '/blog/entrenar-con-la-regla-fases-ciclo', title: 'Ciclo menstrual y entrenamiento', description: 'Qué dice la evidencia sobre adaptar por fases.' },
    { href: '/blog/menopausia-y-tiroides', title: 'Menopausia e hipotiroidismo', description: 'Síntomas que pueden solaparse y cómo entrenar con contexto.' },
    { href: '/blog/suelo-pelvico-lo-que-no-te-cuentan', title: 'Suelo pélvico y fuerza', description: 'Síntomas, adaptación y cuándo pedir una valoración especializada.' },
  ],
  faqs: [
    { question: '¿La fuerza hace que una mujer se vuelva muy musculada?', answer: 'El aumento de masa muscular es gradual y depende del entrenamiento, la alimentación, el tiempo y factores individuales. No aparece de forma accidental.' },
    { question: '¿Tengo que cambiar la rutina según el ciclo?', answer: 'No de forma obligatoria. Puedes adaptar el entrenamiento según síntomas y preferencias sin imponer una periodización universal por fases.' },
    { question: '¿Es tarde para empezar después de los 40?', answer: 'No. Se puede empezar a cualquier edad con ejercicios, volumen y progresión adaptados al punto de partida.' },
  ],
  cta: { title: 'Una rutina genérica no conoce tu semana', description: 'Si quieres que el plan se adapte a tu experiencia, tiempo, material y respuesta real, conoce el servicio individual.', href: '/servicios/entrenamiento-online', label: 'Ver entrenamiento personalizado' },
}

export default function EntrenamientoFuerzaMujeresPage() { return <TopicHubPage config={config} /> }
