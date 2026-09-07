'use client'

import { useEffect, useState } from 'react'
import { Activity, ArrowRight, CircleDollarSign, RefreshCw, Users } from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'

interface FunnelData {
  days: number
  counts: Record<string, number>
  rates: Record<string, number>
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
  ['Valoraciones', 'thyroid_valuation_submit'],
  ['Ventas', 'thyroid_sale'],
  ['Renovaciones', 'thyroid_continuity'],
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
            <section className="grid gap-3 lg:grid-cols-7">
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

            <section className="mt-6 grid gap-5 xl:grid-cols-2">
              <Breakdown title="Perfiles" leads={data.byProfile} sales={data.salesByProfile} labels={PROFILE_LABELS} />
              <Breakdown title="Intenciones" leads={data.byIntent} sales={data.salesByIntent} />
            </section>

            <section className="mt-6 grid gap-5 xl:grid-cols-2">
              <SimpleBreakdown title="Leads por fuente" values={data.bySource} />
              <SimpleBreakdown title="Respuestas por pregunta" values={data.byQuestion} />
            </section>

            <section className="mt-6 rounded-xl border border-white/10 bg-[#1a1535] p-5">
              <h2 className="font-semibold text-white">Conversiones entre etapas</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <Rate label="Landing → inicio" value={data.rates.landingToStart} />
                <Rate label="Inicio → completo" value={data.rates.startToComplete} />
                <Rate label="Completo → lead" value={data.rates.completeToLead} />
                <Rate label="Lead → valoración" value={data.rates.leadToValuation} />
                <Rate label="Valoración → venta" value={data.rates.valuationToSale} />
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
