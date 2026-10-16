import TopicHubPage, { type TopicHubConfig } from '@/components/seo/TopicHubPage'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({ title: 'Entrenamiento online: cómo funciona y qué incluye', description: 'Qué es el entrenamiento online personalizado, qué incluye, en qué se diferencia de una app y cómo saber si te conviene.', path: '/entrenamiento-online', keywords: ['entrenamiento online', 'entrenador personal online', 'entrenamiento personalizado online'] })

const config: TopicHubConfig = {
  eyebrow: 'Guía para elegir con criterio', title: 'Entrenamiento online:', highlightedTitle: 'qué deberías recibir',
  introduction: 'Un entrenador online no debería limitarse a enviarte una tabla. El valor está en valorar, programar, observar tu respuesta y ajustar el plan.',
  answer: 'Un buen servicio incluye valoración inicial, programa adaptado, instrucciones claras, registro del entrenamiento, revisiones y ajustes. Una app puede ser la herramienta; la personalización depende de las decisiones que toma el profesional contigo.', path: '/entrenamiento-online',
  sections: [
    { title: 'Valoración', body: 'Objetivos, experiencia, tiempo, material, historial y posibles límites definen el punto de partida.' },
    { title: 'Programación', body: 'El plan concreta ejercicios, series, repeticiones, esfuerzo y una forma de progresar sin improvisar.' },
    { title: 'Seguimiento', body: 'Las revisiones comprueban adherencia, ejecución y respuesta para ajustar lo que no encaja.' },
    { title: 'Entrenas con una guía clara', body: 'Recibes el programa en la app con vídeos, instrucciones y referencias de esfuerzo para saber qué hacer en cada sesión.' },
    { title: 'Registras lo que ocurre', body: 'Cargas, repeticiones, sensaciones y sesiones completadas aportan información más útil que entrenar de memoria.' },
    { title: 'Ajustamos con datos', body: 'Cada semana se revisa tu respuesta. Si cambia tu agenda, recuperación o rendimiento, también puede cambiar el programa.' },
  ],
  guides: [
    { href: '/blog/entrenador-online-vs-app', title: 'Entrenador online vs app', description: 'Qué aporta cada opción y cuándo merece la pena pagar por seguimiento individual.' },
    { href: '/blog/cuanto-cuesta-entrenador-personal-online', title: 'Cuánto cuesta un entrenador online', description: 'Qué determina el precio y qué debería incluir un servicio personalizado.' },
    { href: '/servicios/entrenamiento-online', title: 'Servicio de entrenamiento personalizado', description: 'Qué incluye el acompañamiento individual de WellnessReal y cómo solicitar valoración.' },
    { href: '/blog/por-que-no-estas-viendo-resultados', title: 'Por qué no ves resultados', description: 'Qué revisar antes de cambiar de rutina o añadir más trabajo.' },
    { href: '/blog/rutina-30-minutos-en-casa', title: 'Rutina de 30 minutos en casa', description: 'Una plantilla práctica y adaptable para empezar.' },
    { href: '/blog/sesion-fuerza-completa-ejemplo', title: 'Ejemplo de sesión completa', description: 'Cómo se ordenan preparación, trabajo principal y accesorios.' },
  ],
  faqs: [
    { question: '¿En qué se diferencia de una app de rutinas?', answer: 'La app muestra y registra. La personalización aparece cuando un profesional valora tus datos, decide y modifica el programa según tu respuesta.' },
    { question: '¿Puedo entrenar online desde casa?', answer: 'Sí. El programa puede adaptarse al espacio y material disponibles, aunque disponer de alguna carga facilita la progresión.' },
    { question: '¿Cómo sé si necesito un entrenador?', answer: 'Puede ayudarte si no sabes cómo progresar, el plan no cabe en tu semana, tienes dudas al adaptar ejercicios o necesitas seguimiento para tomar decisiones.' },
    { question: '¿Cómo funciona el seguimiento online?', answer: 'Registras las sesiones en la app y se revisan cargas, repeticiones, esfuerzo, cumplimiento y dudas. Con esa información se mantiene o modifica el programa cada semana.' },
    { question: '¿Cuánto cuesta el servicio de WellnessReal?', answer: 'El acompañamiento individual de 12 semanas cuesta actualmente 750 € en un pago o tres pagos de 270 €. La valoración previa no obliga a contratar.' },
    { question: '¿Qué ocurre si una semana no puedo cumplir el plan?', answer: 'El seguimiento sirve también para adaptar. Se puede reducir volumen, cambiar días o utilizar una versión más corta sin convertir una semana difícil en abandono.' },
  ],
  cta: { title: 'Comprueba si este formato encaja contigo', description: 'La valoración inicial sirve para conocer tu situación y confirmar si puedo ayudarte antes de empezar.', href: '/valoracion', label: 'Solicitar valoración individual' },
}

export default function EntrenamientoOnlineHubPage() { return <TopicHubPage config={config} /> }
