#!/usr/bin/env node
/**
 * Edita los metadatos internos de un PDF (Title, Author, Subject, Keywords).
 * El Title es lo que el navegador muestra en la pestaña al abrir el PDF.
 *
 * Uso:
 *   node scripts/set-pdf-metadata.mjs <ruta-pdf>
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { PDFDocument } from 'pdf-lib'

const filePath = process.argv[2]
if (!filePath) {
  console.error('❌ Uso: node scripts/set-pdf-metadata.mjs <ruta-pdf>')
  process.exit(1)
}

const absPath = resolve(filePath)
const pdfBytes = readFileSync(absPath)

const pdf = await PDFDocument.load(pdfBytes)

// Metadatos que verá el navegador y los lectores de PDF
pdf.setTitle('Guía Fitness WellnessReal — Fitness real para gente con vida real')
pdf.setAuthor('Fernando Royano · WellnessReal')
pdf.setSubject('Guía gratuita: cómo ponerte en forma cuando no tienes vida perfecta')
pdf.setKeywords([
  'fitness',
  'entrenamiento online',
  'nutrición',
  'hábitos',
  'WellnessReal',
  'Fernando Royano',
])
pdf.setCreator('WellnessReal')
pdf.setProducer('WellnessReal')

const out = await pdf.save()
writeFileSync(absPath, out)

console.log('✅ Metadatos actualizados en:', absPath)
console.log('   Title:    Guía Fitness WellnessReal — Fitness real para gente con vida real')
console.log('   Author:   Fernando Royano · WellnessReal')
console.log('   Subject:  Guía gratuita: cómo ponerte en forma cuando no tienes vida perfecta')
