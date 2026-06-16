import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores";

export function ProtectedRoute({ roles }: { roles?: Array<"admin" | "user"> }) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/browse" replace />;
  }

  return <Outlet />;
}
