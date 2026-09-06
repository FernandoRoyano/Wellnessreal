import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import type { Programa } from '@/lib/programa-schema'

const PAGE = { width: 595.28, height: 841.89, margin: 48 }
const COLORS = {
  ink: rgb(0.09, 0.07, 0.17),
  muted: rgb(0.36, 0.34, 0.4),
  purple: rgb(0.4, 0.18, 0.57),
  yellow: rgb(0.87, 0.78, 0.04),
  line: rgb(0.86, 0.84, 0.89),
  white: rgb(1, 1, 1),
}

function printable(text: string): string {
  return String(text ?? '')
    .replace(/[‐‑‒–—]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/×/g, 'x')
    .replace(/•/g, '-')
    .replace(/[^ -~ -ÿ]/g, '')
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const paragraphs = printable(text).split(/\n+/)
  const lines: string[] = []
  for (const paragraph of paragraphs) {
    const words = paragraph.trim().split(/\s+/).filter(Boolean)
    let line = ''
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) line = candidate
      else {
        if (line) lines.push(line)
        line = word
      }
    }
    if (line) lines.push(line)
  }
  return lines.length ? lines : ['']
}

export async function createProgramPdf(program: Programa, clientName: string): Promise<Uint8Array> {
  const pdf = await PDFDocument.create()
  const regular = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  let page!: PDFPage
  let y!: number
  let pageNumber = 0

  const newPage = () => {
    page = pdf.addPage([PAGE.width, PAGE.height])
    pageNumber += 1
    y = PAGE.height - PAGE.margin
    page.drawText('WELLNESSREAL', { x: PAGE.margin, y, size: 9, font: bold, color: COLORS.purple })
    page.drawText(`METODO BASE · ${printable(clientName)}`, { x: PAGE.width - PAGE.margin - 210, y, size: 8, font: regular, color: COLORS.muted })
    page.drawLine({ start: { x: PAGE.margin, y: y - 10 }, end: { x: PAGE.width - PAGE.margin, y: y - 10 }, thickness: 0.7, color: COLORS.line })
    y -= 34
  }

  const ensure = (height: number) => {
    if (y - height < 52) newPage()
  }

  const text = (value: string, options: { size?: number; font?: PDFFont; color?: ReturnType<typeof rgb>; gap?: number; indent?: number } = {}) => {
    const size = options.size ?? 10
    const selectedFont = options.font ?? regular
    const indent = options.indent ?? 0
    const lineHeight = size * 1.42
    const lines = wrap(value, selectedFont, size, PAGE.width - PAGE.margin * 2 - indent)
    ensure(lines.length * lineHeight + (options.gap ?? 8))
    for (const line of lines) {
      page.drawText(line, { x: PAGE.margin + indent, y, size, font: selectedFont, color: options.color ?? COLORS.ink })
      y -= lineHeight
    }
    y -= options.gap ?? 8
  }

  const heading = (value: string, level: 1 | 2 | 3 = 2) => {
    const size = level === 1 ? 25 : level === 2 ? 16 : 11
    ensure(size * 2.4)
    text(value, { size, font: bold, color: level === 3 ? COLORS.purple : COLORS.ink, gap: level === 1 ? 14 : 8 })
  }

  const list = (items: string[]) => items.forEach((item) => text(`- ${item}`, { size: 9.5, indent: 10, gap: 4 }))

  newPage()
  page.drawRectangle({ x: PAGE.margin, y: y - 82, width: PAGE.width - PAGE.margin * 2, height: 86, color: COLORS.ink })
  page.drawRectangle({ x: PAGE.margin, y: y - 82, width: 8, height: 86, color: COLORS.yellow })
  page.drawText('TU PLAN PERSONALIZADO', { x: PAGE.margin + 24, y: y - 26, size: 10, font: bold, color: COLORS.yellow })
  page.drawText(printable(clientName), { x: PAGE.margin + 24, y: y - 56, size: 23, font: bold, color: COLORS.white })
  y -= 112
  text(program.mensaje_bienvenida, { size: 11, color: COLORS.muted, gap: 18 })

  heading('1. Tu punto de partida')
  text(`Objetivo principal: ${program.punto_partida.objetivo_principal}`, { font: bold })
  list(program.punto_partida.objetivos_secundarios)
  text(`Dónde entrenas: ${program.punto_partida.donde_entrena}`)
  text(`Días y tiempo: ${program.punto_partida.dias_tiempo}`)
  text(`A tener en cuenta: ${program.punto_partida.consideraciones}`)

  heading('2. Tu entrenamiento')
  text(program.entrenamiento.introduccion)
  heading('Regla del esfuerzo (RIR)', 3)
  text(program.entrenamiento.regla_rir)
  heading('Cómo progresar', 3)
  text(program.entrenamiento.progresion)
  heading('Calentamiento', 3)
  list(program.entrenamiento.calentamiento)

  for (const [dayIndex, day] of program.entrenamiento.dias.entries()) {
    heading(`Día ${dayIndex + 1}: ${day.nombre}`, 2)
    for (const exercise of day.ejercicios) {
      ensure(66)
      text(exercise.nombre, { font: bold, size: 10.5, gap: 3 })
      text(`${exercise.series_reps} · RIR ${exercise.rir}`, { size: 9.5, color: COLORS.purple, gap: 3 })
      if (exercise.alternativa) text(`Alternativa: ${exercise.alternativa}`, { size: 9, color: COLORS.muted, gap: 3 })
      if (exercise.nota) text(exercise.nota, { size: 9, color: COLORS.muted, gap: 8 })
    }
  }
  heading('Vuelta a la calma', 3)
  list(program.entrenamiento.vuelta_calma)

  heading('3. Tu nutrición')
  text(program.nutricion.introduccion)
  heading('Las reglas que importan', 3)
  list(program.nutricion.reglas)
  heading('Un día tipo', 3)
  list(program.nutricion.dia_tipo)
  text(program.nutricion.notas, { color: COLORS.muted })

  heading('4. Cómo medimos el progreso')
  text(program.seguimiento.introduccion)
  list(program.seguimiento.que_registrar)

  const pages = pdf.getPages()
  for (const [index, pdfPage] of pages.entries()) {
    pdfPage.drawLine({ start: { x: PAGE.margin, y: 38 }, end: { x: PAGE.width - PAGE.margin, y: 38 }, thickness: 0.5, color: COLORS.line })
    pdfPage.drawText(`WellnessReal · Método BASE · Página ${index + 1} de ${pageNumber}`, { x: PAGE.margin, y: 24, size: 7.5, font: regular, color: COLORS.muted })
  }
  pdf.setTitle(`Plan personalizado - ${printable(clientName)}`)
  pdf.setAuthor('WellnessReal')
  pdf.setSubject('Plan personalizado del Método BASE')
  return pdf.save()
}
