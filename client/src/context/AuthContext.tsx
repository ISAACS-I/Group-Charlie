import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { UserRole } from "../types";

interface AuthUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  qrCode?: string;
  token: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  role: UserRole | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => void;
}

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  password: string;
}

const API_BASE = "http://localhost:5001/api";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
  const verifySession = async () => {
    const stored = localStorage.getItem("authUser");
    if (!stored) {
      setIsLoading(false);
      return;
    }

    try {
      const parsed: AuthUser = JSON.parse(stored);

      // Verify token with server and get latest role
      const res = await fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${parsed.token}` },
      });

      if (!res.ok) {
        // Token expired or invalid
        localStorage.removeItem("authUser");
        setIsLoading(false);
        return;
      }

      const freshUser = await res.json();

      // Update with latest role from DB
      const updatedUser: AuthUser = {
        ...parsed,
        role: freshUser.role,
        firstName: freshUser.firstName,
        lastName: freshUser.lastName,
      };

      localStorage.setItem("authUser", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch {
      // Server unreachable — use cached data
      try {
        const parsed: AuthUser = JSON.parse(stored);
        setUser(parsed);
      } catch {
        localStorage.removeItem("authUser");
      }
    } finally {
      setIsLoading(false);
    }
  };

  verifySession();
}, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Invalid credentials");
    }

    const authUser: AuthUser = data;
    localStorage.setItem("authUser", JSON.stringify(authUser));
    setUser(authUser);
  }, []);

  const signUp = useCallback(async (formData: SignUpData) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        dob: formData.dateOfBirth,
        password: formData.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to create account");
    }

    const authUser: AuthUser = data;
    localStorage.setItem("authUser", JSON.stringify(authUser));
    setUser(authUser);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("authUser");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        isAdmin: user?.role === "admin",
        isLoading,
        signIn,
        signUp,
        signOut,
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