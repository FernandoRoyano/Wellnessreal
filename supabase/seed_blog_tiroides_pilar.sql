-- ============================================================
--  Blog · Artículo PILAR de tiroides (borrador)
--  "Adelgazar con hipotiroidismo: la guía honesta (sin milagros)"
--  Ancla del clúster SEO de tiroides. Se inserta como BORRADOR
--  (published=false): revísalo y publícalo desde /admin/blog.
--
--  Idempotente: solo inserta si no existe ya (no sobrescribe si
--  lo editas en el admin). Para reimportar, borra antes la fila.
--  Los CTAs (guía de tiroides + comunidad) se inyectan solos por
--  estar en la categoría 'tiroides'.
-- ============================================================

-- Categoría de tiroides (si no existe)
insert into categories (title, slug, description)
select 'Tiroides', 'tiroides', 'Entrenar, comer y vivir mejor con hipotiroidismo o Hashimoto. Sin milagros.'
where not exists (select 1 from categories where slug = 'tiroides');

-- Artículo pilar (borrador)
insert into posts (title, slug, excerpt, author, main_image_url, main_image_alt, category_id, published_at, read_time, content, published)
select
  'Adelgazar con hipotiroidismo: la guía honesta (sin milagros)',
  'adelgazar-con-hipotiroidismo',
  'Con hipotiroidismo adelgazar cuesta más, pero no es imposible. La guía honesta, sin detox ni suplementos milagro: qué falla de verdad y qué sí mueve la aguja.',
  'Fernando Royano',
  '/blog/01_adelgazar.png',
  'Adelgazar con hipotiroidismo, sin milagros',
  (select id from categories where slug = 'tiroides'),
  now(),
  '12 min de lectura',
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
<p>Entrenar fuerza dos o tres veces por semana es lo que le devuelve el músculo a tu cuerpo. Y con el músculo vuelve el motor. No necesitas dos horas ni machacarte hasta no poder: necesitas constancia y algo de peso que te suponga un esfuerzo honesto.</p>
<p>Nada de acabar arrastrándote. Deja siempre un par de repeticiones en la recámara y sube el peso poco a poco, semana a semana. Eso, mantenido en el tiempo, es oro.</p>

<h3>2. Proteína en cada comida</h3>
<p>Es lo que más te sacia y lo que protege ese músculo que estamos recuperando. Y no hace falta pesar nada ni contar calorías. Tu propia mano te sirve de medida:</p>
<ul>
<li><strong>Palma</strong> = proteína. Carne, pescado, huevo, legumbre, lácteo. Una o dos por comida. Es la prioridad.</li>
<li><strong>Puño</strong> = verdura. Medio plato.</li>
<li><strong>Mano ahuecada</strong> = carbohidrato. Arroz, patata, pan. Más los días que entrenas. No, no se quita: te ayuda a entrenar y a conservar músculo.</li>
<li><strong>Pulgar</strong> = grasa. Aceite, frutos secos, aguacate.</li>
</ul>

<h3>3. Descanso: no es opcional</h3>
<p>Con hipotiroidismo, dormir mal te hunde. Menos descanso es más hambre, menos fuerza y cero ganas de entrenar. Cuidar el sueño no es un lujo de revista: es parte del tratamiento de tu día a día. Empieza por una hora fija para acostarte y por soltar la pantalla antes.</p>

<h3>4. Constancia, no intensidad</h3>
<p>El error de siempre es empezar un lunes cambiándolo todo a la vez. Dura dos semanas. Lo que funciona es lo contrario: pocos cambios, sostenidos mucho tiempo. Un hábito que aguantas seis meses vale más que un plan perfecto que abandonas en quince días.</p>

<h2>Una semana de ejemplo (3 entrenos de 40 minutos)</h2>
<p>No necesitas vivir en el gimnasio. Con tres sesiones de fuerza de unos 40 minutos, repartidas en la semana, tienes de sobra para empezar a girar la rueda. Cuerpo completo, ejercicios básicos, y a progresar despacio.</p>
<p>Lo importante no es el detalle perfecto de cada serie. Es que aparezcas tres veces, semana tras semana, y que cada mes muevas un poquito más de peso que el anterior. Eso es lo que construye.</p>

<h2>Deja de pesarte cada mañana</h2>
<p>La báscula sube y baja por el agua, las hormonas y mil cosas que no son grasa. Te subes en ayunas, aguantas la respiración como si eso cambiara algo, y dejas que un número decida cómo va a ir tu día. Basta.</p>
<p>Mira otras cosas: cómo te queda la ropa, la energía con la que te levantas, la fuerza que ganas en tus entrenos, cómo duermes. Se puede cambiar de talla sin que la báscula apenas se mueva. Eso también es ganar. De hecho, muchas veces es la mejor señal de todas.</p>

<h2>Por dónde empezar esta semana</h2>
<p>No cambies diez cosas. Cambia una. Elige tu comida principal y asegúrate de que lleva su palma de proteína y su medio plato de verdura. Nada más. Cuando eso te salga solo, sin pensar, añades lo siguiente.</p>
<p>Así se construye un sistema. Lo otro se llama fuerza de voluntad, y esa se agota siempre.</p>

<h2>Una última cosa</h2>
<p>No te falta fuerza de voluntad. Si has aguantado años intentando cosas que no funcionaban, te sobra fuerza de voluntad. Lo que te faltaba era dirección.</p>
<p>Tu tiroides seguirá siendo cosa de tu endocrino, y así debe ser. Pero lo de entrenar, comer y descansar para verte bien con ella regulada, eso lo podemos trabajar. Y no tienes por qué hacerlo sola.</p>',
  false
where not exists (select 1 from posts where slug = 'adelgazar-con-hipotiroidismo');
