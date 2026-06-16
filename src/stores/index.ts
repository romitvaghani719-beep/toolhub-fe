import type { Role } from "@toolhub/shared";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  created_at?: string;
  updated_at?: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  setAuth: (user: AuthUser, accessToken: string) => void;
  clearAuth: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      setAuth: (user, accessToken) => set({ user, accessToken }),
      clearAuth: () => set({ user: null, accessToken: null }),
      isAdmin: () => get().user?.role === "admin",
    }),
    { name: "toolvault-auth" },
  ),
);

interface FilterState {
  search: string;
  category: string;
  sort: "newest" | "name" | "votes";
  page: number;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setSort: (sort: FilterState["sort"]) => void;
  setPage: (page: number) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  search: "",
  category: "",
  sort: "newest",
  page: 1,
  setSearch: (search) => set({ search, page: 1 }),
  setCategory: (category) => set({ category, page: 1 }),
  setSort: (sort) => set({ sort, page: 1 }),
  setPage: (page) => set({ page }),
  reset: () => set({ search: "", category: "", sort: "newest", page: 1 }),
}));

type Theme = "light" | "dark";

interface UiState {
  sidebarOpen: boolean;
  theme: Theme;
  setSidebarOpen: (open: boolean) => void;
  toggleTheme: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      sidebarOpen: false,
      theme: "light",
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleTheme: () => {
        const next = get().theme === "light" ? "dark" : "light";
        document.documentElement.classList.toggle("dark", next === "dark");
        set({ theme: next });
      },
    }),
    { name: "toolvault-ui" },
  ),
);
