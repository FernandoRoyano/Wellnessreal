import Anthropic from '@anthropic-ai/sdk'

// Cliente de Claude. SOLO servidor (usa ANTHROPIC_API_KEY).
export const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Modelo configurable por variable de entorno. Por defecto Opus (máxima calidad);
// cambia WELLNESS_AI_MODEL a claude-sonnet-4-6 para reducir coste cuando convenga.
export const MODELO_IA = process.env.WELLNESS_AI_MODEL || 'claude-opus-4-8'
