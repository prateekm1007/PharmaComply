"use client"

import { useRouter } from "next/navigation"
import { useAuthStore } from "../../store/authStore"
import { supabase } from "../../lib/supabase"

export function TopNav() {
  const { adminId, adminRole, clearAuth } = useAuthStore()
  const router = useRouter()

  async function logout() {
    await supabase.auth.signOut()
    clearAuth()
    router.replace("/login")
  }

  return (
    <nav className="w-full px-4 py-2 bg-gray-900 text-white flex justify-between items-center">
      <span className="font-bold text-lg">PharmaComply Admin</span>

      <div className="flex gap-4 items-center text-sm">
        {adminId && (
          <span className="px-2 py-1 rounded bg-gray-700 border border-gray-500">
            {adminRole ?? "user"}
          </span>
        )}

        {adminId ? (
          <button
            onClick={logout}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white"
          >
            Logout
          </button>
        ) : null}
      </div>
    </nav>
  )
}
