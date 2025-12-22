import { createBrowserRouter } from "react-router-dom";
import { AdminLayout } from "@/layouts/AdminLayout";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import AdminApprovalQueuePage from "@/pages/AdminApprovalQueuePage";

// more page imports added later

export const adminRouter = createBrowserRouter([
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "approvals", element: <AdminApprovalQueuePage /> },
      { path: "fraud", element: <div>fraud placeholder</div> },
      { path: "audit", element: <div>audit placeholder</div> },
    ]
  },
  { path: "/unauthorized", element: <UnauthorizedPage /> }
]);
