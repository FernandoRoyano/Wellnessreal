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
select id, 'quien-soy', 'Bienvenida: qué vas a encontrar aquí',
'<p>Antes de seguir, ponme cara. Son dos minutos:</p>
<div data-video-embed="" class="video-embed is-vertical"><iframe src="https://www.youtube.com/embed/48tqytciSS8" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true"></iframe></div>
<h2>Esta comunidad existe para hacer aplicables los consejos</h2>
<p><em>Come mejor. Haz fuerza. Descansa más.</em> Suena bien, pero no resuelve las preguntas importantes: cuánto, cómo empezar y qué hacer el día que no puedes con el plan completo.</p>
<p>Soy Fernando Royano, graduado en Ciencias del Deporte, y llevo <strong>14 años</strong> ayudando a personas a entrenar y organizar sus hábitos.</p>
<div class="lesson-note"><p><strong>El límite está claro:</strong> no tengo hipotiroidismo y no voy a fingir que sé exactamente cómo te sientes. Tampoco soy tu endocrino. Tu diagnóstico, tu medicación y tus analíticas los lleva el profesional sanitario que conoce tu caso.</p></div>
<h2>Lo que sí voy a hacer contigo</h2>
<p>Mi trabajo aquí es ayudarte a entender el entrenamiento y convertir consejos generales en decisiones que puedas aplicar en tu vida real.</p>
<h3>Dentro vas a encontrar tres cosas</h3>
<ul>
<li><strong>Explicaciones sencillas</strong> para entender mejor la tiroides sin perderte entre siglas y promesas.</li>
<li><strong>Una forma práctica de empezar a entrenar fuerza</strong>, incluso si ahora tienes poca energía.</li>
<li><strong>Un espacio donde preguntar</strong> y compartir lo que te está costando sin sentirte juzgada.</li>
</ul>
<h3>Tu primer paso</h3>
<p>El contenido se irá desbloqueando poco a poco para que puedas aplicar una cosa antes de pasar a la siguiente. No necesitas hacerlo todo hoy.</p>
<p>Continúa con la primera acción y después preséntate en el foro: cuánto tiempo llevas con hipotiroidismo o Hashimoto, qué es lo que más te cuesta ahora y qué te gustaría recuperar.</p>
<p><a class="lesson-cta" href="/comunidad/preguntas-apoyo">Presentarme en la comunidad →</a></p>',
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
<p>Y ojo, porque esto no va solo de entrenar. Va de <strong>ajustar tu día a día</strong>: el descanso, la energía, la comida cuando no tienes tiempo, los hábitos que suman y los que restan. De desatascar eso que llevas tiempo sin poder con ello.</p>
<h3>Grupo Tiroides</h3>
<p>Doce semanas trabajando conmigo, junto a un grupo pequeño de mujeres que están exactamente donde tú.</p>
<ul>
<li><strong>Tu plan de entreno y nutrición hecho para ti.</strong> Tus días, tu material, tus lesiones, tus horarios. No una plantilla.</li>
<li><strong>Un directo conmigo cada semana</strong>, de 45 minutos: entrenamiento, comida real, descanso, energía y lo que se te atragante esa semana.</li>
<li><strong>Un espacio privado</strong> para el grupo, aquí mismo. Entre 8 y 12 mujeres, todas con lo mismo que tú.</li>
<li><strong>Ajusto tu día a día cada 3 semanas</strong>, no solo la rutina, según cómo vayas.</li>
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
