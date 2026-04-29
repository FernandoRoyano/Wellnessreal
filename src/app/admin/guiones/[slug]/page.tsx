import Link from 'next/link'
import { notFound } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { getGuion, guiones } from '@/lib/guiones/data'
import { ChevronLeft, Clock, Hash } from 'lucide-react'
import GuionActions from './GuionActions'

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

        {/* Script content */}
        <article
          className="rounded-xl p-6 md:p-8 mt-6 guion-content"
          style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102,45,145,0.3)' }}
        >
          <pre className="whitespace-pre-wrap font-sans text-gray-200 leading-relaxed text-[15px]">
            {guion.content}
          </pre>
        </article>
      </main>
    </div>
  )
}
