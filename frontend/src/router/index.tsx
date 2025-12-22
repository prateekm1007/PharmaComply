import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminApprovalQueuePage from "../pages/admin/AdminApprovalQueuePage";
import { useOverdueCount } from "../hooks/useOverdueCount";
<Route path="/admin/audit" element={<AdminGuard isAdmin={true}><AuditPage /></AdminGuard>} />
<Route path="/admin/case/:id" element={<AdminGuard isAdmin={true}><CaseDetail /></AdminGuard>} />
import ResetDetailPage from "../pages/admin/ResetDetailPage";
import { AdminGuard } from "../components/auth/AdminGuard";

export function AppRouter() {
  const isAdmin = true; // server authority required

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin/queue"
          element={
            <AdminGuard isAdmin={isAdmin}>
              <AdminApprovalQueuePage />
import { useOverdueCount } from "../hooks/useOverdueCount";
<Route path="/admin/audit" element={<AdminGuard isAdmin={true}><AuditPage /></AdminGuard>} />
<Route path="/admin/case/:id" element={<AdminGuard isAdmin={true}><CaseDetail /></AdminGuard>} />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/reset/:id"
          element={
            <AdminGuard isAdmin={isAdmin}>
              <ResetDetailPage />
            </AdminGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function OverdueBadge() {
  const { data } = useOverdueCount();
  if (!data?.overdue_count) return null;
  return (
    <span className="ml-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded">
      {data.overdue_count}
    </span>
  );
}
