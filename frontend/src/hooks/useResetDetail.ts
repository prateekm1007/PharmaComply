import { useQuery } from "@tanstack/react-query";

export function useResetDetail(resetId: string) {
  return useQuery({
    queryKey: ["resetDetail", resetId],
    queryFn: async () => {
      const res = await fetch(
        `/api/admin/reset/${resetId}`,
        {
          credentials: "include"
        }
      );

      if (!res.ok) throw new Error("Reset not found or not authorized");

      return res.json();
    },
    refetchInterval: 5000
  });
}
