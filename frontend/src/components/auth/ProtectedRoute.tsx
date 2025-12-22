"use client"

import { ReactNode, useEffect, useState } from "react"
import { useAuthStore } from "../../store/authStore"
import { useRouter } from "next/navigation"

export function ProtectedRoute({ children, roles }: { children: ReactNode, roles?: string[] }) {
  const { sessionLoaded, adminRole } = useAuthStore()
  const router = useRouter()
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    if (!sessionLoaded) return  

    // unauthenticated redirect
    if (!adminRole) {
      router.replace("/login")
      return
    }

    // RBAC rule enforcement
    if (roles && !roles.includes(adminRole)) {
      router.replace("/403")
      return
    }

    setAllowed(true)
  }, [sessionLoaded, adminRole])

  if (!allowed) return null
  return <>{children}</>
}
