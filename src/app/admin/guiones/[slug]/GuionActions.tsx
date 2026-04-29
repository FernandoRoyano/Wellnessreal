'use client'

import { useState } from 'react'
import { Copy, Check, Download, Printer } from 'lucide-react'

interface GuionActionsProps {
  content: string
  title: string
  slug: string
}

export default function GuionActions({ content, title, slug }: GuionActionsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fail silently
    }
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${slug}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
    <style>
      body { font-family: Georgia, serif; max-width: 700px; margin: 40px auto; padding: 20px; line-height: 1.7; color: #111; }
      h1,h2,h3 { color: #222; }
      pre { white-space: pre-wrap; font-family: inherit; font-size: 16px; }
      strong { background: #fff3b0; padding: 0 2px; }
      em { color: #666; }
    </style></head><body><pre>${content.replace(/</g, '&lt;')}</pre></body></html>`)
    w.document.close()
    setTimeout(() => w.print(), 250)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all hover:scale-[1.02]"
        style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
      >
        {copied ? (
          <>
            <Check size={16} /> Copiado
          </>
        ) : (
          <>
            <Copy size={16} /> Copiar guión completo
          </>
        )}
      </button>
      <button
        onClick={handleDownload}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all border"
        style={{
          backgroundColor: 'rgba(102,45,145,0.2)',
          borderColor: 'rgba(102,45,145,0.5)',
          color: '#fff',
        }}
      >
        <Download size={16} /> Descargar (.md)
      </button>
      <button
        onClick={handlePrint}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all border"
        style={{
          backgroundColor: 'rgba(102,45,145,0.2)',
          borderColor: 'rgba(102,45,145,0.5)',
          color: '#fff',
        }}
      >
        <Printer size={16} /> Imprimir / PDF
      </button>
    </div>
  )
}
