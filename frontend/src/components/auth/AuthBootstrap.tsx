"use client"

import { useEffect } from "react"
import { useAuthStore } from "../../store/authStore"

export function AuthBootstrap() {
  const { setAuth } = useAuthStore()

  useEffect(() => {
    async function hydrate() {
      try {
        const res = await fetch("/api/auth/me")
        const result = await res.json()
        if (result?.user) {
          setAuth(result.user.id, result.user.role)
        }
      } catch {}
    }
    hydrate()
  }, [])

  return null
}
