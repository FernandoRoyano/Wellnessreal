# Publicar contenido sin desalinear web y archivos

La fuente que sirve el blog es `posts` en Supabase. Los Markdown de `content/blog` son material editorial; modificarlos no actualiza por sí solo el artículo público. El frontend se despliega desde Git en Vercel.

1. Revisar el texto, fuentes, título, descripción, categoría y texto alternativo.
2. Incluir en el commit cualquier imagen que use una ruta `/blog/...` o `/images/...`. Si la imagen vive en Supabase Storage, subirla y comprobar su URL antes de publicar el artículo.
3. Comprobar que el diff incluye solo los cambios previstos y desplegar el commit. Confirmar que el recurso de imagen devuelve `200` y `image/*`.
4. Publicar el contenido desde el administrador o un script editorial específico revisado. No ejecutar scripts masivos para publicar un solo artículo. La API de administración invalida las páginas y el sitemap.
5. Ejecutar `npm run check:content`. Consulta únicamente artículos publicados y comprueba sus URLs, imágenes y archivos locales. No modifica datos. Requiere las variables Supabase de `.env.local`; no muestra credenciales.
6. Abrir el artículo y el listado en móvil. Revisar imagen, autor, fecha, enlaces y recomendaciones. Comprobar el sitemap tras su invalidación.

Para comprobar un despliegue alternativo: `npm run check:content -- --base-url=https://dominio-del-preview`. Las imágenes externas mantienen su dominio.

El listado del blog se pagina en servidor y no contiene el cuerpo de todos los artículos. Sus filtros se conservan en `categoria` y `pagina`; las categorías filtradas no se indexan, y cada página general de resultados tiene canonical propio.

Los vídeos siguen pendientes de grabación. No lanzar campañas que prometan un vídeo disponible hasta verificar reproductor, acceso y correo de entrega.
