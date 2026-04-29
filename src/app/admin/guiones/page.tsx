import Link from 'next/link'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { guiones } from '@/lib/guiones/data'
import { FileText, Clock, Hash, ArrowRight, CheckCircle2, AlertCircle, Mic } from 'lucide-react'

const statusConfig = {
  draft: { label: 'Borrador', color: '#9ca3af', bg: 'rgba(156,163,175,0.15)', icon: AlertCircle },
  ready: { label: 'Listo para grabar', color: '#FCEE21', bg: 'rgba(252,238,33,0.15)', icon: CheckCircle2 },
  recorded: { label: 'Grabado', color: '#4ade80', bg: 'rgba(74,222,128,0.15)', icon: Mic },
}

export default function GuionesListPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8" style={{ backgroundColor: '#16122B' }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#FCEE21' }}>
              Guiones
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Scripts de vídeo, audio, campañas de email y anuncios.
            </p>
          </div>
        </div>

        {guiones.length === 0 ? (
          <div
            className="rounded-xl p-12 text-center"
            style={{ backgroundColor: '#1a1535', border: '1px solid rgba(102,45,145,0.3)' }}
          >
            <FileText size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No hay guiones todavía</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guiones.map((guion) => {
              const cfg = statusConfig[guion.status]
              const StatusIcon = cfg.icon
              return (
                <Link
                  key={guion.slug}
                  href={`/admin/guiones/${guion.slug}`}
                  className="block rounded-xl p-6 transition-all hover:scale-[1.01] hover:border-opacity-60 group"
                  style={{
                    backgroundColor: '#1a1535',
                    border: '1px solid rgba(102,45,145,0.3)',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 pr-4">
                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#FCEE21] transition-colors">
                        {guion.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{guion.subtitle}</p>
                    </div>
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 whitespace-nowrap"
                      style={{ backgroundColor: cfg.bg, color: cfg.color }}
                    >
                      <StatusIcon size={11} />
                      {cfg.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t" style={{ borderColor: 'rgba(102,45,145,0.3)' }}>
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      {guion.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Hash size={12} />
                      {guion.wordCount.toLocaleString('es-ES')} palabras
                    </span>
                    <span className="ml-auto flex items-center gap-1 text-[#FCEE21] group-hover:gap-2 transition-all">
                      Abrir
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
