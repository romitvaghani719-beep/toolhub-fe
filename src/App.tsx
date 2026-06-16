import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import LoginPage from "@/pages/LoginPage";
import BrowsePage from "@/pages/BrowsePage";
import ToolDetailPage from "@/pages/ToolDetailPage";
import AddToolPage from "@/pages/AddToolPage";
import ActivityPage from "@/pages/ActivityPage";
import AdminPage from "@/pages/AdminPage";
import { useAuthStore } from "@/stores";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

function PublicOnly({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  if (user) return <Navigate to="/browse" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnly>
                <LoginPage />
              </PublicOnly>
            }
          />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/browse" replace />} />
              <Route path="browse" element={<BrowsePage />} />
              <Route path="tools/:id" element={<ToolDetailPage />} />
              <Route path="add" element={<AddToolPage />} />
              <Route path="tools/:id/edit" element={<AddToolPage />} />
              <Route path="activity" element={<ActivityPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route element={<AppLayout />}>
              <Route path="admin" element={<AdminPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/browse" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
