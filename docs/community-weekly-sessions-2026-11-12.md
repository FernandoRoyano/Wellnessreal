# Sesiones ilustradas y calendario por cuenta

12 de noviembre de 2026.

## Cambios

- Las dos sesiones muestran miniaturas de las ilustraciones existentes, con texto alternativo, proporción reservada y pie que identifica lo representado. No se generan imágenes nuevas ni se modifica el PDF.
- «Mi semana» permite elegir casa, gimnasio o ninguna sesión para cada día de la semana actual. El resumen abre directamente el ejemplo correspondiente.
- La elección se guarda por miembro y fecha, separada del check-in, las lecturas y el entrenamiento realizado. No se copia automáticamente entre semanas.
- La semana se calcula en Europe/Madrid; se rechaza guardar una página de una semana ya pasada. No se aceptan fechas o identidades de cuenta desde el formulario.
- El selector permanece plegado hasta abrirlo. Los errores de guardado mantienen las elecciones; un fallo al leer conserva acceso a sesiones y PDF.

## Activación

Ejecutar una vez en el SQL Editor de Supabase:

`supabase/migrations/20261112_community_workout_days.sql`

El archivo crea únicamente `community_workout_days`, con clave miembro/fecha, referencia al perfil, valores de sesión acotados, RLS activado y acceso exclusivo del servidor mediante service_role. No modifica datos ni tablas existentes. La acción exige sesión y cuenta aprobada y deriva la identidad de la sesión.

Antes de desplegar se comprobó por REST que la tabla no está disponible (404). La conexión actual permite operaciones de contenido, no crear tablas. Hasta ejecutar la migración se muestra el PDF como alternativa y no se ofrece un guardado falso.

## Verificación

- 6 pruebas unitarias del catálogo y 4 del calendario/acción: fechas al cambiar semana, año y horario; identidad ausente/bloqueada; elecciones y semana inválidas; identidad manipulada; fallo de escritura.
- 4 ejecuciones del calendario en Chrome móvil y escritorio: guardar/recargar, separación entre cuentas, quitar una elección, abrir la sesión ilustrada, errores sin pérdida de selección y lectura no disponible con PDF. Se corrigió el reinicio automático del formulario tras una acción fallida y se repitió el caso afectado correctamente.
- 2 casos de regresión móvil: alternativas y acceso desde lecciones.
- TypeScript y ESLint de archivos afectados sin errores.
- Capturas revisadas a 320 y 1440 px. Imágenes cargadas y sin desbordamiento horizontal.
- Pruebas con servicios y cuentas locales ficticios; sin usuarios ni actividad de prueba en producción.

Pendiente de ejecutar SQL y verificar la tabla real. Las pruebas locales no sustituyen esa activación ni una comprobación de los permisos reales de Postgres.
