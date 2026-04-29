#!/usr/bin/env node
/**
 * Genera una imagen de cabecera de blog (1200x630px) con texto sobre fondo
 * branded, en el estilo que ya tienes en public/images/ ("El descanso no
 * funciona...", etc).
 *
 * Uso:
 *   node scripts/generate-blog-header.mjs --out public/blog/post.jpg \
 *     --eyebrow "CATEGORÍA" \
 *     --title "PRIMERA LÍNEA|SEGUNDA LÍNEA" \
 *     --highlight "TERCERA EN VERDE.|" \
 *     --subtitle "Subtítulo línea 1.|Subtítulo línea 2." \
 *     --url "wellnessreal.es"
 *
 * Las pipes "|" separan saltos de línea dentro del mismo bloque.
 * --highlight es opcional (texto verde de remate del título).
 */

import sharp from 'sharp'
import { writeFileSync } from 'node:fs'
import { resolve, extname } from 'node:path'

// --- Args parser muy simple ---
function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2)
      out[key] = argv[i + 1]
      i++
    }
  }
  return out
}

const args = parseArgs(process.argv.slice(2))
const outPath = args.out
if (!outPath) {
  console.error('❌ Falta --out <ruta>')
  process.exit(1)
}

const eyebrow   = args.eyebrow   || ''
const title     = args.title     || ''
const highlight = args.highlight || ''
const subtitle  = args.subtitle  || ''
const url       = args.url       || 'wellnessreal.es'

// --- Paleta (matching public/images/El descanso no funciona...) ---
const BG_DEEP   = '#0A1A1F'   // fondo principal casi negro con tinte teal
const BG_PANEL  = '#0E2128'   // capa intermedia
const TEAL      = '#1FA67A'   // verde marca para acentos y highlight
const TEAL_SOFT = '#15604A'
const TEXT      = '#FFFFFF'
const MUTED     = '#9CA3AF'

// --- Helpers de texto ---
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const lines = (s) => (s ? s.split('|') : [])

const titleLines     = lines(title)
const highlightLines = lines(highlight)
const subtitleLines  = lines(subtitle)

// --- Layout ---
const W = 1200
const H = 630
const PAD_X = 90
const SIDEBAR_X = 60
const TITLE_SIZE = titleLines.length + highlightLines.length >= 4 ? 76 : 88
const TITLE_LH = TITLE_SIZE * 1.0
const TITLE_TOP = 195

let cursorY = TITLE_TOP

const titleBlock = titleLines.map((l) => {
  const y = cursorY
  cursorY += TITLE_LH
  return `<text x="${PAD_X}" y="${y}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="${TITLE_SIZE}" font-weight="900" fill="${TEXT}" letter-spacing="-1">${esc(l)}</text>`
}).join('')

const highlightBlock = highlightLines.map((l) => {
  const y = cursorY
  cursorY += TITLE_LH
  return `<text x="${PAD_X}" y="${y}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="${TITLE_SIZE}" font-weight="900" fill="${TEAL}" letter-spacing="-1">${esc(l)}</text>`
}).join('')

const SUB_TOP = cursorY + 32
const subtitleBlock = subtitleLines.map((l, i) => {
  const y = SUB_TOP + (i * 28)
  return `<text x="${PAD_X}" y="${y}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="20" font-weight="500" fill="${MUTED}">${esc(l)}</text>`
}).join('')

const URL_Y = H - 35
const eyebrowText = eyebrow.toUpperCase()

// SVG completo
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <!-- Fondo -->
  <rect width="${W}" height="${H}" fill="${BG_DEEP}"/>

  <!-- Decoraciones sutiles: círculo y "topo lines" -->
  <circle cx="${W - 80}" cy="100" r="220" fill="none" stroke="${TEAL_SOFT}" stroke-width="1.2" opacity="0.18"/>
  <circle cx="${W - 80}" cy="100" r="160" fill="none" stroke="${TEAL_SOFT}" stroke-width="1" opacity="0.12"/>

  <g opacity="0.10" stroke="${TEAL}" stroke-width="1.2" fill="none">
    <path d="M 0 ${H - 110} Q 200 ${H - 130} 400 ${H - 110} T 800 ${H - 110} T 1200 ${H - 110}"/>
    <path d="M 0 ${H - 80}  Q 200 ${H - 100} 400 ${H - 80}  T 800 ${H - 80}  T 1200 ${H - 80}"/>
    <path d="M 0 ${H - 50}  Q 200 ${H - 70}  400 ${H - 50}  T 800 ${H - 50}  T 1200 ${H - 50}"/>
  </g>

  <!-- Side bar verde a la izquierda -->
  <rect x="${SIDEBAR_X}" y="80" width="4" height="${H - 200}" fill="${TEAL}"/>

  <!-- Eyebrow (categoría) -->
  ${eyebrowText ? `
  <text x="${PAD_X}" y="120" font-family="Inter, Helvetica, Arial, sans-serif" font-size="18" font-weight="700" fill="${TEAL}" letter-spacing="3">${esc(eyebrowText)}</text>
  <line x1="${PAD_X}" y1="138" x2="${PAD_X + Math.min(eyebrowText.length * 12, 280)}" y2="138" stroke="${TEAL}" stroke-width="2"/>
  ` : ''}

  <!-- Título (blanco) -->
  ${titleBlock}

  <!-- Highlight (verde) -->
  ${highlightBlock}

  <!-- Subtítulo (gris) -->
  ${subtitleBlock}

  <!-- URL -->
  <text x="${PAD_X}" y="${URL_Y}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="18" font-weight="800" fill="${TEAL}" letter-spacing="2">${esc(url.toUpperCase())}</text>
</svg>`

// --- Render ---
const ext = extname(outPath).slice(1).toLowerCase()
const validExt = ['png', 'jpg', 'jpeg', 'webp']
if (!validExt.includes(ext)) {
  console.error(`❌ Extensión no soportada: .${ext}. Usa png, jpg o webp.`)
  process.exit(1)
}

let pipeline = sharp(Buffer.from(svg))
if (ext === 'jpg' || ext === 'jpeg') pipeline = pipeline.jpeg({ quality: 90 })
else if (ext === 'webp') pipeline = pipeline.webp({ quality: 90 })
else pipeline = pipeline.png({ compressionLevel: 9 })

const buffer = await pipeline.toBuffer()
writeFileSync(resolve(outPath), buffer)

console.log(`✅ Generada: ${outPath} (${(buffer.length / 1024).toFixed(1)} KB, ${W}x${H})`)
