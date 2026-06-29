#!/usr/bin/env node
/**
 * Genera una portada de blog "branded con foto" en el estilo de la serie de
 * suplementos: la FOTO ocupa el lienzo y un panel navy degradado a la izquierda
 * sostiene el texto (eyebrow + título blanco + remate amarillo + subtítulo + url).
 *
 * Uso:
 *   node scripts/generate-blog-cover.mjs \
 *     --photo /ruta/foto.png \
 *     --out public/blog/<slug>.jpg \
 *     --eyebrow "GUÍA DE SUPLEMENTOS" \
 *     --title "Berberina:|¿el 'Ozempic" \
 *     --highlight "natural'?" \
 *     --subtitle "Qué dice la evidencia de verdad (y por|qué no hace magia para perder grasa)." \
 *     --url "wellnessreal.es"
 *
 * Las pipes "|" separan líneas. --highlight es el remate amarillo del título.
 */

import { resolve, extname, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { writeFileSync, mkdirSync } from 'node:fs'

// --- Tipografía de marca: Montserrat vía fontconfig (scripts/fonts/*.ttf) ---
// Generamos fonts.conf con la ruta absoluta de la máquina y apuntamos librsvg ahí
// ANTES de cargar sharp (de ahí el import dinámico más abajo).
const FONTS_DIR = join(dirname(fileURLToPath(import.meta.url)), 'fonts')
mkdirSync(join(FONTS_DIR, 'cache'), { recursive: true })
const FC = join(FONTS_DIR, 'fonts.conf')
writeFileSync(FC, `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>${FONTS_DIR.replace(/\\/g, '/')}</dir>
  <cachedir>${FONTS_DIR.replace(/\\/g, '/')}/cache</cachedir>
  <config></config>
</fontconfig>`)
process.env.FONTCONFIG_FILE = FC

const sharp = (await import('sharp')).default

function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) { out[argv[i].slice(2)] = argv[i + 1]; i++ }
  }
  return out
}
const a = parseArgs(process.argv.slice(2))
if (!a.photo || !a.out) {
  console.error('❌ Faltan --photo y/o --out')
  process.exit(1)
}

const eyebrow   = (a.eyebrow || 'GUÍA DE SUPLEMENTOS').toUpperCase()
const title     = a.title     || ''
const highlight = a.highlight || ''
const subtitle  = a.subtitle  || ''
const url       = (a.url || 'wellnessreal.es')

// --- Paleta de marca (muestreada de las portadas existentes) ---
const NAVY   = '#16122b'
const YELLOW = '#F2E84B'
const WHITE  = '#FFFFFF'
const MUTED  = '#B9B6C8'

// --- Lienzo (16:9, igual que la serie) ---
const W = 1672
const H = 941

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const lines = (s) => (s ? s.split('|') : [])
// La serie usa DOS fuentes: titulares en Montserrat Alternates (la 'a' y 'g' de
// un solo piso) y el cuerpo (eyebrow, subtítulo, url) en Montserrat normal.
const TITLE_FONT = "Montserrat Alternates, 'Segoe UI', Arial, sans-serif"
const BODY_FONT  = "Montserrat, 'Segoe UI', Arial, sans-serif"

const PAD_X = 142          // sangría izquierda del texto
const BAR_X = 104          // barra vertical amarilla
const titleLines     = lines(title)
const highlightLines = lines(highlight)
const subtitleLines  = lines(subtitle)

const TITLE_SIZE = 96
const TITLE_LH   = TITLE_SIZE * 1.0
const TITLE_TOP  = 415     // baseline de la primera línea

let cy = TITLE_TOP
const titleBlock = titleLines.map((l) => {
  const y = cy; cy += TITLE_LH
  return `<text x="${PAD_X}" y="${y}" font-family="${TITLE_FONT}" font-size="${TITLE_SIZE}" font-weight="900" fill="${WHITE}" letter-spacing="-2">${esc(l)}</text>`
}).join('')
const highlightBlock = highlightLines.map((l) => {
  const y = cy; cy += TITLE_LH
  return `<text x="${PAD_X}" y="${y}" font-family="${TITLE_FONT}" font-size="${TITLE_SIZE}" font-weight="900" fill="${YELLOW}" letter-spacing="-2">${esc(l)}</text>`
}).join('')

const barTop = TITLE_TOP - TITLE_SIZE + 8
const barBottom = cy - TITLE_LH + 22
const bar = `<rect x="${BAR_X}" y="${barTop}" width="7" height="${barBottom - barTop}" fill="${YELLOW}"/>`

const SUB_TOP = cy + 26
const subtitleBlock = subtitleLines.map((l, i) =>
  `<text x="${PAD_X}" y="${SUB_TOP + i * 40}" font-family="${BODY_FONT}" font-size="29" font-weight="500" fill="${MUTED}">${esc(l)}</text>`
).join('')

const EY_Y = 318
const eyebrowBlock = `
  <text x="${PAD_X}" y="${EY_Y}" font-family="${BODY_FONT}" font-size="27" font-weight="700" fill="#D8D5E6" letter-spacing="7">${esc(eyebrow)}</text>
  <rect x="${PAD_X}" y="${EY_Y + 22}" width="78" height="5" fill="${YELLOW}"/>`

const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0"    stop-color="${NAVY}" stop-opacity="1"/>
      <stop offset="0.40" stop-color="${NAVY}" stop-opacity="1"/>
      <stop offset="0.66" stop-color="${NAVY}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  ${eyebrowBlock}
  ${bar}
  ${titleBlock}
  ${highlightBlock}
  ${subtitleBlock}
  <text x="${PAD_X}" y="${H - 58}" font-family="${BODY_FONT}" font-size="27" font-weight="800" fill="${YELLOW}" letter-spacing="1">${esc(url)}</text>
</svg>`

const base = await sharp(resolve(a.photo)).resize(W, H, { fit: 'cover', position: 'right' }).toBuffer()
let pipeline = sharp(base).composite([{ input: Buffer.from(overlay), top: 0, left: 0 }])

const ext = extname(a.out).slice(1).toLowerCase()
if (ext === 'jpg' || ext === 'jpeg') pipeline = pipeline.jpeg({ quality: 86, mozjpeg: true })
else if (ext === 'webp') pipeline = pipeline.webp({ quality: 86 })
else pipeline = pipeline.png({ compressionLevel: 9 })

const buf = await pipeline.toBuffer()
writeFileSync(resolve(a.out), buf)
console.log(`✅ Portada generada: ${a.out} (${(buf.length / 1024).toFixed(0)} KB, ${W}x${H})`)
