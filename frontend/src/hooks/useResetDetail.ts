import { useQuery } from "@tanstack/react-query";
import { fetchResetDetail } from "../services/api/resetDetail";

export function useResetDetail(id: string) {
  return useQuery({
    queryKey: ["resetDetail", id],
    queryFn: () => fetchResetDetail(id),
    enabled: !!id,
    refetchInterval: 5000,           // drift protection
    refetchOnWindowFocus: true,      // minimum bandwidth cost
  });
}
