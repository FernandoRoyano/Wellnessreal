type Media = { alt: string; kind: 'photo' | 'portrait' | 'diagram'; position?: string; thumbnail?: string; credit?: string }
const illustrative = 'Imagen ilustrativa generada con IA.'
const editorial = '/community/editorial/'
const media: Record<string, Media> = {
  [`${editorial}progresion-fuerza.webp`]: { alt: 'Mujer preparando unas mancuernas junto a un banco de entrenamiento en casa', kind: 'photo', thumbnail: `${editorial}progresion-fuerza-400.webp`, credit: illustrative },
  [`${editorial}recuperacion-paseo.webp`]: { alt: 'Mujer caminando a un ritmo tranquilo por un parque', kind: 'photo', thumbnail: `${editorial}recuperacion-paseo-400.webp`, credit: illustrative },
  [`${editorial}seguimiento-cuaderno.webp`]: { alt: 'Manos anotando un registro breve en un cuaderno de entrenamiento', kind: 'photo', thumbnail: `${editorial}seguimiento-cuaderno-400.webp`, credit: illustrative },
  [`${editorial}alimentacion-cotidiana.webp`]: { alt: 'Ejemplo de comida con lentejas, huevo, verduras y pan', kind: 'photo', thumbnail: `${editorial}alimentacion-cotidiana-400.webp`, credit: illustrative },
  '/community/fuerza-en-casa.webp': { alt: 'Ejemplo de sentarse y levantarse de una silla en casa', kind: 'photo', credit: 'Imagen ilustrativa.' },
  '/community/organizar-semana.webp': { alt: 'Mujer organizando su semana en un cuaderno', kind: 'photo', credit: 'Imagen ilustrativa.' },
  '/community/alimentacion-practica.webp': { alt: 'Ejemplo de preparación de una comida cotidiana', kind: 'photo', credit: 'Imagen ilustrativa.' },
  '/images/fernando-royano-tiroides.webp': { alt: 'Fernando Royano, creador de WellnessReal', kind: 'portrait', position: '50% 34%' },
  '/community/diagrams/tiroides-senales.svg': { alt: 'Esquema de señales entre hipotálamo, hipófisis y tiroides', kind: 'diagram', credit: 'Esquema educativo. Abre la imagen para ampliarla.' },
  '/community/diagrams/analitica-contexto.svg': { alt: 'Esquema para situar TSH, T4 libre y contexto clínico', kind: 'diagram', credit: 'Esquema educativo. Abre la imagen para ampliarla.' },
  '/community/diagrams/hashimoto-contexto.svg': { alt: 'Mapa educativo sobre Hashimoto y seguimiento profesional', kind: 'diagram', credit: 'Esquema educativo. Abre la imagen para ampliarla.' },
}
export function communityMedia(src: string): Media {
  return media[src] ?? { alt: 'Imagen de apoyo de la lección', kind: src.endsWith('.svg') ? 'diagram' : 'photo' }
}
