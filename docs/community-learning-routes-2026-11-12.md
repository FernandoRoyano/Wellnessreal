# Rutas de aprendizaje — 12 de noviembre de 2026

## Recorrido

Tres rutas gratuitas en /comunidad/rutas, accesibles desde el inicio y el menú. Se conserva la comparación entre comunidad y BASE en /comunidad/recorrido, etiquetada «Comunidad y BASE» en el menú para distinguirla de las rutas.

| Ruta | Lecturas, en orden | Recurso |
| --- | --- | --- |
| Empiezo | Bienvenida → Por qué empezar con fuerza → Primera rutina de fuerza | Planificador semanal |
| Retomo | Bienvenida → Entrenar cuando estás cansada → Progresar sin agotarte | Registro semanal |
| Quiero organizarme | Bienvenida → Organizar dos días → Qué hacer durante una mala semana | Planificador semanal |

Son selecciones de contenido educativo existente, no planes individuales ni valoraciones sanitarias. Hay una acción de organización para aplicar y un PDF disponible aunque la siguiente lectura siga bloqueada.

La ruta elegida aparece en la URL (?ruta=empezar, retomar u organizar), que se puede volver a abrir o guardar. No se añade una preferencia permanente al perfil. El progreso sí pertenece a la cuenta y es compartido entre todas las rutas, el lector, el inicio y Mi semana. Cambiar de ruta no reinicia ni modifica marcas.

En el lector se mantiene el contexto mediante el parámetro validado. «Continuar ruta» devuelve al recorrido elegido con su siguiente paso actualizado, en lugar de sugerir otra secuencia. Sin contexto de ruta se conserva la navegación anterior del lector. El destino tras autenticarse conserva una ruta válida.

## Acceso y estados

- Se usan espacios y lecciones gratuitos y publicados; se reutilizan sesión, permisos y bloqueos existentes.
- Una lectura bloqueada muestra su estado y días restantes, sin enlace al lector ni contenido del cuerpo.
- Una lectura ausente no se presenta como publicación futura; se muestra no disponible y no completa la ruta.
- La primera lectura pendiente determina el siguiente paso; no se saltan bloqueos para fingir continuidad.
- Cuando todas están completadas, se ofrece repaso, recurso o cambio de ruta; no se reinicia la secuencia.
- Valores desconocidos de ruta devuelven 404. El lector ignora contexto inválido o de una ruta que no contiene esa lección.
- En una ruta seleccionada, «Cambiar ruta» está plegado; al cambiar se vuelve a plegar. No se añade una barra fija de filtros.

## Verificación

Cinco pruebas unitarias: lista permitida de identificadores, orden y progreso compartido, bloqueo sin salto, ausencias y contenido premium excluidos, y conservación del destino interno con su consulta al pedir acceso. Seis casos de navegador entre móvil y escritorio: selección y retorno tras completar, cambio conservando avance, bloqueo con recurso disponible, rutas completadas y consulta inválida. Revisadas capturas de 320 y 1440 px sin desbordamiento. TypeScript y ESLint focalizado pasan.

Consulta de metadatos reales confirma las siete lecciones utilizadas como publicadas, gratuitas y dentro de sus espacios correspondientes. No se modifica contenido del CMS ni se crean registros de miembros o progreso de prueba en producción. No requiere SQL adicional.

Evidencias locales: output/community-learning-routes-2026-11-12 del workspace principal. Las pruebas privadas usan servicios y sesiones ficticios; no equivalen a una sesión real en producción.

## Publicación

Implementación final f380f79 publicada en dpl_5iRZMM9tgiC2KzezNELah97xsM4H tras verificar READY y la versión previa activa. Comprobación pública: rutas y lector requieren acceso; el parámetro de ruta se conserva como destino interno al entrar. La página de entrada responde 200. Comprobante: public-verification.json en el directorio de evidencias. No se crean miembros ni marcas de progreso de prueba en producción.
