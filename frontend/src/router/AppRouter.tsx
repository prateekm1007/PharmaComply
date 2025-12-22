
// --- PharmaComply Auth Routes (Module 11) --- //
import { ProtectedRoute } from "../auth/ProtectedRoute";
import AdminApprovalQueuePage from "../pages/AdminApprovalQueuePage";
import ResetDetailScreen from "../components/admin/ResetDetailScreen"; // assumes existing

<Route element={<ProtectedRoute allowedRoles={["admin","super_admin","org_admin"]} />}>
  <Route path="/admin/approvals" element={<AdminApprovalQueuePage />} />
  <Route path="/admin/reset/:id" element={<ResetDetailScreen />} />
</Route>

<Route path="/login" element={<LoginPage />} />
