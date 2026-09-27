import Link from 'next/link'
import { notFound } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { marked } from 'marked'
import { getGuion, guiones } from '@/lib/guiones/data'
import { ChevronLeft, Clock, Hash } from 'lucide-react'
import GuionActions from './GuionActions'

const RECORDING_SCRIPT_SLUGS = new Set([
  'clase-metodo-base-tiroides',
  'ads-clase-metodo-base-tiroides',
])

function formatRecordingScript(content: string) {
  const dividerIndex = content.indexOf('\n---\n')
  if (dividerIndex === -1) return content

  const instructions = content.slice(0, dividerIndex + 5)
  const script = content.slice(dividerIndex + 5).replace(/\s*\/{2,3}\s*/g, (pause, offset, source) => {
    const previousCharacter = source.slice(0, offset).trimEnd().at(-1)
    return previousCharacter && '.?!…»”'.includes(previousCharacter) ? '\n\n' : ' '
  })

  return `${instructions}${script}`
}

export function generateStaticParams() {
  return guiones.map((g) => ({ slug: g.slug }))
}

export default async function GuionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const guion = getGuion(slug)
  if (!guion) notFound()

  const isRecordingScript = RECORDING_SCRIPT_SLUGS.has(guion.slug)
  const displayContent = isRecordingScript ? formatRecordingScript(guion.content) : guion.content
  const html = await marked.parse(displayContent, { breaks: true, gfm: true })

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8" style={{ backgroundColor: '#16122B' }}>
        {/* Top nav */}
        <Link
          href="/admin/guiones"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition mb-6"
        >
          <ChevronLeft size={16} />
          Volver a guiones
        </Link>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#FCEE21' }}>
            {guion.title}
          </h1>
          <p className="text-gray-400 text-base mb-4">{guion.subtitle}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {guion.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <Hash size={14} />
              {guion.wordCount.toLocaleString('es-ES')} palabras
            </span>
            <span className="text-xs text-gray-600">
              Última actualización: {guion.lastUpdated}
            </span>
          </div>
        </div>

        {/* Purpose callout */}
        <div
          className="rounded-xl p-4 mb-6"
          style={{ backgroundColor: 'rgba(252,238,33,0.08)', border: '1px solid rgba(252,238,33,0.25)' }}
        >
          <p className="text-sm" style={{ color: '#FCEE21' }}>
            <strong>Para qué:</strong>{' '}
            <span className="text-gray-300">{guion.purpose}</span>
          </p>
        </div>

        {/* Actions (client component) */}
        <GuionActions content={guion.content} title={guion.title} slug={guion.slug} />

        {isRecordingScript && (
          <div className="guion-recording-help" role="note">
            <strong>Modo grabación por tomas</strong>
            <span>Cada tarjeta contiene una frase completa o un tramo corto. Graba una tarjeta, para y continúa con la siguiente.</span>
          </div>
        )}

        {/* Script content */}
        <article
          className={`rounded-xl p-4 md:p-8 mt-6 guion-content${isRecordingScript ? ' guion-content-recording' : ''}`}
          style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102,45,145,0.3)' }}
        >
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      </main>
    </div>
  )
}
