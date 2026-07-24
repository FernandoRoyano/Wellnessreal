-- ============================================================
--  Comunidad · Espacio "Aprende sobre tiroides" · Serie experta
--  3 lecciones que llevan a Fernando de "entrenador" a "el que
--  entiende cómo funciona y lo explica sin miedo":
--    0 · Cómo funciona la tiroides (el mecanismo)
--    1 · Entiende tu analítica (TSH, T4, anti-TPO) sin diagnosticar
--    2 · Hashimoto: qué es y por qué no es una condena
--  Basado en la guía de referencia interna (PubMed, ATA/ETA/EMAS).
--  Límite siempre puesto: explicar y derivar, nunca diagnosticar.
--
--  Ejecutar en el proyecto de la COMUNIDAD (donde están spaces/lessons).
--  Idempotente (upsert). Drip: 0, 3 y 7 días para pacear la serie.
-- ============================================================

-- Fuera los stubs antiguos de este espacio (contenido placeholder)
delete from lessons
where space_id = (select id from spaces where slug = 'aprende-tiroides')
  and slug in ('los-4-pilares', 'la-bascula-miente', 'metabolismo-lento-no-roto');


-- ── 0 · Cómo funciona tu tiroides ───────────────────────────
insert into lessons (space_id, slug, title, content, sort_order, drip_days, published)
select id, 'como-funciona-la-tiroides', 'Cómo funciona tu tiroides (sin bata blanca)',
'<h2>Entenderla es el primer paso para dejar de tenerle miedo</h2>
<p>A la tiroides se le echa la culpa de todo y casi nadie te explica qué hace en realidad. Vamos a arreglar eso. Cuando entiendas cómo funciona, dejará de ser ese monstruo abstracto y pasará a ser algo que puedes manejar.</p>
<h3>Qué es</h3>
<p>Es una glándula pequeña, con forma de mariposa, en la base del cuello. Su trabajo es marcar el <strong>ritmo</strong> de casi todo tu cuerpo: la energía, la temperatura, el pulso, la digestión, hasta el ánimo. Piensa en ella como el <strong>acelerador general</strong>. Si va lenta, todo va lento.</p>
<h3>No trabaja sola: la cadena de mando</h3>
<p>Aquí está la parte que nadie te cuenta. La tiroides no decide sola; es el último eslabón de una cadena de tres, que funciona como un termostato:</p>
<ul>
<li>Tu <strong>cerebro</strong> (el hipotálamo) da la orden inicial.</li>
<li>Una glándula del cerebro (la <strong>hipófisis</strong>) le da el toque a la tiroides con una hormona: la <strong>TSH</strong>. Recuerda esta sigla, es la estrella de tu analítica.</li>
<li>La <strong>tiroides</strong>, al recibir el toque, produce sus hormonas: <strong>T4</strong> y <strong>T3</strong>.</li>
</ul>
<p>Y cuando ya hay hormona suficiente, esa misma hormona le dice al cerebro <em>"vale, para de insistir"</em>. Es un termostato: se apaga solo al llegar a la temperatura buena. Por eso el sistema es tan fino, y por eso responde tanto a cómo vives.</p>
<h3>T4 y T3: la reserva y la activa</h3>
<p>La tiroides fabrica sobre todo <strong>T4</strong>, que es una forma de <strong>reserva</strong>, poco activa. Tu cuerpo (el músculo, el hígado) la transforma luego en <strong>T3</strong>, que es <strong>la que de verdad enciende el motor</strong>. Y esa transformación necesita <strong>selenio</strong> y <strong>hierro</strong> para funcionar. Guarda este dato: explica por qué ciertas carencias frenan la tiroides por la puerta de atrás.</p>
<p>Existe también una versión "freno", la <strong>T3 reversa</strong>, que tu cuerpo fabrica cuando quiere ahorrar energía: en ayunos largos, en enfermedad o en <strong>dietas muy agresivas</strong>. Apunta esto, porque en otra lección verás por qué es la razón de que las dietas extremas te estanquen.</p>
<div class="lesson-note"><p><strong>Lo importante:</strong> la tiroides no es "la culpable" de todo. Es un regulador finísimo que responde a cuánto comes, cuánto descansas y cuánto estrés cargas. Nadie te preguntó cómo era tu vida antes de decirte que "es tu metabolismo".</p></div>',
0, 0, true
from spaces where slug = 'aprende-tiroides'
on conflict (space_id, slug) do update set
  title = excluded.title, content = excluded.content,
  sort_order = excluded.sort_order, drip_days = excluded.drip_days, published = excluded.published;


-- ── 1 · Entiende tu analítica ───────────────────────────────
insert into lessons (space_id, slug, title, content, sort_order, drip_days, published)
select id, 'entiende-tu-analitica-tiroides', 'Entiende tu analítica: TSH, T4 y anti-TPO',
'<h2>Que no salgas de la consulta más perdida que entraste</h2>
<p>Te dan un papel lleno de siglas y flechitas, te sueltan dos frases y a casa. Vamos a que entiendas qué mide cada cosa. Ojo, esto es <strong>para que sepas de qué te hablan y preguntes mejor</strong>, no para que te autodiagnostiques: los números los interpreta tu endocrino con tu caso delante. Siempre.</p>
<h3>TSH: la estrella, y va al revés</h3>
<p>Es el valor que más vas a oír. Y lo que confunde a todo el mundo: la TSH <strong>no la fabrica la tiroides</strong>, es el toque que le da el cerebro para que trabaje. Por eso funciona al contrario de lo que parece:</p>
<ul>
<li><strong>TSH alta</strong> = el cerebro está gritando porque la tiroides responde poco → tiroides <strong>lenta</strong> (hipotiroidismo).</li>
<li><strong>TSH baja</strong> = no hace falta insistir porque sobra hormona → tiroides <strong>acelerada</strong> (hipertiroidismo).</li>
</ul>
<p>Sí, al revés de la intuición. Una flecha hacia arriba en la TSH suele apuntar a lenta, no a rápida.</p>
<h3>T4 libre y T3 libre</h3>
<p>Miden la hormona que de verdad tienes disponible para las células. Se leen junto a la TSH para dibujar el cuadro completo. Por eso tu médico no mira un solo número suelto: los cruza.</p>
<h3>Anti-TPO y anti-Tg: los anticuerpos</h3>
<p>Estos son los que marcan si hay <strong>autoinmunidad</strong>, es decir, si tu sistema inmune está atacando la tiroides. Los <strong>anti-TPO</strong> salen positivos en más del 90% de los casos de Hashimoto. Es el dato que separa un simple "tengo la tiroides lenta" de "tengo una enfermedad autoinmune detrás". De eso va la siguiente lección.</p>
<div class="lesson-note"><p><strong>🟢 Un truco práctico que casi nadie sabe:</strong> la <strong>biotina</strong> (el suplemento típico para pelo y uñas) puede <strong>falsear</strong> tu analítica de tiroides y darte resultados engañosos. Si tomas algún suplemento, avísale a tu médico antes de la analítica; puede que te pida dejar la biotina unos días.</p></div>
<div class="lesson-note"><p><strong>Y el límite, claro:</strong> esto es para entender tu informe, no para ponerte un diagnóstico ni cambiar nada por tu cuenta. Quien decide qué significan tus valores y qué hacer es tu endocrino. Lo tuyo ahora es ir a esa consulta sabiendo de qué habláis.</p></div>',
1, 3, true
from spaces where slug = 'aprende-tiroides'
on conflict (space_id, slug) do update set
  title = excluded.title, content = excluded.content,
  sort_order = excluded.sort_order, drip_days = excluded.drip_days, published = excluded.published;


-- ── 2 · Hashimoto ───────────────────────────────────────────
insert into lessons (space_id, slug, title, content, sort_order, drip_days, published)
select id, 'hashimoto-que-es', 'Hashimoto: qué es y por qué no es una condena',
'<h2>Suena a sentencia. No lo es.</h2>
<p>Te dicen "tienes Hashimoto" y se te cae el mundo, porque suena grave y raro. Respira. Te lo explico y verás que es algo que se entiende y se maneja.</p>
<h3>Qué es de verdad</h3>
<p>Es una enfermedad <strong>autoinmune</strong>: tu sistema inmune, que debería defenderte, se confunde y va atacando poco a poco tu tiroides. Al ir teniendo menos glándula funcionando, la tiroides produce menos hormona y aparece el hipotiroidismo. En países como España, donde hay yodo suficiente, es <strong>la causa número uno</strong> de tiroides lenta.</p>
<h3>Los números (para que veas que no estás sola)</h3>
<ul>
<li>Afecta muchísimo más a mujeres: hasta <strong>10 mujeres por cada hombre</strong>.</li>
<li>Suele aparecer entre los <strong>30 y los 50 años</strong>. Justo esa etapa en la que encima te dicen que "es la edad".</li>
<li>Es de lo más común que existe. No eres un caso raro ni roto.</li>
</ul>
<h3>Por qué no es una condena</h3>
<p>Porque se controla. El tratamiento que te ponga tu endocrino repone la hormona que te falta, y con los valores en rango tu cuerpo vuelve a funcionar. Hashimoto no significa que no puedas estar fuerte, con energía y bien contigo misma. Significa que hay una pieza que hay que vigilar y ajustar, y ya está.</p>
<p>Y aquí entra lo tuyo, lo que trabajamos aquí: con la tiroides regulada por tu médico, <strong>lo de verte y sentirte bien depende de lo de siempre</strong> — fuerza, comida real, descanso y constancia. Eso no te lo quita ningún diagnóstico.</p>
<div class="lesson-note"><p><strong>🟠 Un matiz sobre el gluten:</strong> tener Hashimoto no te obliga a comer sin gluten. Ahora bien, la <strong>celiaquía</strong> es más frecuente en quien tiene Hashimoto, así que <em>tiene sentido descartarla con una prueba</em> (con tu médico), en vez de quitar el gluten "por si acaso". Una cosa es una prueba; otra, una dieta de miedo sin motivo.</p></div>
<div class="lesson-note"><p><strong>Lo de siempre:</strong> tu Hashimoto y tu medicación los lleva tu endocrino. Yo estoy para lo otro: que entiendas lo que te pasa, que pierdas el miedo y que entrenes y comas de forma que tu cuerpo funcione lo mejor posible. Y para eso, no tienes por qué hacerlo sola.</p></div>',
2, 7, true
from spaces where slug = 'aprende-tiroides'
on conflict (space_id, slug) do update set
  title = excluded.title, content = excluded.content,
  sort_order = excluded.sort_order, drip_days = excluded.drip_days, published = excluded.published;
