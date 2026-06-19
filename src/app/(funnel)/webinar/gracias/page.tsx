import type { Metadata } from "next";
import Link from "next/link";
import "../webinar.css";

export const metadata: Metadata = {
  title: "Plaza reservada | WellnessReal",
  robots: { index: false, follow: false },
};

export default function WebinarGracias() {
  return (
    <div className="wrlp">
      <section className="ty">
        <div className="ty-inner">
          <div className="badge">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h1>
            ¡Tu plaza está <span className="hl">reservada!</span>
          </h1>
          <p>
            Te he enviado un email de confirmación con los detalles. Revisa tu
            bandeja de entrada (y la carpeta de spam, por si acaso).
          </p>

          <div className="steps">
            <div className="step">
              <span className="n">1</span>
              <span>Apunta el día y la hora de tu sesión.</span>
            </div>
            <div className="step">
              <span className="n">2</span>
              <span>Te enviaré el enlace de acceso antes de que empiece.</span>
            </div>
            <div className="step">
              <span className="n">3</span>
              <span>Conéctate desde el móvil o el ordenador, sin instalar nada.</span>
            </div>
          </div>

          <div style={{ marginTop: 28, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,.1)" }}>
            <p style={{ marginBottom: 18 }}>
              <strong style={{ color: "var(--cream)" }}>¿No quieres esperar al webinar?</strong>{" "}
              Cuéntame tu situación en 2 minutos y te preparo un primer plan
              personalizado con mi método. Lo revisas al instante.
            </p>
            <Link href="/cuestionario" className="btn-primary">
              Crear mi plan ahora →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
