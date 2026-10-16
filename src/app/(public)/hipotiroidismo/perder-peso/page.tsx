import TopicHubPage, { type TopicHubConfig } from '@/components/seo/TopicHubPage'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({ title: 'Perder peso con hipotiroidismo: guía realista', description: 'Qué revisar para perder peso con hipotiroidismo sin dietas extremas: tratamiento, alimentación, fuerza, actividad y medición.', path: '/hipotiroidismo/perder-peso', keywords: ['perder peso hipotiroidismo', 'adelgazar con hipotiroidismo', 'no adelgazo hipotiroidismo'] })

const config: TopicHubConfig = {
  eyebrow: 'Composición corporal e hipotiroidismo', title: 'Perder peso con hipotiroidismo:', highlightedTitle: 'sin perseguir atajos',
  introduction: 'El hipotiroidismo puede influir en el peso y la retención de agua, pero no hace inútiles la alimentación, el movimiento o el entrenamiento.',
  answer: 'Con el tratamiento clínico revisado, la pérdida de grasa sigue necesitando un déficit energético sostenible. La fuerza ayuda a conservar capacidad y masa muscular; el movimiento diario, la alimentación y el sueño completan el contexto.', path: '/hipotiroidismo/perder-peso',
  sections: [
    { title: 'Comprueba el contexto', body: 'Si los síntomas o el peso cambian de forma llamativa, revisa el seguimiento clínico sin ajustar medicación por tu cuenta.' },
    { title: 'Crea una estructura', body: 'Organiza comidas suficientes, proteína, vegetales y porciones que puedas mantener sin prohibiciones extremas.' },
    { title: 'Mide tendencias', body: 'Combina promedio de peso, cintura, ropa y rendimiento. Un día aislado no representa pérdida o ganancia de grasa.' },
  ],
  guides: [
    { href: '/blog/adelgazar-con-hipotiroidismo', title: 'Guía completa para adelgazar', description: 'Alimentación, fuerza, actividad y descanso ordenados en un proceso.' },
    { href: '/blog/por-que-no-adelgazo-con-hipotiroidismo', title: 'Por qué no adelgazo', description: 'Siete piezas que pueden explicar un estancamiento real.' },
    { href: '/blog/bascula-te-miente-medir-progreso-real', title: 'Cómo medir el progreso', description: 'Interpreta fluctuaciones y elige indicadores según tu objetivo.' },
    { href: '/blog/dietas-extremas-frenan-tiroides', title: 'Dietas extremas y tiroides', description: 'Riesgos de recortar demasiado y señales que requieren atención.' },
  ],
  faqs: [
    { question: '¿Es imposible adelgazar con hipotiroidismo?', answer: 'No. Puede existir más dificultad o cambios modestos ligados a la enfermedad, pero el proceso debe valorar tratamiento, hábitos y adherencia.' },
    { question: '¿Tengo que comer muy poco?', answer: 'No. Un recorte extremo es difícil de sostener y puede empeorar recuperación, hambre y rendimiento.' },
    { question: '¿Qué hago si la báscula no baja?', answer: 'Observa varias semanas y otros indicadores. Después revisa adherencia, porciones, actividad, entrenamiento y contexto clínico.' },
  ],
  cta: { title: 'Convierte la información en prioridades', description: 'Haz el test gratuito y ordena entrenamiento, alimentación, descanso y seguimiento según tu punto de partida.', href: '/tiroides', label: 'Hacer el test gratuito' },
}

export default function PerderPesoHipotiroidismoPage() { return <TopicHubPage config={config} /> }
