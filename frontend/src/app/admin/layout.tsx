import { AdminNav } from "../../components/admin/AdminNav"
import { TopNav } from "../../components/nav/TopNav"
import { ProtectedRoute } from "../../components/auth/ProtectedRoute"
import { ProtectedRoute } from "../../components/auth/ProtectedRoute"
import { ReactNode } from "react"

const AdminLayout = function AdminLayout({ children }: { children: ReactNode }) {
  return (<div className="flex"><AdminNav/><div className="flex-1 p-6"><ProtectedRoute roles={["admin","super_admin"]}>
    <html>
      <body>
      <TopNav />
        {children}
      </ProtectedRoute></body>
    </html>
  )
}
export default AdminLayout;
