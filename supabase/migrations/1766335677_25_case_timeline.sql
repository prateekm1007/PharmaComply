-- Case timeline table
CREATE TABLE IF NOT EXISTS incident_case_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES incident_cases(id),
  actor_id UUID REFERENCES auth.users(id),
  event TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE incident_case_timeline ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_case_timeline_rw" ON incident_case_timeline;
CREATE POLICY "admin_case_timeline_rw"
ON incident_case_timeline
FOR ALL
USING (auth.role() IN ('admin','super_admin'));
