# Publicación de los artículos revisados de tiroides

Fecha: 5 de noviembre de 2026. Autorización: «subelo», después de la revisión integral.

Se publican los artículos siguientes con su fecha real de salida, sustituyendo las fechas de sus borradores:

- [Levotiroxina y ejercicio: horarios, café y suplementos](https://wellnessreal.es/blog/levotiroxina-y-ejercicio).
- [Hipotiroidismo y colesterol alto: qué relación tienen](https://wellnessreal.es/blog/hipotiroidismo-y-colesterol).

La publicación se limita a esos dos registros. Conserva texto, títulos, descripciones, autores, categorías y portadas revisados. El script `scripts/publish-reviewed-thyroid-posts.mjs` compara ambos registros con las revisiones y sus hashes antes de publicar, comprueba las imágenes y usa control de concurrencia. Las copias y los recibos están excluidos de Git en `output/thyroid-publication-20261105/`.

El despliegue incorpora también las correcciones de títulos duplicados y la mejora del foco en el formulario de entrada a la comunidad, verificadas durante la revisión. No requiere cambios en las variables de producción.

La comprobación posterior incluye disponibilidad, imagen, H1, descripción, canonical, indexabilidad, fecha y autor en datos estructurados, enlaces internos, listado del blog y sitemap. Sus resultados y capturas se guardan localmente en la carpeta de publicación.

Después de comprobar la web publicada, queda inspeccionar las dos URLs nuevas en Search Console. La presencia en el sitemap y una respuesta HTTP correcta no confirman que Google ya las haya indexado.
