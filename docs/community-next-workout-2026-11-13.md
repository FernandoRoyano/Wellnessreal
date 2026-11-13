# Próxima sesión en el inicio

13 de noviembre de 2026.

El inicio de la comunidad muestra la próxima sesión reservada de la semana actual, incluyendo hoy, y enlaza directamente a su ejemplo. La fecha se interpreta en Europe/Madrid. La elección procede del calendario existente, por miembro; no se añaden tablas, eventos, cookies ni registros de entrenamiento realizado.

Estados: sesión de hoy, próxima fecha, sin reservas, fechas reservadas ya pasadas y lectura no disponible. Ningún estado deduce que se haya entrenado. El enlace secundario permite ajustar los días desde Mi semana. Al guardar el plan se revalidan Mi semana y el inicio para evitar información antigua.

Validación: pruebas unitarias de fechas y selección sin mutar datos; navegador móvil y escritorio para vacío/hoy/futuro/pasado, apertura del ejemplo, enlace al calendario y fallo de lectura. TypeScript y ESLint de archivos afectados sin errores. El caso futuro/pasado de navegador depende del día real; las pruebas unitarias cubren ambos de forma determinista.

## Publicación y comprobación real

Implementación 0c1a1f0 publicada el 13/11/2026. Deployment activo dpl_HNDFFvDpbmPXadwtZEWWgPSpRvgk, READY y promovido tras comprobar la versión anterior. Cinco pruebas unitarias y cuatro ejecuciones de navegador correctas. En producción, una cuenta temporal confirmó guardado/recarga, vista móvil independiente, actualización del inicio al cambiar el calendario y apertura de la sesión reservada desde el inicio móvil. Capturas revisadas de escritorio y móvil. Cuenta y datos temporales eliminados y verificados; no se modificó la cuenta de Fernando. Un primer intento del script de producción falló por su codificación de texto, se corrigió y la ejecución completa pasó. Evidencias: output/community-next-workout-2026-11-13 en el workspace principal.
