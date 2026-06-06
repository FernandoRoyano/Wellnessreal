-- Sincroniza el enum service_type con los valores definidos en TypeScript.
-- Añade los valores que falten (idempotente: si ya existen, no hace nada).
--
-- Bug previo: "pack_6meses_transformacion" estaba en src/lib/types/database.ts
-- pero NO en el enum de Postgres, lo que devolvía 500 al crear propuestas
-- con ese servicio.

alter type service_type add value if not exists 'starter_1mes';
alter type service_type add value if not exists 'pack_3meses';
alter type service_type add value if not exists 'pack_6meses_transformacion';
alter type service_type add value if not exists 'premium_3meses';
alter type service_type add value if not exists 'solo_entrenamiento_trimestral';
alter type service_type add value if not exists 'entrenamiento_presencial';
alter type service_type add value if not exists 'consulta_nutricion';
alter type service_type add value if not exists 'analisis_corporal';
alter type service_type add value if not exists 'sesion_osteopatia';
alter type service_type add value if not exists 'pack_combinado';
alter type service_type add value if not exists 'personalizado';
