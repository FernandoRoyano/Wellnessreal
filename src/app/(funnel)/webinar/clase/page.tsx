import type { Metadata } from "next";
import Link from "next/link";
import "../webinar.css";

export const metadata: Metadata = {
  title: "Tu clase gratuita | WellnessReal",
  robots: { index: false, follow: false },
};

// Pega aquí el embed de tu vídeo cuando lo tengas (YouTube/Vimeo).
// Ej. YouTube: "https://www.youtube.com/embed/XXXXXXXXXXX"
//     Vimeo:   "https://player.vimeo.com/video/XXXXXXXXX"
const VIDEO_EMBED_URL = "";

export default function WebinarClase() {
  return (
    <div className="wrlp">
      <nav id="wr-nav" className="scrolled">
        <a href="https://wellnessreal.es" className="logo" aria-label="WellnessReal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logos/WR_AUX_normal_bg.png" alt="WellnessReal" />
        </a>
      </nav>

      <section className="form-sec" style={{ paddingTop: "clamp(90px,14vh,140px)" }}>
        <div className="wrap">
          <div className="head reveal in">
            <span className="slabel">Clase online gratuita</span>
            <h2 className="title">Tu clase está lista. Dale al play.</h2>
            <p className="lede">
              Unos 15 minutos. Cuando termines, justo debajo tienes el botón para montar tu plan
              personalizado gratis.
            </p>
            <p
              style={{
                marginTop: 14,
                fontSize: ".9rem",
                color: "var(--lavender)",
                background: "rgba(252,238,33,.08)",
                border: "1px solid rgba(252,238,33,.2)",
                borderRadius: 12,
                padding: "10px 16px",
                display: "inline-block",
              }}
            >
              📩 Te hemos enviado el acceso también por email. Si no lo ves en unos minutos, revisa
              la carpeta de <strong style={{ color: "var(--cream)" }}>spam o promociones</strong> (y márcalo como “no es spam” para no perderte nada).
            </p>
          </div>

          {/* Reproductor 16:9 */}
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 9",
              borderRadius: 18,
              overflow: "hidden",
              border: "1px solid rgba(252,238,33,.25)",
              background: "#0E0B1E",
              marginBottom: 28,
            }}
          >
            {VIDEO_EMBED_URL ? (
              <iframe
                src={VIDEO_EMBED_URL}
                title="Clase WellnessReal"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
              />
            ) : (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: 24,
                  color: "#958D99",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 12 }}>🎬</div>
                <p style={{ maxWidth: 360, lineHeight: 1.6 }}>
                  El vídeo de la clase estará disponible aquí muy pronto. Mientras tanto, ya puedes
                  montar tu plan personalizado abajo.
                </p>
              </div>
            )}
          </div>

          {/* CTA al cuestionario */}
          <div
            className="glass"
            style={{
              textAlign: "center",
              padding: "clamp(24px,4vw,36px)",
              maxWidth: 620,
              margin: "0 auto",
            }}
          >
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.3rem,3.5vw,1.7rem)", color: "var(--cream)", marginBottom: 10 }}>
              ¿Listo para tu plan?
            </h3>
            <p style={{ color: "var(--lavender)", marginBottom: 22, lineHeight: 1.6 }}>
              Cuéntame tu situación en 2 minutos y te monto tu primer plan personalizado con este
              método. Lo ves al instante; yo lo reviso antes de dártelo entero.
            </p>
            <Link href="/cuestionario" className="btn-primary">
              Crear mi plan ahora <span className="arr">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
