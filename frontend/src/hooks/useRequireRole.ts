import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Usage:
 * useRequireRole(["admin", "super_admin"])
 * useRequireRole(["super_admin"])
 */
export function useRequireRole(allowedRoles: string[]) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    // fail closed: safest default
    if (!user || !allowedRoles.includes(user.role)) {
      navigate("/unauthorized");
    }
  }, [user, isLoading, allowedRoles, navigate]);
}
