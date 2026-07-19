-- ============================================================
--  Comunidad Tiroides · Contenido (espacios + lecciones)
--  Estructura estilo Skool: la comunidad se divide en "espacios"
--  (spaces). Un espacio puede ser de contenido (lecciones) o de foro.
--  Las lecciones admiten "drip": se desbloquean N días después de que
--  el miembro se registró (nurture / hábito de volver).
--  access_tier queda desde el día 1 para activar premium sin migrar.
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Espacios (secciones de la comunidad)
-- ------------------------------------------------------------
create table if not exists spaces (
  id           uuid primary key default gen_random_uuid(),
  creado_en    timestamptz not null default now(),

  slug         text not null unique,
  name         text not null,
  description  text,
  icon         text,                                  -- nombre de icono (lucide)

  -- 'content' (lecciones) | 'forum' (hilos)
  type         text not null default 'content',
  sort_order   int  not null default 0,
  access_tier  text not null default 'free',
  published    boolean not null default true
);

create index if not exists idx_spaces_orden on spaces(sort_order);

-- ------------------------------------------------------------
-- Lecciones (contenido educativo dentro de un espacio 'content')
-- ------------------------------------------------------------
create table if not exists lessons (
  id           uuid primary key default gen_random_uuid(),
  creado_en    timestamptz not null default now(),
  space_id     uuid not null references spaces(id) on delete cascade,

  slug         text not null,
  title        text not null,
  content      text not null default '',             -- HTML del editor TipTap
  cover_url    text,
  sort_order   int  not null default 0,

  -- Drip: días tras el registro del miembro para desbloquear (0 = inmediato).
  drip_days    int  not null default 0,
  access_tier  text not null default 'free',
  published    boolean not null default true,

  unique (space_id, slug)
);

create index if not exists idx_lessons_space on lessons(space_id, sort_order);

-- ------------------------------------------------------------
-- Seguridad: RLS activado sin políticas públicas (backend service-role)
-- ------------------------------------------------------------
alter table spaces  enable row level security;
alter table lessons enable row level security;
