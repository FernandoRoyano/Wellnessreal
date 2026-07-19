-- ============================================================
--  Comunidad Tiroides · Perfiles de miembro (Supabase Auth)
--  Primer sistema de auth de usuario final del proyecto.
--  El login es magic link (passwordless) -> auth.users.
--  member_profiles es la ficha pública del miembro dentro de la comunidad.
--  Coherente con el resto del proyecto: RLS activado SIN políticas públicas;
--  todo el acceso pasa por el backend con la service role key.
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists member_profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  creado_en     timestamptz not null default now(),

  email         text not null,
  display_name  text not null,
  avatar_url    text,
  bio           text,

  -- 'member' | 'mod' | 'admin' (moderación del foro)
  role          text not null default 'member',

  -- Enlace opcional al cliente de pago (Método BASE), por si un miembro
  -- de la comunidad acaba contratando. No es obligatorio.
  cliente_id    uuid references cliente_perfil(id) on delete set null
);

create index if not exists idx_member_profiles_email on member_profiles(email);
create index if not exists idx_member_profiles_cliente on member_profiles(cliente_id);

alter table member_profiles enable row level security;
