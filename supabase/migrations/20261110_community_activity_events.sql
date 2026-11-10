-- Amplía los eventos admitidos conservando la validación y todos los datos existentes.
begin;
do $$
declare
  previous_check text;
begin
  select pg_get_constraintdef(oid) into previous_check
  from pg_constraint
  where conrelid = 'public.thyroid_funnel_events'::regclass
    and conname = 'thyroid_funnel_events_event_name_check';

  if previous_check is null then
    raise exception 'Falta la validación de eventos esperada; revisa el esquema antes de continuar';
  end if;

  if position('community_active_day' in previous_check) = 0
     or position('community_resource_click' in previous_check) = 0 then
    alter table public.thyroid_funnel_events drop constraint thyroid_funnel_events_event_name_check;
    execute format(
      'alter table public.thyroid_funnel_events add constraint thyroid_funnel_events_event_name_check check ((%s) or event_name in (''community_active_day'', ''community_resource_click''))',
      regexp_replace(previous_check, '^CHECK\s*', '')
    );
  end if;
end $$;
commit;
