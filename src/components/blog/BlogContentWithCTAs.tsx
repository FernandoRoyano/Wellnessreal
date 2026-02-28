'use client'

import Link from 'next/link'
import { trackSignUp, trackGenerateLead } from '@/lib/analytics'

interface Props {
  content: string
}

function splitIntoParagraphs(html: string): string[] {
  return html
    .split('</p>')
    .map((chunk) => (chunk.trim() ? chunk + '</p>' : ''))
    .filter(Boolean)
}

function GuideCtaBanner() {
  return (
    <div
      className="my-10 p-6 md:p-8 rounded-xl"
      style={{ backgroundColor: '#1a1535', border: '2px solid #FCEE21' }}
    >
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#662D91' }}>
            Recurso gratuito
          </p>
          <h3 className="text-lg font-bold text-white mb-1">
            ¿Quieres aplicar esto a tu caso real?
          </h3>
          <p className="text-sm text-gray-400">
            Descarga la guía gratuita:{' '}
            <span style={{ color: '#FCEE21' }} className="font-semibold">
              &ldquo;Fitness real para gente con vida real&rdquo;
            </span>
          </p>
        </div>
        <Link
          href="/recurso-gratis"
          onClick={() => trackSignUp('blog_inline_guia')}
          className="flex-shrink-0 px-6 py-3 rounded-lg font-bold text-sm transition hover:scale-105"
          style={{ backgroundColor: '#FCEE21', color: '#16122B' }}
        >
          Descargar gratis
        </Link>
      </div>
    </div>
  )
}

function ValoracionCtaBanner() {
  return (
    <div
      className="my-10 p-6 md:p-8 rounded-xl"
      style={{ backgroundColor: '#1a1535', border: '2px solid #662D91' }}
    >
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#FCEE21' }}>
            Plan personalizado
          </p>
          <h3 className="text-lg font-bold text-white mb-1">
            Esto es contenido general. Tu caso es único.
          </h3>
          <p className="text-sm text-gray-400">
            Solicita una valoración gratuita y recibe un plan diseñado para tu vida real.
          </p>
        </div>
        <Link
          href="/valoracion"
          onClick={() => trackGenerateLead('blog_inline_valoracion')}
          className="flex-shrink-0 px-6 py-3 rounded-lg font-bold text-sm transition hover:scale-105 border-2 border-[#FCEE21] text-[#FCEE21] hover:bg-[#FCEE21] hover:text-[#16122B]"
        >
          Valoración gratuita
        </Link>
      </div>
    </div>
  )
}

export default function BlogContentWithCTAs({ content }: Props) {
  const paragraphs = splitIntoParagraphs(content)
  const total = paragraphs.length

  if (total < 4) {
    return (
      <article
        className="prose prose-invert prose-lg max-w-none markdown-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  const guideIndex = Math.floor(total * 0.3)
  const valoracionIndex = Math.floor(total * 0.7)

  return (
    <>
      {paragraphs.map((chunk, index) => (
        <div key={index}>
          <div
            className="prose prose-invert prose-lg max-w-none markdown-content"
            dangerouslySetInnerHTML={{ __html: chunk }}
          />
          {index === guideIndex - 1 && <GuideCtaBanner />}
          {index === valoracionIndex - 1 && valoracionIndex !== guideIndex && <ValoracionCtaBanner />}
        </div>
      ))}
    </>
  )
}
