# Títulos y navegación de tiroides

Fecha: 4 de noviembre de 2026.

## Cambios

- `/metodo-tiroides`: título «Entrenamiento con hipotiroidismo | Método BASE», 46 caracteres. `title.absolute` evita añadir otra marca mediante la plantilla global. Open Graph y Twitter usan el mismo título. Encabezado e introducción explican entrenamiento, público y acompañamiento de doce semanas. Presentación abreviada para móvil. La oferta, los importes y la solicitud conservan su funcionamiento.
- `/tiroides`: título y encabezado específicos del test gratuito de hábitos, diferenciados del centro informativo y de la página comercial. El test sigue siendo orientativo y no diagnóstico.
- El centro de hipotiroidismo enlaza directamente los artículos existentes sobre gluten y menopausia. La primera guía destacada de `/tiroides` dirige a `/hipotiroidismo/ejercicio`, con la semana orientativa y los ejercicios ilustrados.
- Los enlaces de las guías utilizan su título como texto visible. Se sustituyen los enlaces genéricos «Leer la guía» en el componente de centros temáticos y en `/tiroides`.
- Una presentación al final de `/hipotiroidismo` explica la comunidad gratuita y enlaza a su entrada por email. Las lecciones y conversaciones continúan privadas. Esta pieza busca registros, no se presenta como un factor directo de posicionamiento.
- Fechas de modificación de programa, test y centro actualizadas en el sitemap. Se mantienen las URLs y las canónicas.

## Verificación

- ESLint focalizado, TypeScript y compilación de producción correctos.
- 24 pruebas de navegador en Chrome móvil y escritorio: test, captación de guía, solicitud, clase sin vídeo, confirmación de pago, entrada privada y accesibilidad automática. Envíos simulados, sin solicitudes ni emails reales.
- Tras abreviar la presentación móvil: cuatro pruebas focalizadas adicionales de solicitud y accesibilidad del programa correctas.
- Comprobación final de cuatro páginas a 375, 768 y 1440 px: doce verificaciones de metadatos, canónicas, encabezado único, enlaces y ausencia de desbordamiento. Título del programa confirmado en 46 caracteres.
- Capturas revisadas de programa y test en móvil y de presentación de la comunidad. Las cuatro imágenes compactas de la guía se conservan.
- Enlaces nuevos a gluten y menopausia: HTTP 200. Fechas del sitemap y redirección al acceso privado comprobadas.

## Criterio y límites

La documentación de Google recomienda [títulos descriptivos y coherentes con los encabezados](https://developers.google.com/search/docs/appearance/title-link) y [enlaces con texto que describa el destino](https://developers.google.com/search/docs/crawling-indexing/links-crawlable). Google puede elegir otro título en sus resultados.

El histórico local de Search Console termina el 11 de octubre de 2026. No mide esta tanda ni las revisiones posteriores; no se ha consultado una exportación actual durante este cambio. No se infiere canibalización por similitud de temas ni se fusionan páginas.

La medición posterior debe comparar consultas y páginas en Search Console, comprobar indexación y canónica elegida por Google y separar clics, registros y solicitudes. Publicar y actualizar el sitemap no garantiza indexación ni posiciones.
