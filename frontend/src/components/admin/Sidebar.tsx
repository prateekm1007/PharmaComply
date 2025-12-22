import { NavLink } from "react-router-dom";

export function Sidebar() {
  const linkClass =
    "flex px-4 py-2 text-sm hover:bg-gray-200 rounded transition";

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4 space-y-2">
      <h2 className="text-lg font-bold mb-4">PharmaComply</h2>

      <nav className="space-y-1">
        <NavLink to="/admin/approvals" className={linkClass}>
          Pending Approvals
        </NavLink>

        <NavLink to="/admin/fraud" className={linkClass}>
          Fraud Monitoring
        </NavLink>

        <NavLink to="/admin/audit" className={linkClass}>
          Audit Export
        </NavLink>
      </nav>
    </aside>
  );
}
