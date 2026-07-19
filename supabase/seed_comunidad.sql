-- ============================================================
--  Comunidad Tiroides · Datos de ejemplo (opcional)
--  Ejecutar UNA vez en el SQL Editor de Supabase, DESPUÉS de las
--  migraciones de comunidad. Idempotente: se puede reejecutar sin duplicar.
--  Borra todo con:  delete from spaces where slug in
--    ('empieza-aqui','aprende-tiroides','preguntas-apoyo');
-- ============================================================

-- ── Espacios ──
insert into spaces (slug, name, description, icon, type, sort_order) values
  ('empieza-aqui',    'Empieza aquí',          'Lo primero que deberías leer al entrar.', 'sparkles', 'content', 0),
  ('aprende-tiroides','Aprende sobre tiroides','Contenido paso a paso para entender tu metabolismo.', 'book-open', 'content', 1),
  ('preguntas-apoyo', 'Preguntas y apoyo',     'Pregunta lo que quieras y comparte tu experiencia.', 'messages-square', 'forum', 2)
on conflict (slug) do nothing;

-- ── Lecciones · Empieza aquí ──
insert into lessons (space_id, slug, title, content, sort_order, drip_days)
select id, 'bienvenida', 'Bienvenida a la comunidad',
  '<h2>Me alegra que estés aquí</h2><p>Esta comunidad es para personas con hipotiroidismo o Hashimoto que están cansadas de milagros y quieren entender de verdad qué le pasa a su cuerpo. Sin postureo, sin culpas.</p><p>Tómatelo con calma: el contenido se va desbloqueando poco a poco para que puedas asimilarlo sin agobios.</p>',
  0, 0
from spaces where slug = 'empieza-aqui'
on conflict (space_id, slug) do nothing;

insert into lessons (space_id, slug, title, content, sort_order, drip_days)
select id, 'como-usar-la-comunidad', 'Cómo sacarle partido',
  '<h2>Tres ideas para empezar</h2><ul><li><strong>Preséntate</strong> en el foro de <em>Preguntas y apoyo</em>: cuéntanos tu caso.</li><li><strong>Aplica una sola cosa</strong> de cada lección. No intentes cambiar todo a la vez.</li><li><strong>Vuelve cada semana</strong>: irás desbloqueando contenido nuevo.</li></ul>',
  1, 0
from spaces where slug = 'empieza-aqui'
on conflict (space_id, slug) do nothing;

-- ── Lecciones · Aprende sobre tiroides ──
insert into lessons (space_id, slug, title, content, sort_order, drip_days)
select id, 'metabolismo-lento-no-roto', 'Tu metabolismo está lento, no roto',
  '<h2>La diferencia lo cambia todo</h2><p>El hipotiroidismo ralentiza tu metabolismo, pero no lo rompe. Con el tratamiento adecuado, fuerza y descanso, puedes recuperar mucho más de lo que crees.</p><p>En esta lección verás por qué la comida y el entrenamiento importan más que cualquier suplemento de moda.</p>',
  0, 0
from spaces where slug = 'aprende-tiroides'
on conflict (space_id, slug) do nothing;

insert into lessons (space_id, slug, title, content, sort_order, drip_days)
select id, 'los-4-pilares', 'Los 4 pilares que sí mueven la aguja',
  '<h2>Fuerza, proteína, sueño y constancia</h2><p>Esta lección se desbloquea unos días después de entrar, cuando ya has asentado lo básico. Aquí desarrollamos los cuatro pilares con ejemplos concretos.</p>',
  1, 3
from spaces where slug = 'aprende-tiroides'
on conflict (space_id, slug) do nothing;

insert into lessons (space_id, slug, title, content, sort_order, drip_days)
select id, 'la-bascula-miente', 'Por qué la báscula te miente',
  '<h2>Mide lo que importa</h2><p>El peso sube y baja por agua, hormonas y muchas cosas que no son grasa. En esta lección aprendes qué mirar en su lugar.</p>',
  2, 7
from spaces where slug = 'aprende-tiroides'
on conflict (space_id, slug) do nothing;

-- ── Lección con VÍDEO de ejemplo (YouTube / Vimeo) ──
-- Así se ve una lección con vídeo. Pega tu enlace en el editor con el botón ▶️,
-- o mete el HTML directamente como aquí. Cambia el src del iframe por tu vídeo:
--   YouTube → https://www.youtube.com/embed/TU_VIDEO_ID
--   Vimeo   → https://player.vimeo.com/video/TU_VIDEO_ID
-- El iframe usa un vídeo de ejemplo (open-source) para que se vea funcionando.
-- Sustitúyelo por el tuyo: edita la lección y pega tu enlace con el botón ▶️,
-- o cambia el VIDEO_ID en la URL (YouTube: /embed/ID ; Vimeo: /video/ID).
insert into lessons (space_id, slug, title, content, sort_order, drip_days)
select id, 'video-bienvenida', 'Vídeo: mi historia con la tiroides',
  '<h2>Te lo cuento en 3 minutos</h2><p>Antes de entrar en materia, mira este vídeo (es de ejemplo, cámbialo por el tuyo):</p><div data-video-embed="" class="video-embed"><iframe src="https://www.youtube.com/embed/aqz-KE-bpKQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true"></iframe></div><p>Cuando termines, sigue con las lecciones de abajo.</p>',
  2, 0
from spaces where slug = 'empieza-aqui'
on conflict (space_id, slug) do nothing;
