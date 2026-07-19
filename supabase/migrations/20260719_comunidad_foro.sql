-- ============================================================
--  Comunidad Tiroides · Foro (hilos + comentarios + likes)
--  Foro asíncrono estilo Skool. Los hilos viven dentro de un
--  espacio de tipo 'forum'. Comentarios con 1 nivel de anidación
--  (respuestas a comentario). Likes sobre hilos o comentarios.
--  RLS activado sin políticas públicas: acceso por backend
--  autorizando contra el miembro logueado.
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Hilos
-- ------------------------------------------------------------
create table if not exists threads (
  id           uuid primary key default gen_random_uuid(),
  creado_en    timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),

  space_id     uuid not null references spaces(id) on delete cascade,
  author_id    uuid not null references member_profiles(id) on delete cascade,

  title        text not null,
  body         text not null default '',
  pinned       boolean not null default false
);

create index if not exists idx_threads_space on threads(space_id, pinned desc, actualizado_en desc);

-- ------------------------------------------------------------
-- Comentarios (parent_id null = comentario raíz; si no, es respuesta)
-- ------------------------------------------------------------
create table if not exists comments (
  id           uuid primary key default gen_random_uuid(),
  creado_en    timestamptz not null default now(),

  thread_id    uuid not null references threads(id) on delete cascade,
  parent_id    uuid references comments(id) on delete cascade,
  author_id    uuid not null references member_profiles(id) on delete cascade,

  body         text not null
);

create index if not exists idx_comments_thread on comments(thread_id, creado_en);

-- ------------------------------------------------------------
-- Likes (sobre hilo o comentario). Único por miembro + objeto.
-- ------------------------------------------------------------
create table if not exists likes (
  id           uuid primary key default gen_random_uuid(),
  creado_en    timestamptz not null default now(),

  member_id    uuid not null references member_profiles(id) on delete cascade,
  target_type  text not null,                 -- 'thread' | 'comment'
  target_id    uuid not null,

  unique (member_id, target_type, target_id)
);

create index if not exists idx_likes_target on likes(target_type, target_id);

-- ------------------------------------------------------------
-- Seguridad
-- ------------------------------------------------------------
alter table threads  enable row level security;
alter table comments enable row level security;
alter table likes    enable row level security;
