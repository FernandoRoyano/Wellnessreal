-- ============================================================
--  Blog · Satélites 4 y 5 del clúster de tiroides (borradores)
--  Cansancio e hipotiroidismo · Suplementos para la tiroides.
--  Mismo patrón: borradores, categoría 'tiroides', enlazan al pilar
--  y heredan los CTAs de tiroides. Idempotente.
--  OJO: el de suplementos deriva a lo medico a proposito.
-- ============================================================

insert into categories (title, slug, description)
select 'Tiroides', 'tiroides', 'Entrenar, comer y vivir mejor con hipotiroidismo o Hashimoto. Sin milagros.'
where not exists (select 1 from categories where slug = 'tiroides');


-- ── 4. Cansancio e hipotiroidismo ────────────────────────────
insert into posts (title, slug, excerpt, author, main_image_url, main_image_alt, category_id, published_at, read_time, content, published)
select
  'Cansancio e hipotiroidismo: qué puedes hacer tú (además de la pastilla)',
  'cansancio-e-hipotiroidismo',
  'El cansancio es de lo que más duele del hipotiroidismo. Además de tu medicación, hay palancas que sí dependen de ti y marcan la diferencia. Aquí están.',
  'Fernando Royano',
  '/blog/05_cansancio.png',
  'Cansancio e hipotiroidismo: qué puedes hacer',
  (select id from categories where slug = 'tiroides'),
  now(),
  '8 min de lectura',
'<p>De todo lo que trae el hipotiroidismo, el cansancio es lo que más te desgasta por dentro. No es "estar un poco floja". Es levantarte ya agotada, arrastrar el día y sentir que no eres tú. Y encima, cuando lo cuentas, hay quien te mira como si exageraras.</p>
<p>No exageras. Pero tampoco estás sin salida. Además de tu medicación, hay palancas que dependen de ti y que suman más de lo que crees. Vamos con ellas.</p>

<h2>Primero, lo que no depende de mí</h2>
<p>Si estás muy cansada, lo primero no es un suplemento ni un truco de internet: es asegurarte de que tu medicación está bien ajustada. Eso lo lleva tu endocrino con tus analíticas. Si hace tiempo que no te revisas o notas que algo va peor, esa es la primera puerta. Lo de aquí abajo suma cuando ya estás medicada y en rango.</p>

<h2>El cansancio no siempre es solo la tiroides</h2>
<p>Es fácil colgarle todo a la tiroides, pero muchas veces se juntan varias cosas: duermes mal, comes poco, no te mueves, arrastras estrés. Cada una te resta un poco, y sumadas te dejan sin batería. La buena noticia es que sobre casi todas esas puedes actuar tú.</p>

<h2>Palanca 1: protege el sueño</h2>
<p>Suena obvio, pero es la que más rinde. Dormir mal multiplica el cansancio, el hambre y la falta de ganas. No hace falta que seas perfecta: empieza por una hora fija para acostarte y por soltar el móvil un rato antes. Solo con eso muchas personas notan un cambio en un par de semanas.</p>

<h2>Palanca 2: muévete, aunque parezca lo contrario</h2>
<p>Parece una contradicción: estoy agotada, ¿y me dices que me mueva? Pues sí. El sedentarismo alimenta el cansancio, y el movimiento suave lo rompe. No hablo de machacarte: hablo de caminar, de fuerza dos o tres veces por semana, de no pasar el día sentada. La energía, curiosamente, aparece cuando la gastas un poco.</p>

<h2>Palanca 3: come suficiente y con proteína</h2>
<p>Comer muy poco para adelgazar es una de las razones por las que vas por la vida sin pilas. Tu cuerpo necesita combustible. Asegura proteína en cada comida (una palma de tu mano como mínimo) y no bajes las calorías a lo bestia. Se adelgaza mejor comiendo lo suficiente que pasando hambre.</p>

<h2>Palanca 4: revisa hierro y vitamina D (con tu médico)</h2>
<p>A veces detrás del cansancio hay un hierro bajo o una vitamina D por los suelos, cosas frecuentes y que se miran en una analítica. No te automediques ni compres suplementos por tu cuenta: coméntaselo a tu médico y que decida él si hay que medir y corregir algo.</p>

<h2>Lo que NO va a arreglar tu cansancio</h2>
<p>Ni las bebidas energéticas, ni los "detox", ni el suplemento milagro de moda. Te dan un chute y te dejan igual o peor. El cansancio de verdad se arregla por debajo: durmiendo, moviéndote, comiendo bien y con la medicación ajustada. Aburrido, pero cierto.</p>

<h2>Por dónde empezar</h2>
<p>Elige una sola palanca esta semana, la que veas más fácil, y céntrate solo en esa. Cuando la tengas, vas a por otra. Tienes cómo encaja todo (entreno, comida y descanso) en la <a href="/blog/adelgazar-con-hipotiroidismo">guía honesta para adelgazar con hipotiroidismo</a>.</p>',
  false
where not exists (select 1 from posts where slug = 'cansancio-e-hipotiroidismo');


-- ── 5. Suplementos para la tiroides ──────────────────────────
insert into posts (title, slug, excerpt, author, main_image_url, main_image_alt, category_id, published_at, read_time, content, published)
select
  'Suplementos para la tiroides: qué sirve y qué es humo (selenio, yodo y compañía)',
  'suplementos-tiroides',
  'Selenio, yodo, "aceleradores del metabolismo"... el negocio de los suplementos de tiroides es enorme. Qué dice la evidencia y por qué el yodo puede ser peligroso.',
  'Fernando Royano',
  '/blog/06_suplementos.png',
  'Suplementos para la tiroides: selenio, yodo y humo',
  (select id from categories where slug = 'tiroides'),
  now(),
  '7 min de lectura',
'<p>Con la tiroides hay un negocio enorme montado alrededor del miedo: pastillas, polvos y goteros que prometen acelerarte el metabolismo, curarte el Hashimoto o hacerte adelgazar sin esfuerzo. Vamos a mirarlo de frente, porque aquí hay cosas inútiles, cosas caras y alguna directamente peligrosa.</p>
<p>Antes de nada, y esto va en serio: yo no soy tu médico. Nada de lo que leas aquí es una recomendación para que te suplementes por tu cuenta. Los suplementos que tocan la tiroides los decide tu endocrino, con tus analíticas delante. Yo solo te ayudo a distinguir el humo.</p>

<h2>El yodo: el mito más peligroso de todos</h2>
<p>Este es importante. Mucha gente cree que si la tiroides va lenta hay que darle yodo "para que trabaje". Pues cuidado: en el Hashimoto, tomar yodo de más puede <strong>empeorar</strong> la cosa, no mejorarla. No es un suplemento inofensivo que "por probar no pasa nada". Por eso el yodo no se toca sin que lo diga tu médico. Nunca por tu cuenta.</p>

<h2>El selenio: algo de evidencia, pero no es magia</h2>
<p>El selenio es el que más suena con algo de base detrás: hay estudios que sugieren cierto papel en el Hashimoto. Pero de ahí a que sea la solución que estabas buscando hay un mundo. Ni adelgaza, ni sustituye a tu tratamiento, ni es para tomarlo alegremente y de por vida. Si tiene sentido en tu caso, lo valora tu endocrino. Punto.</p>

<h2>Vitamina D y hierro: solo si te faltan</h2>
<p>No son suplementos "de tiroides", pero salen mucho porque su falta da cansancio, y el cansancio ya lo tienes de serie. La regla es sencilla: no se suplementa a ciegas, se mide primero. Una analítica dice si te falta algo, y tu médico decide si hay que corregirlo. Comprar botes por si acaso es tirar el dinero, y a veces contraproducente.</p>

<h2>Los "aceleradores del metabolismo": humo caro</h2>
<p>Todo lo que prometa acelerarte el metabolismo, quemar grasa o desbloquear tu tiroides es marketing. Si algo hiciera eso de verdad, sería un medicamento y te lo daría tu médico, no un anuncio de Instagram. Ese dinero está mucho mejor en comida de calidad.</p>

<h2>El único "suplemento" que nunca falla</h2>
<p>Te va a sonar poco emocionante después de tanto bote: lo que de verdad mueve tu metabolismo no se compra. Es el músculo que construyes con la fuerza, la proteína que pones en cada comida, el descanso que cuidas y la constancia que sostienes. Eso no cabe en una cápsula, pero es lo único que funciona de forma fiable.</p>

<h2>En resumen</h2>
<p>Antes de gastarte un euro en suplementos, habla con tu endocrino y monta la base. Tienes esa base, paso a paso, en la <a href="/blog/adelgazar-con-hipotiroidismo">guía honesta para adelgazar con hipotiroidismo</a>. Y para todo lo que sea analíticas, dosis y diagnósticos, tu médico. Siempre.</p>',
  false
where not exists (select 1 from posts where slug = 'suplementos-tiroides');
