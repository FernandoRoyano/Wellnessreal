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

interface Session {
  value: string;
  label: string;
  spots: number;
}

// Sesiones evergreen: se generan automáticamente a partir de "ahora", así que
// nunca caducan ni hay que mantenerlas a mano.
function buildSessions(now: Date): Session[] {
  const HORAS = [11, 19];
  const SPOTS = [9, 14, 21];
  const slots: Date[] = [];
  for (let day = 0; day < 5 && slots.length < 3; day++) {
    for (const h of HORAS) {
      const s = new Date(now);
      s.setDate(now.getDate() + day);
      s.setHours(h, 0, 0, 0);
      if (s.getTime() > now.getTime() + 20 * 60 * 1000) slots.push(s);
    }
  }
  const cap = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  const fmtDay = (d: Date) => {
    const t0 = new Date(now); t0.setHours(0, 0, 0, 0);
    const t1 = new Date(d); t1.setHours(0, 0, 0, 0);
    const diff = Math.round((t1.getTime() - t0.getTime()) / 86400000);
    if (diff === 0) return "Hoy";
    if (diff === 1) return "Mañana";
    return cap(d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short" }));
  };
  const fmtHora = (d: Date) => d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  return slots.slice(0, 3).map((d, i) => ({
    value: d.toISOString(),
    label: `${fmtDay(d)} · ${fmtHora(d)}h`,
    spots: SPOTS[i] ?? 12,
  }));
}

export default function WebinarLanding() {
  const router = useRouter();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", session: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Sesiones calculadas solo en cliente (evita desajuste de hidratación con la fecha)
  useEffect(() => {
    const s = buildSessions(new Date());
    setSessions(s);
    setForm((f) => (f.session ? f : { ...f, session: s[0]?.value ?? "" }));
  }, []);

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
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.session) {
      setError("Completa todos los campos y elige una sesión.");
      return;
    }
    setSending(true);
    try {
      const { getAttributionForSubmit } = await import("@/lib/tracking");
      const sessionLabel = sessions.find((s) => s.value === form.session)?.label ?? "";
      const res = await fetch("/api/webinar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          session: form.session,
          sessionLabel,
          _attribution: getAttributionForSubmit(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo reservar tu plaza.");
      router.push("/webinar/gracias");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al reservar tu plaza.");
      setSending(false);
    }
  };

  return (
    <div className="wrlp">
      <div className="progress" id="wr-progress" />

      <nav id="wr-nav" className="hero-mode">
        <div className="logo">
          <b>Wellness</b>
          <span className="mark">Real</span>
        </div>
        <button className="nav-cta" onClick={goReserve}>
          Reservar plaza gratis
        </button>
      </nav>

      {/* HERO */}
      <header className="hero">
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
            Descubre por qué el entrenamiento genérico deja de funcionar a partir
            de los 35 — y el sistema que usan mis clientes para transformar su
            composición corporal sin dietas extremas ni obsesión.
          </p>

          <div className="glass sessions">
            <div className="lab">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              Próximas sesiones
            </div>
            {(sessions.length ? sessions : [null, null, null]).map((s, i) => (
              <div className="srow" key={i}>
                <span className="dot" />
                <span className="t">{s ? s.label : "Cargando…"}</span>
                {s && <span className="spots"><b>{s.spots}</b> plazas</span>}
              </div>
            ))}
          </div>

          <button className="btn-primary" onClick={goReserve}>
            Reservar mi plaza gratis <span className="arr">→</span>
          </button>
          <p className="micro">Sin tarjeta · 100% online · Respondo personalmente</p>
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
              <h3>Por qué tu cuerpo cambió</h3>
              <p>Cómo responde tu metabolismo a partir de los 35 y por qué lo que funcionaba antes ya no funciona.</p>
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
            <div className="whom reveal d2"><span className="chk">✓</span><p>Tu cuerpo ya no responde igual que con 25 años</p></div>
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
            <span className="slabel">Últimas plazas disponibles</span>
            <h2 className="title">Reserva tu plaza gratis</h2>
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
            <div className="field">
              <label>Elige sesión</label>
              <select
                value={form.session}
                onChange={(e) => setForm({ ...form, session: e.target.value })}
              >
                {!sessions.length && <option value="">Cargando sesiones…</option>}
                {sessions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label} ({s.spots} plazas)
                  </option>
                ))}
              </select>
            </div>
            <button className="btn-submit" type="submit" disabled={sending}>
              {sending ? "Reservando…" : <>Reservar mi plaza gratis <span className="arr">→</span></>}
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
        <div className="logo">
          <b>Wellness</b>
          <span className="mark">Real</span>
        </div>
        <div className="links">
          <a href="https://wellnessreal.es/filosofia">Filosofía</a>
          <a href="https://wellnessreal.es/servicios">Servicios</a>
          <a href="https://wellnessreal.es/blog">Blog</a>
          <a href="https://wellnessreal.es/privacidad">Privacidad</a>
        </div>
        <p className="copy">© 2026 WellnessReal · info@wellnessreal.es · Madrid</p>
      </footer>
    </div>
  );
}
