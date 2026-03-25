import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
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

  if (isLoading) return null;

  if (!role) return <Navigate to="/home" replace />;

  if (requireAdmin && !isAdmin) return <Navigate to="/home" replace />;

  return <>{children}</>;
}