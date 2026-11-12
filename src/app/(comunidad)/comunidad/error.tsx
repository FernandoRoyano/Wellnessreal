'use client'

export default function CommunityError({ reset }: { reset: () => void }) {
  return <section className="mx-auto my-12 max-w-xl space-y-5 rounded-2xl border border-border-subtle p-6" role="alert">
    <h1 className="headline text-fluid-2xl text-white">No se ha podido cargar esta parte de la comunidad</h1>
    <p className="text-muted">Puede ser un problema temporal de conexión. Vuelve a intentarlo para recuperar tu contenido y tu progreso.</p>
    <button type="button" onClick={reset} className="btn-brand min-h-11">Volver a intentar</button>
  </section>
}
