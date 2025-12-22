import { useMutation } from "@tanstack/react-query";
import { openCase } from "../services/api/adminCase";

export function useOpenCase() {
  return useMutation({
    mutationFn: openCase
  });
}
