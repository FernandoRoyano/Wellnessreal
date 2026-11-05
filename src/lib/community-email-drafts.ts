import type { TemplateVars } from '@/lib/emailTemplates'

// Borradores para el editor existente. No programan ni envían campañas.
export const COMMUNITY_EMAIL_DRAFTS: { day: number; subject: string; vars: TemplateVars }[] = [
  {
    day: 2, subject: 'Tu primer paso con la fuerza',
    vars: { title: 'Una primera decisión, sin hacerlo todo', subtitle: 'Lee y elige una acción posible.',
      body: 'Si acabas de llegar a la comunidad, empieza por la lección «Por qué empezar con fuerza». No necesitas resolver toda tu semana hoy. Después de leerla, reserva dos momentos posibles para entrenar y una alternativa breve si cambia el día. Ajusta siempre la actividad a lo que tu situación y tu seguimiento sanitario permitan.',
      ctaText: 'Leer mi primera lección', ctaUrl: 'https://wellnessreal.es/comunidad/entrena-organizate/por-que-empezar-con-fuerza', footerText: 'Fernando Royano · WellnessReal' },
  },
  {
    day: 5, subject: 'Una semana difícil también necesita un plan',
    vars: { title: 'Prepara una alternativa para los días de menos energía', subtitle: 'Una herramienta para decidir con contexto.',
      body: 'Una semana cambia: trabajo, descanso, compromisos. En la biblioteca de la comunidad tienes el semáforo de energía y el planificador semanal. Elige una alternativa que puedas aplicar sin improvisar. Si te surge una duda general, tienes el espacio «Preguntas y apoyo». La valoración de síntomas y las decisiones médicas corresponden a tu equipo sanitario.',
      ctaText: 'Abrir las herramientas', ctaUrl: 'https://wellnessreal.es/comunidad#recursos', footerText: 'Fernando Royano · WellnessReal' },
  },
  {
    day: 8, subject: 'Cómo entiendo el entrenamiento y el seguimiento',
    vars: { title: 'El plan empieza por tu contexto', subtitle: 'Conoce a Fernando y su forma de trabajar.',
      body: 'Antes de escoger ejercicios, necesito entender el tiempo disponible, la experiencia, el material y qué puedes sostener. Después toca observar cómo respondes y ajustar. En mi presentación explico mi formación, experiencia y enfoque. Mi trabajo es el entrenamiento y los hábitos; el diagnóstico y el tratamiento tiroideo corresponden al equipo sanitario.',
      ctaText: 'Conocer cómo trabajo', ctaUrl: 'https://wellnessreal.es/sobre-mi', footerText: 'Fernando Royano · WellnessReal' },
  },
  {
    day: 12, subject: '¿Te ayudaría un plan adaptado con seguimiento?',
    vars: { title: 'Cuando quieres aplicar lo aprendido con acompañamiento', subtitle: 'Conoce Método BASE Tiroides.',
      body: 'La comunidad te ayuda a aprender y practicar por tu cuenta. Método BASE Tiroides añade evaluación inicial, plan de fuerza adaptado, seguimiento semanal y dos revisiones individuales durante 12 semanas. Puedes consultar el alcance, el precio y las condiciones antes de solicitar plaza. Primero reviso si encaja contigo; enviar la solicitud no implica pagar. Puedes hacerlo cuando lo necesites, sin esperar a terminar estos correos.',
      ctaText: 'Ver cómo funciona Método BASE', ctaUrl: 'https://wellnessreal.es/metodo-tiroides?origen=comunidad', footerText: 'Fernando Royano · WellnessReal' },
  },
]
