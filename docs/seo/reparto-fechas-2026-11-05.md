# Reparto editorial de las publicaciones del 5 de noviembre

A petición de Fernando, los tres artículos concentrados el 5 de noviembre quedan con una semana de separación:

| Artículo | Fecha editorial, hora de Madrid |
| --- | --- |
| Ganar masa muscular con hipotiroidismo | 22 de octubre de 2026, 09:00 |
| Hipotiroidismo y colesterol alto | 29 de octubre de 2026, 09:00 |
| Levotiroxina y ejercicio | 5 de noviembre de 2026, fecha y hora conservadas |

Son fechas editoriales redistribuidas. Las fechas anteriores se conservan en la copia local de `output/blog-dates-20261105/plan.json`, ignorada por Git. El ajuste se limita a `published_at` y la marca técnica de modificación de los dos primeros artículos, sin alterar publicación, identificadores, contenido, imágenes, autores ni el resto del catálogo. Los originales Markdown guardan la fecha con el cambio horario de Madrid correspondiente.

`scripts/redistribute-blog-dates.mjs` prepara la copia y aplica el reparto con `--apply`, comprobando conflictos y verificando la lectura posterior. El despliegue posterior refresca la fecha visible, Open Graph y `datePublished`; la revisión reciente se mantiene separada en `dateModified` y en el sitemap.
