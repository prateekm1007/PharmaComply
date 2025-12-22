"use client";

import Link from "next/link";

export function AdminNav() {
  return (
    <nav className="w-48 bg-gray-100 p-4 border-r min-h-screen space-y-3">
      <ul className="space-y-3">
        <li>
          <Link href="/admin/queue" className="text-blue-600 hover:underline">
            Approval Queue
          </Link>
        </li>

        <li>
          <Link href="/admin/audit" className="text-blue-600 hover:underline">
            Audit Logs
          </Link>
        </li>

        <li>
          <Link href="/admin/fraud" className="text-blue-600 hover:underline">
            Fraud Alerts
          </Link>
        </li>
      </ul>
    </nav>
  );
}
