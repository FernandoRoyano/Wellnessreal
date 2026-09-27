# Auditoría de URLs antiguas — Search Console

Fecha: 23 de septiembre de 2026  
Fuente: exportación de Search Console del 14 de marzo al 20 de septiembre de 2026.

## Resumen

- 48 registros exportados.
- 40 URLs únicas tras normalizar barras finales y fragmentos.
- 19 rutas actuales válidas e indexables.
- 5 rutas antiguas con redirección temática directa.
- 2 rutas taxonómicas o auxiliares redirigidas al blog.
- 14 artículos antiguos sin equivalente actual claro.

Las redirecciones genéricas hacia `/blog` solo se mantienen para archivos, etiquetas o contenidos
sin valor recuperable. Los artículos con una intención concreta no deben enviarse a una página
genérica: se recuperarán si muestran demanda o se retirarán cuando Search Console deje de mostrar
señales.

## Rutas actuales correctas

| URL | Impresiones | Acción |
|---|---:|---|
| `/` | 1161 | Mantener |
| `/tarifas` | 141 | Mantener y mejorar CTR |
| `/servicios` | 62 | Mantener |
| `/contacto` | 85 | Canonical ya normaliza la variante con barra |
| `/filosofia` | 71 | Mantener |
| `/recurso-gratis` | 78 | Mantener |
| `/servicios/entrenamiento-online` | 41 | URL comercial prioritaria |
| `/blog/omega-3-mujeres` | 151 | Mantener; requiere mejorar posición antes que CTR |
| `/blog/gluten-e-hipotiroidismo` | 35 | Optimizada y enlazada desde `/tiroides` |
| `/privacidad` | 33 | Mantener |
| `/valoracion` | 24 | Mantener |
| `/servicios/entrenamiento-personalizado` | 21 | Mantener |
| `/blog` | 15 | Mantener |
| `/servicios/osteopatia` | 13 | Mantener |
| `/blog/por-que-no-adelgazo-con-hipotiroidismo` | 12 | Reforzar desde `/tiroides` |
| `/blog/hierro-mujeres` | 11 | Mantener |
| `/blog/entrenar-con-la-regla-fases-ciclo` | 7 | Mantener |
| `/blog/cansancio-e-hipotiroidismo` | 2 | Reforzar desde `/tiroides` |
| `/blog/celulitis-guia-evidencia-cientifica` | 1 | Destino del artículo antiguo |

## Redirecciones temáticas correctas

| URL antigua | Impresiones | Destino |
|---|---:|---|
| `/como-eliminar-la-celulitis-de-las-piernas-y-gluteos/` | 118 | `/blog/celulitis-guia-evidencia-cientifica` |
| `/como-eliminar-las-barreras-mentales/` | 46 | `/blog/la-motivacion-no-es-tu-problema` |
| `/asesoramiento-nutricional/` | 1 | `/servicios/nutricion` |
| `/entrenamiento-presencial/` | 4 | `/servicios/entrenamiento-personalizado` |
| `/osteopatia-y-masajes/` | 1 | `/servicios/osteopatia` |

## Rutas auxiliares

| URL antigua | Impresiones | Acción |
|---|---:|---|
| `/tag/beneficios-para-la-salud/` | 1 | Redirección existente a `/blog` |
| `/newsletter/` | 1 | Redirección a `/blog`, donde existe el formulario global |

## Contenido antiguo pendiente de decisión

| URL antigua | Impresiones | Posición | Recomendación |
|---|---:|---:|---|
| `/alimentacion-adecuada-para-la-fibromialgia/` | 38 | 79,87 | No recuperar salvo que vuelva a ser línea editorial |
| `/la-verdad-sobre-el-aquarius-y-tratamiento-de-la-gastroenteritis/` | 16 | 2,88 | Revisar consulta exacta antes de sustituir la redirección genérica |
| `/cuantos-huevos-puedes-comer-al-dia-mitos-y-realidades/` | 12 | 39,67 | Posible artículo futuro de nutrición |
| `/que-es-el-almidon-resistente/` | 8 | 77,5 | No priorizar |
| `/avena-vs-carne-deja-de-creer-en-cuentos-nutricionales/` | 6 | 7,33 | Recuperar solo tras confirmar consultas e intención |
| `/anatomia-y-biomecanica-del-pie/` | 6 + fragmentos | 59,5 | Posible recurso de osteopatía, baja prioridad |
| `/analisis-e-introduccion-de-los-metodos-de-entrenamiento-de-la-fuerza/` | 4 | 7 | Candidato a recuperar dentro del clúster de fuerza |
| `/peso-libre-vs-maquinas/` | 4 | 71 | No priorizar |
| `/el-tacon-alto-un-enemigo-silencioso-de-tu-salud-y-tu-fuerza/` | 3 | 9 | Candidato secundario para osteopatía |
| `/como-el-estres-afecta-nuestro-organismo-perspectiva-oriental/` | 3 | 54,33 | Fuera del foco editorial actual |
| `/verdades-y-mitos-sobre-el-aceite-de-palma/` | 3 | 69,67 | No priorizar |
| `/lo-que-necesitas-saber-sobre-nutriscore/` | 5 | 87 | Redirección genérica existente; no recuperar por ahora |
| `/seguridad-prevencion-las-playas-fauna-marina/` | 1 | 10 | Fuera del foco; retirar |
| `/dieta-baja-en-carbohidratos-o-low-carb-vegana/` | 1 | 47 | No priorizar |

## Prioridad recomendada

1. Mantener las redirecciones temáticas implantadas.
2. Analizar en Search Console las consultas de `Aquarius`, `avena vs carne` y `métodos de fuerza`.
3. Recuperar solo contenidos que encajen con entrenamiento, hipotiroidismo o nutrición aplicada.
4. Solicitar retirada de URLs fuera de foco solo si continúan rastreándose tras varias semanas.
5. Revisar cobertura e impresiones entre cuatro y seis semanas después del despliegue.
