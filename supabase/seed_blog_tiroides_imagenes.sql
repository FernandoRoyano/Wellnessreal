-- ============================================================
--  Blog · Imágenes destacadas de los posts de tiroides
--  Asigna a cada artículo su imagen de public/blog/*.png.
--  Ejecutar DESPUÉS de haber creado los posts (los 3 seeds).
--  Idempotente: si el post no existe todavía, no hace nada.
-- ============================================================

update posts set
  main_image_url = '/blog/01_adelgazar.png',
  main_image_alt = 'Adelgazar con hipotiroidismo, sin milagros'
where slug = 'adelgazar-con-hipotiroidismo';

update posts set
  main_image_url = '/blog/02_porque_no.png',
  main_image_alt = 'Por qué no adelgazo aunque lo hago todo bien con hipotiroidismo'
where slug = 'por-que-no-adelgazo-con-hipotiroidismo';

update posts set
  main_image_url = '/blog/03_gluten.png',
  main_image_alt = 'Gluten e hipotiroidismo: ¿hay que dejarlo?'
where slug = 'gluten-e-hipotiroidismo';

update posts set
  main_image_url = '/blog/04_ejercicio.png',
  main_image_alt = 'El mejor ejercicio para la tiroides lenta'
where slug = 'mejor-ejercicio-hipotiroidismo';

update posts set
  main_image_url = '/blog/05_cansancio.png',
  main_image_alt = 'Cansancio e hipotiroidismo: qué puedes hacer'
where slug = 'cansancio-e-hipotiroidismo';

update posts set
  main_image_url = '/blog/06_suplementos.png',
  main_image_alt = 'Suplementos para la tiroides: selenio, yodo y humo'
where slug = 'suplementos-tiroides';
