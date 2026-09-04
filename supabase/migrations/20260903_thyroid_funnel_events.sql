create table if not exists public.thyroid_funnel_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null check (event_name in (
    'thyroid_landing_view',
    'thyroid_test_start',
    'thyroid_test_question',
    'thyroid_test_complete',
    'thyroid_lead_capture',
    'thyroid_result_view',
    'thyroid_valuation_click',
    'thyroid_valuation_submit',
    'thyroid_sale',
    'thyroid_continuity'
  )),
  lead_id uuid references public.leads(id) on delete set null,
  anonymous_id text,
  session_id text,
  profile text,
  intent text,
  question_id text,
  source text,
  medium text,
  campaign text,
  value numeric(10, 2),
  currency text default 'EUR',
  external_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists thyroid_funnel_events_name_created_idx
  on public.thyroid_funnel_events(event_name, created_at desc);
create index if not exists thyroid_funnel_events_lead_idx
  on public.thyroid_funnel_events(lead_id, created_at desc);
create index if not exists thyroid_funnel_events_profile_intent_idx
  on public.thyroid_funnel_events(profile, intent);
create unique index if not exists thyroid_funnel_events_external_id_idx
  on public.thyroid_funnel_events(external_id)
  where external_id is not null;

alter table public.thyroid_funnel_events enable row level security;

comment on table public.thyroid_funnel_events is
  'Eventos first-party del funnel de tiroides. Acceso exclusivo mediante service role.';
