'use client'

import { useState } from 'react'
import { marked } from 'marked'
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
    // Mismo criterio que en la vista: el guion es Markdown y en papel también debe leerse como documento.
    void Promise.resolve(marked.parse(content, { breaks: true, gfm: true })).then((html) => {
      w.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
      <style>
        body { font-family: Georgia, serif; max-width: 720px; margin: 40px auto; padding: 20px; line-height: 1.75; color: #111; }
        h1 { font-size: 26px; }
        h2 { margin-top: 34px; padding-bottom: 6px; border-bottom: 1px solid #ddd; font-size: 19px; }
        h3 { margin-top: 22px; font-size: 16px; }
        p { max-width: 62ch; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
        th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; vertical-align: top; }
        th { background: #f2f2f2; }
        strong { background: #fff3b0; padding: 0 2px; }
        em { color: #666; }
        hr { border: 0; border-top: 1px solid #ddd; margin: 28px 0; }
      </style></head><body>${html}</body></html>`)
      w.document.close()
      setTimeout(() => w.print(), 250)
    })
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
