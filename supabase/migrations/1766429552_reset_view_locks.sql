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
