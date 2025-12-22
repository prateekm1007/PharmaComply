export interface QueueItem {
  id: string;
  created_at: string;
  status: 'pending' | 'awaiting_second' | 'approved' | 'denied' | 'escalated';
  
  // Display Info
  organization_name: string;
  user_email: string;
  usage_type: string;
  reset_amount: number;
  reset_percentage: number;
  reason: string;
  
  // Requestor
  requested_by_email: string;
  
  // Security / Logic Flags
  requires_dual_control: boolean;
  cooldown_until: string | null;    // ISO Date
  velocity_remaining: number;       // 0-5
  is_self_approval: boolean;
  can_approve: boolean;             // Server-side logic result
  rejection_reason: string | null;  // Why can_approve is false
  
  // Real-time / Ephemeral
  locked_viewers: string[];
  is_locked: boolean;
  ui_actionable: boolean;           // Helper for graying out rows
}

export interface QueueResponse {
  queue: QueueItem[];
  meta: {
    count: number;
    limit: number;
    offset: number;
    timestamp: string;
  };
}
