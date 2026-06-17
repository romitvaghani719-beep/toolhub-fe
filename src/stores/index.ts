import type { Role, SessionTokens } from "@toolhub/shared";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Keep users signed in for 7 days (must match Supabase refresh token expiry). */
export const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

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
  refreshToken: string | null;
  expiresAt: number | null;
  sessionStartedAt: number | null;
  setAuth: (user: AuthUser, session: SessionTokens) => void;
  updateSession: (session: SessionTokens) => void;
  clearAuth: () => void;
  isAdmin: () => boolean;
  isSessionExpired: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      sessionStartedAt: null,
      setAuth: (user, session) =>
        set({
          user,
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
          expiresAt: session.expires_at,
          sessionStartedAt: Date.now(),
        }),
      updateSession: (session) =>
        set({
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
          expiresAt: session.expires_at,
        }),
      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          sessionStartedAt: null,
        }),
      isAdmin: () => get().user?.role === "admin",
      isSessionExpired: () => {
        const { sessionStartedAt } = get();
        if (!sessionStartedAt) return true;
        return Date.now() - sessionStartedAt > SESSION_MAX_AGE_MS;
      },
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
