import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  role: string; // "user" | "org_admin" | "admin" | "super_admin"
};

const AuthContext = createContext<{ user: User | null }>({ user: null });

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadSession() {
      const res = await fetch("/api/auth/session", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    }
    loadSession();
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

  // refresh every 60s
  useEffect(() => {
    const id = setInterval(loadSession, 60000);
    return () => clearInterval(id);
  }, []);
