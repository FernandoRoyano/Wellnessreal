"use client";

import { useState } from "react";
import "./cuestionario.css";
import ProgramaTeaser from "@/components/programa/ProgramaTeaser";
import type { Programa } from "@/lib/programa-schema";

interface FormState {
  nombre: string;
  email: string;
  edad: string;
  sexo: string;
  altura_cm: string;
  peso_kg: string;
  objetivo_principal: string;
  objetivos_secundarios: string[];
  dias_semana: string;
  minutos_sesion: string;
  donde_entrena: string;
  material: string;
  experiencia: string;
  lesiones: string;
  consideraciones: string;
  alergias: string;
  preferencias_comida: string;
  estilo_vida: string;
}

const VACIO: FormState = {
  nombre: "", email: "", edad: "", sexo: "", altura_cm: "", peso_kg: "",
  objetivo_principal: "", objetivos_secundarios: [], dias_semana: "", minutos_sesion: "",
  donde_entrena: "", material: "", experiencia: "", lesiones: "", consideraciones: "",
  alergias: "", preferencias_comida: "", estilo_vida: "",
};

const OBJETIVOS = ["Perder grasa", "Ganar músculo", "Recomposición (perder grasa y tonificar)", "Salud y energía", "Rendimiento", "Crear el hábito"];
const SECUNDARIOS = ["Dormir mejor", "Más energía", "Menos dolores", "Ganar fuerza", "Sentirme mejor con mi cuerpo", "Reducir el estrés"];
const SEXO = [["Mujer", "mujer"], ["Hombre", "hombre"], ["Otro", "otro"]];
const DONDE = [["En casa", "casa"], ["Gimnasio", "gimnasio"], ["Ambos", "ambos"]];
const EXPERIENCIA = [["Nunca he entrenado", "nada"], ["Algo de experiencia", "algo"], ["Con experiencia", "experimentado"]];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOTAL = 7;

export default function Cuestionario() {
  const [form, setForm] = useState<FormState>(VACIO);
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [programa, setPrograma] = useState<Programa | null>(null);
  const [verTeaser, setVerTeaser] = useState(false);

  const set = (k: keyof FormState, v: string | string[]) => setForm((f) => ({ ...f, [k]: v }));
  const toggleSecundario = (s: string) =>
    setForm((f) => ({
      ...f,
      objetivos_secundarios: f.objetivos_secundarios.includes(s)
        ? f.objetivos_secundarios.filter((x) => x !== s)
        : [...f.objetivos_secundarios, s],
    }));

  const canAdvance = (): boolean => {
    if (step === 0) return form.nombre.trim().length > 1 && EMAIL_REGEX.test(form.email);
    if (step === 2) return form.objetivo_principal !== "";
    return true;
  };

  const next = () => { setError(""); setStep((s) => Math.min(s + 1, TOTAL - 1)); };
  const back = () => { setError(""); setStep((s) => Math.max(s - 1, 0)); };

  const enviar = async () => {
    setSending(true);
    setError("");
    try {
      const num = (v: string) => (v.trim() === "" ? null : Number(v));
      const res = await fetch("/api/generar-programa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          email: form.email.trim(),
          edad: num(form.edad),
          sexo: form.sexo || null,
          altura_cm: num(form.altura_cm),
          peso_kg: num(form.peso_kg),
          objetivo_principal: form.objetivo_principal,
          objetivos_secundarios: form.objetivos_secundarios,
          dias_semana: num(form.dias_semana),
          minutos_sesion: num(form.minutos_sesion),
          donde_entrena: form.donde_entrena || null,
          material: form.material.trim() || null,
          experiencia: form.experiencia || null,
          lesiones: form.lesiones.trim() || null,
          consideraciones: form.consideraciones.trim() || null,
          alergias: form.alergias.trim() || null,
          preferencias_comida: form.preferencias_comida.trim() || null,
          estilo_vida: form.estilo_vida.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo procesar tu cuestionario.");
      if (data.programa) setPrograma(data.programa as Programa);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al enviar el cuestionario.");
      setSending(false);
    }
  };

  const Logo = () => (
    <a href="https://wellnessreal.es" className="wrq-logo" aria-label="WellnessReal">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logos/WR_AUX_normal_bg.png" alt="WellnessReal" />
    </a>
  );

  // --- Pantalla: generando ---
  if (sending && !done) {
    return (
      <div className="wrq">
        <div className="wrq-center">
          <div className="wrq-center-inner">
            <div className="wrq-spinner" />
            <h1>Estamos preparando <span className="hl">tu plan</span></h1>
            <p>Analizando tus respuestas y diseñando tu programa con el método de Fernando. Esto puede tardar hasta un minuto — no cierres esta ventana.</p>
          </div>
        </div>
      </div>
    );
  }

  // --- Pantalla: teaser del plan (tras pulsar "ver adelanto") ---
  if (done && programa && verTeaser) {
    return <ProgramaTeaser programa={programa} nombre={form.nombre} />;
  }

  // --- Pantalla: gracias ---
  if (done) {
    return (
      <div className="wrq">
        <div className="wrq-center">
          <div className="wrq-center-inner">
            <div className="wrq-badge">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5" /></svg>
            </div>
            <h1>¡Listo, <span className="hl">{form.nombre.split(" ")[0] || "crack"}</span>!</h1>
            {programa ? (
              <>
                <p>Hemos montado tu punto de partida con el método de Fernando. Él lo revisa y lo afináis juntos antes de que empieces — pero ya puedes echarle un vistazo.</p>
                <button type="button" className="wrq-btn primary" onClick={() => setVerTeaser(true)}>
                  Ver el adelanto de tu plan →
                </button>
                <p style={{ marginTop: 18, fontSize: ".88rem" }}>
                  <a href="https://wellnessreal.es/recurso-gratis" style={{ color: "var(--lavender)", textDecoration: "underline" }}>
                    Mientras tanto, descarga la guía gratis
                  </a>
                </p>
              </>
            ) : (
              <>
                <p>Tu plan personalizado se está preparando. Fernando lo revisa personalmente antes de enviártelo — lo recibirás en tu email <strong style={{ color: "var(--cream)" }}>({form.email})</strong> en menos de 24-48h.</p>
                <p>Mientras tanto, ve abriendo hueco en la agenda. Esto va en serio.</p>
                <a href="https://wellnessreal.es/recurso-gratis" className="wrq-btn primary">Descargar la guía gratis</a>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrq">
      <div className="wrq-top">
        <Logo />
        <div className="wrq-progress"><span style={{ width: `${((step + 1) / TOTAL) * 100}%` }} /></div>
        <div className="wrq-step-label">Paso {step + 1} de {TOTAL}</div>
      </div>

      <div className="wrq-body">
        <div className="wrq-card">
          {/* Paso 0 — contacto */}
          {step === 0 && (
            <>
              <span className="wrq-eyebrow"><span className="dot" /> Empezamos</span>
              <h2 className="wrq-title">Vamos a montar <span className="hl">tu plan</span></h2>
              <p className="wrq-help">Responde con sinceridad: cuanto mejor te conozca, mejor será tu plan. Son 2 minutos.</p>
              <div className="wrq-field">
                <label>Tu nombre</label>
                <input type="text" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} placeholder="Tu nombre" autoFocus />
              </div>
              <div className="wrq-field">
                <label>Tu email</label>
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="tu@email.com" />
              </div>
            </>
          )}

          {/* Paso 1 — básicos */}
          {step === 1 && (
            <>
              <span className="wrq-eyebrow"><span className="dot" /> Sobre ti</span>
              <h2 className="wrq-title">Cuatro datos <span className="hl">básicos</span></h2>
              <p className="wrq-help">Para ajustar el punto de partida. Si alguno no lo sabes, déjalo en blanco.</p>
              <div className="wrq-row">
                <div className="wrq-field"><label>Edad</label><input type="number" value={form.edad} onChange={(e) => set("edad", e.target.value)} placeholder="42" /></div>
                <div className="wrq-field">
                  <label>Sexo</label>
                  <div className="wrq-choices">
                    {SEXO.map(([l, v]) => (
                      <button key={v} type="button" className={"wrq-chip" + (form.sexo === v ? " active" : "")} onClick={() => set("sexo", v)}>{l}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="wrq-row">
                <div className="wrq-field"><label>Altura (cm)</label><input type="number" value={form.altura_cm} onChange={(e) => set("altura_cm", e.target.value)} placeholder="168" /></div>
                <div className="wrq-field"><label>Peso (kg)</label><input type="number" value={form.peso_kg} onChange={(e) => set("peso_kg", e.target.value)} placeholder="72" /></div>
              </div>
            </>
          )}

          {/* Paso 2 — objetivo */}
          {step === 2 && (
            <>
              <span className="wrq-eyebrow"><span className="dot" /> Tu objetivo</span>
              <h2 className="wrq-title">¿Qué quieres <span className="hl">conseguir?</span></h2>
              <p className="wrq-help">Elige lo principal. Luego añade lo que también te importe.</p>
              <div className="wrq-field">
                <label>Objetivo principal</label>
                <div className="wrq-choices">
                  {OBJETIVOS.map((o) => (
                    <button key={o} type="button" className={"wrq-chip" + (form.objetivo_principal === o ? " active" : "")} onClick={() => set("objetivo_principal", o)}>{o}</button>
                  ))}
                </div>
              </div>
              <div className="wrq-field">
                <label>También me importa (opcional)</label>
                <div className="wrq-choices">
                  {SECUNDARIOS.map((s) => (
                    <button key={s} type="button" className={"wrq-chip" + (form.objetivos_secundarios.includes(s) ? " active" : "")} onClick={() => toggleSecundario(s)}>{s}</button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Paso 3 — disponibilidad */}
          {step === 3 && (
            <>
              <span className="wrq-eyebrow"><span className="dot" /> Tu disponibilidad</span>
              <h2 className="wrq-title">¿Cuánto y <span className="hl">dónde?</span></h2>
              <p className="wrq-help">Sé realista con tu vida actual. El plan se adapta a esto.</p>
              <div className="wrq-field">
                <label>Días que puedes entrenar/semana</label>
                <div className="wrq-choices">
                  {["2", "3", "4", "5"].map((d) => (
                    <button key={d} type="button" className={"wrq-chip" + (form.dias_semana === d ? " active" : "")} onClick={() => set("dias_semana", d)}>{d} días</button>
                  ))}
                </div>
              </div>
              <div className="wrq-field">
                <label>Minutos por sesión</label>
                <div className="wrq-choices">
                  {["30", "45", "60", "75"].map((m) => (
                    <button key={m} type="button" className={"wrq-chip" + (form.minutos_sesion === m ? " active" : "")} onClick={() => set("minutos_sesion", m)}>{m} min</button>
                  ))}
                </div>
              </div>
              <div className="wrq-field">
                <label>¿Dónde entrenas?</label>
                <div className="wrq-choices">
                  {DONDE.map(([l, v]) => (
                    <button key={v} type="button" className={"wrq-chip" + (form.donde_entrena === v ? " active" : "")} onClick={() => set("donde_entrena", v)}>{l}</button>
                  ))}
                </div>
              </div>
              <div className="wrq-field">
                <label>Material disponible</label>
                <input type="text" value={form.material} onChange={(e) => set("material", e.target.value)} placeholder="Ej: un par de mancuernas y una banda elástica" />
              </div>
            </>
          )}

          {/* Paso 4 — experiencia y salud */}
          {step === 4 && (
            <>
              <span className="wrq-eyebrow"><span className="dot" /> Experiencia y salud</span>
              <h2 className="wrq-title">Para entrenar <span className="hl">seguro</span></h2>
              <p className="wrq-help">Esto es clave para adaptar los ejercicios a ti.</p>
              <div className="wrq-field">
                <label>Tu experiencia entrenando</label>
                <div className="wrq-choices">
                  {EXPERIENCIA.map(([l, v]) => (
                    <button key={v} type="button" className={"wrq-chip" + (form.experiencia === v ? " active" : "")} onClick={() => set("experiencia", v)}>{l}</button>
                  ))}
                </div>
              </div>
              <div className="wrq-field">
                <label>Lesiones o molestias (opcional)</label>
                <input type="text" value={form.lesiones} onChange={(e) => set("lesiones", e.target.value)} placeholder="Ej: molestia en el hombro derecho" />
              </div>
              <div className="wrq-field">
                <label>Otras consideraciones de salud (opcional)</label>
                <input type="text" value={form.consideraciones} onChange={(e) => set("consideraciones", e.target.value)} placeholder="Ej: tensión alta, embarazo, etc." />
              </div>
            </>
          )}

          {/* Paso 5 — alimentación y vida */}
          {step === 5 && (
            <>
              <span className="wrq-eyebrow"><span className="dot" /> Alimentación y vida</span>
              <h2 className="wrq-title">Lo último, <span className="hl">tu día a día</span></h2>
              <p className="wrq-help">Para que el plan encaje en tu vida, no al revés.</p>
              <div className="wrq-field">
                <label>Alergias o intolerancias (opcional)</label>
                <input type="text" value={form.alergias} onChange={(e) => set("alergias", e.target.value)} placeholder="Ej: lactosa, frutos secos" />
              </div>
              <div className="wrq-field">
                <label>Preferencias de comida (opcional)</label>
                <input type="text" value={form.preferencias_comida} onChange={(e) => set("preferencias_comida", e.target.value)} placeholder="Ej: vegetariana, no me gusta el pescado" />
              </div>
              <div className="wrq-field">
                <label>Tu estilo de vida (opcional)</label>
                <textarea value={form.estilo_vida} onChange={(e) => set("estilo_vida", e.target.value)} placeholder="Trabajo, turnos, hijos, nivel de estrés, cómo duermes..." />
              </div>
            </>
          )}

          {/* Paso 6 — repaso y envío */}
          {step === 6 && (
            <>
              <span className="wrq-eyebrow"><span className="dot" /> Último paso</span>
              <h2 className="wrq-title">Todo listo, <span className="hl">{form.nombre.split(" ")[0] || ""}</span></h2>
              <p className="wrq-help">
                Con esto generamos tu plan: <strong style={{ color: "var(--cream)" }}>{form.objetivo_principal}</strong>
                {form.dias_semana ? `, ${form.dias_semana} días/semana` : ""}
                {form.donde_entrena ? `, ${form.donde_entrena}` : ""}.
                Fernando lo revisa antes de enviártelo.
              </p>
              <p className="wrq-help" style={{ fontSize: ".85rem" }}>
                Al enviar aceptas que tratemos tus datos para preparar tu plan, según nuestra{" "}
                <a href="https://wellnessreal.es/privacidad" style={{ color: "var(--yellow)" }}>política de privacidad</a>.
                Tus datos de salud se tratan con confidencialidad.
              </p>
            </>
          )}

          {error && <p className="wrq-error">{error}</p>}

          <div className="wrq-nav">
            {step > 0 && <button type="button" className="wrq-btn ghost" onClick={back}>Atrás</button>}
            {step < TOTAL - 1 ? (
              <button type="button" className="wrq-btn primary" onClick={next} disabled={!canAdvance()}>
                Siguiente →
              </button>
            ) : (
              <button type="button" className="wrq-btn primary" onClick={enviar} disabled={sending}>
                Generar mi plan →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
