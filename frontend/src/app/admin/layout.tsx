import React from "react";
import { AdminNav } from "../../components/admin/AdminNav";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute roles={["admin", "super_admin"]}>
      <html>
        <body>
          <div className="flex min-h-screen">
            <AdminNav />
            <div className="flex-1 p-6">{children}</div>
          </div>
        </body>
      </html>
    </ProtectedRoute>
  );
}
