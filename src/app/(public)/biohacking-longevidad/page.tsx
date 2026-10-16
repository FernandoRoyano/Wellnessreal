import TopicHubPage, { type TopicHubConfig } from '@/components/seo/TopicHubPage'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Biohacking y longevidad: qué funciona de verdad',
  description: 'Una guía para separar hábitos útiles, medicina con indicación y promesas experimentales sobre longevidad, hormonas, péptidos y medición.',
  path: '/biohacking-longevidad',
  ogImage: '/blog/biohacking-longevidad-que-funciona.webp',
  keywords: ['biohacking', 'longevidad', 'antienvejecimiento', 'péptidos', 'envejecimiento saludable'],
})

const config: TopicHubConfig = {
  eyebrow: 'Longevidad sin humo',
  title: 'Biohacking y longevidad:',
  highlightedTitle: 'evidencia antes que promesas',
  introduction: 'Dormir, entrenar y cuidar la salud no suena tan novedoso como un protocolo de péptidos. También es donde encontramos la base más sólida. Este centro analiza cada propuesta por sus resultados en personas, sus riesgos y su utilidad real.',
  answer: 'El biohacking no es una especialidad médica ni garantiza frenar el envejecimiento. Algunas prácticas son hábitos de salud con otro nombre; otras son tratamientos útiles solo cuando existe una indicación clínica, y muchas continúan siendo experimentales.',
  path: '/biohacking-longevidad',
  sections: [
    { title: 'Base sólida', body: 'Fuerza, actividad física, sueño, alimentación, relaciones y control de factores de riesgo sostienen la mayor parte del beneficio conocido.' },
    { title: 'Medicina con indicación', body: 'Una terapia hormonal o un fármaco pueden ser adecuados para una persona concreta. Eso exige diagnóstico, seguimiento y una conversación clínica sobre beneficios y riesgos.' },
    { title: 'Terreno experimental', body: 'Péptidos, biomarcadores y moléculas de longevidad generan hipótesis interesantes. Una hipótesis o un resultado en animales todavía no demuestra que una intervención alargue la vida humana.' },
  ],
  guides: [
    { href: '/blog/biohacking-longevidad-que-funciona', title: 'Biohacking y longevidad: qué funciona de verdad', description: 'Un mapa para ordenar hábitos, mediciones, hormonas, fármacos y promesas antienvejecimiento.' },
    { href: '/blog/entrenar-despues-de-los-40', title: 'Entrenar después de los 40', description: 'Cómo conservar fuerza y capacidad sin entrenar como si cada sesión fuera un examen.' },
    { href: '/blog/dormir-mal-arruina-tu-progreso', title: 'Sueño y progreso', description: 'Qué cambia cuando dormir mal deja de ser una excepción y empieza a condicionar el entrenamiento.' },
    { href: '/blog/creatina-mujeres-guia-evidencia', title: 'Creatina: beneficios y límites', description: 'Un ejemplo de cómo valorar una ayuda con bastante investigación, sin convertirla en imprescindible.' },
    { href: '/entrenamiento-online', title: 'Entrenamiento online personalizado', description: 'Cómo convertir objetivos, contexto y datos de entrenamiento en un plan que pueda ajustarse.' },
  ],
  faqs: [
    { question: '¿Qué significa biohacking?', answer: 'Es una etiqueta amplia para prácticas con las que una persona intenta modificar o medir su salud y rendimiento. Puede abarcar desde dormir mejor hasta usar tratamientos experimentales; por eso la palabra, por sí sola, no informa sobre eficacia o seguridad.' },
    { question: '¿Se puede frenar el envejecimiento?', answer: 'No existe una intervención demostrada que detenga el envejecimiento humano. Sí podemos reducir riesgos, mantener capacidad física y tratar problemas de salud para aumentar las probabilidades de vivir más años con autonomía.' },
    { question: '¿Un wearable puede decirme mi edad biológica?', answer: 'Puede estimar métricas asociadas con sueño, actividad o recuperación, pero una puntuación propietaria no equivale a un diagnóstico ni demuestra que una intervención haya rejuvenecido tus tejidos.' },
    { question: '¿Los péptidos son medicamentos?', answer: 'Algunos péptidos forman parte de medicamentos aprobados para indicaciones concretas. Otros productos promocionados para recuperación o longevidad no cuentan con la misma evidencia, autorización ni control de calidad. No deben tratarse como una sola categoría.' },
    { question: '¿Por dónde empiezo si me interesa la longevidad?', answer: 'Empieza por tu situación real: actividad física, fuerza, sueño, alimentación, tabaco, alcohol y revisiones sanitarias. Después valora si una medición o intervención adicional cambiará una decisión útil.' },
  ],
  cta: {
    title: 'Convierte la información en un plan posible',
    description: 'Si quieres mejorar fuerza, composición corporal y capacidad física, la valoración inicial sirve para decidir qué entrenar y cómo adaptarlo a tu semana. No sustituye una consulta médica.',
    href: '/valoracion',
    label: 'Solicitar valoración individual',
  },
}

export default function BiohackingLongevidadPage() {
  return <TopicHubPage config={config} />
}
