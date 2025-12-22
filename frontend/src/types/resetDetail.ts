export interface ResetDetailResponse {
  id: string;
  status: string;
  user_email: string;
  requested_by_email: string;
  created_at: string;
  reason: string;
  reset_amount: number;
  reset_percentage: number;

  requires_dual_control: boolean;
  cooldown_until: string | null;
  velocity_remaining: number | null;
  can_approve: boolean;
  rejection_reason: string | null;

  locked_viewers: string[] | null;
  is_locked: boolean;
}
