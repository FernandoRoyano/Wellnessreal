-- Amplía los eventos permitidos del funnel de tiroides con los cinco de la
-- clase (VSL). Sin esto, insertar 'thyroid_vsl_registration' viola el CHECK
-- (23514) y el registro de /tiroides/clase responde 500 sin enviar el email.
--
-- La constraint original se creó inline y sin nombre en
-- 20260903_thyroid_funnel_events.sql, así que Postgres la nombró
-- thyroid_funnel_events_event_name_check.

alter table public.thyroid_funnel_events
  drop constraint if exists thyroid_funnel_events_event_name_check;

alter table public.thyroid_funnel_events
  add constraint thyroid_funnel_events_event_name_check
  check (event_name in (
    'thyroid_landing_view',
    'thyroid_test_start',
    'thyroid_test_question',
    'thyroid_test_complete',
    'thyroid_lead_capture',
    'thyroid_result_view',
    'thyroid_vsl_landing_view',
    'thyroid_vsl_registration',
    'thyroid_vsl_view',
    'thyroid_vsl_progress',
    'thyroid_vsl_cta_click',
    'thyroid_valuation_click',
    'thyroid_valuation_submit',
    'thyroid_sale',
    'thyroid_continuity'
  ));
