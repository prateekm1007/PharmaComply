"use client"

import { ProtectedRoute } from "../../../components/auth/ProtectedRoute"

export default function ApprovalsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute roles={["admin", "super_admin"]}>
      {children}
    </ProtectedRoute>
  )
}
