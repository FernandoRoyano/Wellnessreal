# Alternativas y sesiones educativas

12 de noviembre de 2026.

## Alcance

- Nueve fichas con alternativas enlazadas, explicando material, cambios de patrón y límites. Las opciones dentro de una misma ficha llevan a sus variantes.
- Dos ejemplos de cuerpo completo en `/comunidad/ejercicios/sesiones`: casa con mancuernas y gimnasio. Cuatro movimientos principales en cada uno; press de hombros opcional en gimnasio.
- Series, repeticiones, descansos, aproximaciones, margen de esfuerzo y un ejemplo de progresión ajustable.
- Acceso desde biblioteca, fichas, rutas seleccionadas y lecciones del espacio gratuito de entrenamiento.
- Se reutilizan ilustraciones y permisos existentes. No se modifica el PDF fitness, la base de datos ni el progreso de cuenta.

## Criterio editorial y fuentes

La dosis y selección se presentan como ejemplos didácticos generales, no como un programa validado en conjunto ni un tratamiento tiroideo. No se exige llegar al fallo ni se promete que cambiar de variante resuelva dolor.

Fuentes primarias consultadas el 12/11/2026:

- [ACSM, actualización 2026](https://acsm.org/resistance-training-guidelines-update-2026/): frecuencia general, individualización, variedad de material y ausencia de necesidad de fallo en todas las series.
- [CDC, actividad física para adultos](https://www.cdc.gov/physical-activity-basics/adding-adults/what-counts.html): fortalecimiento de grupos principales, rangos de repeticiones y series como base general.
- Las fichas mantienen sus fuentes de ejecución ACE.

Las elecciones concretas de variantes, descanso, reserva y progresión son propuestas editoriales de aplicación; no se atribuyen literalmente a las fuentes.

## Diseño

Se conserva la identidad actual. Alternativas en lista dentro de cada ficha y sesiones en flujo de lectura con índice por anclas; controles sin panel fijo y sin añadir dependencias. El destino principal son las fichas y la organización semanal existentes.

## Verificación

Seis pruebas unitarias correctas. Doce casos de navegador comprobados entre Chrome móvil y escritorio: nueve pasaron en la primera ejecución y tres tras corregir el desplazamiento de anclas, una expectativa de título y precalentar la compilación local. Se verifican búsqueda, variantes, sesiones, acceso desde una lección gratuita y redirección sin sesión. Capturas revisadas a 320 y 1440 px; sin desbordamiento horizontal. El arranque local usa webpack porque el enlace de node_modules del worktree no es compatible con la raíz de Turbopack; no se cambia la configuración de producción.

TypeScript y ESLint de los archivos afectados: sin errores.
