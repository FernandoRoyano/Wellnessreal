-- ============================================================
--  Blog · Publicar el clúster de tiroides con fechas + garantizar CTAs
--  Ejecuta este archivo en el SQL Editor del proyecto donde YA tienes
--  los 6 posts cargados (los que tienen la foto puesta).
--
--  Por cada artículo:
--    · lo PUBLICA (published = true)
--    · le pone una fecha escalonada (cadencia ~semanal → blog activo)
--    · lo mete en la categoría "Tiroides" (para que salgan solos los
--      CTAs de la guía y la comunidad)
--
--  Solo hace UPDATE: no crea posts ni puede fallar por tablas.
--  Idempotente: se puede reejecutar sin problema.
-- ============================================================

-- Asegura que existe la categoría Tiroides (si ya está, no hace nada)
insert into categories (title, slug, description)
select 'Tiroides', 'tiroides', 'Entrenar, comer y vivir mejor con hipotiroidismo o Hashimoto. Sin milagros.'
where not exists (select 1 from categories where slug = 'tiroides');

-- 1 · Pilar · 10 jun
update posts set
  published = true,
  published_at = '2026-06-10 09:00:00+02'::timestamptz,
  category_id = (select id from categories where slug = 'tiroides')
where slug = 'adelgazar-con-hipotiroidismo';

-- 2 · ¿Por qué no adelgazo? · 19 jun
update posts set
  published = true,
  published_at = '2026-06-19 09:00:00+02'::timestamptz,
  category_id = (select id from categories where slug = 'tiroides')
where slug = 'por-que-no-adelgazo-con-hipotiroidismo';

-- 3 · Gluten · 30 jun
update posts set
  published = true,
  published_at = '2026-06-30 09:00:00+02'::timestamptz,
  category_id = (select id from categories where slug = 'tiroides')
where slug = 'gluten-e-hipotiroidismo';

-- 4 · Ejercicio · 8 jul
update posts set
  published = true,
  published_at = '2026-07-08 09:00:00+02'::timestamptz,
  category_id = (select id from categories where slug = 'tiroides')
where slug = 'mejor-ejercicio-hipotiroidismo';

-- 5 · Cansancio · 15 jul
update posts set
  published = true,
  published_at = '2026-07-15 09:00:00+02'::timestamptz,
  category_id = (select id from categories where slug = 'tiroides')
where slug = 'cansancio-e-hipotiroidismo';

-- 6 · Suplementos · 22 jul
update posts set
  published = true,
  published_at = '2026-07-22 09:00:00+02'::timestamptz,
  category_id = (select id from categories where slug = 'tiroides')
where slug = 'suplementos-tiroides';

-- Comprobación: deberían salir las 6 filas, published = true, categoría tiroides
select slug, published, published_at, category_id
from posts
where slug in (
  'adelgazar-con-hipotiroidismo',
  'por-que-no-adelgazo-con-hipotiroidismo',
  'gluten-e-hipotiroidismo',
  'mejor-ejercicio-hipotiroidismo',
  'cansancio-e-hipotiroidismo',
  'suplementos-tiroides'
)
order by published_at;
