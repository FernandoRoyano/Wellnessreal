-- ============================================================
--  Blog · Satélites del clúster de tiroides (borradores)
--  3 artículos que cuelgan del pilar "Adelgazar con hipotiroidismo".
--  Cada uno ataca una búsqueda concreta y enlaza al pilar.
--  Se insertan como BORRADOR (published=false): revisa y publica
--  desde /admin/blog. Idempotente: solo inserta si no existen.
--  Heredan los CTAs de tiroides (guía + comunidad) por su categoría.
-- ============================================================

-- Categoría (idempotente, por si se ejecuta suelto)
insert into categories (title, slug, description)
select 'Tiroides', 'tiroides', 'Entrenar, comer y vivir mejor con hipotiroidismo o Hashimoto. Sin milagros.'
where not exists (select 1 from categories where slug = 'tiroides');


-- ── 1. ¿Por qué no adelgazo aunque lo hago todo bien? ────────
insert into posts (title, slug, excerpt, author, main_image_url, main_image_alt, category_id, published_at, read_time, content, published)
select
  '¿Por qué no adelgazo aunque lo hago todo bien? (con hipotiroidismo)',
  'por-que-no-adelgazo-con-hipotiroidismo',
  'Comes bien, te mueves y la báscula no se entera. Con hipotiroidismo, estas son las razones reales por las que estás estancada, y qué hacer con cada una.',
  'Fernando Royano',
  '/blog/02_porque_no.png',
  'Por qué no adelgazo aunque lo hago todo bien con hipotiroidismo',
  (select id from categories where slug = 'tiroides'),
  now(),
  '8 min de lectura',
'<p>Es una de las frases que más escucho: <em>"Fernando, es que lo hago todo bien y no baja".</em> Y te la crees, porque llevas meses esforzándote. Pero deja que te haga una pregunta incómoda: ¿seguro que lo haces todo bien, o haces bien lo que crees que hay que hacer?</p>
<p>No es lo mismo. Y con la tiroides lenta, la diferencia entre las dos cosas es justo donde te estás quedando atascada. Vamos con las razones reales, una a una.</p>

<h2>Razón 1: estás perdiendo músculo sin darte cuenta</h2>
<p>El hipotiroidismo viene con cansancio y menos ganas de moverte. Mantenido en el tiempo, eso hace que pierdas músculo poco a poco. Y el músculo es tu motor: cuanto menos tienes, menos gastas en reposo. Así que aunque comas parecido a antes, tu cuerpo quema menos. La solución no es comer aún menos. Es recuperar ese músculo con fuerza.</p>

<h2>Razón 2: te mueves menos de lo que crees</h2>
<p>No hablo del entreno. Hablo del resto del día: pasos, recados, subir escaleras, estar de pie. Con el cansancio de la tiroides, sin darte cuenta te mueves menos las 23 horas que no entrenas. Y eso pesa más en tu gasto diario que la propia sesión de gimnasio. Un objetivo de pasos al día, sin obsesión, mueve la aguja más de lo que parece.</p>

<h2>Razón 3: duermes mal, y eso lo cambia todo</h2>
<p>Dormir mal te sube el hambre, te baja la fuerza y te deja sin ganas de nada. Puedes hacerlo todo perfecto en la cocina y en el gimnasio, que si duermes cinco horas rotas, tu cuerpo rema en tu contra. El descanso no es el premio por portarte bien: es parte del trabajo.</p>

<h2>Razón 4: estás midiendo lo que no toca</h2>
<p>Si tu único termómetro es la báscula de la mañana, vas a rendirte antes de tiempo. El peso sube y baja por agua y hormonas, cosas que no son grasa. Puedes estar cambiando de talla, ganando fuerza y durmiendo mejor mientras la báscula no se mueve. Eso no es fracasar: muchas veces es exactamente lo que buscamos.</p>

<h2>Razón 5: comes "sano" pero te falta proteína</h2>
<p>Ensalada, fruta, un poco de todo... suena sano, pero si no hay proteína suficiente en cada comida, pasas hambre a media tarde y pierdes el músculo que tanto nos interesa. La proteína es lo que más sacia y lo que protege tu motor. Una palma de tu mano en cada comida, como mínimo.</p>

<h2>Qué hacer con esto</h2>
<p>No lo arregles todo el lunes. Elige la razón que más te resuene y ataca solo esa esta semana. Cuando la tengas dominada, vas a por la siguiente. Tienes el método completo, paso a paso, en la <a href="/blog/adelgazar-con-hipotiroidismo">guía honesta para adelgazar con hipotiroidismo</a>.</p>
<p>Y recuerda: tu tiroides la lleva tu endocrino. Si llevas tiempo sin analítica o no te encuentras bien, eso es lo primero. Lo de aquí es para cuando ya estás medicada y en rango.</p>',
  false
where not exists (select 1 from posts where slug = 'por-que-no-adelgazo-con-hipotiroidismo');


-- ── 2. Gluten e hipotiroidismo: ¿de verdad tienes que dejarlo? ──
insert into posts (title, slug, excerpt, author, main_image_url, main_image_alt, category_id, published_at, read_time, content, published)
select
  'Gluten e hipotiroidismo: ¿de verdad tienes que dejarlo?',
  'gluten-e-hipotiroidismo',
  'Todo el mundo te dice que quites el gluten si tienes Hashimoto. ¿Es verdad o es otro mito? Lo que dice la evidencia, sin humo y sin dietas de miedo.',
  'Fernando Royano',
  '/blog/03_gluten.png',
  'Gluten e hipotiroidismo: ¿hay que dejarlo?',
  (select id from categories where slug = 'tiroides'),
  now(),
  '7 min de lectura',
'<p>Entras en cualquier grupo de tiroides y a los cinco minutos alguien te dice que el gluten es tu enemigo, que lo quites ya, que a ella le cambió la vida. Y te quedas con la duda y con culpa cada vez que comes pan.</p>
<p>Vamos a poner orden. Porque quitar el gluten sin motivo no es inofensivo: te complica la vida, te aísla y muchas veces te empeora la relación con la comida. Sin ganar nada a cambio.</p>

<h2>De dónde viene el mito</h2>
<p>El Hashimoto es una enfermedad autoinmune, y la celiaquía también. Es verdad que aparecen juntas más de lo normal. De ahí alguien saltó a una conclusión demasiado grande: <em>"si tienes Hashimoto, quita el gluten".</em> Pero que dos cosas se relacionen no significa que quitar una cure la otra.</p>

<h2>Qué dice la evidencia de verdad</h2>
<p>En personas con Hashimoto pero <strong>sin</strong> celiaquía ni sensibilidad al gluten, no hay pruebas sólidas de que quitarlo mejore la tiroides ni ayude a adelgazar por sí mismo. Lo que sí funciona es lo de siempre: fuerza, proteína, descanso y constancia. Aburrido, lo sé. Pero es lo que hay.</p>

<h2>Cuándo sí tiene sentido quitarlo</h2>
<p>Hay un caso claro: si tienes celiaquía o una sensibilidad al gluten diagnosticada. Ahí no es una moda, es una necesidad médica. Por eso lo primero, si tienes la sospecha, no es quitar el gluten a ciegas: es hablarlo con tu médico y hacerte la prueba <strong>antes</strong> de dejarlo (si lo quitas primero, la prueba puede salir falsamente normal).</p>

<h2>El problema de quitarlo "por si acaso"</h2>
<p>Restringir sin motivo tiene coste. Comes fuera con miedo, te pierdes cosas, vives pendiente de las etiquetas y acabas con una relación peor con la comida. Y encima, como no era el problema, sigues sin ver resultados y te frustras más. Todo ese esfuerzo, para nada.</p>

<h2>Qué hacer en su lugar</h2>
<p>Deja de buscar el alimento maldito y monta la base que sí mueve la aguja. Tienes el plan completo en la <a href="/blog/adelgazar-con-hipotiroidismo">guía para adelgazar con hipotiroidismo</a>. Y si tienes dudas sobre tu caso concreto, tu endocrino y tu médico de cabecera son quienes deben decidir sobre pruebas y diagnósticos. Lo mío es ayudarte a entrenar y comer bien, con o sin gluten.</p>',
  false
where not exists (select 1 from posts where slug = 'gluten-e-hipotiroidismo');


-- ── 3. El mejor ejercicio para la tiroides lenta ─────────────
insert into posts (title, slug, excerpt, author, main_image_url, main_image_alt, category_id, published_at, read_time, content, published)
select
  'El mejor ejercicio para la tiroides lenta (y no es cardio)',
  'mejor-ejercicio-hipotiroidismo',
  'Te han dicho cardio y más cardio. Pero con hipotiroidismo lo que de verdad mueve la aguja es otra cosa. Qué entrenar, cuánto y cómo empezar sin agobios.',
  'Fernando Royano',
  '/blog/04_ejercicio.png',
  'El mejor ejercicio para la tiroides lenta',
  (select id from categories where slug = 'tiroides'),
  now(),
  '8 min de lectura',
'<p>Cuando le dices a alguien que quieres adelgazar con la tiroides lenta, la respuesta automática es <em>"pues haz más cardio".</em> Y ahí te tienes, hora y media en la cinta, muerta, para ver que la báscula no se mueve. Frustrante, ¿verdad?</p>
<p>Te lo digo claro: el mejor ejercicio para ti no es el cardio. Es la fuerza. Y te explico por qué.</p>

<h2>Por qué el cardio infinito no es la respuesta</h2>
<p>El cardio quema calorías mientras lo haces, y ya está. En cuanto te bajas de la cinta, se acabó. Además, horas y horas de cardio con la tiroides lenta y poco descanso suelen traer más hambre y más cansancio. Andar está genial y lo vamos a usar, pero no como plan principal.</p>

<h2>El músculo es tu motor metabólico</h2>
<p>Aquí está la clave. La fuerza construye músculo, y el músculo gasta energía <strong>todo el rato</strong>, también cuando estás en el sofá. Con hipotiroidismo llevas años perdiendo músculo sin darte cuenta, así que recuperarlo es lo que más te interesa de todo. No es para ponerte enorme (no vas a ponerte enorme, tranquila). Es para reactivar tu motor.</p>

<h2>Cómo empezar sin agobios</h2>
<p>No necesitas un gimnasio lleno de máquinas ni saber de nada. Necesitas movimientos básicos que trabajen todo el cuerpo: empujar, tirar, agacharte, sostener. Con tu propio peso, unas mancuernas o unas gomas ya empiezas. Lo importante no es la sofisticación, es aparecer.</p>

<h2>Cuánto y cómo</h2>
<p>Con dos o tres sesiones a la semana, de unos 40 minutos, tienes de sobra para empezar. Trabaja cada ejercicio dejándote un par de repeticiones en la recámara (nada de acabar al fallo, arrastrándote), y sube el peso poquito a poco según las semanas. Eso es lo que hace que el músculo vuelva: esfuerzo honesto y progresión lenta, no machaque.</p>

<h2>Y el cardio, ¿para nada?</h2>
<p>Para nada, no. Pero en su sitio. Caminar todos los días, moverte, subir escaleras: eso suma muchísimo a tu gasto diario y encima te sienta bien para la cabeza y el descanso. Úsalo como base de tu día, no como castigo en la cinta. La fuerza construye, el caminar acompaña.</p>

<h2>Por dónde empezar</h2>
<p>Elige tres días de la semana y reserva 40 minutos. Empieza suave, prioriza la técnica sobre el peso y sé constante seis semanas antes de juzgar nada. Tienes cómo encaja todo esto (entreno, comida y descanso) en la <a href="/blog/adelgazar-con-hipotiroidismo">guía honesta para adelgazar con hipotiroidismo</a>.</p>
<p>Un recordatorio de siempre: tu tiroides y tu medicación son cosa de tu endocrino. Esto es lo que sí depende de ti, y es más de lo que crees.</p>',
  false
where not exists (select 1 from posts where slug = 'mejor-ejercicio-hipotiroidismo');
