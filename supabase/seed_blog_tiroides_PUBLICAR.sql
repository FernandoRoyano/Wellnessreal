-- ============================================================
--  Blog · PUBLICAR el clúster de tiroides (todo en uno)
--  Ejecuta ESTE archivo solo, una vez, en el SQL Editor.
--  Hace 3 cosas por cada uno de los 6 artículos:
--    1) lo crea si no existe (con su contenido)
--    2) le pone su imagen de portada
--    3) lo PUBLICA con una fecha escalonada (blog activo = mejor SEO)
--  Es seguro reejecutar: no duplica y no pierde tus ediciones.
--  Fechas: cadencia ~semanal, del pilar (más antiguo) al último.
-- ============================================================

insert into categories (title, slug, description)
select 'Tiroides', 'tiroides', 'Entrenar, comer y vivir mejor con hipotiroidismo o Hashimoto. Sin milagros.'
where not exists (select 1 from categories where slug = 'tiroides');


-- ══════════ 1 · PILAR · 10 jun ══════════
insert into posts (title, slug, excerpt, author, main_image_url, main_image_alt, category_id, published_at, read_time, content, published)
select
  'Adelgazar con hipotiroidismo: la guía honesta (sin milagros)',
  'adelgazar-con-hipotiroidismo',
  'Con hipotiroidismo adelgazar cuesta más, pero no es imposible. La guía honesta, sin detox ni suplementos milagro: qué falla de verdad y qué sí mueve la aguja.',
  'Fernando Royano', '/blog/01_adelgazar.png', 'Adelgazar con hipotiroidismo, sin milagros',
  (select id from categories where slug = 'tiroides'),
  '2026-06-10 09:00:00+02'::timestamptz, '12 min de lectura',
'<p>Si has llegado hasta aquí, es porque llevas tiempo peleándote con tu cuerpo. Comes bien, o eso crees. Te mueves, o lo intentas. Y aun así la báscula no se entera. Encima alguien te ha dicho que basta con <em>hacer más y comer menos</em>, como si no lo hubieras probado ya mil veces.</p>
<p>Vamos a hablar claro. Sin milagros, sin detox, sin suplementos que lo arreglan todo. Solo lo que de verdad funciona cuando tu tiroides va lenta.</p>
<p>Un aviso antes de empezar: yo no soy tu endocrino. Tu tiroides y tu medicación las lleva tu médico, y nada de lo que leas aquí sustituye una analítica ni su criterio. Lo mío es lo otro: entrenar y comer para verte y sentirte bien con tu tiroides ya regulada.</p>
<h2>Tu metabolismo va lento, no está roto</h2>
<p>Esta frase parece una tontería, pero lo cambia todo. Roto significa que no hay nada que hacer. Lento significa que se puede compensar.</p>
<p>Tu tiroides regula el ritmo al que tu cuerpo gasta energía. Cuando va baja, ese ritmo cae. Es real, no te lo estás inventando y no eres una exagerada. Pero conviene saber <strong>cuánto</strong> cae de verdad, porque ahí es donde casi todo el mundo se pierde.</p>
<p>Con la tiroides sin tratar, ese gasto puede bajar de forma notable. Pero una vez que estás medicada y con los valores en rango, la diferencia respecto a alguien sin hipotiroidismo es <strong>mucho más pequeña de lo que te han hecho creer</strong>. Y esa es la parte incómoda y liberadora a la vez: si la diferencia es pequeña, entonces lo que llevas años intentando no fallaba por tu tiroides. Fallaba por el método.</p>
<h2>Por qué con hipotiroidismo cuesta más de verdad</h2>
<p>Porque el hipotiroidismo casi nunca viene solo. Viene con cansancio, con peor descanso, con menos ganas de moverte. Y eso, mantenido en el tiempo, tiene una consecuencia silenciosa: pierdes músculo sin darte cuenta.</p>
<p>El músculo es tu motor metabólico. Menos músculo es menos gasto, más cansancio y menos ganas. Y así la rueda gira hacia abajo, mes tras mes.</p>
<p>No es que tu cuerpo esté roto. Es que la rueda lleva años girando en la dirección equivocada. Y las ruedas se pueden girar al revés. De eso va todo lo que viene ahora.</p>
<h2>Lo que NO funciona (aunque te lo hayan vendido mil veces)</h2>
<p>Antes de lo que sí, quitemos de en medio lo que te está robando tiempo, dinero y energía.</p>
<ul>
<li><strong>Los detox y las curas milagro.</strong> Tu hígado y tus riñones ya te desintoxican gratis. Ningún batido verde arregla una tiroides.</li>
<li><strong>Dejar el gluten porque sí.</strong> Solo tiene sentido si hay celiaquía o sensibilidad diagnosticada. Tener Hashimoto no te obliga a comer sin gluten, por mucho que lo repitan en internet.</li>
<li><strong>Las dietas de hambre.</strong> Bajar a 1200 calorías con la tiroides lenta es la mejor forma de perder más músculo, tener más hambre y rendirte a las tres semanas.</li>
<li><strong>Horas de cardio.</strong> Andar está muy bien, pero pasarte la vida en la cinta no construye lo único que de verdad te interesa: músculo.</li>
<li><strong>El suplemento de turno.</strong> Ni el yodo (que en Hashimoto puede empeorar la cosa), ni la maca, ni nada que prometa acelerarte el metabolismo. Antes de comprar nada, habla con tu médico.</li>
</ul>
<p>Si te suena porque lo has probado, respira. No es que tú lo hicieras mal. Es que te dieron el mapa equivocado.</p>
<h2>Lo que sí mueve la aguja</h2>
<p>Cuatro pilares. Ni son sexis ni salen en anuncios, pero son los que funcionan.</p>
<h3>1. Fuerza: tu mejor medicina metabólica</h3>
<p>Entrenar fuerza dos o tres veces por semana es lo que le devuelve el músculo a tu cuerpo. Y con el músculo vuelve el motor. No necesitas dos horas ni machacarte hasta no poder: necesitas constancia y algo de peso que te suponga un esfuerzo honesto. Nada de acabar arrastrándote. Deja siempre un par de repeticiones en la recámara y sube el peso poco a poco, semana a semana.</p>
<h3>2. Proteína en cada comida</h3>
<p>Es lo que más te sacia y lo que protege ese músculo que estamos recuperando. Y no hace falta pesar nada. Tu propia mano te sirve de medida: una <strong>palma</strong> de proteína, un <strong>puño</strong> de verdura (medio plato), una <strong>mano ahuecada</strong> de carbohidrato (más los días que entrenas) y un <strong>pulgar</strong> de grasa. Y no, el carbohidrato no se quita: te ayuda a entrenar y a conservar músculo.</p>
<h3>3. Descanso: no es opcional</h3>
<p>Con hipotiroidismo, dormir mal te hunde. Menos descanso es más hambre, menos fuerza y cero ganas de entrenar. Cuidar el sueño no es un lujo de revista: es parte del tratamiento de tu día a día.</p>
<h3>4. Constancia, no intensidad</h3>
<p>El error de siempre es empezar un lunes cambiándolo todo a la vez. Dura dos semanas. Lo que funciona es lo contrario: pocos cambios, sostenidos mucho tiempo. Un hábito que aguantas seis meses vale más que un plan perfecto que abandonas en quince días.</p>
<h2>Deja de pesarte cada mañana</h2>
<p>La báscula sube y baja por el agua, las hormonas y mil cosas que no son grasa. Mira otras cosas: cómo te queda la ropa, la energía con la que te levantas, la fuerza que ganas, cómo duermes. Se puede cambiar de talla sin que la báscula apenas se mueva. Eso también es ganar.</p>
<h2>Por dónde empezar esta semana</h2>
<p>No cambies diez cosas. Cambia una. Elige tu comida principal y asegúrate de que lleva su palma de proteína y su medio plato de verdura. Nada más. Cuando eso te salga solo, sin pensar, añades lo siguiente. Así se construye un sistema. Lo otro se llama fuerza de voluntad, y esa se agota siempre.</p>
<h2>Una última cosa</h2>
<p>No te falta fuerza de voluntad. Si has aguantado años intentando cosas que no funcionaban, te sobra. Lo que te faltaba era dirección. Tu tiroides seguirá siendo cosa de tu endocrino, y así debe ser. Pero lo de entrenar, comer y descansar para verte bien con ella regulada, eso lo podemos trabajar. Y no tienes por qué hacerlo sola.</p>',
  true
where not exists (select 1 from posts where slug = 'adelgazar-con-hipotiroidismo');

update posts set published = true, published_at = '2026-06-10 09:00:00+02'::timestamptz,
  main_image_url = '/blog/01_adelgazar.png', main_image_alt = 'Adelgazar con hipotiroidismo, sin milagros'
where slug = 'adelgazar-con-hipotiroidismo';


-- ══════════ 2 · POR QUÉ NO ADELGAZO · 19 jun ══════════
insert into posts (title, slug, excerpt, author, main_image_url, main_image_alt, category_id, published_at, read_time, content, published)
select
  '¿Por qué no adelgazo aunque lo hago todo bien? (con hipotiroidismo)',
  'por-que-no-adelgazo-con-hipotiroidismo',
  'Comes bien, te mueves y la báscula no se entera. Con hipotiroidismo, estas son las razones reales por las que estás estancada, y qué hacer con cada una.',
  'Fernando Royano', '/blog/02_porque_no.png', 'Por qué no adelgazo aunque lo hago todo bien con hipotiroidismo',
  (select id from categories where slug = 'tiroides'),
  '2026-06-19 09:00:00+02'::timestamptz, '8 min de lectura',
'<p>Es una de las frases que más escucho: <em>"Fernando, es que lo hago todo bien y no baja".</em> Y te la crees, porque llevas meses esforzándote. Pero deja que te haga una pregunta incómoda: ¿seguro que lo haces todo bien, o haces bien lo que crees que hay que hacer?</p>
<p>No es lo mismo. Y con la tiroides lenta, la diferencia entre las dos cosas es justo donde te estás quedando atascada. Vamos con las razones reales, una a una.</p>
<h2>Razón 1: estás perdiendo músculo sin darte cuenta</h2>
<p>El hipotiroidismo viene con cansancio y menos ganas de moverte. Mantenido en el tiempo, eso hace que pierdas músculo poco a poco. Y el músculo es tu motor: cuanto menos tienes, menos gastas en reposo. La solución no es comer aún menos. Es recuperar ese músculo con fuerza.</p>
<h2>Razón 2: te mueves menos de lo que crees</h2>
<p>No hablo del entreno. Hablo del resto del día: pasos, recados, subir escaleras, estar de pie. Con el cansancio de la tiroides, sin darte cuenta te mueves menos las 23 horas que no entrenas. Y eso pesa más en tu gasto diario que la propia sesión de gimnasio.</p>
<h2>Razón 3: duermes mal, y eso lo cambia todo</h2>
<p>Dormir mal te sube el hambre, te baja la fuerza y te deja sin ganas de nada. Puedes hacerlo todo perfecto en la cocina y en el gimnasio, que si duermes cinco horas rotas, tu cuerpo rema en tu contra.</p>
<h2>Razón 4: estás midiendo lo que no toca</h2>
<p>Si tu único termómetro es la báscula de la mañana, vas a rendirte antes de tiempo. Puedes estar cambiando de talla, ganando fuerza y durmiendo mejor mientras la báscula no se mueve. Eso no es fracasar: muchas veces es exactamente lo que buscamos.</p>
<h2>Razón 5: comes "sano" pero te falta proteína</h2>
<p>Ensalada, fruta, un poco de todo... suena sano, pero si no hay proteína suficiente en cada comida, pasas hambre a media tarde y pierdes el músculo que tanto nos interesa. Una palma de tu mano en cada comida, como mínimo.</p>
<h2>Qué hacer con esto</h2>
<p>No lo arregles todo el lunes. Elige la razón que más te resuene y ataca solo esa esta semana. Tienes el método completo en la <a href="/blog/adelgazar-con-hipotiroidismo">guía honesta para adelgazar con hipotiroidismo</a>. Y recuerda: tu tiroides la lleva tu endocrino.</p>',
  true
where not exists (select 1 from posts where slug = 'por-que-no-adelgazo-con-hipotiroidismo');

update posts set published = true, published_at = '2026-06-19 09:00:00+02'::timestamptz,
  main_image_url = '/blog/02_porque_no.png', main_image_alt = 'Por qué no adelgazo aunque lo hago todo bien con hipotiroidismo'
where slug = 'por-que-no-adelgazo-con-hipotiroidismo';


-- ══════════ 3 · GLUTEN · 30 jun ══════════
insert into posts (title, slug, excerpt, author, main_image_url, main_image_alt, category_id, published_at, read_time, content, published)
select
  'Gluten e hipotiroidismo: ¿de verdad tienes que dejarlo?',
  'gluten-e-hipotiroidismo',
  'Todo el mundo te dice que quites el gluten si tienes Hashimoto. ¿Es verdad o es otro mito? Lo que dice la evidencia, sin humo y sin dietas de miedo.',
  'Fernando Royano', '/blog/03_gluten.png', 'Gluten e hipotiroidismo: ¿hay que dejarlo?',
  (select id from categories where slug = 'tiroides'),
  '2026-06-30 09:00:00+02'::timestamptz, '7 min de lectura',
'<p>Entras en cualquier grupo de tiroides y a los cinco minutos alguien te dice que el gluten es tu enemigo, que lo quites ya, que a ella le cambió la vida. Y te quedas con la duda y con culpa cada vez que comes pan.</p>
<p>Vamos a poner orden. Porque quitar el gluten sin motivo no es inofensivo: te complica la vida, te aísla y muchas veces te empeora la relación con la comida. Sin ganar nada a cambio.</p>
<h2>De dónde viene el mito</h2>
<p>El Hashimoto es una enfermedad autoinmune, y la celiaquía también. Es verdad que aparecen juntas más de lo normal. De ahí alguien saltó a una conclusión demasiado grande: <em>"si tienes Hashimoto, quita el gluten".</em> Pero que dos cosas se relacionen no significa que quitar una cure la otra.</p>
<h2>Qué dice la evidencia de verdad</h2>
<p>En personas con Hashimoto pero <strong>sin</strong> celiaquía ni sensibilidad al gluten, no hay pruebas sólidas de que quitarlo mejore la tiroides ni ayude a adelgazar por sí mismo. Lo que sí funciona es lo de siempre: fuerza, proteína, descanso y constancia.</p>
<h2>Cuándo sí tiene sentido quitarlo</h2>
<p>Hay un caso claro: si tienes celiaquía o una sensibilidad al gluten diagnosticada. Por eso lo primero, si tienes la sospecha, no es quitar el gluten a ciegas: es hablarlo con tu médico y hacerte la prueba <strong>antes</strong> de dejarlo (si lo quitas primero, la prueba puede salir falsamente normal).</p>
<h2>El problema de quitarlo "por si acaso"</h2>
<p>Restringir sin motivo tiene coste. Comes fuera con miedo, te pierdes cosas, vives pendiente de las etiquetas y acabas con una relación peor con la comida. Y encima, como no era el problema, sigues sin ver resultados y te frustras más.</p>
<h2>Qué hacer en su lugar</h2>
<p>Deja de buscar el alimento maldito y monta la base que sí mueve la aguja. Tienes el plan completo en la <a href="/blog/adelgazar-con-hipotiroidismo">guía para adelgazar con hipotiroidismo</a>. Y para pruebas y diagnósticos, tu endocrino y tu médico de cabecera.</p>',
  true
where not exists (select 1 from posts where slug = 'gluten-e-hipotiroidismo');

update posts set published = true, published_at = '2026-06-30 09:00:00+02'::timestamptz,
  main_image_url = '/blog/03_gluten.png', main_image_alt = 'Gluten e hipotiroidismo: ¿hay que dejarlo?'
where slug = 'gluten-e-hipotiroidismo';


-- ══════════ 4 · EJERCICIO · 8 jul ══════════
insert into posts (title, slug, excerpt, author, main_image_url, main_image_alt, category_id, published_at, read_time, content, published)
select
  'El mejor ejercicio para la tiroides lenta (y no es cardio)',
  'mejor-ejercicio-hipotiroidismo',
  'Te han dicho cardio y más cardio. Pero con hipotiroidismo lo que de verdad mueve la aguja es otra cosa. Qué entrenar, cuánto y cómo empezar sin agobios.',
  'Fernando Royano', '/blog/04_ejercicio.png', 'El mejor ejercicio para la tiroides lenta',
  (select id from categories where slug = 'tiroides'),
  '2026-07-08 09:00:00+02'::timestamptz, '8 min de lectura',
'<p>Cuando le dices a alguien que quieres adelgazar con la tiroides lenta, la respuesta automática es <em>"pues haz más cardio".</em> Y ahí te tienes, hora y media en la cinta, muerta, para ver que la báscula no se mueve. Frustrante, ¿verdad?</p>
<p>Te lo digo claro: el mejor ejercicio para ti no es el cardio. Es la fuerza. Y te explico por qué.</p>
<h2>Por qué el cardio infinito no es la respuesta</h2>
<p>El cardio quema calorías mientras lo haces, y ya está. En cuanto te bajas de la cinta, se acabó. Además, horas y horas de cardio con la tiroides lenta y poco descanso suelen traer más hambre y más cansancio.</p>
<h2>El músculo es tu motor metabólico</h2>
<p>Aquí está la clave. La fuerza construye músculo, y el músculo gasta energía <strong>todo el rato</strong>, también cuando estás en el sofá. Con hipotiroidismo llevas años perdiendo músculo sin darte cuenta, así que recuperarlo es lo que más te interesa de todo. No es para ponerte enorme (no vas a ponerte enorme, tranquila). Es para reactivar tu motor.</p>
<h2>Cómo empezar sin agobios</h2>
<p>No necesitas un gimnasio lleno de máquinas ni saber de nada. Necesitas movimientos básicos que trabajen todo el cuerpo: empujar, tirar, agacharte, sostener. Con tu propio peso, unas mancuernas o unas gomas ya empiezas.</p>
<h2>Cuánto y cómo</h2>
<p>Con dos o tres sesiones a la semana, de unos 40 minutos, tienes de sobra para empezar. Trabaja cada ejercicio dejándote un par de repeticiones en la recámara (nada de acabar al fallo) y sube el peso poquito a poco según las semanas.</p>
<h2>Y el cardio, ¿para nada?</h2>
<p>Para nada, no. Pero en su sitio. Caminar todos los días, moverte, subir escaleras: eso suma muchísimo a tu gasto diario y te sienta bien para la cabeza y el descanso. La fuerza construye, el caminar acompaña.</p>
<h2>Por dónde empezar</h2>
<p>Elige tres días de la semana y reserva 40 minutos. Empieza suave, prioriza la técnica sobre el peso y sé constante seis semanas antes de juzgar nada. Tienes cómo encaja todo en la <a href="/blog/adelgazar-con-hipotiroidismo">guía honesta para adelgazar con hipotiroidismo</a>.</p>',
  true
where not exists (select 1 from posts where slug = 'mejor-ejercicio-hipotiroidismo');

update posts set published = true, published_at = '2026-07-08 09:00:00+02'::timestamptz,
  main_image_url = '/blog/04_ejercicio.png', main_image_alt = 'El mejor ejercicio para la tiroides lenta'
where slug = 'mejor-ejercicio-hipotiroidismo';


-- ══════════ 5 · CANSANCIO · 15 jul ══════════
insert into posts (title, slug, excerpt, author, main_image_url, main_image_alt, category_id, published_at, read_time, content, published)
select
  'Cansancio e hipotiroidismo: qué puedes hacer tú (además de la pastilla)',
  'cansancio-e-hipotiroidismo',
  'El cansancio es de lo que más duele del hipotiroidismo. Además de tu medicación, hay palancas que sí dependen de ti y marcan la diferencia. Aquí están.',
  'Fernando Royano', '/blog/05_cansancio.png', 'Cansancio e hipotiroidismo: qué puedes hacer',
  (select id from categories where slug = 'tiroides'),
  '2026-07-15 09:00:00+02'::timestamptz, '8 min de lectura',
'<p>De todo lo que trae el hipotiroidismo, el cansancio es lo que más te desgasta por dentro. No es "estar un poco floja". Es levantarte ya agotada, arrastrar el día y sentir que no eres tú. Y encima, cuando lo cuentas, hay quien te mira como si exageraras.</p>
<p>No exageras. Pero tampoco estás sin salida. Además de tu medicación, hay palancas que dependen de ti y que suman más de lo que crees.</p>
<h2>Primero, lo que no depende de mí</h2>
<p>Si estás muy cansada, lo primero no es un suplemento ni un truco de internet: es asegurarte de que tu medicación está bien ajustada. Eso lo lleva tu endocrino con tus analíticas. Lo de aquí abajo suma cuando ya estás medicada y en rango.</p>
<h2>El cansancio no siempre es solo la tiroides</h2>
<p>Es fácil colgarle todo a la tiroides, pero muchas veces se juntan varias cosas: duermes mal, comes poco, no te mueves, arrastras estrés. La buena noticia es que sobre casi todas esas puedes actuar tú.</p>
<h2>Palanca 1: protege el sueño</h2>
<p>Es la que más rinde. Empieza por una hora fija para acostarte y por soltar el móvil un rato antes. Solo con eso muchas personas notan un cambio en un par de semanas.</p>
<h2>Palanca 2: muévete, aunque parezca lo contrario</h2>
<p>El sedentarismo alimenta el cansancio, y el movimiento suave lo rompe. No hablo de machacarte: caminar, fuerza dos o tres veces por semana, no pasar el día sentada. La energía aparece cuando la gastas un poco.</p>
<h2>Palanca 3: come suficiente y con proteína</h2>
<p>Comer muy poco para adelgazar es una de las razones por las que vas sin pilas. Asegura proteína en cada comida (una palma de tu mano) y no bajes las calorías a lo bestia.</p>
<h2>Palanca 4: revisa hierro y vitamina D (con tu médico)</h2>
<p>A veces detrás del cansancio hay un hierro bajo o una vitamina D por los suelos. No te automediques: coméntaselo a tu médico y que decida él si hay que medir y corregir algo.</p>
<h2>Por dónde empezar</h2>
<p>Elige una sola palanca esta semana, la que veas más fácil. Tienes cómo encaja todo en la <a href="/blog/adelgazar-con-hipotiroidismo">guía honesta para adelgazar con hipotiroidismo</a>.</p>',
  true
where not exists (select 1 from posts where slug = 'cansancio-e-hipotiroidismo');

update posts set published = true, published_at = '2026-07-15 09:00:00+02'::timestamptz,
  main_image_url = '/blog/05_cansancio.png', main_image_alt = 'Cansancio e hipotiroidismo: qué puedes hacer'
where slug = 'cansancio-e-hipotiroidismo';


-- ══════════ 6 · SUPLEMENTOS · 22 jul ══════════
insert into posts (title, slug, excerpt, author, main_image_url, main_image_alt, category_id, published_at, read_time, content, published)
select
  'Suplementos para la tiroides: qué sirve y qué es humo (selenio, yodo y compañía)',
  'suplementos-tiroides',
  'Selenio, yodo, "aceleradores del metabolismo"... el negocio de los suplementos de tiroides es enorme. Qué dice la evidencia y por qué el yodo puede ser peligroso.',
  'Fernando Royano', '/blog/06_suplementos.png', 'Suplementos para la tiroides: selenio, yodo y humo',
  (select id from categories where slug = 'tiroides'),
  '2026-07-22 09:00:00+02'::timestamptz, '7 min de lectura',
'<p>Con la tiroides hay un negocio enorme montado alrededor del miedo: pastillas, polvos y goteros que prometen acelerarte el metabolismo, curarte el Hashimoto o hacerte adelgazar sin esfuerzo. Vamos a mirarlo de frente, porque aquí hay cosas inútiles, cosas caras y alguna directamente peligrosa.</p>
<p>Antes de nada, y esto va en serio: yo no soy tu médico. Nada de lo que leas aquí es una recomendación para que te suplementes por tu cuenta. Los suplementos que tocan la tiroides los decide tu endocrino, con tus analíticas delante.</p>
<h2>El yodo: el mito más peligroso de todos</h2>
<p>Este es importante. Mucha gente cree que si la tiroides va lenta hay que darle yodo "para que trabaje". Pues cuidado: en el Hashimoto, tomar yodo de más puede <strong>empeorar</strong> la cosa, no mejorarla. Por eso el yodo no se toca sin que lo diga tu médico. Nunca por tu cuenta.</p>
<h2>El selenio: algo de evidencia, pero no es magia</h2>
<p>El selenio es el que más suena con algo de base detrás: hay estudios que sugieren cierto papel en el Hashimoto. Pero ni adelgaza, ni sustituye a tu tratamiento, ni es para tomarlo alegremente de por vida. Si tiene sentido en tu caso, lo valora tu endocrino.</p>
<h2>Vitamina D y hierro: solo si te faltan</h2>
<p>No son suplementos "de tiroides", pero salen mucho porque su falta da cansancio. La regla es sencilla: no se suplementa a ciegas, se mide primero. Una analítica dice si te falta algo, y tu médico decide si hay que corregirlo.</p>
<h2>Los "aceleradores del metabolismo": humo caro</h2>
<p>Todo lo que prometa acelerarte el metabolismo o desbloquear tu tiroides es marketing. Si algo hiciera eso de verdad, sería un medicamento y te lo daría tu médico, no un anuncio de Instagram.</p>
<h2>El único "suplemento" que nunca falla</h2>
<p>Lo que de verdad mueve tu metabolismo no se compra. Es el músculo que construyes con la fuerza, la proteína que pones en cada comida, el descanso que cuidas y la constancia que sostienes. Eso no cabe en una cápsula, pero es lo único que funciona de forma fiable.</p>
<h2>En resumen</h2>
<p>Antes de gastarte un euro en suplementos, habla con tu endocrino y monta la base. La tienes, paso a paso, en la <a href="/blog/adelgazar-con-hipotiroidismo">guía honesta para adelgazar con hipotiroidismo</a>. Y para analíticas, dosis y diagnósticos, tu médico. Siempre.</p>',
  true
where not exists (select 1 from posts where slug = 'suplementos-tiroides');

update posts set published = true, published_at = '2026-07-22 09:00:00+02'::timestamptz,
  main_image_url = '/blog/06_suplementos.png', main_image_alt = 'Suplementos para la tiroides: selenio, yodo y humo'
where slug = 'suplementos-tiroides';
