# Visibilidad en buscadores e IA — 11 de noviembre de 2026

## Objetivo y datos confirmados

Mantener el recorrido público → comunidad gratuita → BASE opcional de pago. Fernando confirma que tiene el grado CAFyD y que su estudio sobre entrenamiento e hipotiroidismo es autodidacta desde hace años. No se atribuye una titulación específica en tiroides, una certificación clínica ni formación impartida por instituciones no identificadas.

## Auditoría de producción

- robots.txt y sitemap.xml responden 200.
- Las 88 URL del sitemap responden 200, con canónica coincidente y sin noindex.
- Solicitudes con los agentes declarados Googlebot y OAI-SearchBot: 200 y contenido legible en robots, sitemap, perfil, BASE y artículo sobre elección de entrenador.
- El grupo User-Agent: * permite las páginas públicas y conserva las exclusiones de áreas privadas. No es necesario añadir un grupo específico que pueda perder esas exclusiones.
- Las respuestas obtenidas desde nuestra conexión no certifican acceso desde las IP reales de los buscadores ni descartan restricciones por IP en el alojamiento. No se ha accedido a Search Console ni a registros de rastreo reales en esta revisión.
- Ya existen ProfilePage/Person, firma de Fernando enlazada al perfil y autor del artículo con identificador estable. No se crean archivos ni marcado supuestamente exclusivos para IA.

## Cambios

1. BASE conserva URL, precio, disponibilidad, formularios y recorrido; título y encabezado explicitan el entrenamiento con hipotiroidismo y Hashimoto.
2. Ejemplo público en /metodo-tiroides#ejemplo-seguimiento: aclarar el obstáculo → elegir alternativa → revisar respuesta. Marcado como didáctico, sin presentarlo como caso real ni prescripción.
3. Sobre mí: comunidad gratuita como acción principal, programa como opción posterior; descripción explícita del estudio autodidacta y separación de la trayectoria general de entrenamiento.
4. Firma ampliada de artículos de tiroides: formación base CAFyD y estudio autodidacta específico, con enlace al perfil y límites sanitarios.
5. lastModified de las dos páginas editadas en el sitemap: 11 de noviembre. No se modifica published_at de los artículos ni se fuerza una falsa revisión de todos sus cuerpos por cambiar la firma común.

## Reutilizar el contenido existente

| Pregunta | Destino público |
| --- | --- |
| Cómo elegir entrenador con hipotiroidismo | /blog/entrenador-online-hipotiroidismo |
| Cómo empezar fuerza con poca experiencia | /blog/rutina-fuerza-casa-hipotiroidismo y /hipotiroidismo/ejercicio |
| Cómo se revisa una semana | /metodo-tiroides#ejemplo-seguimiento |
| Qué incluye el seguimiento | /metodo-tiroides#semana-programa y condiciones del programa |

No se añaden páginas casi idénticas para cubrir consultas similares. Los recursos completos privados siguen dentro de la comunidad; la explicación del método es pública.

## Pendientes que requieren material o datos reales

- Casos: autorización específica, punto de partida, duración, proceso, resultados y límites. No se han aportado nuevos casos autorizados en esta sesión.
- Vídeos propios y colaboraciones: publicar únicamente material confirmado; no se contacta a terceros ni se inventan avales.
- Search Console: seguir consultas y páginas prioritarias; comparar registros y solicitudes con denominadores. El rastreo simulado no es prueba de indexación.
- Analítica: la captura existente admite utm_source y consentimiento. No se añaden proveedores ni se afirma haber observado tráfico de ChatGPT o nuevos clientes. Atribución de visitas no equivale a demostrar todas las menciones de una IA.

## Fundamento

- [Google: funciones de IA y tu sitio](https://developers.google.com/search/docs/appearance/ai-features).
- [Google: optimización para funciones generativas](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).
- [Google: contenido útil y fiable](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
- [OpenAI: rastreadores](https://developers.openai.com/api/docs/bots).

Se aplican fundamentos de accesibilidad de rastreo, claridad y contenido útil. Ningún cambio garantiza indexación, posición ni cita por una IA.

## Validación

TypeScript y ESLint focalizado; comprobación con navegador sin envío de formularios en 390 y 1440 px: páginas 200, título, enlaces a comunidad, perfil estructurado, tres pasos del ejemplo y ausencia de desbordamiento horizontal. Proveedores de prueba locales y comunicaciones externas bloqueadas. Capturas y auditoría reproducible guardadas en output/search-visibility-2026-11-11 del workspace principal.
