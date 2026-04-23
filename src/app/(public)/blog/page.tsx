import Container from '@/components/common/Container'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { getAllPosts, getAllCategories } from '@/lib/db/posts'
import BlogFilters from './BlogFilters'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Blog | Consejos de Entrenamiento y Nutrición',
  description:
    'Blog de entrenamiento y nutrición sin rodeos. Consejos prácticos, artículos de fitness y guías para ponerte en forma de verdad.',
  path: '/blog',
  keywords: [
    'blog fitness',
    'consejos entrenamiento',
    'nutrición deportiva',
    'artículos fitness',
    'blog entrenamiento online',
  ],
})

export const revalidate = 60

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
  ])

  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative py-fluid-xl overflow-hidden bg-brand-deep">
        <div className="absolute inset-0 bg-radial-accent opacity-70" />
        <div className="absolute inset-0 bg-grid-soft opacity-40" />
        <Container>
          <div className="relative max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full border border-border-subtle bg-accent-muted backdrop-blur-sm animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-fluid-xs font-semibold tracking-wider uppercase text-accent">
                Blog
              </span>
            </div>

            <h1 className="headline text-fluid-7xl text-white animate-fade-up">
              Fitness <span className="text-gradient-brand">sin rodeos.</span>
            </h1>

            <p className="text-fluid-xl text-muted leading-relaxed animate-fade-up [animation-delay:100ms]">
              Consejos de entrenamiento y nutrición{' '}
              <span className="text-accent font-semibold">sin rodeos</span>.
              <br />
              Lo que funciona, explicado simple.
            </p>
          </div>
        </Container>
      </section>

      {/* ═══════════════ POSTS + FILTROS ═══════════════ */}
      <BlogFilters posts={posts} categories={categories} />

      {/* ═══════════════ LEAD MAGNET ═══════════════ */}
      <section className="relative py-fluid-lg bg-brand-dusk">
        <Container>
          <div className="max-w-3xl mx-auto surface-card-accent rounded-2xl p-fluid-md text-center space-y-5">
            <h2 className="headline text-fluid-3xl text-white">
              ¿Quieres ir <span className="text-gradient-brand">al grano?</span>
            </h2>
            <p className="text-fluid-lg text-muted max-w-xl mx-auto leading-relaxed">
              Descarga la guía gratuita{' '}
              <span className="text-accent font-semibold">&ldquo;Fitness real para gente con vida real&rdquo;</span>.
              Sin teoría, solo lo que funciona.
            </p>
            <div className="pt-2">
              <Link href="/recurso-gratis" className="btn-brand text-fluid-base">
                Descargar guía gratis
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ CTA FINAL ═══════════════ */}
      <section className="relative py-fluid-lg bg-brand-deep">
        <Container>
          <div className="text-center max-w-2xl mx-auto space-y-5">
            <p className="text-fluid-lg text-muted">
              ¿Prefieres un plan personalizado a tu situación?
            </p>
            <Link href="/valoracion" className="btn-ghost text-fluid-base">
              Solicitar valoración gratuita
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
