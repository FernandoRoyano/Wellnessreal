import Image from 'next/image'
import Container from '@/components/common/Container'
import Link from 'next/link'
import { Calendar, Clock, User, ArrowLeft, ArrowRight } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPostSlugs, getRelatedPosts } from '@/lib/db/posts'
import type { Metadata } from 'next'
import JsonLd, { articleSchema, breadcrumbSchema, isFernandoAuthor } from '@/components/seo/JsonLd'
import BlogContentWithCTAs from '@/components/blog/BlogContentWithCTAs'
import RelatedPosts from '@/components/blog/RelatedPosts'
import WeeklyLogDownload from '@/components/blog/WeeklyLogDownload'
import { withArticleSource } from '@/lib/article-attribution'
import { getBlogPartner } from '@/lib/blog-partners'
import '../markdown.css'

export const revalidate = 60

export async function generateStaticParams() {
  try {
    const slugs = await getAllPostSlugs()
    return slugs.map((item) => ({ slug: item.slug }))
  } catch (error) {
    console.error('[blog:generateStaticParams]', error)
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) return { title: 'Post no encontrado | WellnessReal' }

  const ogImage = post.main_image_url || '/images/portada-WR.jpg'

  return {
    title: post.title,
    description: post.excerpt,
    ...(getBlogPartner(slug) ? { robots: { index: false, follow: true, googleBot: { index: false, follow: true } } } : {}),
    alternates: {
      canonical: `https://wellnessreal.es/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: [post.author],
      url: `https://wellnessreal.es/blog/${slug}`,
      siteName: 'WellnessReal',
      locale: 'es_ES',
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  }
}

// El contenido importado incluye un <h1> inicial generado desde el título del
// markdown. El template ya renderiza su propio <h1>, así que lo eliminamos para
// no duplicarlo en el DOM (señal negativa de estructura para crawlers).
function stripLeadingH1(html: string): string {
  return html.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, '')
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const partner = getBlogPartner(slug)
  const relatedPosts = partner ? [] : await getRelatedPosts(slug, post.category_id, 3)

  // Los artículos de tiroides funnelizan a su propia guía y a la comunidad,
  // no al embudo general de fitness.
  const isThyroid = post.category?.slug === 'tiroides'
  const hasFernandoAuthor = isFernandoAuthor(post.author)
  const hasWeeklyLog = !partner && ['rutina-fuerza-casa-hipotiroidismo', 'retomar-entrenamiento-fuerza-despues-paron', 'rutina-30-minutos-en-casa', 'mejor-ejercicio-hipotiroidismo'].includes(slug)

  return (
    <>
      <JsonLd
        data={articleSchema({
          title:         post.title,
          description:   post.excerpt,
          url:           `https://wellnessreal.es/blog/${slug}`,
          image:         post.main_image_url || undefined,
          datePublished: post.published_at,
          dateModified:  post.updated_at,
          author:        post.author,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Inicio', url: 'https://wellnessreal.es' },
          { name: 'Blog',   url: 'https://wellnessreal.es/blog' },
          { name: post.title, url: `https://wellnessreal.es/blog/${slug}` },
        ])}
      />

      {/* ═══════════════ HERO DEL POST ═══════════════ */}
      <section className="relative pt-fluid-lg pb-fluid-sm bg-brand-deep overflow-hidden">
        <div className="absolute inset-0 bg-radial-accent opacity-50" />
        <Container>
          <div className="relative max-w-4xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-fluid-sm text-muted hover:text-accent transition-colors mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Volver al blog
            </Link>

            {post.category && (
              <span className="inline-block text-fluid-xs font-bold px-3 py-1.5 rounded-full mb-5 bg-accent-soft text-accent border border-accent/20 uppercase tracking-wider">
                {post.category.title}
              </span>
            )}

            <h1 className="headline text-fluid-5xl text-white mb-6 leading-[1.1]">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-5 text-fluid-sm text-muted pb-6 border-b border-border-subtle">
              <span className="inline-flex items-center gap-2">
                <User className="w-4 h-4 text-accent" />
                {hasFernandoAuthor ? (
                  <Link href="/sobre-mi" rel="author" className="inline-flex min-h-11 items-center text-accent underline underline-offset-4">{post.author}</Link>
                ) : post.author}
              </span>
              <span className="inline-flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                {new Date(post.published_at).toLocaleDateString('es-ES', {
                  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Madrid',
                })}
              </span>
              {post.read_time && (
                <span className="inline-flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent" />
                  {post.read_time}
                </span>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ IMAGEN DESTACADA ═══════════════ */}
      {post.main_image_url && (
        <section className="bg-brand-deep pb-fluid-md">
          <Container>
            <div className="max-w-4xl mx-auto">
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-border-subtle shadow-xl">
                <Image
                  src={post.main_image_url}
                  alt={post.main_image_alt || post.title}
                  fill
                  priority
                  sizes="(max-width: 896px) 100vw, 896px"
                  className="object-cover"
                />
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ═══════════════ CONTENIDO ═══════════════ */}
      <section data-lead-resource={isThyroid ? 'tiroides' : 'guia'} className="bg-brand-deep pb-fluid-xl">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-fluid-xl text-white/85 leading-relaxed mb-fluid-md pb-fluid-sm border-b border-border-subtle font-medium">
              {post.excerpt}
            </p>

            <BlogContentWithCTAs content={stripLeadingH1(post.content)} isThyroid={isThyroid} sourceSlug={slug} showCtas={!partner} />
            {hasWeeklyLog && <WeeklyLogDownload />}
            {hasFernandoAuthor && !partner && (
              <aside aria-labelledby="sobre-el-autor" className="mt-12 border-t border-border-subtle pt-7">
                <div className="flex items-center gap-4">
                  <Image src="/images/fernando-royano-avatar.webp" alt="Fernando Royano, autor del artículo" width={64} height={64} className="h-16 w-16 rounded-full object-cover object-top" />
                  <h2 id="sobre-el-autor" className="font-display text-fluid-xl font-bold text-white">Sobre Fernando Royano</h2>
                </div>
                <p className="mt-4 text-fluid-base leading-relaxed text-muted">Graduado en Ciencias de la Actividad Física y del Deporte, con 14 años de experiencia ayudando a personas a entrenar y organizar sus hábitos.</p>
                {isThyroid && (
                  <p className="mt-3 text-fluid-base leading-relaxed text-muted">Mi foco en mujeres con hipotiroidismo o Hashimoto nace de la experiencia con clientes y del estudio continuado sobre entrenamiento y alteraciones tiroideas. Trabajo sobre la planificación y la adaptación del ejercicio, manteniendo el diagnóstico y el tratamiento en el ámbito sanitario.</p>
                )}
                <Link href={isThyroid ? '/sobre-mi#enfoque-tiroides' : '/sobre-mi'} className="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold text-accent underline underline-offset-4">Conoce mi formación y cómo trabajo <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></Link>
              </aside>
            )}
          </div>
        </Container>
      </section>

      {/* ═══════════════ ARTÍCULOS RELACIONADOS ═══════════════ */}
      {!partner && <>
      <RelatedPosts posts={relatedPosts} />

      {/* ═══════════════ LEAD MAGNET ═══════════════ */}
      {!hasWeeklyLog && <section className="relative py-fluid-lg bg-brand-dusk">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />
        <Container>
          <div className="max-w-3xl mx-auto surface-card-accent rounded-2xl p-fluid-md text-center space-y-5">
            <h2 className="headline text-fluid-3xl text-white">
              ¿Quieres más <span className="text-gradient-brand">contenido como este?</span>
            </h2>
            <p className="text-fluid-lg text-muted max-w-xl mx-auto leading-relaxed">
              Descarga la guía gratuita{' '}
              <span className="text-accent font-semibold">
                {isThyroid
                  ? '“Entrenar y adelgazar con hipotiroidismo”'
                  : '“Fuerza para la vida real”'}
              </span>
              .
            </p>
            <div className="pt-2">
              <Link href={isThyroid ? '/tiroides' : '/recurso-gratis'} className="btn-brand text-fluid-base">
                Descargar guía gratis
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>}

      {/* ═══════════════ CTA FINAL ═══════════════ */}
      <section className="relative py-fluid-xl bg-brand-deep overflow-hidden">
        <div className="absolute inset-0 bg-radial-accent opacity-40" />
        <Container>
          <div className="relative text-center max-w-3xl mx-auto space-y-6">
            <span className="eyebrow justify-center">Tu turno</span>
            {isThyroid ? (
              <>
                <h2 className="headline text-fluid-4xl text-white">
                  Convierte lo aprendido <span className="text-gradient-brand">en un plan.</span>
                </h2>
                <p className="text-fluid-lg text-muted leading-relaxed">
                  Método BASE Tiroides son 12 semanas para organizar fuerza, alimentación y descanso
                  con seguimiento profesional y ajustes alrededor de tu vida real.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                  <Link href={withArticleSource('/metodo-tiroides', slug)} className="btn-brand text-fluid-base px-8">
                    Ver Método BASE Tiroides
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/comunidad/entrar" className="btn-ghost text-fluid-base px-8">
                    Prefiero empezar gratis
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h2 className="headline text-fluid-4xl text-white">
                  ¿Prefieres un <span className="text-gradient-brand">plan personalizado?</span>
                </h2>
                <p className="text-fluid-lg text-muted leading-relaxed">
                  Esto que lees aquí es contenido general. Una valoración analiza TU caso y diseña un plan
                  adaptado a tu vida real.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                  <Link href={withArticleSource('/valoracion', slug)} className="btn-brand text-fluid-base px-8">
                    Solicitar valoración gratuita
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/blog" className="btn-ghost text-fluid-base px-8">
                    Ver más artículos
                  </Link>
                </div>
              </>
            )}
          </div>
        </Container>
      </section>
      </>}
    </>
  )
}
