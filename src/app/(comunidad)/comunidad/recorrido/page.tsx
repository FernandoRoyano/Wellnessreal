import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, Check, LockKeyhole, Sparkles } from 'lucide-react'
import { getSessionMember, getSpaces } from '@/lib/db/comunidad'
import { FREE_COMMUNITY, FREE_TOPICS, PREMIUM_PROGRAM, PREMIUM_TOPICS } from '@/lib/community-offer'
import styles from './recorrido.module.css'

export const metadata: Metadata = { title: 'Tu recorrido · Comunidad Tiroides · WellnessReal', robots: { index: false, follow: false } }

export default async function RecorridoPage() {
  const member = await getSessionMember()
  if (!member) redirect('/comunidad/entrar?next=/comunidad/recorrido')
  const spaces = await getSpaces(member)
  const hasPremium = spaces.some((space) => space.access_tier !== 'free')

  return <main className={styles.page}>
    <header className={styles.hero}>
      <p><Sparkles size={15} /> Tu mapa dentro de WellnessReal</p>
      <h1>Primero ganas criterio.<br /><span>Después, precisión.</span></h1>
      <p className={styles.lead}>La comunidad gratuita y el Método BASE hablan de temas relacionados, pero no hacen el mismo trabajo. Aquí tienes la diferencia completa.</p>
    </header>
    <section className={styles.comparison} aria-label="Comparación entre comunidad gratuita y Método BASE">
      <OfferCard offer={FREE_COMMUNITY} tone="free" active />
      <OfferCard offer={PREMIUM_PROGRAM} tone="premium" active={hasPremium} />
    </section>
    <section className={styles.boundary}>
      <div><span>Gratis</span><strong>Aprendes qué hacer y por qué.</strong></div><ArrowRight aria-hidden="true" /><div><span>Método BASE</span><strong>Decidimos qué te toca a ti y lo revisamos.</strong></div>
    </section>
    <TopicSection number="01" eyebrow="Comunidad gratuita" title="Los temas que construyen la base" topics={FREE_TOPICS} />
    <TopicSection number="02" eyebrow="Método BASE Tiroides" title="Los temas que convierten información en un plan" topics={PREMIUM_TOPICS} premium />
    <section className={styles.decision}>
      <div><p>{hasPremium ? 'Tu programa está activo' : 'Cuando el contenido general ya no es suficiente'}</p><h2>{hasPremium ? 'Continúa con tu semana del Método BASE.' : 'No compras más información. Solicitas acompañamiento.'}</h2><span>{hasPremium ? 'Tu espacio premium contiene el calendario y las revisiones de las 12 semanas.' : 'Primero revisamos tu caso. Solo después, si encaja, se realiza el pago y se activa el programa.'}</span></div>
      <Link href={hasPremium ? '/comunidad/metodo-base-tiroides' : '/comunidad/asesoria'}>{hasPremium ? 'Ir al Método BASE' : 'Solicitar valoración'} <ArrowRight size={17} /></Link>
    </section>
  </main>
}

type Topic = { readonly icon: React.ComponentType<{ size?: number }>; readonly title: string; readonly description: string }
function TopicSection({ number, eyebrow, title, topics, premium = false }: { number: string; eyebrow: string; title: string; topics: readonly Topic[]; premium?: boolean }) {
  return <section className={`${styles.topics} ${premium ? styles.premiumTopics : ''}`}><div className={styles.sectionHeading}><span>{number}</span><div><p>{eyebrow}</p><h2>{title}</h2></div></div><div className={styles.topicGrid}>{topics.map(({ icon: Icon, title: topicTitle, description }) => <article key={topicTitle}><Icon size={22} /><h3>{topicTitle}</h3><p>{description}</p></article>)}</div></section>
}

function OfferCard({ offer, tone, active }: { offer: typeof FREE_COMMUNITY | typeof PREMIUM_PROGRAM; tone: 'free' | 'premium'; active: boolean }) {
  return <article className={`${styles.offer} ${tone === 'premium' ? styles.offerPremium : ''}`}><div className={styles.offerLabel}>{tone === 'premium' && <LockKeyhole size={14} />} {offer.label}<span>{active ? 'Activo' : 'Con valoración'}</span></div><h2>{offer.promise}</h2><p>{offer.objective}</p><ul>{offer.includes.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul><small>{offer.limits}</small></article>
}
