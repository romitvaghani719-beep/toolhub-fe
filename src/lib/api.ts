import { useAuthStore } from "@/stores";

function trimTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function resolveApiUrl(): string {
  const env = (import.meta as ImportMeta & {
    env: Record<string, string | boolean | undefined>;
  }).env;

  const explicitApiUrl = (env.VITE_API_URL as string | undefined)?.trim();
  if (explicitApiUrl) return trimTrailingSlash(explicitApiUrl);

  const backendBaseUrl = (env.VITE_BE_URL as string | undefined)?.trim();
  if (!backendBaseUrl) {
    throw new Error("Set VITE_BE_URL (or VITE_API_URL) in your .env file.");
  }

  return `${trimTrailingSlash(backendBaseUrl)}/api`;
}

const API_URL = resolveApiUrl();
const TOKEN_REFRESH_BUFFER_SEC = 60;

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "ApiError";
  }
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken, clearAuth, updateSession, isSessionExpired } =
    useAuthStore.getState();

  if (!refreshToken || isSessionExpired()) {
    clearAuth();
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
        const json = await res.json();

        if (!res.ok || json.success === false) {
          clearAuth();
          return null;
        }

        updateSession(json.data.session);
        return json.data.session.access_token as string;
      } catch {
        clearAuth();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}

/** Returns a valid access token, refreshing automatically when needed. */
export async function getValidAccessToken(): Promise<string | null> {
  const { accessToken, expiresAt, refreshToken, clearAuth, isSessionExpired } =
    useAuthStore.getState();

  if (!accessToken) return null;

  if (isSessionExpired()) {
    clearAuth();
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  const stillValid =
    expiresAt != null && expiresAt > now + TOKEN_REFRESH_BUFFER_SEC;

  if (stillValid || !refreshToken) return accessToken;

  return refreshAccessToken();
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  let authToken = token;
  if (authToken) {
    authToken = (await getValidAccessToken()) ?? authToken;
  }

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (authToken) headers.set("Authorization", `Bearer ${authToken}`);

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const json = await res.json();

  if (!res.ok || json.success === false) {
    if (res.status === 401 && token) {
      const refreshed = await refreshAccessToken();
      if (refreshed && refreshed !== authToken) {
        return request<T>(path, options, refreshed);
      }
      useAuthStore.getState().clearAuth();
    }
    throw new ApiError(json.message ?? "Request failed", res.status);
  }

  return json.data as T;
}

export const api = {
  get: <T>(path: string, token?: string | null) =>
    request<T>(path, { method: "GET" }, token),
  post: <T>(path: string, body: unknown, token?: string | null) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }, token),
  put: <T>(path: string, body: unknown, token?: string | null) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }, token),
  del: <T>(path: string, token?: string | null) =>
    request<T>(path, { method: "DELETE" }, token),
};

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
