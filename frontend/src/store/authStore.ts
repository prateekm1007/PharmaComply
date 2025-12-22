import { create } from "zustand"

type Role = "user" | "admin" | "super_admin" | null

interface AuthState {
  userId: string | null
  role: Role
  setAuth: (id: string, role: Role) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  role: null,
  setAuth: (id, role) => set({ userId: id, role }),
  logout: () => set({ userId: null, role: null }),
}))

  clearAuth() {
    set({ adminId: null, adminRole: null, sessionLoaded: true })
  },
