import Anthropic from '@anthropic-ai/sdk'

// Cliente de Claude. SOLO servidor (usa ANTHROPIC_API_KEY).
export const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Modelo configurable por variable de entorno. Por defecto Haiku: en Vercel free
// el tope de la función son 60s DUROS y un programa completo (~4.3k tokens de salida)
// no cabe ni con Sonnet (medido: 90s) ni con Opus. Haiku 4.5 lo genera en ~34s con
// margen, y al ser un borrador que Fernando revisa antes de enviar, la calidad basta.
// Para subir a Sonnet/Opus haría falta Vercel Pro (300s) o generación en background.
export const MODELO_IA = process.env.WELLNESS_AI_MODEL || 'claude-haiku-4-5'
