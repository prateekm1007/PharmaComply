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

