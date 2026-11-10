'use client'

import { useEffect, useState } from 'react'
import { Activity, ArrowRight, CircleDollarSign, RefreshCw, Users } from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'

interface FunnelData {
  days: number
  counts: Record<string, number>
  rates: Record<string, number>
  landingSignals: { engagedViews: number; landingCtaClicks: number }
  communityRetention?: {
    enabled: boolean; startedAt: string | null; activeMembers: number; resourceMembers: number;
    eligibleMembers: number; returnedMembers: number; returnRate: number | null;
    cohortStart: string; cohortEnd: string; truncated: boolean;
  }
  revenue: number
  recurringRevenue: number
  revenuePer100Leads: number
  byProfile: Record<string, number>
  salesByProfile: Record<string, number>
  byIntent: Record<string, number>
  salesByIntent: Record<string, number>
  bySource: Record<string, number>
  byQuestion: Record<string, number>
}

const STAGES = [
  ['Visitas', 'thyroid_landing_view'],
  ['Inicios', 'thyroid_test_start'],
  ['Completados', 'thyroid_test_complete'],
  ['Leads', 'thyroid_lead_capture'],
  ['Oferta', 'thyroid_offer_view'],
  ['Valoraciones', 'thyroid_valuation_submit'],
  ['Ventas', 'thyroid_sale'],
  ['Incorporados', 'thyroid_onboarding_complete'],
  ['Renovaciones', 'thyroid_continuity'],
] as const

const COMMUNITY_STAGES = [
  ['Clic para entrar', 'community_entry_click'],
  ['Enlace solicitado', 'community_access_requested'],
  ['Alta nueva confirmada', 'community_signup_confirmed'],
  ['Primera lección completada', 'community_first_lesson_completed'],
  ['Programa desde comunidad', 'community_program_visit'],
] as const

const PROFILE_LABELS: Record<string, string> = {
  buena_base: 'Buena base',
  falta_estructura: 'Falta de estructura',
  mucho_esfuerzo: 'Mucho esfuerzo',
  construir_base: 'Construir base',
  desconocido: 'Sin clasificar',
}

export default function ThyroidFunnelPage() {
  const [days, setDays] = useState(30)
  const [data, setData] = useState<FunnelData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // La carga se reinicia cuando cambia el rango solicitado.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    setError('')
    fetch(`/api/admin/funnel-tiroides?days=${days}`)
      .then(async (response) => {
        const payload = await response.json()
        if (!response.ok) throw new Error(payload.error || 'Error al cargar')
        setData(payload)
      })
      .catch(() => setError('No se pudieron cargar los datos. Comprueba que la migración esté aplicada.'))
      .finally(() => setLoading(false))
  }, [days])

  return (
    <div className="flex min-h-screen bg-[#16122B]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#FCEE21]">Tiroides</p>
            <h1 className="mt-1 text-3xl font-bold text-white">Funnel de negocio</h1>
            <p className="mt-2 text-sm text-white/50">De visita a clienta rentable, sin mezclar métricas generales.</p>
          </div>
          <select value={days} onChange={(event) => setDays(Number(event.target.value))} className="rounded-lg border border-[#662D91] bg-[#1a1535] px-4 py-2 text-sm text-white">
            <option value={7}>Últimos 7 días</option>
            <option value={30}>Últimos 30 días</option>
            <option value={90}>Últimos 90 días</option>
          </select>
        </div>

        {loading && <div className="flex items-center gap-2 py-20 text-white/50"><RefreshCw className="h-5 w-5 animate-spin" /> Cargando funnel…</div>}
        {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">{error}</div>}
        {data && !loading && (
          <>
            <section className="mb-8" aria-labelledby="community-funnel-heading">
              <h2 id="community-funnel-heading" className="text-xl font-semibold text-white">De la comunidad al acompañamiento</h2>
              <p className="mt-2 mb-4 max-w-3xl text-sm leading-relaxed text-white/70">Identidades con consentimiento en el periodo. Pedir un enlace no confirma un alta; volver a iniciar sesión no cuenta como miembro nuevo. Solicitudes y pagos confirmados aparecen en las etapas comerciales.</p>
              <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{COMMUNITY_STAGES.map(([label, key]) => <div key={key} className="border-t border-white/20 pt-4"><dt className="text-sm text-white/75">{label}</dt><dd className="mt-2 text-2xl font-semibold text-white">{data.counts[key] ?? 0}</dd></div>)}</dl>
            </section>
            {data.communityRetention && <section className="mb-8 rounded-xl border border-white/10 p-5" aria-labelledby="community-retention-heading">
              <h2 id="community-retention-heading" className="font-semibold text-white">Continuidad en la comunidad</h2>
              {!data.communityRetention.enabled ? <p className="mt-3 text-sm text-white/60">Medición preparada, pendiente de activar los eventos en la base de datos. No hay datos históricos de continuidad.</p> : data.communityRetention.truncated ? <p className="mt-3 text-sm text-white/60">El rango supera el límite de eventos. Reduce el periodo antes de interpretar la continuidad.</p> : <>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div><p className="text-sm text-white/60">Miembros activos</p><strong className="text-2xl text-white">{data.communityRetention.activeMembers}</strong></div>
                  <div><p className="text-sm text-white/60">Miembros con clic en recursos</p><strong className="text-2xl text-white">{data.communityRetention.resourceMembers}</strong></div>
                  <div><p className="text-sm text-white/60">Volvieron durante los días 1–7</p><strong className="text-2xl text-white">{data.communityRetention.returnRate === null ? '—' : `${data.communityRetention.returnRate}%`}</strong><p className="text-xs text-white/50">{data.communityRetention.returnedMembers} de {data.communityRetention.eligibleMembers} altas con ventana completa</p></div>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-white/50">Solo actividad con consentimiento de analítica, medida internamente. Clic no confirma descarga ni lectura del recurso. Retorno: una visita en otro día entre el 1 y el 7 tras el alta; no cuenta la sesión inicial. Cohorte de altas del {data.communityRetention.cohortStart} al {data.communityRetention.cohortEnd} (UTC), desde el inicio de medición. Las altas recientes esperan a completar la ventana.</p>
              </>}
            </section>}
            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {STAGES.map(([label, key], index) => (
                <div key={key} className="relative rounded-xl border border-white/10 bg-[#1a1535] p-4">
                  <p className="text-xs text-white/45">{label}</p>
                  <p className="mt-1 text-2xl font-bold text-white">{data.counts[key] ?? 0}</p>
                  {index < STAGES.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 text-[#FCEE21] lg:block" />}
                </div>
              ))}
            </section>

            <section className="mt-6 grid gap-4 md:grid-cols-3">
              <Metric icon={<Users />} label="Lead → venta" value={`${data.rates.leadToSale}%`} />
              <Metric icon={<CircleDollarSign />} label="Ingresos atribuibles" value={`${data.revenue.toFixed(0)} €`} sub={`+ ${data.recurringRevenue.toFixed(0)} € en continuidad`} />
              <Metric icon={<Activity />} label="Ingresos / 100 leads" value={`${data.revenuePer100Leads.toFixed(0)} €`} sub="No es beneficio: margen pendiente" />
            </section>

            <section className="mt-4 grid gap-4 sm:grid-cols-2">
              <Metric icon={<Activity />} label="Visitas con 5 s reales" value={String(data.landingSignals.engagedViews)} sub={`${data.rates.landingToEngaged}% de las aperturas`} />
              <Metric icon={<ArrowRight />} label="Clics para empezar" value={String(data.landingSignals.landingCtaClicks)} sub="CTA superior o fijo en móvil" />
            </section>

            <section className="mt-6 grid gap-5 xl:grid-cols-2">
              <Breakdown title="Perfiles" leads={data.byProfile} sales={data.salesByProfile} labels={PROFILE_LABELS} />
              <Breakdown title="Intenciones" leads={data.byIntent} sales={data.salesByIntent} />
            </section>

            <section className="mt-6 grid gap-5 xl:grid-cols-2">
              <SimpleBreakdown title="Leads por fuente" values={data.bySource} />
              <SimpleBreakdown title="Avances históricos por pregunta" values={data.byQuestion} />
            </section>

            <section className="mt-6 rounded-xl border border-white/10 bg-[#1a1535] p-5">
              <h2 className="font-semibold text-white">Conversiones entre etapas</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <Rate label="Landing → inicio" value={data.rates.landingToStart} />
                <Rate label="Inicio → completo" value={data.rates.startToComplete} />
                <Rate label="Completo → lead" value={data.rates.completeToLead} />
                <Rate label="Lead → valoración" value={data.rates.leadToValuation} />
                <Rate label="Valoración → venta" value={data.rates.valuationToSale} />
                <Rate label="Clase → registro" value={data.rates.vslLandingToRegistration} />
                <Rate label="Registro → CTA" value={data.rates.vslRegistrationToCta} />
                <Rate label="Oferta → solicitud" value={data.rates.offerToApplication} />
                <Rate label="Venta → onboarding" value={data.rates.saleToOnboarding} />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

function Metric({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return <div className="rounded-xl border border-white/10 bg-[#1a1535] p-5"><div className="flex items-center gap-2 text-[#FCEE21]">{icon}<span className="text-xs uppercase tracking-wider text-white/45">{label}</span></div><p className="mt-3 text-3xl font-bold text-white">{value}</p>{sub && <p className="mt-1 text-xs text-white/40">{sub}</p>}</div>
}

function Rate({ label, value }: { label: string; value: number }) {
  return <div><p className="text-xs text-white/40">{label}</p><p className="mt-1 text-xl font-semibold text-white">{value}%</p></div>
}

function Breakdown({ title, leads, sales, labels = {} }: { title: string; leads: Record<string, number>; sales: Record<string, number>; labels?: Record<string, string> }) {
  const keys = Array.from(new Set([...Object.keys(leads), ...Object.keys(sales)]))
  return <div className="rounded-xl border border-white/10 bg-[#1a1535] p-5"><h2 className="font-semibold text-white">{title}</h2><div className="mt-4 space-y-3">{keys.length === 0 ? <p className="text-sm text-white/35">Todavía no hay datos.</p> : keys.map((key) => <div key={key} className="flex items-center justify-between border-b border-white/5 pb-2 text-sm"><span className="text-white/70">{labels[key] || key}</span><span className="text-white"><strong>{leads[key] ?? 0}</strong> leads · <strong className="text-[#FCEE21]">{sales[key] ?? 0}</strong> ventas</span></div>)}</div></div>
}

function SimpleBreakdown({ title, values }: { title: string; values: Record<string, number> }) {
  const entries = Object.entries(values).sort((a, b) => b[1] - a[1])
  return <div className="rounded-xl border border-white/10 bg-[#1a1535] p-5"><h2 className="font-semibold text-white">{title}</h2><div className="mt-4 space-y-2">{entries.length === 0 ? <p className="text-sm text-white/35">Todavía no hay datos.</p> : entries.map(([label, value]) => <div key={label} className="flex justify-between text-sm"><span className="text-white/60">{label}</span><strong className="text-white">{value}</strong></div>)}</div></div>
}
