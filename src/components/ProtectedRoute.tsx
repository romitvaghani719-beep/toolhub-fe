import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "@/stores";

export function ProtectedRoute({ roles }: { roles?: Array<"admin" | "user"> }) {
  const user = useAuthStore((s) => s.user);
  const isSessionExpired = useAuthStore((s) => s.isSessionExpired);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const location = useLocation();

  useEffect(() => {
    if (user && isSessionExpired()) {
      clearAuth();
    }
  }, [user, isSessionExpired, clearAuth]);

  if (!user || isSessionExpired()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/browse" replace />;
  }

  return <Outlet />;
}
