const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

let _csrfToken: string | null = null;

async function getCsrfToken(): Promise<string> {
  if (_csrfToken) return _csrfToken;
  const res = await fetch(`${API_BASE}/api/auth/csrf`, { credentials: "include" });
  const data = await res.json() as { csrfToken: string };
  _csrfToken = data.csrfToken;
  return _csrfToken;
}

export function clearCsrfToken() {
  _csrfToken = null;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error((error as { error?: { message?: string } }).error?.message || `API Error ${res.status}`);
  }

  return res.json() as Promise<T>;
}

async function mutate<T>(path: string, options?: RequestInit): Promise<T> {
  const csrfToken = await getCsrfToken();
  return request<T>(path, {
    ...options,
    headers: { "x-csrf-token": csrfToken, ...options?.headers },
  });
}

export const api = {
  auth: {
    csrf: () => request<{ csrfToken: string }>("/api/auth/csrf"),
    login: (body: { email: string; password: string }) =>
      mutate<{ user: { id: string; email: string; name: string | null; role: string }; expires: string }>("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
    session: () => request<{ user: { id: string; email: string; name: string | null; role: string }; expires: string }>("/api/auth/session"),
    logout: () => mutate<{ success: boolean }>("/api/auth/logout", { method: "POST" }),
    forgotPassword: (body: { email: string }) =>
      request<{ success: boolean }>("/api/auth/forgot-password", { method: "POST", body: JSON.stringify(body) }),
    resetPassword: (body: { token: string; password: string }) =>
      request<{ success: boolean }>("/api/auth/reset-password", { method: "POST", body: JSON.stringify(body) }),
  },
  rules: {
    list: () => request<unknown[]>("/api/rules"),
    create: (body: unknown) => mutate<unknown>("/api/rules", { method: "POST", body: JSON.stringify(body) }),
    toggle: (id: string, active: boolean) => mutate<unknown>(`/api/rules/${id}/toggle`, { method: "PATCH", body: JSON.stringify({ active }) }),
    remove: (id: string) => mutate<{ deleted: boolean }>(`/api/rules/${id}`, { method: "DELETE" }),
  },
  billing: {
    balance: () => request<{ balance: number }>("/api/billing/balance"),
    purchase: (body: { plan: string; gateway: string; idempotencyKey: string }) =>
      mutate<unknown>("/api/billing/purchase", { method: "POST", body: JSON.stringify(body) }),
    transactions: () => request<unknown[]>("/api/billing/transactions"),
  },
};
