import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateToolInput,
  CreateUserInput,
  LoginInput,
  UpdateToolInput,
  UpdateUserInput,
} from "@toolhub/shared";
import { api, type Paginated } from "@/lib/api";
import { useAuthStore } from "@/stores";

export interface Tool {
  id: string;
  name: string;
  description: string | null;
  website_url: string | null;
  category: string;
  image_url: string | null;
  logo_color: string | null;
  tags: string[];
  votes: number;
  api_available: boolean;
  free_plan: boolean;
  open_source: boolean;
  pricing: string | null;
  automation: string | null;
  community: string | null;
  models: string[];
  features: string[];
  ai_capabilities: string[];
  use_cases: string[];
  featured: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  user_id: string;
  tool_id: string;
  action: string;
  created_at: string;
  user_name?: string;
  tool_name?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  created_at: string;
  updated_at: string;
}

function token() {
  return useAuthStore.getState().accessToken;
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (input: LoginInput) =>
      api.post<{ session: { access_token: string }; user: User }>(
        "/auth/login",
        input,
      ),
    onSuccess: (data) => setAuth(data.user, data.session.access_token),
  });
}

export function useMe() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["me", accessToken],
    queryFn: () => api.get<User>("/auth/me", accessToken),
    enabled: !!accessToken,
  });
}

export function useTools(params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.search) qs.set("search", params.search);
  if (params.category) qs.set("category", params.category);
  if (params.sort) qs.set("sort", params.sort);

  return useQuery({
    queryKey: ["tools", params],
    queryFn: () => api.get<Paginated<Tool>>(`/tools?${qs}`, token()),
  });
}

export function useTool(id: string) {
  return useQuery({
    queryKey: ["tool", id],
    queryFn: () =>
      api.get<{
        tool: Tool;
        creator: User | null;
        related: Tool[];
        activities: Activity[];
      }>(`/tools/${id}`, token()),
    enabled: !!id,
  });
}

export function useCreateTool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateToolInput) =>
      api.post<Tool>("/tools", input, token()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tools"] }),
  });
}

export function useUpdateTool(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateToolInput) =>
      api.put<Tool>(`/tools/${id}`, input, token()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tools"] });
      qc.invalidateQueries({ queryKey: ["tool", id] });
    },
  });
}

export function useActivities(params: {
  page?: number;
  limit?: number;
  user_id?: string;
  tool_id?: string;
}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.user_id) qs.set("user_id", params.user_id);
  if (params.tool_id) qs.set("tool_id", params.tool_id);

  return useQuery({
    queryKey: ["activities", params],
    queryFn: () =>
      api.get<Paginated<Activity>>(`/activities?${qs}`, token()),
    enabled: !!token(),
  });
}

export function useAdminUsers(params: { page?: number; search?: string }) {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.search) qs.set("search", params.search);

  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () =>
      api.get<Paginated<User>>(`/admin/users?${qs}`, token()),
    enabled: !!token() && useAuthStore.getState().isAdmin(),
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUserInput) =>
      api.post<User>("/admin/users", input, token()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: UpdateUserInput & { id: string }) =>
      api.put<User>(`/admin/users/${id}`, input, token()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.del<{ deleted: boolean }>(`/admin/users/${id}`, token()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  return useMutation({
    mutationFn: () => api.post("/auth/logout", {}, token()),
    onSettled: () => clearAuth(),
  });
}
