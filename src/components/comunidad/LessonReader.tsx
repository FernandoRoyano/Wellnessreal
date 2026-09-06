'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, BookOpen, Clock3, Download, ShieldCheck } from 'lucide-react'

export interface RelatedArticle {
  slug: string
  title: string
  excerpt: string
  imageUrl: string | null
  category: string | null
  readTime: string | null
}

interface HeadingItem {
  id: string
  label: string
  level: 2 | 3
}

interface LessonReaderProps {
  content: string
  title: string
  lessonNumber: number
  lessonCount: number
  memberLabel: string
  coverUrl: string | null
  relatedArticles: RelatedArticle[]
}

function slugifyHeading(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function countWords(html: string): number {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

export function LessonReader({
  content,
  title,
  lessonNumber,
  lessonCount,
  memberLabel,
  coverUrl,
  relatedArticles,
}: LessonReaderProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [headings, setHeadings] = useState<HeadingItem[]>([])
  const [activeHeading, setActiveHeading] = useState('')
  const [progress, setProgress] = useState(0)
  const readingMinutes = useMemo(() => Math.max(1, Math.ceil(countWords(content) / 210)), [content])

  useEffect(() => {
    const root = contentRef.current
    if (!root) return

    const usedIds = new Map<string, number>()
    const nodes = Array.from(root.querySelectorAll<HTMLHeadingElement>('h2, h3'))
    const items = nodes.map((heading, index) => {
      const baseId = slugifyHeading(heading.textContent ?? '') || `apartado-${index + 1}`
      const duplicate = usedIds.get(baseId) ?? 0
      usedIds.set(baseId, duplicate + 1)
      const id = duplicate === 0 ? baseId : `${baseId}-${duplicate + 1}`
      heading.id = id
      return {
        id,
        label: heading.textContent?.trim() || `Apartado ${index + 1}`,
        level: heading.tagName === 'H2' ? 2 : 3,
      } as HeadingItem
    })
    setHeadings(items)

    root.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((anchor) => {
      const href = anchor.getAttribute('href') ?? ''
      const downloadable = /\.(pdf|docx?|xlsx?|csv|zip)(\?.*)?$/i.test(href) || anchor.hasAttribute('download')
      if (downloadable) {
        anchor.classList.add('lesson-download-link')
        anchor.setAttribute('target', '_blank')
        anchor.setAttribute('rel', 'noopener noreferrer')
      }
    })

    let frame = 0
    const updateProgress = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = root.getBoundingClientRect()
        const readableDistance = Math.max(1, root.offsetHeight - window.innerHeight * 0.55)
        const nextProgress = Math.min(100, Math.max(0, ((window.innerHeight * 0.24 - rect.top) / readableDistance) * 100))
        setProgress(Math.round(nextProgress))

        let current = items[0]?.id ?? ''
        for (const item of items) {
          const heading = document.getElementById(item.id)
          if (heading && heading.getBoundingClientRect().top <= 170) current = item.id
        }
        setActiveHeading(current)
      })
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [content])

  const blockCopy = (event: React.ClipboardEvent | React.DragEvent) => event.preventDefault()

  return (
    <>
      <div className="lesson-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <header className="lesson-editorial-header">
        <div className="lesson-kicker">
          <span>Lección {lessonNumber} de {lessonCount}</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" /> {readingMinutes} min</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Solo lectura</span>
        </div>
        <h1 className="headline mt-4 max-w-4xl text-[clamp(2.25rem,5vw,4.75rem)] text-white">{title}</h1>
        <div className="mt-6 flex items-center gap-3 text-xs text-white/45">
          <span className="h-px w-10 bg-[var(--color-accent)]/60" />
          <span>{progress}% leído</span>
        </div>
      </header>

      {coverUrl && (
        <figure className="lesson-cover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverUrl} alt={`Portada de ${title}`} />
        </figure>
      )}

      <details className="lesson-toc-mobile">
        <summary><BookOpen className="h-4 w-4" /> En esta lección</summary>
        <TableOfContents items={headings} activeId={activeHeading} />
      </details>

      <div className="lesson-reading-layout">
        <aside className="lesson-toc" aria-label="Índice de la lección">
          <div className="lesson-toc-inner">
            <p className="lesson-toc-label"><BookOpen className="h-4 w-4" /> En esta lección</p>
            <TableOfContents items={headings} activeId={activeHeading} />
            <div className="lesson-toc-progress">
              <span>{progress}%</span>
              <div><span style={{ width: `${progress}%` }} /></div>
            </div>
          </div>
        </aside>

        <main className="lesson-paper">
          <div className="lesson-watermarks" aria-hidden="true">
            {Array.from({ length: 7 }, (_, index) => <span key={index}>{memberLabel} · WellnessReal</span>)}
          </div>
          <div
            ref={contentRef}
            className="tiptap lesson-prose lesson-protected"
            onCopy={blockCopy}
            onCut={blockCopy}
            onDragStart={blockCopy}
            onContextMenu={(event) => event.preventDefault()}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </main>
      </div>

      {relatedArticles.length > 0 && (
        <section className="lesson-related" aria-labelledby="related-title">
          <div className="lesson-related-heading">
            <p>Para profundizar</p>
            <h2 id="related-title">Lecturas que conectan con esta lección</h2>
          </div>
          <div className="lesson-related-grid">
            {relatedArticles.map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`} className="lesson-related-card">
                {article.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={article.imageUrl} alt="" />
                )}
                <div className="lesson-related-card-body">
                  <p>{article.category ?? 'Artículo WellnessReal'}</p>
                  <h3>{article.title}</h3>
                  <p className="lesson-related-excerpt">{article.excerpt}</p>
                  <span>{article.readTime ?? 'Lectura recomendada'} <ArrowUpRight className="h-4 w-4" /></span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <p className="lesson-copy-note"><Download className="h-3.5 w-3.5" /> Los recursos descargables se abrirán en una pestaña nueva.</p>
    </>
  )
}

function TableOfContents({ items, activeId }: { items: HeadingItem[]; activeId: string }) {
  if (items.length === 0) return <p className="mt-3 text-sm text-white/40">Lectura breve, sin apartados.</p>

  return (
    <ol className="lesson-toc-list">
      {items.map((item) => (
        <li key={item.id} className={item.level === 3 ? 'is-subsection' : undefined}>
          <a href={`#${item.id}`} aria-current={activeId === item.id ? 'location' : undefined}>
            {item.label}
          </a>
        </li>
      ))}
    </ol>
  )
}
