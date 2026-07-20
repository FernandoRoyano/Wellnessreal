export interface Guion {
  slug: string
  title: string
  subtitle: string
  duration: string
  wordCount: number
  purpose: string
  status: 'draft' | 'ready' | 'recorded'
  lastUpdated: string
  content: string
}

export const guiones: Guion[] = [
  {
    slug: 'comunidad-tiroides-quien-soy',
    title: 'Comunidad Tiroides — Quién soy',
    subtitle: 'Vídeo de bienvenida de la lección 2 de "Empieza aquí". Construye la confianza personal que hace posible que después alguien pague por el plan revisado a mano.',
    duration: '2:30 — 3:00 min',
    wordCount: 420,
    purpose: 'Que la miembro nueva te ponga cara y te crea. Angulo honesto: NO tienes tiroides y lo dices de frente; tu diferencial es la PRECISION (instrucciones ejecutables) frente a los titulares de internet. No se vende nada en este video.',
    status: 'draft',
    lastUpdated: '2026-07-20',
    content: `# 🎬 Guion — Comunidad Tiroides · "Quién soy"

**~2:30-3:00 min · ~420 palabras · 150 palabras/min**

## Notas de lectura
- // = pausa corta (respirar)
- /// = pausa larga (dejar calar)
- **negrita** = énfasis al hablar
- *cursiva* = tono más bajo, confidente

## Objetivo
Que te ponga cara y te crea. Nada más. **No se vende nada aquí.**
La venta llega tres días después, en otra lección. Si intentas vender en este vídeo, quemas la confianza.

## Tono
Mirando a cámara, sentado, sin música. Como si se lo contaras a una clienta en la primera sesión.
Natural. Si te trabas, mejor: parece humano.

---

## 🎬 00:00 — Lo que NO soy (40 seg)

Hola. // Soy Fernando. ///

Y voy a empezar por donde casi nadie empieza: // por lo que **no** soy.

*Yo no tengo hipotiroidismo.* // No he pasado por lo que estás pasando tú. // Y no te voy a decir eso de "sé cómo te sientes" // porque sería mentira. // Y creo que ya te han mentido bastante. ///

Tampoco soy tu endocrino. // De tu medicación y de tu analítica no te voy a decir ni una palabra. // Eso es de tu médico. // Punto.

---

## 🎬 00:40 — Lo que sí (40 seg)

¿Y entonces qué hago yo aquí? ///

Soy graduado en Ciencias del Deporte // y llevo **catorce años** entrenando a gente. // Han pasado por mis manos más de cien personas. // Y muchas de ellas // mujeres con la tiroides lenta // que llegaban diciéndome exactamente la misma frase: ///

*"Ya no sé qué más probar."* ///

Lo que yo aporto no es empatía de haberlo vivido. // Es otra cosa. // Y creo que es justo la que te falta.

**Precisión.**

---

## 🎬 01:20 — Qué es precisión (60 seg)

Te explico a qué me refiero. ///

Internet está lleno de consejos que **no se pueden ejecutar**. //

"Come más proteína." // ¿Cuánta? ¿En qué comida? ¿Cómo lo mido sin volverme loca pesando? //

"Haz fuerza." // ¿Cuántos días? ¿Cuántas series? ¿Con cuánto peso? // ¿Y qué hago el día que me duele el hombro? //

"Descansa mejor." // Ya. // *¿Cómo?* ///

Eso no son consejos. // Son **titulares**. // Y con titulares no se cambia un cuerpo. ///

Mi trabajo es coger todo eso // y convertirlo en instrucciones que puedas ejecutar mañana por la mañana sin pensar. // Qué comes. // Cuánto. // Qué ejercicio. // Cuántas repeticiones. // Qué haces el día que no llegas. // Y qué cambiamos cuando llevas tres semanas sin ver nada.

---

## 🎬 02:20 — Por qué esta comunidad (30 seg)

Monté esto por una razón muy concreta. //

Cuando busqué información decente para mis clientas con tiroides // me encontré un pantano. // Suplementos milagro. // Dietas sin gluten "para curar el Hashimoto". // Gente vendiendo humo a personas que lo están pasando mal. ///

Aquí no va a haber nada de eso. // La información va a ser honesta // y va a ser concreta. // Aunque a veces la respuesta honesta // sea bastante más aburrida que la del vendedor de milagros. ///

Nos vemos dentro.

---

## ✅ Checklist antes de grabar
- [ ] Luz de frente (ventana), no a la espalda.
- [ ] Móvil a la altura de los ojos, horizontal.
- [ ] Micro de auriculares mejor que el del móvil.
- [ ] **No leas de corrido**: mírate el guion por bloques y cuéntalo.
- [ ] Al terminar: subir a YouTube como **"No listado"** y pegar el enlace en la lección con el botón ▶️.`,
  },
  {
    slug: 'metodo-base-explicativo',
    title: 'Método BASE — Guion explicativo',
    subtitle: 'Vídeo/clase que explica en qué consiste el programa: los 5 pilares, qué recibes exactamente, precio honesto y flujo cuestionario → plan → seguimiento.',
    duration: '13:30 — 14:30 min',
    wordCount: 2390,
    purpose: 'Explicar el Metodo BASE por dentro (no venderlo en 60s). Para web /metodo, la clase del embudo o un vídeo de YouTube. El espectador termina entendiendo QUÉ es el programa, en qué se basa y cómo se trabaja.',
    status: 'draft',
    lastUpdated: '2026-06-26',
    content: `# 🎬 Guion explicativo — Método BASE
**~10-12 minutos · ~1.980 palabras · 150 palabras/min**

## Notas de lectura
- // = pausa corta (respirar)
- /// = pausa larga (dejar calar)
- **negrita** = énfasis al hablar
- *cursiva* = tono más bajo, confidente

## Objetivo del guion
Que la persona termine entendiendo QUÉ es el Método BASE, sobre qué se construye y cómo se trabaja. No es un anuncio. Es la explicación honesta del programa por dentro.

---

## 🎬 00:00 — Qué es esto (45 seg)

Voy a explicarte qué es el Método BASE. // Sin humo y sin tecnicismos. // Para que cuando termines este vídeo sepas exactamente **en qué consiste** y decidas tú si encaja contigo.

///

El Método BASE es la forma en la que entreno y alimento a las personas que vienen a WellnessReal. // No es una rutina suelta // ni una dieta. // Es un **sistema** // pensado para gente real: // con trabajo, // con familia, // con poco tiempo // y, casi siempre, // con más de 35 años a la espalda.

El nombre lo dice todo: // antes de buscar resultados espectaculares, // **construimos la base.** // Porque sin base, // todo lo que montas encima // se cae.

---

## 🎬 00:45 — Por qué a partir de los 35 cambia todo (1:30 min)

Empecemos por el porqué. //

A los 20 podías hacer cualquier barbaridad // y tu cuerpo lo aguantaba. // Dormías poco, // comías regular, // entrenabas a lo loco // y aun así estabas bien.

///

A partir de los 35 // las reglas cambian. // Recuperas más lento. // Pierdes músculo si no lo trabajas. // El estrés y el mal descanso // te pasan factura de verdad. //

Y aquí está el error que comete casi todo el mundo: // intentar ponerse en forma // **como cuando tenía 20.** // Más cardio, // menos comida, // rutinas eternas. //

Eso no falla porque te falte disciplina. // Falla porque **ya no es la herramienta adecuada** // para tu cuerpo // ni para tu vida de ahora.

El Método BASE parte de ahí: // de entender cómo funciona tu cuerpo **hoy** // y trabajar con eso, // no contra eso.

---

## 🎬 02:15 — Los 5 pilares (3 min)

El método se construye sobre **cinco pilares**, // y van en este orden por una razón. //

///

**Pilar uno: contexto.** // Antes de tocar nada, // entiendes por qué tu cuerpo responde distinto. // Por qué la dieta que le funcionó a tu cuñado // a ti no. // Por qué recuperar músculo a los 45 // es la mejor inversión que puedes hacer. // Cuando entiendes el porqué, // dejas de saltar de moda en moda.

///

**Pilar dos: composición corporal.** // El objetivo no es *"adelgazar"*. // Es **cambiar grasa por músculo.** // Y eso es clave, // porque puedes verte mejor, // tener más fuerza // y usar una talla menos // aunque la báscula apenas se mueva. // La báscula // deja de ser el centro de tu vida.

///

**Pilar tres: energía y salud.** // El proceso tiene que dejarte **mejor**, // no destrozado. // Si un plan te deja sin fuerzas, // de mal humor // y muerto de hambre, // es un mal plan, // por mucho que adelgaces. // Aquí cuidamos que entrenes con energía // y termines el día entero, // no arrastrándote.

///

**Pilar cuatro: hábitos sostenibles.** // No te pido que cambies tu vida entera el lunes. // Empezamos con **dos o tres hábitos base** // y los asentamos antes de añadir más. // Esto es lo que separa // a quien lo mantiene un año // de quien lo deja en tres semanas. // Sistema, // no fuerza de voluntad.

///

**Pilar cinco: rendimiento como consecuencia.** // Cuando los cuatro pilares de abajo están puestos, // el rendimiento // llega solo. // Levantas más, // te cansas menos, // te ves mejor. // Pero llega **como resultado** de haber construido bien, // no como una meta a la que te tiras de cabeza el primer día.

///

Fíjate en el orden: // contexto, // composición, // energía, // hábitos // y luego rendimiento. // La mayoría de programas empiezan por el último // y se saltan los cuatro primeros. // Por eso fracasan.

---

## 🎬 05:15 — Cómo es el entrenamiento (2 min)

Vamos a lo práctico. // ¿Cómo se entrena en BASE? //

Lo primero: // entrenas **los días que de verdad puedes.** // Si son dos, // montamos dos. // Si son cuatro, // cuatro. // No te diseño un plan de seis días // sabiendo que vas a fallar el tercero. //

///

Trabajamos con **ejercicios básicos** // — los de toda la vida — // sentadilla, // peso muerto, // empujes, // remos. // Movimientos que dan resultado de verdad, // no inventos de Instagram. // Y cada ejercicio // lleva **una alternativa**, // por si tienes una lesión, // te falta material // o no llegas a esa postura. //

///

Entrenamos **fuertes pero con cabeza.** // Dejando un par de repeticiones en reserva, // sin llegar al fallo cada serie, // sin machacarte. // Y progresamos despacio y seguro: // primero sumas repeticiones, // luego subes el peso. //

El objetivo es que abras el plan // y sepas **exactamente qué hacer hoy**: // qué ejercicio, // cuántas series, // cuántas repeticiones // y con qué alternativa si algo no encaja. // Sin agobios. // Sin sesiones de dos horas.

---

## 🎬 07:15 — Cómo es la nutrición (1:45 min)

La nutrición sigue la misma filosofía: // sencilla // y sostenible. //

Aquí **no se pesa la comida** // ni se cuentan calorías. // Se mide **con la mano.** //

La palma // es tu proteína // — y es la prioridad en cada comida. // El puño // es la verdura, // medio plato. // La mano ahuecada // es el carbohidrato, // más en los días que entrenas. // Y el pulgar // es la grasa. //

///

Las reglas son cuatro, // en orden: // proteína en cada comida, // medio plato de verdura, // ajustar el carbohidrato al día // y // **cero alimentos prohibidos.** //

Lo repito porque es importante: // **nada está prohibido.** // No eliminamos el pan, // ni la pasta, // ni el día de comer fuera. // El carbohidrato no se quita // — te ayuda a entrenar // y a conservar el músculo. //

Es comida normal, // de tu vida real, // organizada con cabeza. // Para que lo puedas mantener // de viaje, // con turnos // o cenando fuera un sábado.

---

## 🎬 09:00 — Cómo se mide el progreso (1 min)

Y ahora lo que casi nadie te cuenta: // **cómo medimos si funciona.** //

No miramos solo el peso. // El peso engaña // — sube y baja por agua, // por sal, // por mil cosas. //

///

Miramos la **tendencia** del peso a lo largo de la semana, // no el dato de un día. // Miramos las **medidas**, // sobre todo la cintura. // Cómo te queda la **ropa**. // Tu **energía** y tu **descanso**, // del uno al diez. // Y tu **adherencia**: // cuánto del plan estás cumpliendo de verdad. //

La regla de oro: // puedes bajar una talla // sin que la báscula casi se mueva. // Y eso // **es ganar.**

---

## 🎬 10:00 — Cómo funciona en la práctica (1:15 min)

Te resumo cómo se pone todo esto en marcha. //

**Uno:** // rellenas un cuestionario. // Tu objetivo, // tu edad, // los días que tienes, // dónde entrenas, // qué material, // tus lesiones, // tu alimentación // y tu estilo de vida. //

**Dos:** // con eso se genera un programa **adaptado a ti** // — entrenamiento, // nutrición por raciones // y sistema de seguimiento. // No una plantilla con tu nombre puesto. // Un plan para tu caso. //

**Tres:** // antes de que te llegue, // **lo reviso yo personalmente.** // No te mando nada automático sin mirarlo. //

**Cuatro:** // entrenas, // comes // y cada semana revisamos cómo vas // y **ajustamos** lo que haga falta. // Si tienes una mala semana, // bajamos. // Si avanzas rápido, // subimos. // El plan se adapta a tu vida, // no al revés.

---

## 🎬 11:15 — Qué recibes exactamente (1:15 min)

Para que veas que esto no es un PDF genérico, // te detallo **qué llega a tus manos.** //

Recibes tu **programa de entrenamiento completo**: // los días que entrenas, // cada ejercicio con sus series y repeticiones, // explicado // y con su alternativa por si tienes una lesión o te falta material. // Sabes exactamente qué hacer al abrirlo. //

///

Recibes tu **guía de nutrición por raciones**: // qué comer, // cuánto, // medido con la mano, // adaptada a tus gustos, // tus alergias // y tu horario real. // Sin pesar nada, // sin contar calorías. //

Recibes un **sistema de seguimiento** // para medir lo que de verdad importa // — cintura, energía, descanso, fuerza, adherencia — // no solo la báscula. //

///

Y lo más importante: // **no es un plan automático.** // Lo genera el sistema con tus datos, // **pero lo reviso yo, persona a persona, antes de enviártelo.** // Ajusto lo que haga falta // para que cuando te llegue // sea un plan que yo firmo. //

Eso es lo que recibes. // Concreto, // tuyo // y revisado.

---

## 🎬 12:30 — Hablemos claro del precio (1 min)

Y ahora te hablo claro, // porque odio la letra pequeña. //

Esto **no es gratis.** // Y prefiero decírtelo a la cara antes que sorprenderte luego. //

Crear tu plan lleva trabajo: // la tecnología que lo genera a tu medida, // y sobre todo **mi tiempo revisándolo y ajustándolo** uno a uno. // Yo no regalo mi trabajo // ni te voy a vender que esto sale de la nada. //

///

Lo que sí te garantizo // es que sabes **exactamente** lo que recibes a cambio: // un programa completo, // personalizado, // revisado por mí // y con seguimiento semanal para ajustarlo según avanzas. // No pagas por un archivo. // Pagas por **tener a alguien detrás** que se asegura de que funcione. //

Trabajar conmigo arranca **desde ciento cincuenta euros al mes**, // y según el tiempo de compromiso // el precio mensual baja. // Toda la info, // sin trucos, // está en la página de tarifas. //

Cero permanencia. // Cero "oferta por tiempo limitado". // Si encajamos, empezamos. // Si no, cada uno a lo suyo.

---

## 🎬 13:30 — Para quién es y cierre (45 seg)

¿Para quién es el Método BASE? //

Para ti // si tienes más de 35, // poco tiempo, // y estás cansado de empezar de cero cada lunes. // Si quieres perder grasa, // ganar fuerza // y recuperar energía // **sin** dietas extremas, // sin rutinas imposibles // y sin vivir pendiente de la báscula. //

///

No es para quien busca perder quince kilos en dos meses. // Eso ni funciona // ni se sostiene. // Aquí construimos algo que **se queda.** //

Si te encaja, // el primer paso es el cuestionario. // Lo rellenas, // yo reviso tu caso // y vemos si esto es para ti. //

Sin humo. // Sin extremos. // Con una base // que puedas sostener.

---

# 🎥 DIRECCIÓN DE GRABACIÓN

> No es solo leerlo a cámara. La regla: hablas TÚ a cámara como base, y encima vamos montando recursos (B-roll, rótulos, pantallas) que ilustran lo que dices. Cada vez que aparece algo concreto (un pilar, las raciones, el cuestionario), se VE en pantalla mientras lo cuentas.

## Setup general
- **Plano base:** medio (de cintura para arriba), cámara a la altura de tus ojos, tú ligeramente descentrado (regla de tercios) para dejar aire donde meter rótulos.
- **Fondo:** tu espacio real de entreno o un fondo limpio con profundidad (nada de pared plana pegada). Que se respire "entrenador real", no "set de infoproductor".
- **Luz:** principal suave de frente-lateral + algo de luz de fondo para separarte. Natural de ventana vale si es estable.
- **Audio:** micro de solapa o de cañón. El audio importa MÁS que la cámara. Sin eco.
- **Vestuario:** ropa de entreno tuya, sobria, sin logos llamativos. Coherente con la marca (oscuros + acento).
- **Energía base:** cercano y tranquilo, no presentador. Hablas como si se lo explicaras a un cliente sentado enfrente, no a una multitud.

## Claves de interpretación (cómo decirlo)
- \`//\` = micro-pausa, respira. \`///\` = paras de verdad, miras a cámara en silencio un segundo, dejas calar.
- **Negrita** = bajas el ritmo y subes la intención en esa frase. No grites: marca con pausa, no con volumen.
- *Cursiva* = bajas la voz, tono confidente, como si contaras un secreto.
- **Mirada:** a cámara (= a los ojos del espectador) en los hooks, las verdades incómodas y el precio. Puedes desviar la mirada al pensar en transiciones, pero vuelve siempre a cámara en lo importante.
- **Manos:** úsalas para enumerar (los 5 pilares, los 4 pasos, las raciones). Gesto contado, no nervioso.
- **Cuerpo:** quieto en lo serio (problema, precio), permítete moverte/caminar en las partes explicativas para dar dinamismo y cambiar de plano.

## Recursos a preparar ANTES de grabar
1. **Gráfico de los 5 pilares** (animación o tarjetas) que se construyen uno a uno mientras los nombras. Núcleo del vídeo.
2. **Grabación de pantalla del cuestionario** real (scroll suave por las preguntas, sin datos sensibles).
3. **Mockup/grabación del plan** que recibe el cliente (el documento de marca: entreno + nutrición + seguimiento).
4. **Demo de raciones de mano** grabada aparte: tus manos sobre un plato real (palma = proteína, puño = verdura, mano ahuecada = carbo, pulgar = grasa).
5. **B-roll propio:** tú entrenando básicos (sentadilla, remo, peso muerto) con buena técnica, comida normal preparándose, tú revisando un plan en tablet/portátil.
6. **Rótulos de marca** (lower-thirds y palabras clave) en tipografía y color de WellnessReal.

## Mapa de recursos por bloque

**00:00 Qué es esto** — Plano medio a cámara, directo. Rótulo de entrada: "MÉTODO BASE". Sin B-roll, que te vean la cara y generes confianza. En "construimos la base", rótulo de la palabra **BASE**.

**00:45 Por qué a los 35** — Empieza a cámara; en "más cardio, menos comida, rutinas eternas" mete B-roll corto de esos clichés (báscula, gimnasio abarrotado, comida triste). Vuelve a tu cara en "no falla porque te falte disciplina".

**02:15 Los 5 pilares** — El bloque más visual. Cada pilar = una tarjeta que entra en pantalla al nombrarlo y se queda en una columna lateral, construyendo la lista. Al terminar, los 5 juntos en orden. B-roll suave detrás de cada uno (contexto = persona pensando; composición = espejo/medidas; energía = persona con vitalidad; hábitos = rutina diaria; rendimiento = levantando con buena técnica).

**05:15 Entrenamiento** — B-roll tuyo entrenando básicos mientras hablas. Rótulos con los conceptos: "ejercicios básicos", "siempre con alternativa", "deja reps en reserva", "primero reps, luego peso". Vuelve a cámara en "abras el plan y sepas qué hacer hoy".

**07:15 Nutrición** — Aquí va la **demo de raciones de mano**: corta a tus manos sobre el plato y rotula cada ración (palma/puño/mano ahuecada/pulgar) a medida que las nombras. En "cero alimentos prohibidos", plano de comida normal (pan, pasta) para reforzar el mensaje.

**09:00 Cómo se mide** — Gráfico/checklist que lista las métricas (tendencia de peso, cintura, ropa, energía, descanso, adherencia). En "puedes bajar una talla sin que la báscula se mueva", visual de cinta métrica vs. báscula tachada. Cierra a cámara.

**10:00 Cómo funciona (4 pasos)** — Numéralos con la mano. Sincroniza recursos: paso 1 = grabación del cuestionario; paso 2 = mockup del plan; paso 3 = TÚ revisándolo (refuerza lo humano, cara a cámara); paso 4 = gráfico de ajuste semanal (flecha sube/baja). Rótulos "1 · 2 · 3 · 4".

**11:15 Qué recibes** — Mientras enumeras, muestra cada entregable en pantalla: el programa de entreno, la guía de nutrición, el sistema de seguimiento. En "lo reviso yo, persona a persona", CORTA el B-roll y vuelve a tu cara fija a cámara: este momento es de confianza, no de pantallazos.

**12:30 Precio** — **Todo a cámara, sin B-roll, plano más cerrado.** Es el momento de máxima honestidad y los recursos distraen. Único rótulo permitido: "desde 150€/mes" cuando lo dices, discreto. Cuerpo quieto, mirada directa, ritmo lento.

**13:30 Cierre** — Vuelve al plano de apertura (cierra el círculo visual). Rótulo final con el CTA: "Rellena el cuestionario" + flecha/botón de marca. Última frase ("una base que puedas sostener") a cámara, pausa, fundido.
`,
  },
  {
    slug: 'ads-metodo-base',
    title: 'Ads - Metodo BASE',
    subtitle: 'Guion publicitario para vender el Metodo BASE sin enfoque generico WellnessReal.',
    duration: '60 - 75 seg',
    wordCount: 1640,
    purpose: 'Anuncio para Meta/TikTok/Reels. Presenta el Metodo BASE como sistema personalizado para +35: perder grasa, ganar fuerza y recuperar energia sin extremos.',
    status: 'ready',
    lastUpdated: '2026-06-23',
    content: `# Guion Ads - Metodo BASE
**60-75 segundos | Video publicitario | Listo para grabar**

## Enfoque
El Metodo BASE no se vende como "otro programa fitness". Se presenta como un sistema personalizado para personas de mas de 35 que quieren perder grasa, ganar fuerza y recuperar energia sin dietas extremas, rutinas eternas ni obsesion con la bascula.

---

## ESCENA 1 - Hook
**Plano:** tu mirando a camara. Directo, serio, sin postureo.

**Voz:**
Si tienes mas de 35 y sigues intentando ponerte en forma como cuando tenias 20...
probablemente ese es el problema.

---

## ESCENA 2 - Dolor
**Plano:** bascula, comida "fit", persona cansada, gimnasio vacio.

**Voz:**
Mas cardio.
Menos comida.
Rutinas larguisimas.
Motivacion durante dos semanas...
y luego vuelta al punto de partida.

No te falta disciplina.
Te falta un sistema que encaje con tu vida real.

---

## ESCENA 3 - Presentacion
**Plano:** tu entrenando, revisando un plan o mostrando el cuestionario.

**Voz:**
Por eso he creado el Metodo BASE.

Un metodo para perder grasa, ganar musculo y recuperar energia
sin dietas agresivas, sin contar calorias y sin vivir pendiente del peso.

---

## ESCENA 4 - Diferenciador
**Plano:** entrenamiento simple, comida normal, check-in semanal.

**Voz:**
BASE se construye sobre cinco pilares:

entender tu contexto,
mejorar tu composicion corporal,
cuidar tu energia y tu salud,
crear habitos sostenibles,
y dejar que el rendimiento llegue como consecuencia.

No buscamos que sufras mas.
Buscamos que puedas mantenerlo.

---

## ESCENA 5 - Personalizacion
**Plano:** formulario/cuestionario en pantalla.

**Voz:**
Primero respondes un cuestionario:
tu objetivo, edad, tiempo disponible, donde entrenas, material, lesiones, alimentacion y estilo de vida.

Con eso se genera un programa adaptado a ti:
entrenamiento, nutricion por raciones y seguimiento semanal.

---

## ESCENA 6 - Prueba del metodo
**Plano:** ejercicios basicos, comida con raciones de mano, app o libreta de seguimiento.

**Voz:**
Entrenas los dias que realmente puedes.
Comes con reglas simples: proteina, verdura, carbohidratos bien ajustados y cero alimentos prohibidos.
Y mides lo que de verdad importa:
cintura, energia, fuerza, descanso y adherencia.

Porque puedes cambiar tu cuerpo aunque la bascula no baje cada dia.

---

## ESCENA 7 - Cierre
**Plano:** tu a camara.

**Voz:**
Si quieres dejar de empezar de cero cada lunes,
entra en el Metodo BASE.

Rellena el cuestionario y recibe tu plan personalizado.

Sin humo.
Sin extremos.
Con una base que puedas sostener.

---

## Version corta - 30 segundos

Si tienes mas de 35 y sigues intentando ponerte en forma con dietas extremas y rutinas imposibles, para.

No te falta disciplina.
Te falta un sistema.

El Metodo BASE te ayuda a perder grasa, ganar fuerza y recuperar energia con un plan adaptado a tu vida real.

Respondes un cuestionario y recibes tu programa:
entrenamiento segun tus dias y material,
nutricion sin contar calorias,
y seguimiento con metricas que importan de verdad.

Sin humo.
Sin prohibiciones.
Sin vivir pendiente de la bascula.

Metodo BASE: construye primero la base.

---

## Recursos de video - Prompts para B-roll IA

### Configuracion general
- Formato: vertical 9:16.
- Duracion por clip: 4-6 segundos.
- Estilo: realista, premium pero cercano, documental publicitario.
- Uso: generar recursos para montar encima de la voz principal.
- Herramientas recomendadas: Runway, Kling, Pika, Sora o similar.

### Prompt base global
Vertical 9:16 cinematic realistic fitness advertisement, natural Spanish lifestyle, premium but not luxury, honest and grounded mood, people aged 35-50, real bodies, no exaggerated fitness model look, warm natural light, clean modern home and gym environments, handheld camera with subtle movement, shallow depth of field, high detail, authentic documentary style, no text on screen, no logos, no subtitles, no distorted hands, no fake UI text.

### Negative prompt
Do not show bodybuilder physiques, extreme transformations, before-after comparison, medical claims, fake app text, unreadable distorted UI, logos, subtitles, text overlays, overly dramatic sweat, unrealistic muscles, young influencer aesthetic, luxury gym, perfect model bodies, distorted hands, extra fingers.

---

## Prompts por plano

### 1. Hook - Mas de 35 intentando volver
A realistic 40-year-old man or woman standing in front of a bathroom mirror in the morning, looking thoughtful but determined, casual sports clothes, soft natural window light, subtle camera push-in, honest documentary fitness ad style, vertical 9:16, no text, no logos.

### 2. Frustracion - Bascula
Close-up of bare feet stepping onto a bathroom scale, the person looks down with mild frustration, morning light, minimal bathroom, cinematic close-up, shallow depth of field, realistic lifestyle fitness ad, vertical 9:16, no readable numbers, no text.

### 3. Dieta extrema
A tired adult in their 40s sitting at a kitchen table with a very restrictive bland meal, looking unmotivated, clean modern kitchen, natural light, realistic, not dramatic, documentary advertising style, vertical 9:16, no text.

### 4. Rutina imposible
A person in their 40s entering a gym and looking overwhelmed by machines and crowded space, holding a towel and water bottle, realistic commercial gym, cinematic handheld shot, vertical 9:16, no text, no logos.

### 5. Cambio de enfoque
A calm adult in their 40s closing a laptop, putting on trainers, and preparing for a short workout at home, mood shifts from stressed to focused, warm home lighting, realistic lifestyle ad, vertical 9:16, no text.

### 6. Entrenamiento realista en casa
A 42-year-old person doing controlled goblet squats with one dumbbell in a living room, simple setup, good technique, calm breathing, realistic body, no extreme sweat, cinematic natural light, vertical 9:16, no text.

### 7. Entrenamiento en gimnasio
A person in their 40s performing a controlled seated row in a gym, focused expression, moderate effort, realistic technique, premium documentary fitness ad look, shallow depth of field, vertical 9:16, no text, no brand logos.

### 8. Nutricion sin obsesion
Top-down shot of a normal balanced meal being prepared at home: protein, vegetables, rice or potatoes, olive oil, realistic portions, hands placing food on plate, bright natural kitchen light, vertical 9:16, no text.

### 9. Raciones de mano
Close-up of adult hands using simple hand portions next to a balanced plate, palm near protein, fist near vegetables, cupped hand near carbohydrates, thumb near fats, clean kitchen counter, realistic, vertical 9:16, no text labels.

### 10. Cuestionario personalizado
Close-up over shoulder of a person filling a clean fitness questionnaire on a laptop or tablet, modern minimal interface but no readable text, warm desk light, focused mood, realistic tech lifestyle, vertical 9:16, no logos.

### 11. Plan personalizado
A coach-like adult reviewing a personalized fitness plan on a tablet, making notes with a pen, desk with notebook and coffee, focused and professional, realistic Spanish fitness coaching brand mood, vertical 9:16, no readable text.

### 12. Seguimiento semanal
A person checking progress in a notebook and mobile app after training, writing down energy, sleep and workout notes, calm satisfied expression, home environment, cinematic close-up, vertical 9:16, no readable text.

### 13. Energia recuperada
A 40-year-old person walking outside after a workout, smiling subtly, fresh morning light, urban park or quiet street, healthy but realistic lifestyle, handheld cinematic shot, vertical 9:16, no text.

### 14. Cierre - Base sostenible
A confident adult in their 40s finishing a simple workout, placing dumbbells down calmly, breathing controlled, satisfied but not exaggerated, warm natural light, realistic documentary fitness ad, vertical 9:16, no text, no logos.

---

## Orden recomendado de montaje
1. Hook mirror.
2. Bascula.
3. Dieta restrictiva.
4. Gimnasio abrumador.
5. Cambio de enfoque en casa.
6. Entrenamiento en casa.
7. Comida real.
8. Cuestionario.
9. Plan en tablet.
10. Seguimiento.
11. Exterior con energia.
12. Cierre entrenando.
`,
  },
]

export function getGuion(slug: string): Guion | undefined {
  return guiones.find((g) => g.slug === slug)
}
