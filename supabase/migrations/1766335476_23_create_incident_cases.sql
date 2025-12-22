-- Incident Case table
CREATE TABLE IF NOT EXISTS incident_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'open', -- open|investigating|resolved
  severity TEXT NOT NULL, -- critical|high|medium|low
  metadata JSONB DEFAULT '{}'::jsonb
);

-- link case <-> audit entries
CREATE TABLE IF NOT EXISTS incident_case_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES incident_cases(id),
  audit_id UUID NOT NULL,
  linked_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE incident_case_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_cases ENABLE ROW LEVEL SECURITY;

-- minimal allow admin read/write policies
DROP POLICY IF EXISTS "admin_cases_rw" ON incident_cases;
CREATE POLICY "admin_cases_rw"
ON incident_cases
FOR ALL
USING (auth.role() IN ('admin','super_admin'));

DROP POLICY IF EXISTS "admin_case_links_rw" ON incident_case_links;
CREATE POLICY "admin_case_links_rw"
ON incident_case_links
FOR ALL
USING (auth.role() IN ('admin','super_admin'));
