import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { UserRole } from "../types";

interface AuthContextValue {
  role: UserRole | null;
  isAdmin: boolean;
  isLoading: boolean;
  setRole: (role: UserRole) => void;
  clearRole: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("role") as UserRole | null;
    if (stored === "admin" || stored === "user") {
      setRoleState(stored);
    }
    setIsLoading(false);
  }, []);

  const setRole = useCallback((newRole: UserRole) => {
    localStorage.setItem("role", newRole);
    setRoleState(newRole);
  }, []);

  const clearRole = useCallback(() => {
    localStorage.removeItem("role");
    setRoleState(null);
  }, []);

  return (
    <AuthContext.Provider value={{ role, isAdmin: role === "admin", isLoading, setRole, clearRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
