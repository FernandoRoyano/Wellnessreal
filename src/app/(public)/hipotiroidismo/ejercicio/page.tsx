import TopicHubPage, { type TopicHubConfig } from '@/components/seo/TopicHubPage'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({ title: 'Ejercicio con hipotiroidismo: fuerza y cardio', description: 'Cómo entrenar con hipotiroidismo: fuerza, cardio, frecuencia, fatiga y señales para adaptar o consultar.', path: '/hipotiroidismo/ejercicio', keywords: ['ejercicio hipotiroidismo', 'entrenamiento hipotiroidismo', 'fuerza hipotiroidismo'] })

const config: TopicHubConfig = {
  eyebrow: 'Hipotiroidismo y entrenamiento', title: 'Ejercicio con hipotiroidismo:', highlightedTitle: 'una dosis que puedas recuperar',
  introduction: 'No existe un ejercicio obligatorio para la tiroides. El mejor plan combina fuerza, actividad aeróbica y movimiento cotidiano de forma progresiva.',
  answer: 'Empieza con dos sesiones de fuerza semanales, actividad aeróbica tolerable y una progresión gradual. Ajusta series o intensidad si la fatiga se acumula y consulta ante debilidad progresiva, dolor preocupante o síntomas nuevos.', path: '/hipotiroidismo/ejercicio',
  sections: [
    { title: 'Prioriza la fuerza', body: 'Trabaja los patrones principales con ejercicios estables, esfuerzo suficiente y una progresión que puedas registrar.' },
    { title: 'Añade cardio', body: 'Caminar, bicicleta u otra modalidad tolerable mejora capacidad. No necesitas usarlo como castigo por comer.' },
    { title: 'Regula la dosis', body: 'Un día de menos energía puede requerir menos series, no necesariamente abandonar toda la semana.' },
  ],
  guides: [
    { href: '/blog/mejor-ejercicio-hipotiroidismo', title: '¿Cuál es el mejor ejercicio?', description: 'Beneficios, dosis y criterios para elegir fuerza y cardio.' },
    { href: '/blog/agujetas-cansancio-debilidad-tiroides', title: 'Agujetas, cansancio o debilidad', description: 'Cómo distinguir patrones y cuándo conviene consultar.' },
    { href: '/blog/rutina-30-minutos-en-casa', title: 'Rutina de 30 minutos', description: 'Una plantilla adaptable para entrenar fuerza en casa.' },
    { href: '/blog/rir-rpe-autoregular-entrenamiento', title: 'Regular el esfuerzo con RIR y RPE', description: 'Dos herramientas para ajustar sin improvisar.' },
  ],
  faqs: [
    { question: '¿Cuántos días debo entrenar?', answer: 'Dos sesiones semanales de fuerza pueden ser un buen inicio. La frecuencia adecuada depende de tu experiencia y recuperación.' },
    { question: '¿El cardio es malo para el hipotiroidismo?', answer: 'No. Se puede combinar con fuerza si la dosis total es tolerable y progresa de forma razonable.' },
    { question: '¿Debo entrenar aunque esté cansada?', answer: 'Depende de la intensidad y duración del cansancio. Puedes adaptar un día puntual; si persiste o progresa, conviene valorarlo.' },
  ],
  cta: { title: 'Necesitas un plan, no una lista de ejercicios', description: 'Descubre qué priorizar según tu situación con el test gratuito de WellnessReal.', href: '/tiroides', label: 'Hacer el test gratuito' },
}

export default function EjercicioHipotiroidismoPage() { return <TopicHubPage config={config} /> }
