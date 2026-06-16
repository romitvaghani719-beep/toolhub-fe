function trimTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function resolveApiUrl(): string {
  const env = (import.meta as ImportMeta & {
    env: Record<string, string | boolean | undefined>;
  }).env;

  const explicitApiUrl = (env.VITE_API_URL as string | undefined)?.trim();
  if (explicitApiUrl) return trimTrailingSlash(explicitApiUrl);

  // In local dev we rely on Vite proxy for /api -> VITE_BE_URL.
  if (env.DEV) return "/api";

  const backendBaseUrl = (env.VITE_BE_URL as string | undefined)?.trim();
  if (backendBaseUrl) return `${trimTrailingSlash(backendBaseUrl)}/api`;

  return "/api";
}

const API_URL = resolveApiUrl();

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const json = await res.json();

  if (!res.ok || json.success === false) {
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
