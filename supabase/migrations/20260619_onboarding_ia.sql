-- ============================================================
--  Método BASE · Onboarding inteligente con IA
--  Modelo de datos: onboarding + memoria del cliente + programas versionados
-- ============================================================
--  Ejecutar en el editor SQL de Supabase.
--  Todo el acceso pasa por el backend con la service role key (salta RLS).
--  RLS activado SIN políticas públicas: el cliente nunca lee estas tablas
--  con la anon key.
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. Respuestas del cuestionario (entrada cruda del onboarding)
-- ------------------------------------------------------------
create table if not exists onboarding_respuestas (
  id              uuid primary key default gen_random_uuid(),
  creado_en       timestamptz not null default now(),

  nombre          text not null,
  email           text not null,

  edad            int,
  sexo            text,
  altura_cm       int,
  peso_kg         numeric,

  objetivo_principal     text not null,
  objetivos_secundarios  text[],

  dias_semana     int,
  minutos_sesion  int,
  donde_entrena   text,
  material        text,

  experiencia     text,
  lesiones        text,
  consideraciones text,

  alergias            text,
  preferencias_comida text,
  estilo_vida         text,

  estado          text not null default 'pendiente'  -- pendiente | generado | revisado | enviado
);

-- ------------------------------------------------------------
-- 2. Perfil canónico (memoria duradera: la "ficha" siempre actualizada)
-- ------------------------------------------------------------
create table if not exists cliente_perfil (
  id              uuid primary key default gen_random_uuid(),
  creado_en       timestamptz not null default now(),
  actualizado_en  timestamptz not null default now(),
  onboarding_id   uuid references onboarding_respuestas(id) on delete set null,

  nombre          text not null,
  email           text not null unique,

  -- hechos duraderos (se actualizan cuando el cliente reporta algo relevante)
  objetivo_principal     text,
  objetivos_secundarios  text[],
  donde_entrena   text,
  material        text,
  dias_semana     int,
  minutos_sesion  int,
  experiencia     text,
  lesiones        text,
  alergias        text,
  preferencias_comida text,
  estilo_vida     text,

  -- estado del programa
  fase_actual     int default 1,        -- 1 | 2 | 3
  semana_actual   int default 1,        -- 1..12
  estado_programa text default 'activo' -- activo | pausado | finalizado
);

-- ------------------------------------------------------------
-- 3. Historial (append-only: todo lo que pasa, nunca se borra)
-- ------------------------------------------------------------
create table if not exists eventos_cliente (
  id          uuid primary key default gen_random_uuid(),
  creado_en   timestamptz not null default now(),
  cliente_id  uuid not null references cliente_perfil(id) on delete cascade,
  semana      int,
  tipo        text not null,   -- check_in | cambio_reportado | ajuste | nota
  contenido   jsonb not null
);
create index if not exists idx_eventos_cliente on eventos_cliente(cliente_id, creado_en);

-- ------------------------------------------------------------
-- 4. Programas generados (versionado: cada ajuste crea una versión nueva)
-- ------------------------------------------------------------
create table if not exists programas_generados (
  id              uuid primary key default gen_random_uuid(),
  creado_en       timestamptz not null default now(),
  cliente_id      uuid references cliente_perfil(id) on delete cascade,
  onboarding_id   uuid references onboarding_respuestas(id) on delete set null,
  version         int not null default 1,
  vigente         boolean not null default true,   -- solo una versión vigente por cliente
  programa        jsonb not null,
  origen          text not null default 'generacion', -- generacion | ajuste
  modelo          text,
  meta            jsonb,

  -- flujo "cliente rellena, Fernando revisa antes de enviar"
  revisado        boolean not null default false,
  revisado_en     timestamptz
);
create index if not exists idx_programas_cliente on programas_generados(cliente_id, vigente);
create index if not exists idx_programas_onboarding on programas_generados(onboarding_id);
create index if not exists idx_onboarding_email on onboarding_respuestas(email);

-- ------------------------------------------------------------
-- 5. Seguridad (RLS activado, sin políticas públicas)
-- ------------------------------------------------------------
alter table onboarding_respuestas enable row level security;
alter table cliente_perfil       enable row level security;
alter table eventos_cliente      enable row level security;
alter table programas_generados  enable row level security;
