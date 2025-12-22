import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/admin/Sidebar";
import { useRequireRole } from "@/hooks/useRequireRole";

export function AdminLayout() {
  useRequireRole(["admin", "org_admin", "super_admin"]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
