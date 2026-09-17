import fs from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const envText = await fs.readFile(path.join(root, '.env.local'), 'utf8')
const env = Object.fromEntries(envText.split(/\r?\n/).filter((line) => line && !line.startsWith('#') && line.includes('=')).map((line) => {
  const index = line.indexOf('=')
  return [line.slice(0, index), line.slice(index + 1).replace(/^['"]|['"]$/g, '')]
}))
const baseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY
if (!baseUrl || !serviceKey) throw new Error('[blog:refresh] Faltan credenciales de Supabase')

const updates = [
  {
    slug: 'el-descanso-no-funciona',
    title: 'Recuperación muscular: por qué sigues cansado aunque descanses',
    excerpt: 'Dormir ayuda, pero recuperarte también depende de la carga, la alimentación y tu contexto. Qué revisar si el cansancio no se va.',
    read_time: '8 min de lectura',
    image: 'el-descanso-no-funciona.jpg',
    alt: 'Mujer descansando después de entrenar junto a una botella de agua',
    content: `<p>Duermes, dejas días sin entrenar y aun así llegas a la siguiente sesión con el cuerpo pesado. Es fácil pensar que necesitas parar todavía más o buscar otro suplemento. Pero <strong>recuperarse no significa únicamente no entrenar</strong>.</p>
<p>La recuperación depende de varias piezas: el sueño, la carga que acumulas, la energía que comes, la hidratación y todo lo que ocurre fuera del gimnasio. Antes de tocarlo todo, conviene revisar el sistema con calma.</p>
<blockquote><p><strong>Idea clave:</strong> una mala sesión aislada no demuestra que te estés recuperando mal. Busca tendencias de varios días y observa también tu vida fuera del entrenamiento.</p></blockquote>
<h2>Recuperación muscular: qué significa de verdad</h2>
<p>Entrenar produce fatiga y ofrece un estímulo. Después necesitas tiempo y recursos para volver a rendir y adaptarte. La dosis adecuada no es idéntica para todo el mundo ni permanece fija durante todo el año.</p>
<p>Trabajo, sueño interrumpido, viajes, enfermedad o más volumen de entrenamiento pueden cambiar temporalmente lo que puedes asimilar. Esto no convierte el estrés en un enemigo ni significa que una hormona esté «bloqueando» tus resultados. Significa que <strong>la carga total importa</strong>.</p>
<h2>1. Mira más allá del número de horas de sueño</h2>
<p>La recomendación conjunta de la <a href="https://aasm.org/resources/pdf/adultsleepdurationconsensus.pdf" target="_blank" rel="noopener noreferrer">American Academy of Sleep Medicine y la Sleep Research Society</a> sitúa en siete o más horas regulares el mínimo general para adultos sanos. Pero la duración no explica por sí sola cómo te levantas.</p>
<p>Revisa durante una semana:</p>
<ul><li>Si mantienes horarios relativamente estables.</li><li>Si te despiertas repetidamente o tardas mucho en dormirte.</li><li>Si dependes de varias alarmas y arrastras somnolencia durante el día.</li><li>Si el alcohol, la cafeína tardía, el ruido o la temperatura están interfiriendo.</li></ul>
<p>Si duermes suficientes horas y continúas agotado de forma persistente, no lo normalices: puede merecer una valoración sanitaria. Para profundizar, lee <a href="/blog/dormir-mal-arruina-tu-progreso">cómo afecta dormir mal a tu entrenamiento</a>.</p>
<h2>2. Compara la carga con lo que puedes recuperar</h2>
<p>Más volumen no garantiza más progreso. Si aumentas a la vez días, series, intensidad y cardio, luego resulta difícil saber qué está generando la fatiga.</p>
<p>Observa tres señales juntas: rendimiento, sensación de esfuerzo y recuperación entre sesiones. Si durante varias sesiones rindes peor con cargas habituales, todo se siente más difícil y no recuperas como antes, reduce temporalmente volumen o intensidad y vuelve a evaluar. No necesitas esperar a estar destrozado para ajustar.</p>
<h2>3. La comida de recuperación no es solo el batido</h2>
<p>La proteína contribuye a reparar y construir tejido muscular, pero la cantidad total del día suele importar más que perseguir una ventana de pocos minutos. El posicionamiento de la <a href="https://pubmed.ncbi.nlm.nih.gov/28642676/" target="_blank" rel="noopener noreferrer">International Society of Sports Nutrition</a> recuerda que las necesidades dependen del volumen de ejercicio y que pueden cubrirse con alimentos.</p>
<p>Los hidratos también tienen una función: ayudan a reponer el glucógeno utilizado, especialmente cuando entrenas con volumen alto o tienes otra sesión pronto. Una comida completa, suficiente y tolerable suele ser más útil que acumular productos de recuperación.</p>
<h2>4. Usa recuperación activa cuando te siente bien</h2>
<p>Descansar no obliga a permanecer inmóvil. Un paseo suave, movilidad o una sesión fácil pueden ayudarte a mantener la rutina sin añadir una carga relevante. No son obligatorios ni «eliminan toxinas»: son opciones para moverte a una intensidad que no compita con la recuperación.</p>
<h2>Un chequeo práctico de siete días</h2>
<ol><li>Anota horas de sueño y cómo te levantas.</li><li>Registra cargas, repeticiones y esfuerzo de cada sesión.</li><li>Comprueba si estás comiendo y bebiendo de forma suficiente y regular.</li><li>Separa cansancio puntual de una tendencia que se mantiene.</li><li>Si el agotamiento es intenso, nuevo o persistente, consulta con un profesional sanitario.</li></ol>
<h2>Qué haría ahora</h2>
<p>No añadiría otro suplemento ni otra sesión. Primero elegiría la pieza más evidente y haría un ajuste pequeño durante una semana. Si no sabes si falla la carga, la organización o la progresión, una valoración sirve para ordenar el problema antes de cambiarlo todo.</p>
<p><a href="/valoracion"><strong>Solicitar una valoración inicial</strong></a></p>
<p><em>Contenido divulgativo. No sustituye una evaluación médica ni permite diagnosticar la causa de un cansancio persistente.</em></p>`,
  },
  {
    slug: 'la-motivacion-no-es-tu-problema',
    title: 'Cómo entrenar sin depender de la motivación',
    excerpt: 'Tener ganas ayuda, pero no basta. Aprende a convertir una intención en un plan concreto que también funcione en semanas normales.',
    read_time: '7 min de lectura',
    image: 'la-motivacion-no-es-tu-problema.jpg',
    alt: 'Mujer anotando dos sesiones de entrenamiento en su agenda semanal',
    content: `<p>El domingo tienes claro que esta semana sí vas a entrenar. El miércoles, después de trabajar, la decisión ya no parece tan sencilla. No es una contradicción: <strong>querer hacer algo y tener preparado cómo hacerlo son problemas distintos</strong>.</p>
<p>La motivación puede ayudarte a empezar. Para repetir necesitas reducir decisiones, concretar el momento y tener una alternativa para los días que no salen como esperabas.</p>
<h2>La motivación no es inútil; es insuficiente</h2>
<p>No hace falta pelearse con las ganas. Hace falta dejar de pedirles que sostengan todo el plan. La investigación sobre actividad física describe una distancia frecuente entre intención y conducta: proponerse entrenar no garantiza hacerlo.</p>
<p>Las llamadas intenciones de implementación —decidir <em>cuándo, dónde y cómo</em> actuar— pueden ayudar a convertir una intención previa en conducta, aunque el efecto no sea igual para todas las personas. Una <a href="https://pubmed.ncbi.nlm.nih.gov/35742582/" target="_blank" rel="noopener noreferrer">revisión y metaanálisis de 41 ensayos</a> encontró una mejora pequeña-moderada de la actividad física con intervenciones de planificación.</p>
<blockquote><p><strong>No necesitas sentirte motivado a las 19:00.</strong> Necesitas haber decidido antes qué harás a las 19:00 y cuál será tu versión mínima si el día se complica.</p></blockquote>
<h2>1. Cambia «entrenaré más» por una cita concreta</h2>
<p>Un propósito ambiguo obliga a negociar cada día. Una cita concreta reduce esa negociación:</p>
<ul><li><strong>Cuándo:</strong> martes y viernes a las 18:30.</li><li><strong>Dónde:</strong> en casa, justo al terminar de trabajar.</li><li><strong>Qué:</strong> la sesión A durante 35 minutos.</li><li><strong>Plan B:</strong> si salgo tarde, hago los dos primeros ejercicios durante 15 minutos.</li></ul>
<p>La revisión sistemática sobre <a href="https://pubmed.ncbi.nlm.nih.gov/31923898/" target="_blank" rel="noopener noreferrer">intenciones de implementación y ejercicio</a> señala que estas estrategias funcionan mejor en determinados contextos, especialmente cuando ya existe intención y cierta confianza para actuar. Planificar ayuda; no convierte una agenda imposible en posible.</p>
<h2>2. Diseña el comienzo, no una vida perfecta</h2>
<p>Preparar la ropa, dejar el material accesible o elegir un gimnasio que esté en tu recorrido no tiene nada de mágico. Simplemente quita pasos entre la intención y la acción.</p>
<p>Empieza por la fricción más repetida. Si tardas veinte minutos en encontrar material, ordénalo. Si llegas sin saber qué sesión toca, deja la rutina abierta. Si siempre aparece una reunión, cambia la hora antes de culparte por no cumplirla.</p>
<h2>3. Crea una semana mínima</h2>
<p>El plan ideal solo sirve si contempla la realidad. Define dos niveles:</p>
<ul><li><strong>Semana normal:</strong> el número de sesiones que puedes sostener la mayoría del tiempo.</li><li><strong>Semana complicada:</strong> la dosis mínima que mantiene el contacto con el hábito sin fingir que todo está bien.</li></ul>
<p>Una versión mínima no sustituye indefinidamente a un entrenamiento completo. Sirve para evitar que una semana difícil se convierta automáticamente en abandono.</p>
<h2>4. Repite un contexto suficientemente estable</h2>
<p>Los hábitos no aparecen en 21 días exactos. Una <a href="https://pubmed.ncbi.nlm.nih.gov/39685110/" target="_blank" rel="noopener noreferrer">revisión sistemática sobre formación de hábitos de salud</a> encontró una variabilidad enorme entre personas y conductas. La repetición consistente, el momento y la elección personal influyen.</p>
<p>Por eso interesa mantener durante unas semanas la misma señal de inicio: después del café, al cerrar el portátil o al dejar a los niños. Si cambias de horario, ejercicio y entorno cada día, estás obligándote a empezar de cero demasiadas veces.</p>
<h2>Tu plan para esta semana</h2>
<ol><li>Elige dos sesiones realistas, no cinco aspiracionales.</li><li>Escribe día, hora, lugar y primera acción.</li><li>Define una versión mínima para un imprevisto concreto.</li><li>Al terminar la semana, revisa qué estorbó y ajusta el sistema.</li></ol>
<p>Si quieres profundizar en cómo se consolida la constancia, continúa con <a href="/blog/habito-entrenar-sin-motivacion">esta guía para crear el hábito de entrenar</a>.</p>
<h2>La idea que quiero que te lleves</h2>
<p>No necesitas esperar a convertirte en una persona distinta. Necesitas un plan que pida menos decisiones en el peor momento del día y que tenga sitio para una semana imperfecta.</p>
<p><a href="/valoracion"><strong>Quiero ordenar mi plan de entrenamiento</strong></a></p>`,
  },
  {
    slug: 'por-que-no-estas-viendo-resultados',
    title: 'Por qué no ves resultados al entrenar: 5 cosas que revisar',
    excerpt: 'Si entrenas y no avanzas, no cambies todo todavía. Revisa progresión, objetivo, alimentación, recuperación y tiempo con datos.',
    read_time: '8 min de lectura',
    image: 'por-que-no-estas-viendo-resultados.jpg',
    alt: 'Mujer revisando su cuaderno de entrenamiento junto a unas mancuernas',
    content: `<p>Entrenas con frecuencia, intentas comer mejor y aun así no ves el cambio que esperabas. En ese punto es tentador culpar a la genética o saltar al siguiente método de moda.</p>
<p>Antes de hacerlo, separa una idea importante: <strong>«no veo resultados» no es todavía un diagnóstico</strong>. Puede significar que el plan no progresa, que estás midiendo mal, que el objetivo necesita más tiempo o que la dosis no encaja en tu contexto.</p>
<h2>1. ¿Tu entrenamiento tiene una progresión observable?</h2>
<p>Moverte, cansarte y entrenar con un objetivo no son exactamente lo mismo. Si buscas ganar fuerza o masa muscular, necesitas que el estímulo avance de alguna forma: más carga, más repeticiones con buena técnica, más volumen útil o una variante más exigente.</p>
<p>Las <a href="https://acsm.org/resistance-training-guidelines-update-2026/" target="_blank" rel="noopener noreferrer">recomendaciones de entrenamiento de fuerza de ACSM</a> insisten en algo bastante menos espectacular que las redes: la constancia y una prescripción adaptada importan más que perseguir un programa innecesariamente complejo.</p>
<p><strong>Qué revisar:</strong> compara cuatro semanas del mismo ejercicio. Si no registras cargas, repeticiones o dificultad, estás intentando evaluar el progreso de memoria.</p>
<h2>2. ¿Estás midiendo el resultado que corresponde?</h2>
<p>La báscula no mide fuerza, técnica, capacidad cardiovascular ni composición corporal por separado. Además, el peso cambia por hidratación, contenido intestinal, ciclo menstrual y otras variaciones normales.</p>
<p>Elige dos o tres indicadores ligados a tu objetivo:</p>
<ul><li>Rendimiento en ejercicios estables.</li><li>Perímetros o fotografías tomadas en condiciones comparables.</li><li>Promedio semanal del peso, si es relevante para ti.</li><li>Regularidad real de las sesiones.</li><li>Cómo toleras tareas que antes te costaban.</li></ul>
<p>Si quieres ordenar esta parte, consulta <a href="/blog/bascula-te-miente-medir-progreso-real">cómo medir el progreso más allá de una pesada aislada</a>.</p>
<h2>3. ¿Tu alimentación acompaña al objetivo?</h2>
<p>«Comer sano» es una base, no una medida exacta. Perder grasa requiere mantener un déficit energético durante suficiente tiempo; ganar músculo necesita entrenamiento de fuerza, proteína suficiente y energía compatible con el proceso.</p>
<p>No significa pesar comida para siempre. Significa comprobar si lo que haces de lunes a domingo coincide con el objetivo que dices perseguir. Si no sabes por dónde empezar, revisa primero regularidad, raciones, bebidas y picoteos antes de imponer una dieta extrema.</p>
<h2>4. ¿Puedes recuperar la carga que has elegido?</h2>
<p>Una sesión dura puede tener sentido. Encadenar sesiones que empeoran tu rendimiento y dejan fatiga persistente no es automáticamente más eficaz. Sueño, alimentación, trabajo y estrés cambian la carga que puedes tolerar.</p>
<p>Si llevas varias semanas rindiendo peor, todo se siente más difícil y llegas sin recuperar, revisa volumen e intensidad. Puedes ampliar esta parte en la guía sobre <a href="/blog/el-descanso-no-funciona">recuperación muscular y cansancio</a>.</p>
<h2>5. ¿Has dado al plan tiempo suficiente?</h2>
<p>Cambiar de rutina cada dos semanas elimina la posibilidad de comparar. Mantener exactamente lo mismo durante meses sin progresar tampoco es la solución. Necesitas un periodo estable, datos y una revisión programada.</p>
<p>Una forma práctica:</p>
<ol><li>Define un objetivo concreto para las próximas 6-8 semanas.</li><li>Mantén ejercicios principales comparables.</li><li>Registra el trabajo y uno o dos indicadores relevantes.</li><li>Revisa cada dos semanas sin cambiar por una mala sesión aislada.</li><li>Al final del bloque decide qué mantener y qué ajustar.</li></ol>
<h2>Cuándo no deberías resolverlo solo entrenando más</h2>
<p>Consulta con un profesional sanitario si aparece cansancio intenso o persistente, dolor que empeora, pérdida de peso no buscada, cambios marcados de apetito u otros síntomas que no encajan con tu carga habitual. Un artículo no puede distinguir todas las causas posibles.</p>
<h2>La idea que quiero que te lleves</h2>
<p>Cuando no hay resultados, la respuesta útil no es «esfuérzate más». Es localizar qué pieza no está alineada y cambiar una variable cada vez. Así podrás saber qué funciona de verdad.</p>
<p><a href="/valoracion"><strong>Solicitar una valoración de mi caso</strong></a></p>`,
  },
  {
    slug: 'comer-sano-con-poco-tiempo',
    title: 'Comer sano con poco tiempo: un sistema semanal sencillo',
    excerpt: 'No necesitas cocinar cada día ni coleccionar recetas. Organiza bases, combinaciones y planes de emergencia para comer bien con menos decisiones.',
    read_time: '8 min de lectura',
    image: 'comer-sano-con-poco-tiempo.jpg',
    alt: 'Preparación semanal con verduras, legumbres, arroz integral y huevos en recipientes de vidrio',
    content: `<p>El problema no suele aparecer cuando tienes tiempo y la nevera llena. Aparece el miércoles a última hora, con hambre, cansancio y nada decidido.</p>
<p>Por eso acumular recetas rápidas no siempre resuelve nada. <strong>Comer sano con poco tiempo depende menos de cocinar platos perfectos y más de tener combinaciones posibles antes de necesitarlas.</strong></p>
<h2>Qué significa comer sano en este contexto</h2>
<p>No existe un único menú saludable para todo el mundo. Como base general, la <a href="https://www.who.int/news-room/fact-sheets/detail/healthy-diet" target="_blank" rel="noopener noreferrer">Organización Mundial de la Salud</a> recomienda variedad de alimentos nutritivos, con presencia habitual de verduras, frutas, legumbres, frutos secos y cereales integrales, adaptando cantidades y elecciones al contexto individual.</p>
<p>Eso no obliga a cocinar fresco en cada comida. La propia guía contempla alternativas congeladas y en conserva cuando no llevan exceso de sal o azúcares añadidos. Lo práctico también puede ser nutritivo.</p>
<h2>El sistema mínimo: tres bases y varias combinaciones</h2>
<p>En vez de preparar siete recetas distintas, deja listas tres piezas que puedas combinar:</p>
<h3>1. Una o dos fuentes de proteína</h3>
<p>Por ejemplo: huevos cocidos, legumbres, pollo, pescado, tofu o yogur natural. Elige según tus preferencias, necesidades y presupuesto. No hace falta utilizar siempre la misma.</p>
<h3>2. Verduras fáciles de usar</h3>
<p>Verdura asada, una bolsa lavada, tomate, conservas de verduras o congelados. Tener una opción lista reduce la distancia entre «debería comer verdura» y ponerla realmente en el plato.</p>
<h3>3. Un hidrato que puedas recalentar o servir</h3>
<p>Arroz, patata, pasta integral, pan o legumbres. Los hidratos no son un error que haya que compensar: forman parte de una alimentación saludable y su cantidad se ajusta a la persona, la actividad y el objetivo.</p>
<blockquote><p><strong>Ejemplo:</strong> arroz + garbanzos + verduras; tortilla + pan + ensalada; yogur + fruta + avena. No son menús obligatorios, sino combinaciones para pensar menos.</p></blockquote>
<h2>Prepara componentes, no una exposición de tuppers</h2>
<p>Reserva uno o dos momentos cortos a la semana. Mientras el horno o una olla trabajan, prepara más de una ración. No necesitas dedicar el domingo completo ni comer lo mismo cinco días seguidos.</p>
<p>Un bloque sencillo puede consistir en:</p>
<ul><li>Cocer arroz o patata para varias combinaciones.</li><li>Asar una bandeja de verduras.</li><li>Preparar una proteína o dejar alternativas rápidas disponibles.</li><li>Lavar fruta y colocarla donde realmente la veas.</li><li>Escribir tres cenas posibles con lo que ya tienes.</li></ul>
<h2>Crea una lista de comidas de emergencia</h2>
<p>Un sistema serio contempla el día en que no has preparado nada. Elige tres opciones que puedas montar en diez minutos con productos habituales:</p>
<ul><li>Legumbre cocida + verdura congelada + aceite de oliva.</li><li>Tortilla + ensalada preparada + pan.</li><li>Conserva de pescado o tofu + arroz precocido + tomate.</li></ul>
<p>Las conservas y los congelados no son un fracaso. Son herramientas. Revisa etiquetas si necesitas controlar sal u otros componentes, pero no conviertas la falta de comida recién cocinada en una excusa para abandonar toda la estructura.</p>
<h2>Compra a partir de combinaciones reales</h2>
<p>Antes de ir al supermercado, escribe cuatro o cinco comidas que sí vas a preparar. Después agrupa la lista por bases: proteínas, verduras, hidratos, fruta y recursos de emergencia.</p>
<p>Comprar alimentos «saludables» sin saber cómo combinarlos acaba a menudo en una nevera llena y ninguna cena resuelta. La lista debe responder a una semana concreta, no a una versión ideal de ti.</p>
<h2>Un plan de 20 minutos para hoy</h2>
<ol><li>Revisa qué tienes y qué caduca antes.</li><li>Elige tres cenas y dos comidas combinables.</li><li>Decide qué componente cocinarás en cantidad.</li><li>Añade dos opciones de emergencia a la compra.</li><li>Deja por escrito qué comerás el día más complicado.</li></ol>
<h2>La idea que quiero que te lleves</h2>
<p>Comer mejor con poco tiempo no exige controlar cada plato. Exige que la opción razonable esté disponible cuando estás cansado. Menos decisiones de última hora, más bases útiles y suficiente flexibilidad para repetirlo.</p>
<p>Si tu objetivo incluye perder grasa, puedes continuar con esta guía sobre <a href="/blog/perder-grasa-sin-contar-calorias">cómo ajustar la alimentación sin contar calorías de por vida</a>.</p>
<p><a href="/valoracion"><strong>Quiero organizar un plan que encaje en mi semana</strong></a></p>
<p><em>La información es general. Si tienes una enfermedad, alergias, embarazo o necesidades nutricionales específicas, consulta con un dietista-nutricionista o profesional sanitario.</em></p>`,
  },
]

const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` }
for (const update of updates) {
  const filePath = path.join(root, 'public', 'blog', update.image)
  const image = await fs.readFile(filePath)
  const upload = await fetch(`${baseUrl}/storage/v1/object/media/blog/${update.image}`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'image/jpeg', 'x-upsert': 'true' },
    body: image,
  })
  if (!upload.ok) throw new Error(`[blog:upload] ${update.slug}: ${await upload.text()}`)

  const imageUrl = `${baseUrl}/storage/v1/object/public/media/blog/${update.image}`
  const response = await fetch(`${baseUrl}/rest/v1/posts?slug=eq.${encodeURIComponent(update.slug)}`, {
    method: 'PATCH',
    headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify({ title: update.title, excerpt: update.excerpt, read_time: update.read_time, main_image_url: imageUrl, main_image_alt: update.alt, content: update.content }),
  })
  if (!response.ok) throw new Error(`[blog:update] ${update.slug}: ${await response.text()}`)
  const rows = await response.json()
  if (rows.length !== 1) throw new Error(`[blog:update] ${update.slug}: se esperaban 1 fila y llegaron ${rows.length}`)
  console.log(`[blog:refresh] OK ${update.slug}`)
}
