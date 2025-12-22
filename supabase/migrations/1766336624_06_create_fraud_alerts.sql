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
