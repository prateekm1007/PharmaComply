/**
 * PharmaComply – Approval Workflow Types
 * Must match backend `approval_engine.py` and DB schema
 */

export type ApprovalStatus =
  | 'pending'
  | 'awaiting_second'
  | 'approved'
  | 'denied'
  | 'escalated'
  | 'expired';

export type ApprovalFailureReason =
  | 'lock_unavailable'
  | 'velocity_limit'
  | 'cooldown_active'
  | 'self_approval'
  | 'already_approved'
  | 'insufficient_privilege'
  | 'network_error'
  | 'invalid_status';

export interface ResetRequest {
  id: string;
  created_at: string;
  status: ApprovalStatus;

  organization_id?: string;
  organization_name?: string;

  user_id?: string;
  user_email?: string;

  usage_type: string;
  reset_amount: number;
  reset_percentage: number;
  cumulative_percentage: number;
  reason: string;

  requested_by_id: string;
  requested_by_email: string;

  requires_dual_control: boolean;
  first_approver_id?: string;
  first_approver_name?: string;
  first_approved_at?: string;

  integrity_hash?: string;
  cooldown_until?: string;
}

export interface ApprovalPayload {
  resetId: string;
  comment: string;
  metadata: {
    ipAddress?: string;
    userAgent: string;
    clientTimestamp: string;
  };
}

export interface ApprovalResponse {
  success: boolean;
  status?: ApprovalStatus;
  approval_hash?: string;
  approved_at?: string;
  error?: ApprovalFailureReason;
  message?: string;
  cooldown_remaining?: number;
}
