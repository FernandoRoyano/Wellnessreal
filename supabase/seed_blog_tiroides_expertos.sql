-- ============================================================
--  Blog · 3 artículos "experto" del clúster de tiroides (borradores)
--  Basados en la guía de referencia (PubMed/ATA/EMAS):
--    · Dietas extremas y la T3 (el mensaje estrella)
--    · Agujetas/debilidad y la tiroides (miopatía + CK)
--    · Menopausia y tiroides
--  Se crean como BORRADOR (published=false): revísalos y publica con
--  fecha desde /admin/blog (recomendado 1-2 por semana).
--  Categoría Tiroides -> heredan los CTAs de guía + comunidad.
--
--  Ejecutar en el proyecto donde vive tu BLOG (posts/categories).
--  Idempotente: solo inserta si no existen.
-- ============================================================

insert into categories (title, slug, description)
select 'Tiroides', 'tiroides', 'Entrenar, comer y vivir mejor con hipotiroidismo o Hashimoto. Sin milagros.'
where not exists (select 1 from categories where slug = 'tiroides');


-- ── 1 · Dietas extremas y la tiroides (mensaje estrella) ─────
insert into posts (title, slug, excerpt, author, category_id, published_at, read_time, content, published)
select
  'Por qué las dietas extremas te frenan la tiroides (el dato que casi nadie cuenta)',
  'dietas-extremas-frenan-tiroides',
  'Comer muy poco no acelera tu pérdida de grasa: le pone el freno a tu tiroides. La ciencia de la T3 que explica por qué las dietas de hambre siempre se estancan.',
  'Fernando Royano',
  (select id from categories where slug = 'tiroides'),
  now(), '8 min de lectura',
'<p>Te han vendido que para adelgazar hay que comer lo mínimo. Cuanto menos, mejor. Y con la tiroides lenta, esa idea no solo no funciona: te hunde. Hoy te explico por qué, con datos, para que no te lo vuelvan a colar.</p>
<h2>Lo que hace tu cuerpo cuando pasas hambre</h2>
<p>Cuando te metes en un déficit muy agresivo, tu cuerpo no piensa "genial, vamos a quemar grasa". Piensa "esto es una hambruna, hay que ahorrar". Y una de las primeras cosas que hace para ahorrar es <strong>bajar la T3</strong>, que es la hormona tiroidea activa, la que enciende tu metabolismo.</p>
<p>Esto no es una opinión ni una excusa. En un estudio clásico, una dieta de 400 kcal al día hizo caer la T3 activa hasta un <strong>66%</strong>. Y ojo, porque incluso un déficit más razonable la bajó alrededor de un <strong>40%</strong>. Tu cuerpo, además, fabrica más de la versión "freno" de esa hormona. Resultado: tu motor gira más despacio justo cuando tú quieres que corra.</p>
<h2>Se llama termogénesis adaptativa</h2>
<p>Es el nombre técnico de esto: tu cuerpo baja el gasto en reposo, te sube el hambre y frena. Por eso las dietas extremas siempre acaban en el mismo sitio — estancamiento y efecto rebote. Y no es que te falte fuerza de voluntad. Es fisiología.</p>
<p>El ejemplo más brutal es el de los concursantes de un famoso concurso de adelgazamiento en televisión: seis años después, su metabolismo seguía gastando unas 500 kcal al día por debajo de lo esperado. Seis años. Ese es el precio de forzar la máquina.</p>
<div class="lesson-note"><p><strong>Y con hipotiroidismo, más:</strong> si tu tiroides ya va lenta de base, castigarla con dietas de hambre es echar gasolina al fuego equivocado. No adelgazas más rápido. Frenas más.</p></div>
<h2>Qué hacer en su lugar</h2>
<p>Lo aburrido, que es lo que funciona: <strong>comer suficiente</strong> (con su proteína en cada comida), <strong>entrenar fuerza</strong> para recuperar músculo, <strong>descansar</strong> y tener <strong>paciencia</strong>. Un déficit moderado, sostenible, que tu cuerpo no interprete como una amenaza. Menos épico, pero es el único que no se te vuelve en contra.</p>
<p>Tienes el plan completo, paso a paso, en la <a href="/blog/adelgazar-con-hipotiroidismo">guía honesta para adelgazar con hipotiroidismo</a>. Y recuerda: tu tiroides la lleva tu endocrino; esto es lo que sí depende de ti.</p>',
  false
where not exists (select 1 from posts where slug = 'dietas-extremas-frenan-tiroides');


-- ── 2 · Agujetas / debilidad y la tiroides (miopatía + CK) ───
insert into posts (title, slug, excerpt, author, category_id, published_at, read_time, content, published)
select
  'Agujetas eternas, cansancio y debilidad rara: cuándo no es falta de constancia',
  'agujetas-cansancio-debilidad-tiroides',
  'Te esfuerzas, cumples, y aun así arrastras una fatiga y unas agujetas que no cuadran. A veces no es que te falte constancia: puede haber una tiroides detrás.',
  'Fernando Royano',
  (select id from categories where slug = 'tiroides'),
  now(), '7 min de lectura',
'<p>Hay una frase que odio: <em>"es que te falta constancia".</em> Porque muchas veces se la sueltan a mujeres que aparecen, se esfuerzan y cumplen — y aun así arrastran una fatiga rara, unas agujetas que no se van y una debilidad que no cuadra con lo que entrenan. Cuando eso pasa, no siempre es la cabeza. A veces es el cuerpo avisando.</p>
<h2>La tiroides y tus músculos están más conectados de lo que crees</h2>
<p>La tiroides marca el ritmo de todo, también el de tu tejido muscular. Cuando va lenta, puede aparecer lo que se llama <strong>miopatía hipotiroidea</strong>: debilidad sobre todo en los músculos grandes y cercanos al centro del cuerpo (muslos, caderas, hombros), rigidez, calambres y una <strong>recuperación lentísima</strong>. Te levantas de una silla y te cuesta. Subes escaleras y las notas raras.</p>
<div class="lesson-note"><p><strong>🟠 El dato que casi ningún entrenador conoce:</strong> el hipotiroidismo puede elevar la <strong>CK</strong>, un marcador de daño muscular en sangre, el mismo que sube con el entreno muy duro. Si arrastras fatiga desproporcionada, agujetas eternas y una debilidad que no encaja con lo que haces, no siempre es "poca constancia". Puede haber una tiroides por debajo.</p></div>
<h2>Esto no es para que te autodiagnostiques</h2>
<p>Que quede claro: yo no te estoy diciendo que tengas hipotiroidismo. Te estoy diciendo que hay señales que merece la pena mirar, y que mirarlas es cosa de una analítica y de tu médico. Señales para consultar:</p>
<ul>
<li>Fatiga desproporcionada y que no se va con el descanso.</li>
<li>Debilidad en muslos, caderas u hombros.</li>
<li>Recuperación anormalmente lenta entre sesiones.</li>
<li>Agujetas que duran demasiado sin motivo.</li>
<li>Si encima hay frío constante, piel seca o caída de pelo, más motivo para revisarlo.</li>
</ul>
<h2>La buena noticia</h2>
<p>Que una vez que tu médico ajusta el tratamiento, ese margen se recupera. La fuerza vuelve, la recuperación mejora y el entrenamiento por fin hace su trabajo. Y no, no era falta de constancia. Era una pieza que había que ajustar.</p>
<p>Si quieres entender cómo encaja todo, empieza por la <a href="/blog/adelgazar-con-hipotiroidismo">guía honesta para adelgazar con hipotiroidismo</a>.</p>',
  false
where not exists (select 1 from posts where slug = 'agujetas-cansancio-debilidad-tiroides');


-- ── 3 · Menopausia y tiroides ───────────────────────────────
insert into posts (title, slug, excerpt, author, category_id, published_at, read_time, content, published)
select
  'Menopausia y tiroides: por qué se confunden (y cómo saber cuál es cuál)',
  'menopausia-y-tiroides',
  'Fatiga, peso, niebla mental, insomnio... ¿es la menopausia o es la tiroides? Los síntomas se solapan casi al 100%. Por qué pasa y por qué no deberían despacharte con un "es la edad".',
  'Fernando Royano',
  (select id from categories where slug = 'tiroides'),
  now(), '7 min de lectura',
'<p>Llegas a cierta edad, empiezas con fatiga, el peso que sube, niebla mental, insomnio, cambios de humor... vas al médico y te dicen "es la menopausia, es normal". ¿Y si no fuera solo eso? ¿Y si hubiera una tiroides sin diagnosticar por debajo? Porque los síntomas de las dos cosas se parecen tanto que es facilísimo confundirlas.</p>
<h2>El gran solapamiento</h2>
<p>Fatiga, ganancia de peso, niebla mental, cambios de humor, caída de pelo, insomnio, dolores articulares, alteraciones de la temperatura... aparecen <strong>igual</strong> en la perimenopausia y en el hipotiroidismo. Punto por punto. Por eso a tantas mujeres les dicen "es la edad" cuando en realidad tenían una tiroides lenta sin diagnosticar.</p>
<h2>Por qué coinciden en el tiempo</h2>
<p>No es casualidad. El estrógeno influye en cómo funciona tu tiroides. Cuando cae en la menopausia, puede <strong>desenmascarar</strong> un Hashimoto que estaba latente, sobre todo si ya había anticuerpos. Es decir: la menopausia no te da tiroiditis, pero puede destapar la que ya venía de camino.</p>
<div class="lesson-note"><p><strong>Y algo importante:</strong> las sociedades médicas de menopausia avisan de que no vigilar la tiroides en esta etapa puede sumar riesgo: más ganancia de peso y peor perfil metabólico. O sea, que no es un detalle menor.</p></div>
<h2>No es "o una o la otra"</h2>
<p>Pueden ir perfectamente de la mano. Y lo mejor es que no tienes que adivinarlo: <strong>una analítica lo aclara</strong>. Tu trabajo no es diagnosticarte, es no conformarte con un "es normal a tu edad" y pedir que lo miren. Eso es cuidarte de verdad.</p>
<h2>Y mientras tanto, lo que sí ayuda en las dos</h2>
<p>Da igual que sea menopausia, tiroides o las dos: <strong>la fuerza y la proteína</strong> ayudan en todos los casos. Recuperar músculo, comer suficiente y descansar es la base que sostiene tu cuerpo en esta etapa. Lo tienes desarrollado en la <a href="/blog/adelgazar-con-hipotiroidismo">guía honesta para adelgazar con hipotiroidismo</a>.</p>
<p>Lo de siempre: la analítica y el tratamiento, tu médico. Lo de entrenar y comer para encontrarte bien, lo vemos juntos.</p>',
  false
where not exists (select 1 from posts where slug = 'menopausia-y-tiroides');
