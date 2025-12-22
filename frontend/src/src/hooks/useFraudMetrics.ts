import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export interface FraudMetrics {
  alerts_summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  velocity_anomalies: Array<{
    admin_id: string;
    email: string;
    approval_count: number;
    z_score: number;
  }>;
  collusion_candidates: Array<{
    admin_a_email: string;
    admin_b_email: string;
    pair_count: number;
  }>;
  recent_alerts: Array<{
    id: string;
    event_type: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    created_at: string;
    acknowledged: boolean;
  }>;
  meta: {
    generated_at: string;
  };
}

export function useFraudMetrics(days = 30) {
  const queryClient = useQueryClient();

  // 1. Fetch Metrics
  const query = useQuery({
    queryKey: ['fraud-metrics', { days }],
    queryFn: async () => {
      const { data } = await api.get<FraudMetrics>(
        `/api/admin/fraud-metrics?days=${days}`
      );
      return data;
    },
    refetchInterval: 60000, // 1 minute refresh
    refetchOnWindowFocus: true,
    staleTime: 30000,
  });

  // 2. Acknowledge Alert Mutation
  const acknowledgeMutation = useMutation({
    mutationFn: async (payload: { 
      alertId: string; 
      resolutionType: string; 
      notes: string 
    }) => {
      await api.post(`/api/admin/fraud-alerts/${payload.alertId}/acknowledge`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fraud-metrics'] });
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    acknowledgeAlert: acknowledgeMutation.mutateAsync,
    isAcknowledging: acknowledgeMutation.isPending,
  };
}
