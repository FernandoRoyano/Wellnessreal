-- ============================================================
--  Comunidad Tiroides · Contenido completo de "Empieza aquí"
--  Onboarding de 6 lecciones diseñado para convertir miembro
--  gratuito en cliente de pago, entregando valor primero.
--
--  Ejecutar en el SQL Editor de Supabase. Es idempotente:
--  sobrescribe (upsert) el contenido en cada ejecución.
--
--  Orden de la secuencia y su función:
--   0 lee-esto-primero      → contrato de expectativas (cero venta)
--   1 mi-historia           → credibilidad personal (vídeo)
--   2 metabolismo-lento     → el reencuadre que crea esperanza
--   3 tu-primera-victoria   → victoria rápida = prueba del método
--   4 como-funciona-esto    → participación en el foro
--   5 ir-mas-rapido         → LA OFERTA (drip 3 días: valor antes que venta)
-- ============================================================

-- ── Limpieza: fuera las lecciones placeholder del seed antiguo ──
delete from lessons
where space_id = (select id from spaces where slug = 'empieza-aqui')
  and slug in ('bienvenida', 'como-usar-la-comunidad', 'video-bienvenida');

-- El reencuadre pasa a ser onboarding: se elimina del otro espacio para no
-- duplicarlo. "Aprende sobre tiroides" queda libre para los 4 pilares.
delete from lessons
where space_id = (select id from spaces where slug = 'aprende-tiroides')
  and slug = 'metabolismo-lento-no-roto';


-- ── 0. Lee esto antes que nada ──────────────────────────────
insert into lessons (space_id, slug, title, content, sort_order, drip_days, published)
select id, 'lee-esto-primero', 'Lee esto antes que nada',
'<h2>Bienvenida. Sin rodeos.</h2>
<p>Si has llegado hasta aquí es porque llevas tiempo peleándote con algo que casi nadie te explica bien: por qué con hipotiroidismo cuesta más. Y porque estás harta de que te digan <em>"come menos y muévete más"</em>, como si no lo hubieras intentado ya mil veces.</p>
<p>Esto no es un grupo de motivación. No es un sitio de milagros. Es un lugar para entender qué le pasa a tu cuerpo y aplicar lo que de verdad funciona.</p>
<h3>Lo que vas a encontrar</h3>
<ul>
<li><strong>Contenido paso a paso</strong>, en orden, sin jerga innecesaria.</li>
<li><strong>Un foro</strong> donde preguntar sin miedo a quedar mal.</li>
<li><strong>Gente que entiende</strong> exactamente por lo que pasas.</li>
</ul>
<h3>Lo que NO vas a encontrar</h3>
<ul>
<li>Dietas de 1200 calorías ni alimentos prohibidos.</li>
<li>Suplementos milagro ni "detox hormonales".</li>
<li>Nadie que te juzgue por lo que comiste ayer.</li>
</ul>
<div class="lesson-note"><p><strong>Un límite importante, y lo digo desde el principio:</strong> tu tiroides la lleva tu endocrino; lo de entrenar y comer para verte bien con ella regulada, lo vemos juntos. Aquí no tocamos tu medicación ni sustituimos a tu médico. Nunca.</p></div>
<h3>Cómo va esto</h3>
<p>El contenido se libera poco a poco. No es para tenerte enganchada: es porque intentar cambiar diez cosas a la vez es la forma más rápida de no cambiar ninguna.</p>
<p>Ahora ve a la siguiente lección. Te cuento quién soy y por qué monté esto.</p>',
0, 0, true
from spaces where slug = 'empieza-aqui'
on conflict (space_id, slug) do update set
  title = excluded.title, content = excluded.content,
  sort_order = excluded.sort_order, drip_days = excluded.drip_days,
  published = excluded.published;


-- ── 1. Quién soy (honestidad + precisión como diferencial) · VÍDEO ──
insert into lessons (space_id, slug, title, content, sort_order, drip_days, published)
select id, 'quien-soy', 'Quién soy y qué puedo hacer por ti',
'<p>Antes de nada, ponme cara. Son dos minutos:</p>
<div data-video-embed="" class="video-embed is-vertical"><iframe src="https://www.youtube.com/embed/48tqytciSS8" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true"></iframe></div>
<h2>Empiezo por lo que no soy</h2>
<p>No tengo hipotiroidismo. No he pasado por lo que estás pasando tú, y no te voy a decir <em>"sé cómo te sientes"</em>, porque sería mentira y bastante gente te ha mentido ya.</p>
<p>Tampoco soy tu endocrino. No voy a opinar sobre tu medicación ni sobre tu analítica.</p>
<h2>Y ahora, lo que sí</h2>
<p>Soy Fernando Royano, graduado en Ciencias del Deporte. Llevo <strong>14 años</strong> entrenando gente y han pasado por mis manos más de cien personas. Muchas de ellas, mujeres con la tiroides lenta que llegaban repitiendo la misma frase: <em>"ya no sé qué más probar"</em>.</p>
<p>Lo que yo aporto no es empatía de haberlo vivido. Es otra cosa, y creo que es la que te falta: <strong>precisión</strong>.</p>
<h3>Qué quiere decir precisión</h3>
<p>Internet está lleno de consejos que no se pueden ejecutar. <em>"Come más proteína."</em> ¿Cuánta? <em>"Haz fuerza."</em> ¿Cuántos días, cuántas series, con cuánto peso, y qué hago si me duele el hombro? <em>"Descansa mejor."</em> Ya, ¿y cómo?</p>
<p>Eso no son consejos. Son titulares. Y con titulares no se cambia un cuerpo.</p>
<p>Mi trabajo es convertir eso en instrucciones que puedas ejecutar mañana por la mañana sin pensar: qué comida, qué cantidad, qué ejercicio, cuántas repeticiones, qué hacer el día que no llegas y qué cambiar cuando lleves tres semanas sin ver nada.</p>
<h3>En qué creo</h3>
<ul>
<li><strong>La adherencia manda.</strong> El mejor plan del mundo no sirve si no lo puedes sostener tres meses.</li>
<li><strong>Nada de sufrir.</strong> Ni 1200 calorías, ni alimentos prohibidos, ni rutinas de dos horas.</li>
<li><strong>Sin promesas de kilos.</strong> No te voy a decir "-10kg en 8 semanas". No conozco tu cuerpo, y quien te lo promete, tampoco.</li>
</ul>
<p>Monté esta comunidad porque cuando busqué información decente para mis clientas con tiroides me encontré un pantano: suplementos milagro, dietas sin gluten "para curar Hashimoto" y gurús vendiendo humo a gente que lo está pasando mal.</p>
<p>Aquí la información va a ser honesta y concreta. Aunque a veces la respuesta honesta sea más aburrida que la del vendedor de milagros.</p>',
1, 0, true
from spaces where slug = 'empieza-aqui'
on conflict (space_id, slug) do update set
  title = excluded.title, content = excluded.content,
  sort_order = excluded.sort_order, drip_days = excluded.drip_days,
  published = excluded.published;


-- ── 2. El reencuadre central ────────────────────────────────
insert into lessons (space_id, slug, title, content, sort_order, drip_days, published)
select id, 'metabolismo-lento-no-roto', 'Tu metabolismo va lento, no está roto',
'<h2>La diferencia entre lento y roto lo cambia todo</h2>
<p>Roto significa que no hay nada que hacer. Lento significa que se puede compensar.</p>
<p>Tu tiroides regula el ritmo al que tu cuerpo gasta energía. Cuando va baja, ese ritmo cae. Es real, no te lo estás inventando y no eres una exagerada. Pero conviene saber <strong>cuánto</strong> cae de verdad, porque ahí es donde casi todo el mundo se pierde.</p>
<h3>El dato honesto</h3>
<p>Con la tiroides <strong>sin tratar</strong>, ese gasto puede bajar de forma notable. Pero una vez que estás medicada y con los valores en rango —que es donde está la mayoría de vosotras— la diferencia respecto a alguien sin hipotiroidismo es <strong>mucho más pequeña de lo que te han hecho creer</strong>.</p>
<p>Y aquí está la parte incómoda y liberadora a la vez: si la diferencia es pequeña, entonces lo que llevas años intentando no fallaba por tu tiroides. Fallaba por el método.</p>
<h3>Entonces, ¿por qué cuesta tanto?</h3>
<p>Porque el hipotiroidismo casi nunca viene solo. Viene con cansancio, con peor descanso, con menos ganas de moverte. Y eso, mantenido en el tiempo, te hace perder músculo sin que te des cuenta.</p>
<p>El músculo es tu motor metabólico. Menos músculo es menos gasto, más cansancio y menos ganas. Y así, la rueda gira hacia abajo.</p>
<p>No es que tu cuerpo esté roto. Es que la rueda lleva años girando en la dirección equivocada. Y las ruedas se pueden girar al revés.</p>
<div class="lesson-note"><p><strong>Ojo:</strong> nada de esto sustituye tener bien ajustada la medicación. Si llevas tiempo sin analítica o no te encuentras bien, eso es lo primero y es cosa de tu endocrino.</p></div>
<h3>Lo que quiero que te lleves</h3>
<p>No te falta fuerza de voluntad. Si has aguantado años intentando cosas que no funcionaban, te sobra fuerza de voluntad. Lo que te faltaba era dirección.</p>
<p>Te lo desarrollo aquí: <a href="/blog/no-te-falta-fuerza-de-voluntad-te-falta-metodo">No te falta fuerza de voluntad, te falta método</a>.</p>
<p>En la siguiente lección hacemos algo. Una sola cosa, y de las que más mueven la aguja.</p>',
2, 0, true
from spaces where slug = 'empieza-aqui'
on conflict (space_id, slug) do update set
  title = excluded.title, content = excluded.content,
  sort_order = excluded.sort_order, drip_days = excluded.drip_days,
  published = excluded.published;


-- ── 3. Victoria rápida (prueba del método) ──────────────────
insert into lessons (space_id, slug, title, content, sort_order, drip_days, published)
select id, 'tu-primera-victoria', 'Tu primera victoria: empieza por la palma',
'<h2>Una sola cosa. Esta semana.</h2>
<p>Si has llegado hasta aquí probablemente estés pensando en cambiar cinco cosas el lunes. No lo hagas. Vamos a cambiar una, la que más rinde: <strong>proteína en cada comida</strong>.</p>
<h3>Por qué la proteína y no otra cosa</h3>
<ul>
<li><strong>Te sacia.</strong> Es lo que más corta el hambre, y con eso dejas de pelearte con la nevera a las siete de la tarde.</li>
<li><strong>Protege tu músculo</strong>, que es justo lo que estabas perdiendo sin darte cuenta. Y el músculo es tu motor metabólico.</li>
<li><strong>No requiere quitar nada.</strong> No prohibimos, añadimos.</li>
</ul>
<h3>Cómo se mide: con la mano</h3>
<p>Nada de pesar comida ni de apps contando calorías. Tu mano va contigo siempre y es proporcional a tu cuerpo:</p>
<ul>
<li><strong>Palma</strong> = proteína. Carne, pescado, huevo, legumbre, lácteo. <em>1-2 por comida. Esta es la prioridad.</em></li>
<li><strong>Puño</strong> = verdura. 1-2 por comida, medio plato.</li>
<li><strong>Mano ahuecada</strong> = carbohidrato. Arroz, patata, pasta, pan. Más los días que entrenas.</li>
<li><strong>Pulgar</strong> = grasa. Aceite, frutos secos, aguacate.</li>
</ul>
<p>Y no, el carbohidrato no se quita. Te ayuda a entrenar y a conservar músculo. Quitarlo es de las peores ideas que te van a vender.</p>
<h3>Tu tarea de esta semana</h3>
<p>No cambies todas las comidas. <strong>Elige una</strong> —normalmente la comida principal es la más fácil— y asegúrate de que tiene su palma de proteína y su medio plato de verdura. Nada más.</p>
<p>Cuando eso te salga solo, sin pensar, añades la siguiente. Así se construye un sistema. Lo otro se llama fuerza de voluntad, y esa se agota.</p>
<div class="lesson-note"><p>Esto es exactamente cómo trabajo la nutrición con mis clientas: <strong>por raciones, sin pesar nada</strong>. Lo que cambia en un plan personalizado es cuántas raciones te tocan a ti según tus días, tu actividad y tu objetivo. Pero el principio es este y ya lo puedes usar hoy.</p></div>
<p><strong>Cuéntamelo:</strong> entra en el foro y escribe qué comida has elegido. Escribirlo multiplica por mucho las probabilidades de que lo hagas de verdad. Y así te puedo echar un cable si te atascas.</p>',
3, 0, true
from spaces where slug = 'empieza-aqui'
on conflict (space_id, slug) do update set
  title = excluded.title, content = excluded.content,
  sort_order = excluded.sort_order, drip_days = excluded.drip_days,
  published = excluded.published;


-- ── 4. Cómo funciona + petición de participación ────────────
insert into lessons (space_id, slug, title, content, sort_order, drip_days, published)
select id, 'como-funciona-esto', 'Cómo funciona esto y qué hacer ahora',
'<h2>Cuatro cosas y te dejo en paz</h2>
<h3>1. Los espacios</h3>
<p>En el menú de la izquierda tienes las secciones. <strong>Empieza aquí</strong> es esto que estás leyendo. <strong>Aprende sobre tiroides</strong> es el contenido de fondo, el que va al detalle. <strong>Preguntas y apoyo</strong> es el foro.</p>
<h3>2. El contenido se desbloquea poco a poco</h3>
<p>Verás lecciones con un candado y un "disponible en X días". No es un truco de marketing: es para que no te lo tragues todo en una tarde y no apliques nada. Se aprende haciendo, y hacer lleva tiempo.</p>
<h3>3. El foro es el sitio donde esto cobra sentido</h3>
<p>Puedes preguntar lo que quieras. Lo que te dé vergüenza preguntar en la consulta. Lo que te dijo tu cuñada y no sabes si es verdad. Lo que llevas años haciendo y nunca supiste si estaba bien.</p>
<p>Aquí nadie juzga. Y si alguien lo hace, se va.</p>
<h3>4. Preséntate. Ahora.</h3>
<p>En serio: es la diferencia entre una comunidad que te sirve y una pestaña más que abres una vez y olvidas. Entra en <strong>Preguntas y apoyo</strong>, abre un tema y cuéntame:</p>
<ul>
<li>Cuánto llevas con el hipotiroidismo (o con Hashimoto).</li>
<li>Qué es lo que más te frustra ahora mismo.</li>
<li>Qué te gustaría conseguir en los próximos meses.</li>
</ul>
<p>Leo todo lo que se escribe. Y cuando conozco tu caso, puedo darte respuestas que sirvan para ti y no consejos genéricos de internet.</p>
<p>Nos vemos ahí dentro.</p>',
4, 0, true
from spaces where slug = 'empieza-aqui'
on conflict (space_id, slug) do update set
  title = excluded.title, content = excluded.content,
  sort_order = excluded.sort_order, drip_days = excluded.drip_days,
  published = excluded.published;


-- ── 5. LA OFERTA · drip 3 días (valor antes que venta) ──────
insert into lessons (space_id, slug, title, content, sort_order, drip_days, published)
select id, 'ir-mas-rapido', 'Cuando quieras ir más rápido',
'<h2>Hasta dónde llega lo que puedo darte aquí</h2>
<p>En esta comunidad te doy los principios. Y los principios funcionan: si aplicas lo de la palma y empiezas a hacer fuerza dos veces por semana, vas a notar cambios. De verdad.</p>
<p>Pero hay algo que no puedo darte en abierto, por mucho que escriba: <strong>precisión</strong>.</p>
<p>Cuántos días puedes entrenar <em>tú</em>. Con qué material. Cuántas series y con cuánto peso. Qué hacemos con esa rodilla que se queja. Cómo encajamos las comidas en tus horarios reales. Qué tocamos exactamente cuando llevas tres semanas estancada.</p>
<p>Eso no cabe en una lección genérica, porque deja de ser general en el momento en que es tuyo. Y sin ese nivel de detalle, volvemos a los titulares de internet.</p>
<p>Y hay una segunda cosa que he aprendido en catorce años, y que me parece incluso más importante: <strong>la mayoría no falla por falta de plan. Falla por hacerlo sola.</strong></p>
<p>Por eso he montado esto.</p>
<h3>Grupo Tiroides</h3>
<p>Doce semanas trabajando conmigo, junto a un grupo pequeño de mujeres que están exactamente donde tú.</p>
<ul>
<li><strong>Tu plan de entreno y nutrición hecho para ti.</strong> Tus días, tu material, tus lesiones, tus horarios. No una plantilla.</li>
<li><strong>Un directo conmigo cada semana</strong>, de 45 minutos: dudas, ajustes y un tema por sesión.</li>
<li><strong>Un espacio privado</strong> para el grupo, aquí mismo. Entre 8 y 12 mujeres, todas con lo mismo que tú.</li>
<li><strong>Reviso tu plan cada 3 semanas</strong> y cambio lo que haga falta según cómo vayas respondiendo.</li>
</ul>
<p>Son <strong>249 € las doce semanas completas</strong>. Pago único, sin cuotas después y sin permanencia. Lo cobro por trimestre entero por lo mismo que te decía antes: en menos de tres meses no se ve nada serio, y quien se compromete tres meses aparece.</p>
<p><a class="lesson-cta" href="/comunidad/asesoria">Ver el Grupo Tiroides y solicitar plaza →</a></p>
<div class="lesson-note"><p><strong>Solicitar no es pagar.</strong> Me cuentas tu caso, te escribo yo personalmente y decides con toda la información encima de la mesa. <strong>Y si veo que no encajas, te lo digo</strong> — prefiero perder una venta que cobrarte por algo que no te va a servir.</p></div>
<p>Y si no quieres nada de esto, perfecto: la comunidad es tuya igualmente. Sigue leyendo, sigue preguntando en el foro y sigue aplicando. No te voy a perseguir.</p>',
5, 3, true
from spaces where slug = 'empieza-aqui'
on conflict (space_id, slug) do update set
  title = excluded.title, content = excluded.content,
  sort_order = excluded.sort_order, drip_days = excluded.drip_days,
  published = excluded.published;
