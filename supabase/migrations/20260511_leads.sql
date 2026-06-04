-- Tabla `leads`: registro central de leads para captación + tracking
-- Source de verdad de quién entra por dónde y en qué estado está

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),

  -- Identidad
  email text not null,
  name text,
  phone text,

  -- Origen
  source text not null default 'unknown',
    -- valores: 'guia', 'valoracion', 'metodo-optin', 'newsletter', 'contacto', 'unknown'
  landing_page text,
  referrer text,

  -- UTMs
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,

  -- Meta click IDs (para Conversions API server-side)
  fbc text,
  fbp text,

  -- Estado pipeline
  status text not null default 'nuevo',
    -- valores: 'nuevo', 'contactado', 'qualified', 'cliente', 'descartado'

  -- Datos adicionales del formulario (objetivo, nivel, etc.)
  form_data jsonb,

  -- Tags libres para segmentación
  tags text[] not null default '{}',

  -- Notas internas Fernando
  notes text,

  -- Metadata técnica
  user_agent text,
  ip text,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  contacted_at timestamptz,
  converted_at timestamptz
);

create index if not exists leads_email_idx on public.leads (email);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_source_idx on public.leads (source);
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_utm_campaign_idx on public.leads (utm_campaign);

-- Trigger updated_at
create or replace function public.leads_set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_updated_at_trigger on public.leads;
create trigger leads_updated_at_trigger
before update on public.leads
for each row execute function public.leads_set_updated_at();

-- RLS: solo acceso vía service_role (server-side). El admin panel usa service key.
alter table public.leads enable row level security;
