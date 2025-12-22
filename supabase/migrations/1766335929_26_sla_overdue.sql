-- SLA target threshold
ALTER TABLE incident_cases
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS sla_hours INTEGER DEFAULT 24;

-- computed overdue view
CREATE OR REPLACE VIEW incident_cases_overdue AS
SELECT 
  c.*,
  (NOW() - c.created_at) > (c.sla_hours * INTERVAL '1 hour') AS overdue
FROM incident_cases c;
