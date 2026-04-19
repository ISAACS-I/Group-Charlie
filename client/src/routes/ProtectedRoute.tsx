import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { role, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  // Not logged in → send to login, preserving intended destination
  if (!role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but not admin when admin is required → send to home
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}