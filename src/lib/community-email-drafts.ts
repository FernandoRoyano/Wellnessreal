import type { TemplateVars } from '@/lib/emailTemplates'
import { escapeHtml } from '@/lib/utils/escapeHtml'

// Borradores para el editor existente. No programan ni envían campañas.
export const COMMUNITY_EMAIL_DRAFTS: { day: number; subject: string; preheader: string; vars: TemplateVars }[] = [
  {
    day: 2, subject: 'Tu primer paso con la fuerza',
    preheader: 'Una lección y dos huecos posibles para tu semana.',
    vars: { title: 'Una primera decisión, sin hacerlo todo', subtitle: 'Lee y elige una acción posible.',
      body: 'Hola, soy Fernando.\n\nSi acabas de llegar a la comunidad, te propongo empezar por «Por qué empezar con fuerza». Es una lección breve para entender qué buscamos al entrenar y cómo elegir un comienzo que puedas repetir.\n\nDespués de leerla, abre tu calendario y busca dos huecos posibles para esta semana. Anota también una alternativa si cambia el día. No necesitas resolver toda la rutina de golpe.\n\nLas herramientas y las lecciones son orientaciones generales. Ajusta siempre la actividad a lo que tu situación y tu seguimiento sanitario permitan.\n\nUn abrazo,\nFernando',
      ctaText: 'Leer mi primera lección', ctaUrl: 'https://wellnessreal.es/comunidad/entrena-organizate/por-que-empezar-con-fuerza?utm_source=wellnessreal&utm_medium=email&utm_campaign=community_intro&utm_content=day_2', footerText: 'Fernando Royano · WellnessReal' },
  },
  {
    day: 5, subject: 'Una semana difícil también necesita un plan',
    preheader: 'Prepara una alternativa y consulta las herramientas.',
    vars: { title: 'Prepara una alternativa para los días de menos energía', subtitle: 'Una herramienta para decidir con contexto.',
      body: 'Hola.\n\nUna semana puede cambiar por el trabajo, el descanso o los compromisos. Tenerlo previsto forma parte de organizarse.\n\nEn la biblioteca de la comunidad encontrarás el planificador semanal y el semáforo de energía. Puedes usarlos para revisar qué tenías previsto y qué alternativa encaja hoy. El objetivo es tomar una decisión con contexto.\n\nSi te surge una duda general sobre cómo utilizar los recursos, el espacio «Preguntas y apoyo» está para eso. Puedes preguntar sin compartir datos médicos personales. La valoración de síntomas y las decisiones médicas corresponden a tu equipo sanitario.\n\nElige una herramienta y dedica unos minutos a ponerla en práctica.\n\nFernando',
      ctaText: 'Abrir las herramientas', ctaUrl: 'https://wellnessreal.es/comunidad?utm_source=wellnessreal&utm_medium=email&utm_campaign=community_intro&utm_content=day_5#recursos', footerText: 'Fernando Royano · WellnessReal' },
  },
  {
    day: 8, subject: 'Cómo entiendo el entrenamiento y el seguimiento',
    preheader: 'Qué reviso antes de proponer un plan y cómo lo ajusto.',
    vars: { title: 'El plan empieza por tu contexto', subtitle: 'Conoce a Fernando y su forma de trabajar.',
      body: 'Hola.\n\nAntes de escoger ejercicios, necesito entender el tiempo disponible, la experiencia, el material y qué puedes sostener durante una semana normal.\n\nDespués toca observar cómo respondes: qué has podido hacer, cómo recuperas y qué dificultades han aparecido. Esa información permite revisar el plan con un motivo concreto.\n\nMi trabajo se centra en el entrenamiento y los hábitos. El diagnóstico, las analíticas y el tratamiento tiroideo corresponden a tu equipo sanitario. La experiencia con clientes y el estudio propio me ayudan a profundizar en este contexto sin convertir mi trabajo en una consulta médica.\n\nEn mi presentación puedes conocer mi formación y mi forma de entender el acompañamiento.\n\nFernando',
      ctaText: 'Conocer cómo trabajo', ctaUrl: 'https://wellnessreal.es/sobre-mi?utm_source=wellnessreal&utm_medium=email&utm_campaign=community_intro&utm_content=day_8', footerText: 'Fernando Royano · WellnessReal' },
  },
  {
    day: 12, subject: '¿Te ayudaría un plan adaptado con seguimiento?',
    preheader: 'Consulta qué incluye Método BASE antes de solicitar plaza.',
    vars: { title: 'Cuando quieres aplicar lo aprendido con acompañamiento', subtitle: 'Conoce Método BASE Tiroides.',
      body: 'Hola.\n\nLa comunidad te permite aprender, consultar herramientas y plantear dudas generales. Puedes seguir utilizándola por tu cuenta.\n\nSi ahora necesitas decidir qué te toca a ti y revisarlo con seguimiento, tienes Método BASE Tiroides: evaluación inicial, plan de fuerza adaptado, organización de hábitos, seguimiento semanal y dos revisiones individuales durante 12 semanas.\n\nEn la página del programa encontrarás el alcance, el precio y las condiciones. Léelos con calma. Si encaja con lo que necesitas, puedes enviar la solicitud para que valore tu punto de partida y acordemos una conversación.\n\nEnviar la solicitud no implica pagar. Y no necesitas terminar ningún vídeo ni completar todas las lecciones para consultar el programa.\n\nFernando',
      ctaText: 'Ver cómo funciona Método BASE', ctaUrl: 'https://wellnessreal.es/metodo-tiroides?origen=comunidad&utm_source=wellnessreal&utm_medium=email&utm_campaign=community_intro&utm_content=day_12', footerText: 'Fernando Royano · WellnessReal' },
  },
]

export function renderCommunityEmail(vars: TemplateVars, preheader: string): string {
  const cta = new URL(vars.ctaUrl)
  if (!['https:', 'http:'].includes(cta.protocol)) throw new Error('[CommunityEmail:render] Destino no válido')
  const paragraphs = vars.body.split(/\n\s*\n/).map(value => `<p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#30273d">${escapeHtml(value).replaceAll('\n', '<br>')}</p>`).join('')
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;background:#f4f0f7;font-family:Arial,Helvetica,sans-serif;color:#30273d">
<div style="display:none;font-size:1px;color:#f4f0f7;max-height:0;overflow:hidden">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f0f7"><tr><td align="center" style="padding:20px 12px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff">
<tr><td style="padding:26px 28px;background:#16122b;color:#fcee21;font-size:18px;font-weight:700;letter-spacing:2px">WELLNESSREAL</td></tr>
<tr><td style="padding:30px 28px 12px"><h1 style="margin:0 0 12px;font-size:27px;line-height:1.25;color:#16122b">${escapeHtml(vars.title)}</h1><p style="margin:0 0 26px;color:#662d91;font-size:16px;line-height:1.6">${escapeHtml(vars.subtitle)}</p>${paragraphs}
<table role="presentation" cellspacing="0" cellpadding="0" style="margin:26px 0"><tr><td style="border-radius:8px;background:#fcee21;text-align:center"><a href="${escapeHtml(cta.href)}" style="display:inline-block;padding:15px 22px;color:#16122b;font-size:16px;font-weight:700;text-decoration:none">${escapeHtml(vars.ctaText)}</a></td></tr></table></td></tr>
<tr><td style="padding:22px 28px;background:#eee8f3;color:#51445e;font-size:13px;line-height:1.7"><p style="margin:0 0 8px">${escapeHtml(vars.footerText)}</p><p style="margin:0 0 8px">Recibes este correo porque elegiste recibir ideas y comunicaciones de WellnessReal.</p><p style="margin:0"><a href="{$unsubscribe}" style="color:#542078;text-decoration:underline">Darme de baja</a> · <a href="https://wellnessreal.es/privacidad" style="color:#542078;text-decoration:underline">Privacidad</a> · <a href="mailto:info@wellnessreal.es" style="color:#542078;text-decoration:underline">Contacto</a></p></td></tr>
</table></td></tr></table></body></html>`
}
