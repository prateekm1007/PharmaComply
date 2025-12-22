import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import {
  ResetRequest,
  ApprovalPayload,
  ApprovalResponse,
  ApprovalFailureReason,
} from '@/types/approval';

export const KEYS = {
  approvals: ['approvals'] as const,
  approval: (id: string) => ['approvals', id] as const,
};

export function useApprovals() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch queue of pending approvals
  const approvalsQuery = useQuery({
    queryKey: KEYS.approvals,
    queryFn: async () => {
      const { data } = await api.get<ResetRequest[]>('/api/admin/approvals/pending');
      return data;
    },
    refetchInterval: 30000,
  });

  const approveMutation = useMutation({
    mutationFn: async (payload: ApprovalPayload): Promise<ApprovalResponse> => {
      if (!user) throw new Error('not_authenticated');

      const response = await api.post<ApprovalResponse>(
        `/api/admin/approvals/${payload.resetId}/approve`,
        payload
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'unknown_error');
      }

      return response.data;
    },

    onError: (err: any) => {
      handleApprovalError(err.message as ApprovalFailureReason, toast);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.approvals });
    },
  });

  const denyMutation = useMutation({
    mutationFn: async (payload: ApprovalPayload): Promise<ApprovalResponse> => {
      const response = await api.post(
        `/api/admin/approvals/${payload.resetId}/deny`,
        payload
      );
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.approvals });
      toast({
        title: 'Request denied',
        variant: 'default',
      });
    },
  });

  return {
    approvals: approvalsQuery.data || [],
    isLoading: approvalsQuery.isLoading,
    approve: approveMutation.mutate,
    deny: denyMutation.mutate,
    isSubmitting: approveMutation.isPending || denyMutation.isPending,
  };
}

// non fragile structured mapping
function handleApprovalError(reason: ApprovalFailureReason, toast: any) {
  const messages = {
    lock_unavailable: 'Approval locked by another admin.',
    velocity_limit: 'Velocity limit reached.',
    cooldown_active: 'Cooldown active.',
    self_approval: 'Cannot approve your own request.',
    already_approved: 'Already approved.',
    insufficient_privilege: 'Insufficient privilege.',
    invalid_status: 'Invalid request status.',
    network_error: 'Network error.'
  };

  toast({
    title: 'Approval failed',
    variant: 'destructive',
    description: messages[reason] || 'Unexpected error occurred.',
  });
}
