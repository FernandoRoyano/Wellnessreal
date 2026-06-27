import Anthropic from '@anthropic-ai/sdk'

// Cliente de Claude. SOLO servidor (usa ANTHROPIC_API_KEY).
export const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Modelo configurable por variable de entorno. Por defecto Sonnet: en Vercel free
// el tope de la función son 60s duros y Opus generando un programa entero se pasa
// (504 → timeout). Sonnet cabe con margen y la calidad sobra para algo estructurado
// que además Fernando revisa. Sube a claude-opus-4-8 solo si amplías el límite (Pro).
export const MODELO_IA = process.env.WELLNESS_AI_MODEL || 'claude-sonnet-4-6'
