"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./webinar.css";

const TICKER = [
  { d: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z", t: "+100 clientes transformados" },
  { d: "M12 2 4 5v6c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V5l-8-3Z", t: "14 años de experiencia" },
  { d: "m4 6 8-4 8 4-8 4-8-4ZM4 6v6M12 10v10M20 6v6", t: "Graduado en Cc. del Deporte" },
  { d: "M20 6 9 17l-5-5", t: "Sin dietas extremas" },
  { d: "M20 6 9 17l-5-5", t: "Sin perfección, solo resultados" },
  { d: "M12 2v20M2 12h20", t: "Adaptado a tu vida real" },
];

export default function WebinarLanding() {
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const nav = document.getElementById("wr-nav");
    const progress = document.getElementById("wr-progress");

    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = (window.scrollY / h) * 100 + "%";
      if (!nav) return;
      if (window.scrollY > 40) {
        nav.classList.add("scrolled");
        nav.classList.remove("hero-mode");
      } else {
        nav.classList.remove("scrolled");
        nav.classList.add("hero-mode");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".wrlp .reveal").forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  const goReserve = () =>
    document.getElementById("reservar")?.scrollIntoView({ behavior: "smooth" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("Completa todos los campos.");
      return;
    }
    setSending(true);
    try {
      const { getAttributionForSubmit } = await import("@/lib/tracking");
      const res = await fetch("/api/webinar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          _attribution: getAttributionForSubmit(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo acceder a la clase.");
      router.push("/webinar/clase");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al acceder a la clase.");
      setSending(false);
    }
  };

  return (
    <div className="wrlp">
      <div className="progress" id="wr-progress" />

      <nav id="wr-nav" className="hero-mode">
        <a href="https://wellnessreal.es" className="logo" aria-label="WellnessReal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logos/WR_AUX_normal_bg.png" alt="WellnessReal" />
        </a>
        <button className="nav-cta" onClick={goReserve}>
          Ver la clase gratis
        </button>
      </nav>

      {/* HERO */}
      <header className="hero">
        <div className="hero-grid" />
        <div className="hero-inner">
          <span className="eyebrow">
            <span className="pulse" /> Clase online gratuita
          </span>
          <h1>
            Llevas tiempo moviéndote.
            <br />
            <span className="hl">¿Por qué tu cuerpo sigue igual?</span>
          </h1>
          <p className="sub">
            Descubre por qué moverte y comer &ldquo;bien&rdquo; ha dejado de bastar — y el
            sistema que usan mis clientes para transformar su composición corporal
            sin dietas extremas ni obsesión.
          </p>

          <div className="glass sessions">
            <div className="lab">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Acceso inmediato
            </div>
            <div className="srow">
              <span className="dot" />
              <span className="t">Clase grabada de ~15 minutos</span>
            </div>
            <div className="srow">
              <span className="dot" />
              <span className="t">La ves cuando quieras, ahora mismo</span>
            </div>
            <div className="srow">
              <span className="dot" />
              <span className="t">Gratis y sin instalar nada</span>
            </div>
          </div>

          <button className="btn-primary" onClick={goReserve}>
            Ver la clase gratis <span className="arr">→</span>
          </button>
          <p className="micro">Sin tarjeta · 100% online · Acceso inmediato</p>
        </div>
      </header>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          {[...TICKER, ...TICKER].map((item, i) => (
            <div className="tick" key={i}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={item.d} />
              </svg>
              {item.t}
            </div>
          ))}
        </div>
      </div>

      {/* DISCOVER */}
      <section>
        <div className="wrap">
          <div className="head reveal">
            <span className="slabel">En esta clase gratuita</span>
            <h2 className="title">
              Lo que vas a <span className="hl">descubrir</span>
            </h2>
          </div>
          <div className="grid-4">
            <div className="card reveal d1">
              <div className="ico">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5a3 3 0 1 0-5.997.142 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
                  <path d="M12 5a3 3 0 1 1 5.997.142 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
                </svg>
              </div>
              <h3>Por qué tu cuerpo está como está</h3>
              <p>No es una edad ni falta de fuerza de voluntad: es la suma de cosas pequeñas que se acumulan con los años. Y se le da la vuelta.</p>
            </div>
            <div className="card reveal d2">
              <div className="ico">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="6" cy="19" r="3" />
                  <circle cx="18" cy="5" r="3" />
                  <path d="M6 16V8a4 4 0 0 1 4-4h4M18 8v8a4 4 0 0 1-4 4h-4" />
                </svg>
              </div>
              <h3>El sistema que sí funciona</h3>
              <p>El método que han usado mis clientes para perder grasa y ganar músculo sin dietas extremas ni obsesión.</p>
            </div>
            <div className="card reveal d3">
              <div className="ico">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                  <path d="m19 9-5 5-4-4-3 3" />
                </svg>
              </div>
              <h3>Cómo medir tu progreso real</h3>
              <p>Más allá de la báscula. Las métricas que importan para saber que estás avanzando de verdad.</p>
            </div>
            <div className="card reveal d4">
              <div className="ico">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m17 2 4 4-4 4" />
                  <path d="M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4" />
                  <path d="M21 13v1a4 4 0 0 1-4 4H3" />
                </svg>
              </div>
              <h3>Hábitos que se mantienen</h3>
              <p>Por qué la fuerza de voluntad no es la solución — y qué es lo que de verdad sostiene el cambio.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOR WHOM */}
      <section className="dark">
        <div className="wrap">
          <div className="head reveal">
            <span className="slabel">¿Es para ti?</span>
            <h2 className="title">
              Esta clase es para ti si ya entrenas pero <span className="hl">algo falla</span>
            </h2>
          </div>
          <div className="whom-grid">
            <div className="whom reveal d1"><span className="chk">✓</span><p>Los resultados se han estancado aunque sigas igual de constante</p></div>
            <div className="whom reveal d2"><span className="chk">✓</span><p>Lo que antes te funcionaba ya no mueve la aguja</p></div>
            <div className="whom reveal d3"><span className="chk">✓</span><p>Sabes lo que tienes que hacer pero no consigues mantenerlo</p></div>
            <div className="whom reveal d4"><span className="chk">✓</span><p>No quieres obsesionarte — quieres que funcione y que dure</p></div>
          </div>
        </div>
      </section>

      {/* PROOF */}
      <section>
        <div className="wrap">
          <div className="head reveal">
            <span className="slabel">Resultados reales</span>
            <h2 className="title">
              Lo que cambió <span className="hl">para ellos</span>
            </h2>
            <p className="lede">Personas normales con vidas ocupadas. Resultados que duran porque el proceso funciona.</p>
          </div>
          <div className="proof-grid">
            <div className="quote reveal d1">
              <span className="qmark">”</span>
              <p>Llegué con 92kg y varios intentos fallidos. En 14 meses bajé 21kg. Lo más sorprendente fue que por primera vez no estaba a dieta. Estaba viviendo.</p>
              <div className="who"><span className="name">Padre de familia, 41 años</span><span className="res">−21 kg / 14 meses</span></div>
            </div>
            <div className="quote reveal d2">
              <span className="qmark">”</span>
              <p>A los 45 me dijeron colesterol alto y tensión límite. En 12 meses perdí 19kg, normalicé los valores y dejé la medicación. Mi médico no se lo creía.</p>
              <div className="who"><span className="name">Hombre, 45 años</span><span className="res">−19 kg</span></div>
            </div>
            <div className="quote reveal d3">
              <span className="qmark">”</span>
              <p>Empecé en 88kg y terminé en 86kg — casi igual en la báscula. Pero la ropa me queda completamente distinta. Nadie se cree que no haya adelgazado más.</p>
              <div className="who"><span className="name">Mujer, 34 años</span><span className="res">Recomposición</span></div>
            </div>
            <div className="quote reveal d4">
              <span className="qmark">”</span>
              <p>Lo que cambió no fue solo mi cuerpo. Cambié yo. Empecé a ir a sitios que antes evitaba, a ponerme ropa que tenía guardada. Eso no te lo da ninguna báscula.</p>
              <div className="who"><span className="name">Mujer, 29 años</span><span className="res">Cambio de vida</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about">
        <div className="wrap">
          <div className="head reveal">
            <span className="slabel">Quién imparte la clase</span>
            <h2 className="title">
              No es una app. <span className="hl">Soy yo.</span>
            </h2>
          </div>
          <div className="about-card reveal d1">
            <div className="avatar">FR</div>
            <div className="about-body">
              <div className="nm">Fernando Royano</div>
              <div className="cr">
                <span className="chip">14 años de experiencia</span>
                <span className="chip">Graduado en Cc. del Deporte</span>
                <span className="chip">+100 clientes reales</span>
              </div>
              <p>No creo en las dietas extremas, ni en entrenar hasta vomitar, ni en la culpa como motor. Creo en planes sensatos, adaptados a tu vida real, que puedas sostener cuando se complica la semana — que es cuando casi todo el mundo lo deja.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="form-sec" id="reservar">
        <div className="wrap">
          <div className="head reveal">
            <span className="slabel">Clase online gratuita</span>
            <h2 className="title">Mira la clase gratis ahora</h2>
          </div>
          <form className="glass form-card reveal d1" onSubmit={onSubmit}>
            <div className="field">
              <label>Nombre</label>
              <input
                type="text"
                placeholder="Tu nombre"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Teléfono</label>
              <input
                type="tel"
                placeholder="+34 600 000 000"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <button className="btn-submit" type="submit" disabled={sending}>
              {sending ? "Accediendo…" : <>Ver la clase gratis <span className="arr">→</span></>}
            </button>
            {error && <p className="formerror">{error}</p>}
            <div className="formnote">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Tus datos están seguros. Sin spam.
            </div>
          </form>
        </div>
      </section>

      <footer>
        <div className="foot-wrap">
          <div className="foot-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logos/WR_AUX_normal_bg.png" alt="WellnessReal" />
            <p>Entrenamiento y nutrición para gente con vida real. Sin extremos, sin perfección. Solo lo que funciona.</p>
            <div className="foot-social">
              <a href="https://www.instagram.com/wellnessrealoficial" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-10.4a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" /></svg>
              </a>
              <a href="https://www.youtube.com/@wellnessreal" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2C0 8.08 0 12 0 12s0 3.92.5 5.8a3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.8zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" /></svg>
              </a>
              <a href="https://www.linkedin.com/in/fernando-royano/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zm1.78 13.02H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" /></svg>
              </a>
            </div>
          </div>

          <div className="foot-col">
            <h4>Explora</h4>
            <a href="https://wellnessreal.es/filosofia">Filosofía</a>
            <a href="https://wellnessreal.es/servicios">Servicios</a>
            <a href="https://wellnessreal.es/tarifas">Tarifas</a>
            <a href="https://wellnessreal.es/blog">Blog</a>
          </div>

          <div className="foot-col">
            <h4>Empieza</h4>
            <a href="https://wellnessreal.es/valoracion">Valoración gratis</a>
            <a href="https://wellnessreal.es/recurso-gratis">Guía gratuita</a>
            <a href="https://wellnessreal.es/caso-real">Caso real</a>
          </div>

          <div className="foot-col">
            <h4>Contacto</h4>
            <a href="mailto:info@wellnessreal.es">info@wellnessreal.es</a>
            <a href="https://wa.me/34633261963" target="_blank" rel="noopener noreferrer">WhatsApp · 633 261 963</a>
            <span style={{ color: "var(--lavender)", fontSize: ".92rem", display: "block", padding: "6px 0" }}>
              Online · Madrid
            </span>
          </div>
        </div>

        <div className="foot-bottom">
          <p>© 2026 WellnessReal · Fitness real para gente con vida real</p>
          <div className="legal">
            <a href="https://wellnessreal.es/privacidad">Privacidad</a>
            <a href="https://wellnessreal.es/terminos">Términos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
