# Secuencia de bienvenida — Lead de tiroides
### WellnessReal · para **MailerLite**

> Adaptación del borrador original (escrito "para Mailrelay"): la plataforma real es MailerLite.
> El grupo **tiroides** ya existe (id `192432978790450886`) y la landing `/tiroides` mete ahí a cada suscriptor automáticamente.

---

## ⚠️ Antes de empezar (prerrequisitos, una sola vez)

1. **Verificar el dominio en MailerLite** — Settings → **Domains** → autenticar `wellnessreal.es` (DKIM/SPF). Sin esto la automatización **no envía**. (Estaba pendiente en junio.)
2. El builder de automatizaciones está incluido en el plan gratis (lo que es solo Premium es crear contenido por API — por eso esta secuencia se monta a mano en la web, ~10 min).

---

## 🔀 Cambio importante respecto al borrador: el email 1 ya está enviado

El backend de la web envía **ya en producción** un email transaccional inmediato con el enlace a la guía (`tiroides.pdf`) en cada alta, y ahora incluye el mensaje del email 1 ("no estás rota, tu tiroides va lenta…" + la PD del médico). Si la automatización de MailerLite también enviara el email 1, el lead recibiría **dos correos casi idénticos en el minuto 1**.

**Por tanto: la automatización de MailerLite tiene 4 emails y empieza en el día 2.** La entrega de la guía queda garantizada por el transaccional (no depende de la verificación de MailerLite).

---

## Cómo montarla en MailerLite (paso a paso)

1. **Automations** → **Create workflow**.
2. **Trigger:** "When a subscriber joins a group" → grupo **tiroides**.
3. Añadir bloques en este orden: `Delay 2 días` → `Email 2` → `Delay 2 días` → `Email 3` → `Delay 2 días` → `Email 4` → `Delay 2 días` → `Email 5`.
4. **Remitente de cada email:** *Fer · WellnessReal* — `info@wellnessreal.es` (nombre de persona, no de marca — se abre más).
5. **Personalización:** en MailerLite el nombre es `{$name}` (nuestro formulario siempre lo envía, pero al insertar el campo en el editor configura un valor por defecto por si acaso, p. ej. vacío → "Hola,").
6. **Pie legal:** MailerLite añade el enlace de baja automáticamente. Añade a mano en todos: *"Esta información es general y no sustituye el consejo de tu médico."*
7. **Asuntos A/B:** el test A/B de asuntos dentro de automatizaciones puede no estar en el plan gratis; si no te deja, usa el asunto A y apunta el B para probarlo más adelante.

**Calendario resultante:**

| Email | Cuándo | Objetivo | Quién lo envía |
|---|---|---|---|
| Entrega (ex-email 1) | Inmediato | Guía + bienvenida + tono | **Backend web** (ya en vivo) |
| 2 | Día 2 | Conexión: por qué esto importa | MailerLite |
| 3 | Día 4 | Valor puro (la báscula) | MailerLite |
| 4 | Día 6 | Prueba social + por qué la guía sola no basta | MailerLite |
| 5 | Día 8 | La invitación (valoración) | MailerLite |

---

## ✉️ Email 2 — Día 2 · Por qué esto importa

**🎯 Objetivo:** conexión emocional + autoridad empática.

**Asunto A:** «No soy vaga, estoy agotada»
**Asunto B:** Lo que nadie te explicó sobre tu tiroides
**Preview:** Y por qué me tomo esto tan en serio.

**Cuerpo:**

Hola {$name},

¿Pudiste echarle un ojo a la guía? Si es así, ya sabes algo que a casi nadie le explican: que con la tiroides lenta el cuerpo va con el freno puesto… y que eso tiene solución.

Te cuento por qué me importa tanto.

> ⚠️ **[HUECO PARA FER — 1–2 frases tuyas, REALES: por qué trabajas con este perfil, qué te llevó a especializarte en esto. Cuéntalo con tu verdad, aunque sea sencillo.]**

Veo llegar a mujeres convencidas de que son "vagas" o que "no tienen fuerza de voluntad", cuando lo único que pasa es que nadie les explicó cómo funciona su cuerpo. Y cuando lo entienden, todo cambia.

No es magia. Es entender tu contexto y entrenar y comer en consecuencia. Justo lo que empieza en esa guía.

En un par de días te mando algo muy concreto: el error nº1 que casi todas cometéis con la báscula.

Un abrazo,
**Fer**

*Esta información es general y no sustituye el consejo de tu médico.*

---

## ✉️ Email 3 — Día 4 · Valor puro (la báscula)

**🎯 Objetivo:** regalar valor útil y demostrar criterio (sin pedir nada).

**Asunto A:** La báscula te está mintiendo
**Asunto B:** Subes 2 kg en 3 días (y no es grasa)
**Preview:** Deja de dejar que un número te arruine el día.

**Cuerpo:**

Hola {$name},

Un regalo rápido que te va a ahorrar disgustos.

Si te subes a la báscula y ves 2 kg más que hace tres días: respira. Es **imposible** que sea grasa. Ganar 2 kg de grasa real cuesta semanas de comer muchísimo de más. En 3 días, lo que sube es **agua** — sal, hidratos, hormonas, la regla, el estrés. Y con la tiroides lenta, que retiene líquido de serie, esto te pasa todavía más.

Estás midiendo con la herramienta equivocada. Fíjate mejor en esto:

- Cómo te queda la ropa
- La cintura, con una cinta métrica
- La fuerza que levantas
- Tu energía a media tarde
- La tendencia del mes, no el número del día

Guárdate este correo para el próximo día que la báscula te quiera hundir la mañana.

Un abrazo,
**Fer**

*Esta información es general y no sustituye el consejo de tu médico.*

---

## ✉️ Email 4 — Día 6 · Prueba social + por qué la guía sola no basta

**🎯 Objetivo:** prueba real + sembrar que la información genérica no es suficiente.

**⚠️ IMPORTANTE:** rellena el bloque con un **caso REAL** tuyo. No inventes resultados ni nombres. Si aún no tienes un caso de tiroides, usa uno de recomposición 35+ y sé honesto ("una clienta parecida a ti").

**Asunto A:** «Llevaba años estancada»
**Asunto B:** Por qué la guía sola no basta (te lo digo claro)
**Preview:** Y qué marcó de verdad la diferencia.

**Cuerpo:**

Hola {$name},

Te voy a ser honesto, porque va con mi forma de trabajar: esa guía está muy bien… pero una guía es genérica. Y tú no eres genérica.

> ⚠️ **[HUECO PARA FER — CASO REAL, ejemplo de estructura, cámbialo por el tuyo:**
> *"Hace poco empezó conmigo [inicial], con hipotiroidismo, convencida de que su cuerpo 'ya no daba para más'. En [X semanas] lo que cambió no fue solo la báscula: recuperó energía, ganó fuerza y volvió a ponerse ropa que tenía guardada."*]**

La diferencia no fue ninguna dieta secreta. Fue aplicar lo básico a **su** vida: su horario, su energía, su punto de partida. Y ajustar sobre la marcha cuando algo no encajaba.

Eso es lo que una guía, por buena que sea, no puede hacer sola. Pero juntos, sí.

Mañana te cuento cómo, por si quieres dar el paso.

Un abrazo,
**Fer**

*Esta información es general y no sustituye el consejo de tu médico.*

---

## ✉️ Email 5 — Día 8 · La invitación

**🎯 Objetivo:** CTA claro a la valoración. Directo pero sin presión.

**Asunto A:** ¿Lo hacemos juntos?
**Asunto B:** Tu siguiente paso (sin compromiso)
**Preview:** Una charla, sin venderte nada raro.

**Cuerpo:**

Hola {$name},

Estos días te he dado lo que sé sin pedirte nada a cambio. Ahora sí te propongo algo.

Si te has sentido identificada en todo esto y quieres dejar de dar vueltas sola, tengo un programa que se llama **Método BASE**: 12 semanas para adultos que ya lo intentan y no avanzan, con entrenamiento y alimentación adaptados a ti y seguimiento real. Sin milagros.

El primer paso **no es pagar nada**. Es una **valoración gratuita**: hablamos de tu caso, te digo con honestidad si te puedo ayudar y cómo sería. Y si no encajas, también te lo digo.

👉 **https://wellnessreal.es/valoracion**

Sin prisa y sin compromiso. Pero si llevas años esperando el momento… puede que sea este.

Un abrazo,
**Fer**

*PD: si tienes cualquier duda, responde a este correo. Lo leo yo.*

*Esta información es general y no sustituye el consejo de tu médico.*

---

## Después de la secuencia

- Quien **no agende**, se queda en el grupo general de la newsletter (contenido de valor cada semana). No lo pierdas: siguen calientes, solo necesitan más tiempo.
- Quien **agende**, sale de esta secuencia (en MailerLite: condición o mover de grupo) y entra en tu proceso de venta / onboarding.
- **Revisa a las 2 semanas:** ¿qué asunto se abre más (A o B)? Quédate el ganador. ¿En qué correo se caen? Ahí está tu punto flojo.

## Enlaces de referencia

- Guía (PDF directo): `https://wellnessreal.es/tiroides.pdf`
- Landing: `https://wellnessreal.es/tiroides`
- Valoración: `https://wellnessreal.es/valoracion`
- Grupo MailerLite: **tiroides** (id `192432978790450886`)
