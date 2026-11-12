# Progreso por cuenta — 12 de noviembre de 2026

## Resultado preparado

Las lecciones completadas se guardan en lesson_progress por member_id y lesson_id. Inicio, espacio, lector y Mi semana consultan el mismo progreso. Al abrir la comunidad desde otro dispositivo con la misma cuenta se recupera el avance. Una página ya abierta se actualiza al navegar o recargar; no se añade sincronización en tiempo real.

Las acciones obtienen el miembro desde la sesión validada; nunca aceptan un member_id del formulario. Cada escritura comprueba también el estado del miembro y el acceso actual a la lección, incluidos nivel y desbloqueo. La tabla mantiene RLS y acceso directo denegado a anon/authenticated; se utiliza el patrón de servidor con service_role ya existente en la comunidad.

Completar hace INSERT con conflicto ignorado: no duplica filas ni cambia la fecha original. Desmarcar solo elimina la pareja miembro/lección. Se conservan los eventos existentes y su consentimiento; la importación de marcas anteriores no genera eventos retrospectivos de primera lección completada.

## Marcas anteriores

La cookie wr_lesson_progress no identifica propietario. No se mezcla automáticamente con ninguna cuenta. En la portada se ofrece una lista de marcas disponibles y todavía no presentes en la cuenta; el miembro confirma «Son mías: añadir a mi cuenta».

La acción vuelve a comprobar la cookie y los permisos en servidor. Se importan solo lecciones publicadas y desbloqueadas. Las marcas no disponibles permanecen en el navegador. Tras escribir correctamente se retiran de la cookie solo las marcas importadas, utilizando su path original /comunidad. Un fallo conserva las marcas para reintentar. El resultado visible distingue lectura completada de ejercicio realizado.

## Fallos

- Una escritura fallida muestra un mensaje y revierte la marca optimista.
- Una lectura fallida no devuelve silenciosamente progreso cero; se propaga al límite de error de la comunidad, que permite reintentar.
- Los duplicados y reintentos de importación son seguros gracias a la clave compuesta.
- No se cambian planes, pagos, accesos ni la fecha de inicio de la medición de continuidad.

## Activación pendiente

1. Ejecutar supabase/migrations/20261112_community_lesson_progress.sql en el SQL Editor del proyecto correcto de Supabase.
2. Confirmar lectura del esquema con select de cero filas y las columnas member_id, lesson_id y completed_at.
3. Compilar y desplegar la versión aislada. Comprobar la versión activa antes de promocionar para no reemplazar trabajo concurrente.
4. Verificar entrada protegida y con una cuenta de prueba autorizada el guardado y la recuperación en otro navegador. No se crean miembros ni progresos ficticios en producción durante esta preparación.

La conexión disponible es la API de datos con service_role; no hay conexión PostgreSQL de administración ni token de gestión disponibles para ejecutar DDL. La comprobación del esquema devuelve 404. La aplicación preparada no se despliega hasta crear la tabla.

La migración es aditiva y repetible, no modifica tablas existentes. Si hay que revertir código, conservar la tabla y sus datos. Las marcas ya importadas seguirán en la base de datos; una versión antigua que solo lea cookies no las mostrará hasta recuperar el código compatible.

## Verificación realizada

- Cinco pruebas unitarias: aislamiento por cuenta, borrado acotado, duplicados/fecha, cookie malformada y retirada selectiva, y fallos sin eliminación de marcas anteriores.
- Ocho pruebas de navegador en móvil y escritorio: segundo contexto de navegador, cambio de cuenta y formulario con miembro falsificado; importación voluntaria, exclusión premium y reintento; fallo de escritura con recuperación; objetivo de lección falsificado y valor de completado inválido.
- El recorrido gratuito existente pasa en móvil y escritorio con su estado de prueba reiniciado por cuenta.
- TypeScript y ESLint focalizado sin errores.
- Migración ejecutada dos veces en PostgreSQL WASM (PGlite 0.5.16) aislado: RLS activo, lectura/escritura denegadas a anon/authenticated, acceso service_role, clave compuesta, fecha original, clave foránea y cascada al borrar miembro.

PGlite es una dependencia temporal de pruebas instalada en output del workspace principal; no se añade a las dependencias de la aplicación. No sustituye la comprobación final en Supabase. Evidencias: output/community-progress-2026-11-12 del workspace principal. No hay cambios en producción todavía.
