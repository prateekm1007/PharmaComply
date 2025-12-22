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
