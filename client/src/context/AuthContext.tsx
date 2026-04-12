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
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>; // Add this line
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

  const signIn = useCallback(async (username: string, password: string) => {
    if (!username || !password) {
      throw new Error("Invalid credentials");
    }

    // simulate authentication
    if (username.toLowerCase().includes("admin")) {
      setRole("admin");
    } else {
      setRole("user");
    }
  }, [setRole]);

  // Add signOut function
  const signOut = useCallback(async () => {
    localStorage.removeItem("role");
    localStorage.removeItem("userInfo"); // Clear any stored user data
    setRoleState(null);
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        role, 
        isAdmin: role === "admin", 
        isLoading, 
        setRole, 
        clearRole,
        signIn,
        signOut, // Add this
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}