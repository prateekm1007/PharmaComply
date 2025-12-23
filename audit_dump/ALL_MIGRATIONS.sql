-- Create organization table for request + RLS scoping
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS usage_resets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  organization_id UUID,
  user_id UUID,

  -- requested reset data
  usage_type TEXT NOT NULL,
  reset_amount INTEGER NOT NULL,
  reset_percentage DECIMAL NOT NULL,
  cumulative_percentage DECIMAL NOT NULL,

  reason TEXT NOT NULL,

  -- requester info
  admin_id UUID NOT NULL REFERENCES auth.users(id),

  -- approval workflow
  status TEXT NOT NULL DEFAULT 'pending',
  requires_dual_control BOOLEAN DEFAULT FALSE,
  secondary_admin_id UUID,
  dual_control_approved_at TIMESTAMPTZ,

  -- cooldown metadata
  cooldown_until TIMESTAMPTZ
);
-- Enable RLS
ALTER TABLE usage_resets ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_audit_log ENABLE ROW LEVEL SECURITY;

-- Prevent unscoped selects
DROP POLICY IF EXISTS "org admins only see owned org resets" ON usage_resets; DROP POLICY IF EXISTS "org admins only see owned org resets" ON usage_resets; CREATE POLICY "org admins only see owned org resets"
  ON usage_resets
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM user_profiles
      WHERE organization_id = usage_resets.organization_id
    )
  );

-- Insert allowed only via API with claims
DROP POLICY IF EXISTS "app inserts only" ON usage_resets; CREATE POLICY "app inserts only"
  ON usage_resets
  FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role'
  );

-- audit log: read-only
DROP POLICY IF EXISTS "readonly logs" ON usage_resets; DROP POLICY IF EXISTS "readonly logs" ON approval_audit_log; CREATE POLICY "readonly logs"
  ON approval_audit_log
  FOR SELECT
  USING (auth.role() IN ('admin','super_admin'));

-- deny inserts from clients
DROP POLICY IF EXISTS "deny user write logs" ON usage_resets; DROP POLICY IF EXISTS "deny user write logs" ON approval_audit_log; CREATE POLICY "deny user write logs"
  ON approval_audit_log
  AS RESTRICTIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (false);

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
CREATE TABLE IF NOT EXISTS fraud_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  severity TEXT NOT NULL CHECK (severity IN ('critical','high','medium','low')),
  actor_id UUID,
  actor_email TEXT,
  event_type TEXT NOT NULL,
  evidence JSONB NOT NULL,
  acknowledged BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE TABLE IF NOT EXISTS reset_view_locks (
  reset_id UUID NOT NULL,
  admin_id UUID NOT NULL,
  admin_email TEXT,
  locked_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT now() + interval '5 minutes',
  PRIMARY KEY (reset_id, admin_id)
);

CREATE INDEX IF NOT EXISTS idx_reset_view_locks_reset
  ON reset_view_locks(reset_id);

-- auto cleanup helper
CREATE OR REPLACE FUNCTION cleanup_expired_reset_locks()
RETURNS void AS $$
BEGIN
  DELETE FROM reset_view_locks
  WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;
