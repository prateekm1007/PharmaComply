create table if not exists compliance_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  object_name text not null,
  detected_at timestamptz default now()
);
