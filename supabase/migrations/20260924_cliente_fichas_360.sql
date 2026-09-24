create table if not exists public.cliente_fichas_360 (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null,
  telefono text,
  respuestas jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists cliente_fichas_360_email_created_idx
  on public.cliente_fichas_360 (lower(email), created_at desc);

alter table public.cliente_fichas_360 enable row level security;

comment on table public.cliente_fichas_360 is
  'Ficha privada de contexto, hábitos, alimentación y entrenamiento. Acceso exclusivo mediante service role.';
