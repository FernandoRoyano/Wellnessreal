alter table public.thyroid_funnel_events
  drop constraint if exists thyroid_funnel_events_event_name_check;

alter table public.thyroid_funnel_events
  add constraint thyroid_funnel_events_event_name_check
  check (event_name in (
    'thyroid_landing_view',
    'thyroid_landing_cta_click',
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
    'thyroid_offer_view',
    'thyroid_sale',
    'thyroid_onboarding_complete',
    'thyroid_continuity'
  ));
